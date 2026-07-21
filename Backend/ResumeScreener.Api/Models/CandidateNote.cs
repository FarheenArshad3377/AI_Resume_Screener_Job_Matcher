using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeScreener.Api.Models
{
    public class CandidateNote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(Candidate))]
        public int CandidateId { get; set; }
        public Candidate? Candidate { get; set; }

        [Required]
        public string Text { get; set; } = string.Empty;

        public int? CreatedByUserId { get; set; }

        [ForeignKey(nameof(CreatedByUserId))]
        public User? CreatedByUser { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}