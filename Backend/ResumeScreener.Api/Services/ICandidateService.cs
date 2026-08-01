using ResumeScreener.Api.DTOs;

namespace ResumeScreener.Api.Services
{
    public interface ICandidateService
    {
        Task<List<CandidateSearchResultDto>> SearchCandidatesAsync(string? query);
    }
}