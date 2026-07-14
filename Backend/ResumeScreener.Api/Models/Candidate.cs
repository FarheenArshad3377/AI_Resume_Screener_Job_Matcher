using System.ComponentModel.DataAnnotations;

namespace ResumeScreener.Api.Models
{
    public class Candidate
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        public string ResumeFilePath { get; set; } = string.Empty;

        public string ParsedText { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Navigation property (one Candidate -> many Applications)
        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}