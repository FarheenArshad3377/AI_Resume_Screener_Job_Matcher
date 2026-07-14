using ResumeScreener.Api.Models;

namespace ResumeScreener.Api.Services
{
    public interface ILlmScoringService
    {
        Task<ScoringResult> ScoreResumeAsync(string resumeText, string jobDescription, string requiredSkills);
    }
}