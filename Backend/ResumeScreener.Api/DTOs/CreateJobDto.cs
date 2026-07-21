using System.ComponentModel.DataAnnotations;

namespace ResumeScreener.Api.DTOs
{
    public class CreateJobDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Department { get; set; } = string.Empty;

        [Required]
        [MinLength(50, ErrorMessage = "Description must be at least 50 characters")]
        public string Description { get; set; } = string.Empty;

        public string? Location { get; set; }

        public string? EmploymentType { get; set; }

        public string? Salary { get; set; }

        public List<string> Requirements { get; set; } = new();

        public List<string> Skills { get; set; } = new();
    }
}