namespace ResumeScreener.Api.Models
{
    public class ScoringResult
    {
        public int Score { get; set; }
        public List<string> MatchedSkills { get; set; } = new();
        public List<string> MissingSkills { get; set; } = new();
        public string Summary { get; set; } = string.Empty;
    }
}