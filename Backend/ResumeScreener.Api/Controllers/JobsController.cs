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
    public class JobsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILlmScoringService _scoringService; // 👈 AI Service added

        public JobsController(ApplicationDbContext context, ILlmScoringService scoringService)
        {
            _context = context;
            _scoringService = scoringService;
        }

        // POST: api/jobs/5/apply
        [HttpPost("{id}/apply")]
        public async Task<IActionResult> ApplyToJob(int id)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new { message = "Invalid token or email not found." });
            }

            var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.Email == email);
            var job = await _context.Jobs.FindAsync(id);

            if (candidate == null || job == null)
            {
                return BadRequest(new { message = "Candidate or Job profile not found." });
            }

            // Duplicate Application Check
            var existingApplication = await _context.Applications
                .FirstOrDefaultAsync(a => a.CandidateId == candidate.Id && a.JobId == id);

            if (existingApplication != null)
            {
                return BadRequest(new { message = "You have already applied for this job." });
            }

            // 1. Create Initial Application
            var application = new Application
            {
                JobId = id,
                CandidateId = candidate.Id,
                Status = "Processing",
                CreatedAt = DateTime.UtcNow
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            // 2. Trigger Gemini AI Scoring
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
                // Fallback in case LLM service encounters an error
                // 👇 UPDATE THIS CATCH BLOCK
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

        // GET: api/jobs
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobs([FromQuery] string? status = "Open")
        {
            var query = _context.Jobs.AsQueryable();

            if (!string.IsNullOrEmpty(status) && status != "All")
            {
                query = query.Where(j => j.Status == status);
            }

            var jobs = await query
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            return Ok(jobs);
        }

        // GET: api/jobs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Job>> GetJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);

            if (job == null)
            {
                return NotFound(new { message = $"Job with Id {id} not found." });
            }

            return Ok(job);
        }

        // POST: api/jobs
        [HttpPost]
        public async Task<ActionResult<Job>> CreateJob([FromBody] Job job)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            job.RecruiterId = userIdClaim != null ? int.Parse(userIdClaim) : null;

            job.CreatedAt = DateTime.UtcNow;

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }

        // PUT: api/jobs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] Job job)
        {
            if (id != job.Id)
            {
                return BadRequest(new { message = "Id in URL does not match Id in body." });
            }

            var existingJob = await _context.Jobs.FindAsync(id);
            if (existingJob == null)
            {
                return NotFound(new { message = $"Job with Id {id} not found." });
            }

            existingJob.Title = job.Title;
            existingJob.Description = job.Description;
            existingJob.RequiredSkills = job.RequiredSkills;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/jobs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                return NotFound(new { message = $"Job with Id {id} not found." });
            }

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}