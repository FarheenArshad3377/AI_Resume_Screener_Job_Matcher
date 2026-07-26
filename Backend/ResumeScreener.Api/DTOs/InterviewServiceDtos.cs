namespace ResumeScreener.Api.DTOs
{
    // ---- Recruiter side ----
    public class InterviewStatsDto
    {
        public int ScheduledToday { get; set; }
        public int ThisWeek { get; set; }
        public int PendingConfirmation { get; set; }
        public int Completed { get; set; }
    }

    public class InterviewerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Avatar { get; set; }
    }

    public class InterviewListItemDto
    {
        public int Id { get; set; }
        public int CandidateId { get; set; }
        public string CandidateName { get; set; } = string.Empty;
        public string CandidateEmail { get; set; } = string.Empty;
        public string? CandidateAvatar { get; set; }
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string InterviewType { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
        public List<InterviewerDto> Interviewers { get; set; } = new();
        public string Status { get; set; } = string.Empty;
    }

    public class InterviewListResultDto
    {
        public InterviewStatsDto Stats { get; set; } = new();
        public List<InterviewListItemDto> Interviews { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }

    public class PastRoundDto
    {
        public int Id { get; set; }
        public string InterviewType { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Outcome { get; set; }
    }

    public class RecruiterInterviewDetailDto
    {
        public int Id { get; set; }
        public CandidateSummaryDto Candidate { get; set; } = new();
        public JobSummaryDto Job { get; set; } = new();
        public string InterviewType { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
        public string? MeetingLink { get; set; }
        public List<InterviewerDto> Interviewers { get; set; } = new();
        public string? Notes { get; set; }
        public List<PastRoundDto> PastRounds { get; set; } = new();
    }

    public class CandidateSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ResumeUrl { get; set; } = string.Empty;
    }

    public class JobSummaryDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
    }

    public class ScheduleInterviewResultDto
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
    }

    public class RescheduleRequestsDto
    {
        public List<object> PreferredSlots { get; set; } = new();
        public string? Reason { get; set; }
    }

    public class RescheduleConfirmResultDto
    {
        public int Id { get; set; }
        public DateTime ScheduledDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class CancelResultDto
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class SubmitFeedbackResultDto
    {
        public int Id { get; set; }
        public int InterviewId { get; set; }
        public int SubmittedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class RecruiterFeedbackDto
    {
        public int Rating { get; set; }
        public string? Strengths { get; set; }
        public string? Concerns { get; set; }
        public string Recommendation { get; set; } = string.Empty;
        public string? PrivateNotes { get; set; }
    }

    // ---- Candidate side ----
    public class MyInterviewDto
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string? Company { get; set; }
        public string? CompanyLogo { get; set; }
        public string InterviewType { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
        public string? InterviewerName { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? MeetingLink { get; set; }
        public string? RescheduleNote { get; set; }
    }

    public class MyInterviewDetailDto
    {
        public int Id { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string? Company { get; set; }
        public string JobDescriptionSnippet { get; set; } = string.Empty;
        public string InterviewType { get; set; } = string.Empty;
        public int DurationMinutes { get; set; }
        public DateTime ScheduledDate { get; set; }
        public string? MeetingLink { get; set; }
        public string? InterviewerName { get; set; }
        public string? InterviewerBio { get; set; }
        public string? PreparationNotes { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class RescheduleRequestResultDto
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? RescheduleNote { get; set; }
    }

    public class CandidateFeedbackDto
    {
        public string? InterviewerName { get; set; }
        public string? Role { get; set; }
        public int Rating { get; set; }
        public string? Notes { get; set; }
        public string? CultureFit { get; set; }
        public string? TechSkills { get; set; }
        public string? Outcome { get; set; }
    }
}