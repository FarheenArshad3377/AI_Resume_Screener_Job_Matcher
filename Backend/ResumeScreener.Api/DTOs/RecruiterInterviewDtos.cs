namespace ResumeScreener.Api.DTOs
{
    public class ScheduleRecruiterInterviewDto
    {
        public int CandidateId { get; set; }
        public int JobId { get; set; }
        public string InterviewType { get; set; } = "Video Call";
        public DateTime ScheduledDate { get; set; }
        public List<int> InterviewerIds { get; set; } = new();
        public string? MeetingLink { get; set; }
        public string? Notes { get; set; }
    }

    public class RescheduleConfirmDto
    {
        public DateTime NewDate { get; set; }
        public string? Reason { get; set; }
        public string? Source { get; set; }
    }

    public class CancelInterviewDto
    {
        public string? Reason { get; set; }
    }

    public class SubmitRecruiterFeedbackDto
    {
        public double Rating { get; set; }
        public string? Strengths { get; set; }
        public string? Concerns { get; set; }
        public string Recommendation { get; set; } = "MoveToNextRound";
        public string? PrivateNotes { get; set; }
    }
}