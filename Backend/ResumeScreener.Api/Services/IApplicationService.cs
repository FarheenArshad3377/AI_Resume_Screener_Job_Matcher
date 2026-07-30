using ResumeScreener.Api.DTOs;

namespace ResumeScreener.Api.Services
{
    public interface IApplicationService
    {
        Task<ApplyResultDto> CreateApplicationAsync(string candidateEmail, int jobId);
        Task<ScoreResultDto> ScoreApplicationAsync(int applicationId);
        Task<PagedResult<ApplicationListItemDto>> GetApplicationsAsync(int pageNumber, int pageSize);
        Task<PagedResult<ApplicationByJobDto>> GetApplicationsByJobAsync(int jobId, int pageNumber, int pageSize);
        Task<ApplyResultDto> CreateApplicationByJobIdAsync(string candidateEmail, int jobId);
        // IApplicationService.cs mein add karo:
        Task<PagedResult<ApplicationListItemDto>> GetMyApplicationsAsync(string candidateEmail, int pageNumber, int pageSize);
        Task<object> GetMyApplicationDetailAsync(int applicationId, string candidateEmail);
        Task<ApplicationListItemDto> GetApplicationByIdAsync(int id);
    }
}