using System.ComponentModel.DataAnnotations;

namespace ResumeScreener.Api.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Role { get; set; } = "Recruiter";

        [MaxLength(150)]
        public string? CompanyName { get; set; }   // 👈 NEW - sirf Recruiter ke liye

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}