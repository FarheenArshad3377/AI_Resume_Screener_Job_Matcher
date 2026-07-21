using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Services;
using System.Security.Claims;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/recruiter")]
    [Authorize]
    public class RecruiterController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILlmScoringService _scoringService;   // 👈 NEW

        public RecruiterController(ApplicationDbContext context, ILlmScoringService scoringService)
        {
            _context = context;
            _scoringService = scoringService;   // 👈 NEW
        }

        // GET: api/recruiter/dashboard/stats
        [HttpGet("dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out var recruiterId))
            {
                return Unauthorized(new ApiResponse<object>
                {
                    StatusCode = 401,
                    Message = "Invalid or expired token."
                });
            }

            var myJobIds = await _context.Jobs
                .Where(j => j.RecruiterId == recruiterId)
                .Select(j => j.Id)
                .ToListAsync();

            var totalJobs = myJobIds.Count;
            var activeJobs = totalJobs; // Draft/Closed concept "Post Job" page mein aayega

            var applications = await _context.Applications
                .Where(a => myJobIds.Contains(a.JobId))
                .ToListAsync();

            var totalApplications = applications.Count;
            var pendingReview = applications.Count(a => a.Status == "Pending" || a.Status == "Processing");

            var hired = applications.Where(a => a.Status == "Hired" && a.HiredAt != null).ToList();

            var avgTimeToHire = hired.Any()
                ? $"{Math.Round(hired.Average(a => (a.HiredAt!.Value - a.CreatedAt).TotalDays))} days"
                : "N/A";

            var hireRate = totalApplications > 0
                ? $"{Math.Round((double)hired.Count / totalApplications * 100)}%"
                : "0%";

            var data = new
            {
                totalJobs,
                activeJobs,
                totalApplications,
                pendingReview,
                avgTimeToHire,
                hireRate
            };

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Stats fetched successfully",
                Data = data
            });
        }

        // POST: api/recruiter/jobs/5/rank
        [HttpPost("jobs/{jobId}/rank")]
        public async Task<IActionResult> RankCandidates(int jobId)
        {
            var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == jobId);
            if (job == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    StatusCode = 404,
                    Message = $"Job with Id {jobId} not found."
                });
            }

            // Sirf un applications ko score karo jo abhi tak scored nahi huin
            var applications = await _context.Applications
                .Include(a => a.Candidate)
                .Where(a => a.JobId == jobId && a.Status != "Scored")
                .ToListAsync();

            var scoredCount = 0;
            var failedCount = 0;

            foreach (var application in applications)
            {
                if (application.Candidate == null || string.IsNullOrWhiteSpace(application.Candidate.ParsedText))
                {
                    application.Status = "Failed";
                    failedCount++;
                    continue;
                }

                try
                {
                    application.Status = "Processing";
                    await _context.SaveChangesAsync();

                    var result = await _scoringService.ScoreResumeAsync(
                        application.Candidate.ParsedText,
                        job.Description,
                        job.RequiredSkills
                    );

                    application.MatchScore = result.Score;
                    application.MatchedSkills = string.Join(", ", result.MatchedSkills);
                    application.MissingSkills = string.Join(", ", result.MissingSkills);
                    application.AiSummary = result.Summary;
                    application.Status = "Scored";
                    scoredCount++;
                }
                catch (Exception)
                {
                    application.Status = "Failed";
                    failedCount++;
                }
            }

            await _context.SaveChangesAsync();

            // Updated candidate list return karo (CandidateRankingPage frontend expect karta hai)
            var updatedCandidates = await _context.Applications
                .Include(a => a.Candidate)
                .Where(a => a.JobId == jobId)
                .OrderByDescending(a => a.MatchScore)
                .Select(a => new
                {
                    id = a.Id,
                    candidateId = a.CandidateId,
                    name = a.Candidate!.Name,
                    email = a.Candidate.Email,
                    appliedDate = a.CreatedAt,
                    matchScore = a.MatchScore,
                    status = a.Status
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = $"Ranking complete. Scored: {scoredCount}, Failed: {failedCount}.",
                Data = updatedCandidates
            });
        }
    }
}