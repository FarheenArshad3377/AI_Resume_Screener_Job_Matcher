using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Models;

namespace ResumeScreener.Api.Services
{
    public interface IJobService
    {
        Task<PagedResult<JobListItemDto>> GetJobsAsync(string? status, int pageNumber, int pageSize);
        Task<Job> GetJobByIdAsync(int id);
        Task<Job> CreateJobAsync(Job job, int? recruiterId);
        Task UpdateJobAsync(int id, Job job);
        Task DeleteJobAsync(int id);
    }
}