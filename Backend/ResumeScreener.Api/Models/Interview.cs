using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeScreener.Api.Models
{
    public class Interview
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(Application))]
        public int ApplicationId { get; set; }
        public Application? Application { get; set; }

        [Required]
        [MaxLength(50)]
        public string InterviewType { get; set; } = "Video Call"; // Video Call, Phone Screen, On-site, Technical Round

        [Required]
        public DateTime ScheduledDate { get; set; }

        public int DurationMinutes { get; set; } = 30;

        [MaxLength(150)]
        public string? InterviewerName { get; set; }

        public string? InterviewerBio { get; set; }

        public string? MeetingLink { get; set; }

        public string? PreparationNotes { get; set; }
        public string? RecruiterNotes { get; set; }

        [Required]
        [MaxLength(30)]
        public string Status { get; set; } = "Scheduled"; // Scheduled, Rescheduled, Completed, Cancelled, Pending Confirmation

        public string? RescheduleNote { get; set; }
        public string? RequestedSlotsJson { get; set; }
        public string? RescheduleReason { get; set; }
        public ICollection<InterviewInterviewer> Interviewers { get; set; } = new List<InterviewInterviewer>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public InterviewFeedback? Feedback { get; set; }
    }
}