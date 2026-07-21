using System.ComponentModel.DataAnnotations;

namespace ResumeScreener.Api.DTOs
{
    public class RegisterRequest
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "Recruiter";

        public string? CompanyName { get; set; }   // 👈 NEW - optional, sirf Recruiter fill karega
    }
}