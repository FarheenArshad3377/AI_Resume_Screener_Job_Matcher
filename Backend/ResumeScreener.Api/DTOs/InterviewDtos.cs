namespace ResumeScreener.Api.DTOs
{
    public class PreferredSlotDto
    {
        public string Date { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
    }

    public class RescheduleRequestDto
    {
        public List<PreferredSlotDto> PreferredSlots { get; set; } = new();
        public string? Reason { get; set; }
    }

    public class ScheduleInterviewDto
    {
        public int ApplicationId { get; set; }
        public string InterviewType { get; set; } = "Video Call";
        public DateTime ScheduledDate { get; set; }
        public int DurationMinutes { get; set; } = 30;
        public string? InterviewerName { get; set; }
        public string? InterviewerBio { get; set; }
        public string? MeetingLink { get; set; }
        public string? PreparationNotes { get; set; }
    }

    public class SubmitFeedbackDto
    {
        public string? InterviewerName { get; set; }
        public string? Role { get; set; }
        public double Rating { get; set; }
        public string? Notes { get; set; }
        public int CultureFit { get; set; }
        public int TechSkills { get; set; }
        public string Outcome { get; set; } = "Pending";
        public bool ShareWithCandidate { get; set; } = false;
    }
}