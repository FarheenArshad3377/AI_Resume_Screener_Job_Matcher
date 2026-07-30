using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeScreener.Api.Models
{
    public class Application
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(Job))]
        public int JobId { get; set; }
        public Job? Job { get; set; }

        [Required]
        [ForeignKey(nameof(Candidate))]
        public int CandidateId { get; set; }
        public Candidate? Candidate { get; set; }

        public int? MatchScore { get; set; }
        public string? MatchedSkills { get; set; }
        public string? MissingSkills { get; set; }
        public string? AiSummary { get; set; }

        public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? HiredAt { get; set; }   // 👈 NEW - jab status "Hired" set ho
    }
}