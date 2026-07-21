using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeScreener.Api.Models
{
    public class InterviewFeedback
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(Interview))]
        public int InterviewId { get; set; }
        public Interview? Interview { get; set; }

        // Legacy fields (candidate-facing simple feedback)
        [MaxLength(150)]
        public string? InterviewerName { get; set; }
        [MaxLength(100)]
        public string? Role { get; set; }
        public int CultureFit { get; set; }
        public int TechSkills { get; set; }
        public bool SharedWithCandidate { get; set; } = false;

        // New recruiter feedback fields
        public double Rating { get; set; }
        public string? Strengths { get; set; }
        public string? Concerns { get; set; }
        [MaxLength(30)]
        public string Recommendation { get; set; } = "MoveToNextRound";
        public string? PrivateNotes { get; set; }

        public int? SubmittedByUserId { get; set; }
        [ForeignKey(nameof(SubmittedByUserId))]
        public User? SubmittedByUser { get; set; }

        [MaxLength(50)]
        public string Outcome { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}