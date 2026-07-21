using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.Models;
using ResumeScreener.Api.Services;
using System.Security.Claims;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILlmScoringService _scoringService;

        public ApplicationsController(ApplicationDbContext context, ILlmScoringService scoringService)
        {
            _context = context;
            _scoringService = scoringService;
        }

        // POST: api/applications (Auto Create & Score)
        [HttpPost]
        public async Task<IActionResult> CreateApplication([FromBody] Application applicationDto)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new { message = "Invalid token or user not authenticated." });
            }

            var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.Email == email);
            var job = await _context.Jobs.FindAsync(applicationDto.JobId);

            if (candidate == null || job == null)
            {
                return BadRequest(new { message = "Candidate or Job not found." });
            }

            // Duplicate check
            var existingApp = await _context.Applications
                .FirstOrDefaultAsync(a => a.CandidateId == candidate.Id && a.JobId == applicationDto.JobId);

            if (existingApp != null)
            {
                return BadRequest(new { message = "You have already applied for this job." });
            }

            // 1. Initial Application Object
            var application = new Application
            {
                JobId = applicationDto.JobId,
                CandidateId = candidate.Id,
                Status = "Processing",
                CreatedAt = DateTime.UtcNow
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            // 2. Automatic LLM AI Scoring Trigger
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
            catch (Exception ex)
            {
                application.Status = "Failed";
                application.AiSummary = $"AI Error: {ex.Message}";
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Application submitted and scored successfully.",
                applicationId = application.Id,
                matchScore = application.MatchScore,
                status = application.Status
            });
        }

        // POST: api/applications/5/score (Manual Re-scoring)
        [HttpPost("{id}/score")]
        public async Task<IActionResult> ScoreApplication(int id)
        {
            var application = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Candidate)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound(new { message = $"Application with Id {id} not found." });
            }

            if (application.Job == null || application.Candidate == null)
            {
                return BadRequest(new { message = "Application is missing Job or Candidate data." });
            }

            application.Status = "Processing";
            await _context.SaveChangesAsync();

            try
            {
                var result = await _scoringService.ScoreResumeAsync(
                    application.Candidate.ParsedText ?? "",
                    application.Job.Description ?? "",
                    application.Job.RequiredSkills ?? ""
                );

                application.MatchScore = result.Score;
                application.MatchedSkills = string.Join(", ", result.MatchedSkills ?? new List<string>());
                application.MissingSkills = string.Join(", ", result.MissingSkills ?? new List<string>());
                application.AiSummary = result.Summary;
                application.Status = "Scored";

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    applicationId = application.Id,
                    score = application.MatchScore,
                    matchedSkills = result.MatchedSkills,
                    missingSkills = result.MissingSkills,
                    summary = application.AiSummary,
                    status = application.Status
                });
            }
            catch (Exception ex)
            {
                application.Status = "Failed";
                application.AiSummary = $"AI Error: {ex.Message}";
                await _context.SaveChangesAsync();

                return StatusCode(500, new { message = "AI scoring failed.", error = ex.Message });
            }
        }

        // GET: api/applications/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetApplication(int id)
        {
            var application = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Candidate)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound(new { message = $"Application with Id {id} not found." });
            }

            return Ok(application);
        }

        // GET: api/applications/by-job/5 (ranked list for a job)
        [HttpGet("by-job/{jobId}")]
        public async Task<IActionResult> GetApplicationsByJob(int jobId)
        {
            var jobExists = await _context.Jobs.AnyAsync(j => j.Id == jobId);
            if (!jobExists)
            {
                return NotFound(new { message = $"Job with Id {jobId} not found." });
            }

            var applications = await _context.Applications
                .Include(a => a.Candidate)
                .Where(a => a.JobId == jobId)
                .OrderByDescending(a => a.MatchScore)
                .Select(a => new
                {
                    a.Id,
                    a.CandidateId,
                    CandidateName = a.Candidate!.Name,
                    CandidateEmail = a.Candidate.Email,
                    a.MatchScore,
                    a.MatchedSkills,
                    a.MissingSkills,
                    a.AiSummary,
                    a.Status,
                    a.CreatedAt
                })
                .ToListAsync();

            return Ok(applications);
        }
    }
}