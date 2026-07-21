using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Models;
using ResumeScreener.Api.Services;
using System.Security.Claims;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/candidates/me")]
    [Authorize]
    public class CandidateApplicationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILlmScoringService _scoringService;

        public CandidateApplicationsController(
            ApplicationDbContext context,
            ILlmScoringService scoringService)
        {
            _context = context;
            _scoringService = scoringService;
        }

        // POST: api/candidates/me/apply/5
        [HttpPost("apply/{jobId}")]
        public async Task<IActionResult> ApplyToJob(int jobId)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new ApiResponse<object> { StatusCode = 401, Message = "Invalid token." });
            }

            var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.Email == email);
            var job = await _context.Jobs.FindAsync(jobId);

            if (candidate == null || job == null)
            {
                return BadRequest(new ApiResponse<object> { StatusCode = 400, Message = "Candidate or Job not found." });
            }

            // Check if already applied
            var existingApplication = await _context.Applications
                .FirstOrDefaultAsync(a => a.CandidateId == candidate.Id && a.JobId == jobId);

            if (existingApplication != null)
            {
                return BadRequest(new ApiResponse<object> { StatusCode = 400, Message = "You have already applied for this job." });
            }

            // 1. Create application record
            var application = new Application
            {
                JobId = jobId,
                CandidateId = candidate.Id,
                Status = "Processing",
                CreatedAt = DateTime.UtcNow
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            // 2. Trigger LLM Scoring instantly
            try
            {
                var result = await _scoringService.ScoreResumeAsync(
                    candidate.ParsedText ?? "",
                    job.Description ?? "",
                    job.RequiredSkills ?? ""
                );

                application.MatchScore = result.Score;
                application.MatchedSkills = string.Join(", ", result.MatchedSkills ?? new List<string>());
                application.MissingSkills = string.Join(", ", result.MissingSkills ?? new List<string>());
                application.AiSummary = result.Summary;
                application.Status = "Scored";

                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                // Fallback if AI service fails, keep application created
                application.Status = "Failed";
                await _context.SaveChangesAsync();
            }

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Application submitted successfully.",
                Data = new { applicationId = application.Id, matchScore = application.MatchScore, status = application.Status }
            });
        }

        // GET: api/candidates/me/applications
        [HttpGet("applications")]
        public async Task<IActionResult> GetMyApplications()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new ApiResponse<object> { StatusCode = 401, Message = "Invalid token." });
            }

            var applications = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Candidate)
                .Where(a => a.Candidate!.Email == email)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new
                {
                    id = a.Id,
                    jobId = a.JobId,
                    jobTitle = a.Job!.Title,
                    
                    appliedDate = a.CreatedAt,
                    status = a.Status,
                    matchScore = a.MatchScore
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Applications fetched successfully",
                Data = new { items = applications, totalCount = applications.Count }
            });
        }

        // GET: api/candidates/me/applications/{applicationId}
        [HttpGet("applications/{applicationId}")]
        public async Task<IActionResult> GetMyApplicationDetail(int applicationId)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            var application = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Candidate)
                .FirstOrDefaultAsync(a => a.Id == applicationId && a.Candidate!.Email == email);

            if (application == null)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = "Application not found" });
            }

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Application detail fetched successfully",
                Data = new
                {
                    id = application.Id,
                    jobTitle = application.Job!.Title,
                    job = new { application.Job!.Id, application.Job.Title, application.Job.Description },
                    status = application.Status,
                    matchScore = application.MatchScore,
                    matchedSkills = application.MatchedSkills,
                    missingSkills = application.MissingSkills,
                    aiSummary = application.AiSummary,
                    appliedDate = application.CreatedAt
                }
            });
        }
    }
}