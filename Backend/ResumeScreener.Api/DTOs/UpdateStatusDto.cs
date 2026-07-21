using System.ComponentModel.DataAnnotations;

namespace ResumeScreener.Api.DTOs
{
    public class UpdateStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty; // New, Reviewing, Shortlisted, Rejected, Hired
    }
}