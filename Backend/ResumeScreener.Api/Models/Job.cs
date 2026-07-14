using System.ComponentModel.DataAnnotations;

namespace ResumeScreener.Api.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string RequiredSkills { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property (one Job -> many Applications)
        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}