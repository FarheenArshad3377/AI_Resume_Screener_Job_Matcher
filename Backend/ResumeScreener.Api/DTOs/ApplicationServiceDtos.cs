namespace ResumeScreener.Api.DTOs
{
    public class PagedResult<T>
    {
        public List<T> Data { get; set; } = new();
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    }

    public class ApplyResultDto
    {
        public int ApplicationId { get; set; }
        public int? MatchScore { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class ScoreResultDto
    {
        public int ApplicationId { get; set; }
        public int? MatchScore { get; set; }
        public List<string> MatchedSkills { get; set; } = new();
        public List<string> MissingSkills { get; set; } = new();
        public string? Summary { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class ApplicationListItemDto
    {
        public int Id { get; set; }
        public int CandidateId { get; set; }
        public int JobId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public int MatchScore { get; set; }
        public string? MatchedSkills { get; set; }
        public string? MissingSkills { get; set; }
        public string? AiSummary { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime AppliedDate { get; set; }
    }

    public class ApplicationByJobDto
    {
        public int Id { get; set; }
        public int CandidateId { get; set; }
        public string CandidateName { get; set; } = string.Empty;
        public string CandidateEmail { get; set; } = string.Empty;
        public int? MatchScore { get; set; }
        public string? MatchedSkills { get; set; }
        public string? MissingSkills { get; set; }
        public string? AiSummary { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}