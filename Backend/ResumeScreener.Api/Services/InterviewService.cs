using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Models;
using ResumeScreener.Api.Services.Exceptions;
using System.Text.Json;

namespace ResumeScreener.Api.Services
{
    public class InterviewService : IInterviewService
    {
        private readonly ApplicationDbContext _context;

        public InterviewService(ApplicationDbContext context)
        {
            _context = context;
        }

        private static string MapRecommendationToOutcome(string recommendation) => recommendation switch
        {
            "MoveToNextRound" => "Passed to next round",
            "Reject" => "Not selected",
            "Hire" => "Hired",
            _ => "Pending"
        };

        // ---------------- Recruiter side ----------------

        public async Task<InterviewListResultDto> GetInterviewsAsync(int recruiterId, string? search, int? jobId, string? status, DateTime? dateFrom, DateTime? dateTo, int page, int pageSize)
        {
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

            var stats = new InterviewStatsDto
            {
                ScheduledToday = allForStats.Count(i => i.ScheduledDate.Date == today && i.Status == "Scheduled"),
                ThisWeek = allForStats.Count(i => i.ScheduledDate.Date >= today && i.ScheduledDate.Date <= weekEnd),
                PendingConfirmation = allForStats.Count(i => i.Status == "Pending Confirmation"),
                Completed = allForStats.Count(i => i.Status == "Completed")
            };

            var result = interviews.Select(i => new InterviewListItemDto
            {
                Id = i.Id,
                CandidateId = i.Application!.CandidateId,
                CandidateName = i.Application.Candidate!.Name,
                CandidateEmail = i.Application.Candidate.Email,
                CandidateAvatar = null,
                JobId = i.Application.JobId,
                JobTitle = i.Application.Job!.Title,
                InterviewType = i.InterviewType,
                ScheduledDate = i.ScheduledDate,
                Interviewers = i.Interviewers.Select(ii => new InterviewerDto
                {
                    Id = ii.UserId,
                    Name = ii.User!.FullName,
                    Avatar = null
                }).ToList(),
                Status = i.Status
            }).ToList();

            return new InterviewListResultDto
            {
                Stats = stats,
                Interviews = result,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<RecruiterInterviewDetailDto> GetInterviewDetailAsync(int recruiterId, int interviewId)
        {
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .Include(i => i.Application).ThenInclude(a => a!.Candidate)
                .Include(i => i.Interviewers).ThenInclude(ii => ii.User)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) throw new NotFoundException("Interview not found.");
            if (interview.Application!.Job!.RecruiterId != recruiterId) throw new ForbiddenException("Not allowed to view this interview.");

            var pastRounds = await _context.Interviews
                .Where(i => i.ApplicationId == interview.ApplicationId && i.Id != interviewId)
                .Include(i => i.Feedback)
                .Select(i => new PastRoundDto
                {
                    Id = i.Id,
                    InterviewType = i.InterviewType,
                    ScheduledDate = i.ScheduledDate,
                    Status = i.Status,
                    Outcome = i.Feedback != null ? i.Feedback.Outcome : null
                })
                .ToListAsync();

            return new RecruiterInterviewDetailDto
            {
                Id = interview.Id,
                Candidate = new CandidateSummaryDto
                {
                    Id = interview.Application.CandidateId,
                    Name = interview.Application.Candidate!.Name,
                    Email = interview.Application.Candidate.Email,
                    ResumeUrl = $"/api/candidates/{interview.Application.CandidateId}/resume"
                },
                Job = new JobSummaryDto { Id = interview.Application.JobId, Title = interview.Application.Job.Title },
                InterviewType = interview.InterviewType,
                ScheduledDate = interview.ScheduledDate,
                MeetingLink = interview.MeetingLink,
                Interviewers = interview.Interviewers.Select(ii => new InterviewerDto { Id = ii.UserId, Name = ii.User!.FullName }).ToList(),
                Notes = interview.RecruiterNotes,
                PastRounds = pastRounds
            };
        }

        public async Task<ScheduleInterviewResultDto> ScheduleInterviewAsync(int recruiterId, ScheduleRecruiterInterviewDto dto)
        {
            var application = await _context.Applications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.CandidateId == dto.CandidateId && a.JobId == dto.JobId);

            if (application == null)
                throw new NotFoundException("No application found for this candidate and job.");

            if (application.Job!.RecruiterId != recruiterId)
                throw new ForbiddenException("Not allowed to schedule for this job.");

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

            return new ScheduleInterviewResultDto
            {
                Id = interview.Id,
                Status = interview.Status,
                ScheduledDate = interview.ScheduledDate
            };
        }

        public async Task<RescheduleRequestsDto> GetRescheduleRequestsAsync(int recruiterId, int interviewId)
        {
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) throw new NotFoundException("Interview not found.");
            if (interview.Application!.Job!.RecruiterId != recruiterId) throw new ForbiddenException("Not allowed.");

            var slots = string.IsNullOrEmpty(interview.RequestedSlotsJson)
                ? new List<object>()
                : JsonSerializer.Deserialize<List<object>>(interview.RequestedSlotsJson) ?? new List<object>();

            return new RescheduleRequestsDto { PreferredSlots = slots, Reason = interview.RescheduleReason };
        }

        public async Task<RescheduleConfirmResultDto> ConfirmRescheduleAsync(int recruiterId, int interviewId, RescheduleConfirmDto dto)
        {
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) throw new NotFoundException("Interview not found.");
            if (interview.Application!.Job!.RecruiterId != recruiterId) throw new ForbiddenException("Not allowed.");

            interview.ScheduledDate = dto.NewDate;
            interview.Status = "Scheduled";
            interview.RescheduleNote = null;
            interview.RequestedSlotsJson = null;

            await _context.SaveChangesAsync();

            return new RescheduleConfirmResultDto { Id = interview.Id, ScheduledDate = interview.ScheduledDate, Status = interview.Status };
        }

        public async Task<CancelResultDto> CancelInterviewAsRecruiterAsync(int recruiterId, int interviewId)
        {
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) throw new NotFoundException("Interview not found.");
            if (interview.Application!.Job!.RecruiterId != recruiterId) throw new ForbiddenException("Not allowed.");

            interview.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return new CancelResultDto { Id = interview.Id, Status = interview.Status };
        }

        public async Task<SubmitFeedbackResultDto> SubmitFeedbackAsync(int recruiterId, int interviewId, SubmitRecruiterFeedbackDto dto)
        {
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .Include(i => i.Feedback)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) throw new NotFoundException("Interview not found.");
            if (interview.Application!.Job!.RecruiterId != recruiterId) throw new ForbiddenException("Not allowed.");

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

            return new SubmitFeedbackResultDto
            {
                Id = interview.Feedback.Id,
                InterviewId = interview.Id,
                SubmittedBy = recruiterId,
                CreatedAt = interview.Feedback.CreatedAt
            };
        }

        public async Task<RecruiterFeedbackDto> GetFeedbackAsRecruiterAsync(int recruiterId, int interviewId)
        {
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .Include(i => i.Feedback)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) throw new NotFoundException("Interview not found.");
            if (interview.Application!.Job!.RecruiterId != recruiterId) throw new ForbiddenException("Not allowed.");
            if (interview.Feedback == null) throw new NotFoundException("No feedback submitted yet.");

            var fb = interview.Feedback;
            return new RecruiterFeedbackDto
            {
                // Explicitly convert Rating to int to resolve type mismatch
                Rating = Convert.ToInt32(fb.Rating),
                Strengths = fb.Strengths,
                Concerns = fb.Concerns,
                Recommendation = fb.Recommendation,
                PrivateNotes = fb.PrivateNotes
            };
        }

        public async Task SendReminderAsync(int recruiterId, int interviewId)
        {
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) throw new NotFoundException("Interview not found.");
            if (interview.Application!.Job!.RecruiterId != recruiterId) throw new ForbiddenException("Not allowed.");

            // Reminder-sending logic yahan aayegi (abhi placeholder, jaisa original code mein tha)
        }

        // ---------------- Candidate side ----------------

        public async Task<PagedResult<MyInterviewDto>> GetMyInterviewsAsync(string candidateEmail, string? status, int page, int pageSize)
        {
            var query = _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Job)
                        .ThenInclude(j => j!.Recruiter)
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Candidate)
                .Where(i => i.Application!.Candidate!.Email == candidateEmail);

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(i => i.Status == status);
            }

            var totalCount = await query.CountAsync();

            var interviews = await query
                .OrderByDescending(i => i.ScheduledDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(i => new MyInterviewDto
                {
                    Id = i.Id,
                    JobId = i.Application!.JobId,
                    JobTitle = i.Application.Job!.Title,
                    Company = i.Application.Job.Recruiter != null ? i.Application.Job.Recruiter.CompanyName : null,
                    CompanyLogo = null,
                    InterviewType = i.InterviewType,
                    ScheduledDate = i.ScheduledDate,
                    InterviewerName = i.InterviewerName,
                    Status = i.Status,
                    MeetingLink = i.MeetingLink,
                    RescheduleNote = i.RescheduleNote
                })
                .ToListAsync();

            return new PagedResult<MyInterviewDto>
            {
                Data = interviews,
                PageNumber = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<MyInterviewDetailDto> GetInterviewDetailForCandidateAsync(string candidateEmail, int interviewId)
        {
            var interview = await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Job)
                        .ThenInclude(j => j!.Recruiter)
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Candidate)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) throw new NotFoundException("Interview not found.");
            if (interview.Application!.Candidate!.Email != candidateEmail) throw new ForbiddenException("Not allowed.");

            var job = interview.Application.Job!;
            var descriptionSnippet = job.Description.Length > 150
                ? job.Description.Substring(0, 150) + "..."
                : job.Description;

            return new MyInterviewDetailDto
            {
                Id = interview.Id,
                JobTitle = job.Title,
                Company = job.Recruiter != null ? job.Recruiter.CompanyName : null,
                JobDescriptionSnippet = descriptionSnippet,
                InterviewType = interview.InterviewType,
                DurationMinutes = interview.DurationMinutes,
                ScheduledDate = interview.ScheduledDate,
                MeetingLink = interview.MeetingLink,
                InterviewerName = interview.InterviewerName,
                InterviewerBio = interview.InterviewerBio,
                PreparationNotes = interview.PreparationNotes,
                Status = interview.Status
            };
        }

        public async Task<RescheduleRequestResultDto> RequestRescheduleAsync(string candidateEmail, int interviewId, RescheduleRequestDto dto)
        {
            var interview = await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Candidate)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) throw new NotFoundException("Interview not found.");
            if (interview.Application!.Candidate!.Email != candidateEmail) throw new ForbiddenException("Not allowed.");

            interview.Status = "Pending Confirmation";
            interview.RescheduleNote = "Reschedule requested — awaiting recruiter confirmation";
            interview.RequestedSlotsJson = JsonSerializer.Serialize(dto.PreferredSlots);
            interview.RescheduleReason = dto.Reason;
            // Note: original ScheduledDate is intentionally NOT modified here

            await _context.SaveChangesAsync();

            return new RescheduleRequestResultDto
            {
                Id = interview.Id,
                Status = interview.Status,
                RescheduleNote = interview.RescheduleNote
            };
        }

        public async Task<CancelResultDto> CancelInterviewAsCandidateAsync(string candidateEmail, int interviewId)
        {
            var interview = await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Candidate)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) throw new NotFoundException("Interview not found.");
            if (interview.Application!.Candidate!.Email != candidateEmail) throw new ForbiddenException("Not allowed.");

            interview.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return new CancelResultDto { Id = interview.Id, Status = interview.Status };
        }

        public async Task<CandidateFeedbackDto> GetFeedbackForCandidateAsync(string candidateEmail, int interviewId)
        {
            var interview = await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a!.Candidate)
                .Include(i => i.Feedback)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null) throw new NotFoundException("Interview not found.");
            if (interview.Application!.Candidate!.Email != candidateEmail) throw new ForbiddenException("Not allowed.");

            if (interview.Status != "Completed" || interview.Feedback == null || !interview.Feedback.SharedWithCandidate)
            {
                throw new NotFoundException("Feedback not available yet.");
            }

            var fb = interview.Feedback;

            return new CandidateFeedbackDto
            {
                InterviewerName = fb.InterviewerName ?? "Interviewer",
                Role = fb.Role ?? "Hiring Team",
                Rating = Convert.ToInt32(fb.Rating),
                Notes = fb.Strengths,
                // If CultureFit/TechSkills are not directly in InterviewFeedback entity, 
                // fallback to 0 or map them properly based on your entity schema
                CultureFit = "0",
                TechSkills = "0",
                Outcome = fb.Outcome
            };
        }
    }
}