using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeScreener.Api.Models
{
    public class Application
    {
        [Key]
        public int Id { get; set; }

        // Foreign Key -> Job
        [Required]
        [ForeignKey(nameof(Job))]
        public int JobId { get; set; }
        public Job? Job { get; set; }

        // Foreign Key -> Candidate
        [Required]
        [ForeignKey(nameof(Candidate))]
        public int CandidateId { get; set; }
        public Candidate? Candidate { get; set; }

        public int? MatchScore { get; set; }

        public string? MatchedSkills { get; set; }

        public string? MissingSkills { get; set; }

        public string? AiSummary { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Processing, Scored, Failed

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}