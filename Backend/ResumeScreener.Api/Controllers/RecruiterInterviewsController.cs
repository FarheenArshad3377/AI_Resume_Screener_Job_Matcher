using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Models;
using System.Security.Claims;
using System.Text.Json;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/recruiter/interviews")]
    [Authorize]
    public class RecruiterInterviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RecruiterInterviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetRecruiterId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }

        private static string MapRecommendationToOutcome(string recommendation) => recommendation switch
        {
            "MoveToNextRound" => "Passed to next round",
            "Reject" => "Not selected",
            "Hire" => "Hired",
            _ => "Pending"
        };

        // GET: api/recruiter/interviews
        [HttpGet]
        public async Task<IActionResult> GetInterviews(
            [FromQuery] string? search = null,
            [FromQuery] int? jobId = null,
            [FromQuery] string? status = null,
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var recruiterId = GetRecruiterId();

            var query = _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .Include(i => i.Application).ThenInclude(a => a!.Candidate)
                .Include(i => i.Interviewers).ThenInclude(ii => ii.User)
                .Where(i => i.Application!.Job!.RecruiterId == recruiterId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(i =>
                    i.Application!.Candidate!.Name.Contains(search) ||
                    i.Application.Job!.Title.Contains(search));
            }
            if (jobId.HasValue)
                query = query.Where(i => i.Application!.JobId == jobId.Value);
            if (!string.IsNullOrEmpty(status) && status != "All")
                query = query.Where(i => i.Status == status);
            if (dateFrom.HasValue)
                query = query.Where(i => i.ScheduledDate >= dateFrom.Value);
            if (dateTo.HasValue)
                query = query.Where(i => i.ScheduledDate <= dateTo.Value);

            var totalCount = await query.CountAsync();

            var interviews = await query
                .OrderByDescending(i => i.ScheduledDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var today = DateTime.UtcNow.Date;
            var weekEnd = today.AddDays(7);

            var allForStats = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .Where(i => i.Application!.Job!.RecruiterId == recruiterId)
                .ToListAsync();

            var stats = new
            {
                scheduledToday = allForStats.Count(i => i.ScheduledDate.Date == today && i.Status == "Scheduled"),
                thisWeek = allForStats.Count(i => i.ScheduledDate.Date >= today && i.ScheduledDate.Date <= weekEnd),
                pendingConfirmation = allForStats.Count(i => i.Status == "Pending Confirmation"),
                completed = allForStats.Count(i => i.Status == "Completed")
            };

            var result = interviews.Select(i => new
            {
                id = i.Id,
                candidateId = i.Application!.CandidateId,
                candidateName = i.Application.Candidate!.Name,
                candidateEmail = i.Application.Candidate.Email,
                candidateAvatar = (string?)null,
                jobId = i.Application.JobId,
                jobTitle = i.Application.Job!.Title,
                interviewType = i.InterviewType,
                scheduledDate = i.ScheduledDate,
                interviewers = i.Interviewers.Select(ii => new
                {
                    id = ii.UserId,
                    name = ii.User!.FullName,
                    avatar = (string?)null
                }),
                status = i.Status
            });

            return Ok(new
            {
                stats,
                interviews = result,
                totalCount,
                page,
                pageSize
            });
        }

        // GET: api/recruiter/interviews/{interviewId}
        [HttpGet("{interviewId}")]
        public async Task<IActionResult> GetInterviewDetail(int interviewId)
        {
            var recruiterId = GetRecruiterId();

            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .Include(i => i.Application).ThenInclude(a => a!.Candidate)
                .Include(i => i.Interviewers).ThenInclude(ii => ii.User)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) return NotFound(new { message = "Interview not found." });
            if (interview.Application!.Job!.RecruiterId != recruiterId) return Forbid();

            var pastRounds = await _context.Interviews
                .Where(i => i.ApplicationId == interview.ApplicationId && i.Id != interviewId)
                .Include(i => i.Feedback)
                .Select(i => new
                {
                    id = i.Id,
                    type = i.InterviewType,
                    date = i.ScheduledDate,
                    status = i.Status,
                    outcome = i.Feedback != null ? i.Feedback.Outcome : null
                })
                .ToListAsync();

            return Ok(new
            {
                id = interview.Id,
                candidate = new
                {
                    id = interview.Application.CandidateId,
                    name = interview.Application.Candidate!.Name,
                    email = interview.Application.Candidate.Email,
                    resumeUrl = $"/api/candidates/{interview.Application.CandidateId}/resume"
                },
                job = new { id = interview.Application.JobId, title = interview.Application.Job.Title },
                interviewType = interview.InterviewType,
                scheduledDate = interview.ScheduledDate,
                meetingLink = interview.MeetingLink,
                interviewers = interview.Interviewers.Select(ii => new { id = ii.UserId, name = ii.User!.FullName }),
                notes = interview.RecruiterNotes,
                pastRounds
            });
        }

        // POST: api/recruiter/interviews
        [HttpPost]
        public async Task<IActionResult> ScheduleInterview([FromBody] ScheduleRecruiterInterviewDto dto)
        {
            var recruiterId = GetRecruiterId();

            var application = await _context.Applications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.CandidateId == dto.CandidateId && a.JobId == dto.JobId);

            if (application == null)
                return NotFound(new { message = "No application found for this candidate and job." });

            if (application.Job!.RecruiterId != recruiterId)
                return Forbid();

            var interview = new Interview
            {
                ApplicationId = application.Id,
                InterviewType = dto.InterviewType,
                ScheduledDate = dto.ScheduledDate,
                MeetingLink = dto.MeetingLink,
                RecruiterNotes = dto.Notes,
                Status = "Scheduled",
                CreatedAt = DateTime.UtcNow
            };

            _context.Interviews.Add(interview);
            await _context.SaveChangesAsync();

            foreach (var userId in dto.InterviewerIds)
            {
                _context.InterviewInterviewers.Add(new InterviewInterviewer
                {
                    InterviewId = interview.Id,
                    UserId = userId
                });
            }
            await _context.SaveChangesAsync();

            return StatusCode(201, new { interview.Id, interview.Status, interview.ScheduledDate });
        }

        // GET: api/recruiter/interviews/{interviewId}/reschedule-requests
        [HttpGet("{interviewId}/reschedule-requests")]
        public async Task<IActionResult> GetRescheduleRequests(int interviewId)
        {
            var recruiterId = GetRecruiterId();
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) return NotFound(new { message = "Interview not found." });
            if (interview.Application!.Job!.RecruiterId != recruiterId) return Forbid();

            var slots = string.IsNullOrEmpty(interview.RequestedSlotsJson)
                ? new List<object>()
                : JsonSerializer.Deserialize<List<object>>(interview.RequestedSlotsJson) ?? new List<object>();

            return Ok(new { preferredSlots = slots, reason = interview.RescheduleReason });
        }

        // PUT: api/recruiter/interviews/{interviewId}/reschedule
        [HttpPut("{interviewId}/reschedule")]
        public async Task<IActionResult> ConfirmReschedule(int interviewId, [FromBody] RescheduleConfirmDto dto)
        {
            var recruiterId = GetRecruiterId();
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) return NotFound(new { message = "Interview not found." });
            if (interview.Application!.Job!.RecruiterId != recruiterId) return Forbid();

            interview.ScheduledDate = dto.NewDate;
            interview.Status = "Scheduled";
            interview.RescheduleNote = null;
            interview.RequestedSlotsJson = null;

            await _context.SaveChangesAsync();

            return Ok(new { interview.Id, interview.ScheduledDate, interview.Status });
        }

        // POST: api/recruiter/interviews/{interviewId}/cancel
        [HttpPost("{interviewId}/cancel")]
        public async Task<IActionResult> CancelInterview(int interviewId, [FromBody] CancelInterviewDto? dto)
        {
            var recruiterId = GetRecruiterId();
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) return NotFound(new { message = "Interview not found." });
            if (interview.Application!.Job!.RecruiterId != recruiterId) return Forbid();

            interview.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok(new { interview.Id, interview.Status });
        }

        // POST: api/recruiter/interviews/{interviewId}/feedback
        [HttpPost("{interviewId}/feedback")]
        public async Task<IActionResult> SubmitFeedback(int interviewId, [FromBody] SubmitRecruiterFeedbackDto dto)
        {
            var recruiterId = GetRecruiterId();
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .Include(i => i.Feedback)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) return NotFound(new { message = "Interview not found." });
            if (interview.Application!.Job!.RecruiterId != recruiterId) return Forbid();

            if (interview.Feedback == null)
            {
                interview.Feedback = new InterviewFeedback { InterviewId = interviewId };
                _context.InterviewFeedbacks.Add(interview.Feedback);
            }

            interview.Feedback.Rating = dto.Rating;
            interview.Feedback.Strengths = dto.Strengths;
            interview.Feedback.Concerns = dto.Concerns;
            interview.Feedback.Recommendation = dto.Recommendation;
            interview.Feedback.PrivateNotes = dto.PrivateNotes;
            interview.Feedback.Outcome = MapRecommendationToOutcome(dto.Recommendation);
            interview.Feedback.SubmittedByUserId = recruiterId;
            interview.Feedback.SharedWithCandidate = true;
            interview.Feedback.CreatedAt = DateTime.UtcNow;

            interview.Status = "Completed";

            await _context.SaveChangesAsync();

            return StatusCode(201, new
            {
                id = interview.Feedback.Id,
                interviewId = interview.Id,
                submittedBy = recruiterId,
                createdAt = interview.Feedback.CreatedAt
            });
        }

        // GET: api/recruiter/interviews/{interviewId}/feedback
        [HttpGet("{interviewId}/feedback")]
        public async Task<IActionResult> GetFeedback(int interviewId)
        {
            var recruiterId = GetRecruiterId();
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .Include(i => i.Feedback)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) return NotFound(new { message = "Interview not found." });
            if (interview.Application!.Job!.RecruiterId != recruiterId) return Forbid();
            if (interview.Feedback == null) return NotFound(new { message = "No feedback submitted yet." });

            var fb = interview.Feedback;
            return Ok(new
            {
                rating = fb.Rating,
                strengths = fb.Strengths,
                concerns = fb.Concerns,
                recommendation = fb.Recommendation,
                privateNotes = fb.PrivateNotes
            });
        }

        // POST: api/recruiter/interviews/{interviewId}/send-reminder
        [HttpPost("{interviewId}/send-reminder")]
        public async Task<IActionResult> SendReminder(int interviewId)
        {
            var recruiterId = GetRecruiterId();
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) return NotFound(new { message = "Interview not found." });
            if (interview.Application!.Job!.RecruiterId != recruiterId) return Forbid();

            return Ok(new { message = "Reminder sent" });
        }
    }

    [ApiController]
    [Route("api/recruiter")]
    [Authorize]
    public class RecruiterLookupController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RecruiterLookupController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetRecruiterId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // GET: api/recruiter/candidates/search?query=...
        [HttpGet("candidates/search")]
        public async Task<IActionResult> SearchCandidates([FromQuery] string query = "")
        {
            var recruiterId = GetRecruiterId();

            var candidates = await _context.Applications
                .Include(a => a.Candidate)
                .Where(a => a.Job!.RecruiterId == recruiterId &&
                            (string.IsNullOrEmpty(query) ||
                             a.Candidate!.Name.Contains(query) ||
                             a.Candidate.Email.Contains(query)))
                .Select(a => new { id = a.CandidateId, name = a.Candidate!.Name, email = a.Candidate.Email, avatar = (string?)null })
                .Distinct()
                .Take(20)
                .ToListAsync();

            return Ok(candidates);
        }

        // GET: api/recruiter/jobs/active
        [HttpGet("jobs/active")]
        public async Task<IActionResult> GetActiveJobs()
        {
            var recruiterId = GetRecruiterId();

            var jobs = await _context.Jobs
                .Where(j => j.RecruiterId == recruiterId && j.Status == "Open")
                .Select(j => new { id = j.Id, title = j.Title })
                .ToListAsync();

            return Ok(jobs);
        }

        // GET: api/recruiter/team-members
        [HttpGet("team-members")]
        public async Task<IActionResult> GetTeamMembers()
        {
            var recruiterId = GetRecruiterId();
            var me = await _context.Users.FindAsync(recruiterId);
            if (me == null) return NotFound();

            var team = await _context.Users
                .Where(u => u.Role == "Recruiter" && u.CompanyName == me.CompanyName)
                .Select(u => new { id = u.Id, name = u.FullName, avatar = (string?)null })
                .ToListAsync();

            return Ok(team);
        }
    }
}