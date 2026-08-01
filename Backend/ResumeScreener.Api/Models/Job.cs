using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeScreener.Api.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        [MaxLength(30)]
        public string? ExperienceLevel { get; set; } // "Entry Level", "Mid Level", "Senior Level"
        [Required]
        public string Description { get; set; } = string.Empty;

        public string RequiredSkills { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int? RecruiterId { get; set; }

        [ForeignKey(nameof(RecruiterId))]
        public User? Recruiter { get; set; }

        public ICollection<Application> Applications { get; set; } = new List<Application>();

        // 👇 NEW fields for Post Job page
        [MaxLength(100)]
        public string? Department { get; set; }

        [MaxLength(150)]
        public string? Location { get; set; }

        [MaxLength(50)]
        public string? EmploymentType { get; set; } // Full-time, Part-time, Contract, Internship

        [MaxLength(50)]
        public string? Salary { get; set; }

        public string? Requirements { get; set; } // newline-separated list

        [MaxLength(20)]
        public string Status { get; set; } = "Draft"; // Draft, Open, Closed

        public DateTime? PublishedDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}