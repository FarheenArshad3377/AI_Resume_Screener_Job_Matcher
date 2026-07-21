using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.DTOs;
using System.Security.Claims;
using System.Text.Json;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/candidates/me/interviews")]
    [Authorize]
    public class CandidateInterviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CandidateInterviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string? GetCandidateEmail()
        {
            return User.FindFirst(ClaimTypes.Email)?.Value;
        }

        // GET: api/candidates/me/interviews
        [HttpGet]
        public async Task<IActionResult> GetMyInterviews([FromQuery] string? status = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var email = GetCandidateEmail();
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new { message = "Invalid or expired token." });
            }

            var query = _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Job)
                        .ThenInclude(j => j!.Recruiter)
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Candidate)
                .Where(i => i.Application!.Candidate!.Email == email);

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(i => i.Status == status);
            }

            var interviews = await query
                .OrderByDescending(i => i.ScheduledDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(i => new
                {
                    id = i.Id,
                    jobId = i.Application!.JobId,
                    jobTitle = i.Application.Job!.Title,
                    company = i.Application.Job.Recruiter != null ? i.Application.Job.Recruiter.CompanyName : null,
                    companyLogo = (string?)null,
                    interviewType = i.InterviewType,
                    scheduledDate = i.ScheduledDate,
                    interviewerName = i.InterviewerName,
                    status = i.Status,
                    meetingLink = i.MeetingLink,
                    rescheduleNote = i.RescheduleNote
                })
                .ToListAsync();

            return Ok(interviews);
        }

        // GET: api/candidates/me/interviews/{interviewId}
        [HttpGet("{interviewId}")]
        public async Task<IActionResult> GetInterviewDetail(int interviewId)
        {
            var email = GetCandidateEmail();

            var interview = await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Job)
                        .ThenInclude(j => j!.Recruiter)
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Candidate)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null)
            {
                return NotFound(new { message = "Interview not found." });
            }

            if (interview.Application!.Candidate!.Email != email)
            {
                return Forbid();
            }

            var job = interview.Application.Job!;
            var descriptionSnippet = job.Description.Length > 150
                ? job.Description.Substring(0, 150) + "..."
                : job.Description;

            return Ok(new
            {
                id = interview.Id,
                jobTitle = job.Title,
                company = job.Recruiter != null ? job.Recruiter.CompanyName : null,
                jobDescriptionSnippet = descriptionSnippet,
                interviewType = interview.InterviewType,
                durationMinutes = interview.DurationMinutes,
                scheduledDate = interview.ScheduledDate,
                meetingLink = interview.MeetingLink,
                interviewerName = interview.InterviewerName,
                interviewerBio = interview.InterviewerBio,
                preparationNotes = interview.PreparationNotes,
                status = interview.Status
            });
        }

        // POST: api/candidates/me/interviews/{interviewId}/reschedule
        [HttpPost("{interviewId}/reschedule")]
        public async Task<IActionResult> RequestReschedule(int interviewId, [FromBody] RescheduleRequestDto dto)
        {
            var email = GetCandidateEmail();

            var interview = await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Candidate)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null)
            {
                return NotFound(new { message = "Interview not found." });
            }

            if (interview.Application!.Candidate!.Email != email)
            {
                return Forbid();
            }

            interview.Status = "Pending Confirmation";
            interview.RescheduleNote = "Reschedule requested — awaiting recruiter confirmation";
            interview.RequestedSlotsJson = JsonSerializer.Serialize(dto.PreferredSlots);
            interview.RescheduleReason = dto.Reason;
            // Note: original ScheduledDate is intentionally NOT modified here

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = interview.Id,
                status = interview.Status,
                rescheduleNote = interview.RescheduleNote
            });
        }

        // POST: api/candidates/me/interviews/{interviewId}/cancel
        [HttpPost("{interviewId}/cancel")]
        public async Task<IActionResult> CancelInterview(int interviewId)
        {
            var email = GetCandidateEmail();

            var interview = await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Candidate)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null)
            {
                return NotFound(new { message = "Interview not found." });
            }

            if (interview.Application!.Candidate!.Email != email)
            {
                return Forbid();
            }

            interview.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok(new { id = interview.Id, status = interview.Status });
        }

        // GET: api/candidates/me/interviews/{interviewId}/feedback
        [HttpGet("{interviewId}/feedback")]
        public async Task<IActionResult> GetFeedback(int interviewId)
        {
            var email = GetCandidateEmail();

            var interview = await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Candidate)
                .Include(i => i.Feedback)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null)
            {
                return NotFound(new { message = "Interview not found." });
            }

            if (interview.Application!.Candidate!.Email != email)
            {
                return Forbid();
            }

            if (interview.Status != "Completed" || interview.Feedback == null || !interview.Feedback.SharedWithCandidate)
            {
                return NotFound(new { message = "Feedback not available yet." });
            }

            var fb = interview.Feedback;

            return Ok(new
            {
                interviewerName = fb.InterviewerName,
                role = fb.Role,
                rating = fb.Rating,
                notes = fb.Strengths,
                cultureFit = fb.CultureFit,
                techSkills = fb.TechSkills,
                outcome = fb.Outcome
            });
        }
    }
}