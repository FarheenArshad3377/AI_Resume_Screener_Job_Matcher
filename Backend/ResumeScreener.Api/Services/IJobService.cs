using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Models;

namespace ResumeScreener.Api.Services
{
    public interface IJobService
    {
        Task<PagedResult<JobListItemDto>> GetJobsAsync(string? status, int pageNumber, int pageSize, int? recruiterId = null,
    string? q = null, string? location = null, string? jobType = null,
    string? experience = null, string? sortBy = null);
        Task<Job> GetJobByIdAsync(int id);
        Task<Job> CreateJobAsync(Job job, int? recruiterId);
        Task UpdateJobAsync(int id, Job job);
        Task DeleteJobAsync(int id);
    }
}