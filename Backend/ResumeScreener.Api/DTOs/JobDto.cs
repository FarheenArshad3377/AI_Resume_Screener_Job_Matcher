namespace ResumeScreener.Api.DTOs
{
    public class JobDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string? EmploymentType { get; set; }
        public string? Salary { get; set; }
        public string Status { get; set; } = string.Empty;
        public int Applicants { get; set; }
        public List<string> Requirements { get; set; } = new();
        public List<string> Skills { get; set; } = new();
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? PublishedDate { get; set; }
    }
}