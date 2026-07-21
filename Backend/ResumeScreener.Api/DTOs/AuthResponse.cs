namespace ResumeScreener.Api.DTOs
{
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? CompanyName { get; set; }   // 👈 NEW
        public DateTime ExpiresAt { get; set; }
    }
}