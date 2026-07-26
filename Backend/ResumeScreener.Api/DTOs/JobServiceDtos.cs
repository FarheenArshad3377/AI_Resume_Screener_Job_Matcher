namespace ResumeScreener.Api.DTOs
{
    public class JobListItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public string? EmploymentType { get; set; }
        public string? Salary { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}