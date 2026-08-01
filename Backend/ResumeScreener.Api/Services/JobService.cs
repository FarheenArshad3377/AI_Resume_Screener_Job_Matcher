using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Models;
using ResumeScreener.Api.Services.Exceptions;

namespace ResumeScreener.Api.Services
{
    public class JobService : IJobService
    {
        private readonly ApplicationDbContext _context;

        public JobService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<JobListItemDto>> GetJobsAsync(
            string? status, int pageNumber, int pageSize, int? recruiterId = null,
            string? q = null, string? location = null, string? jobType = null,
            string? experience = null, string? sortBy = null)
        {
            var query = _context.Jobs.AsQueryable();

            if (!string.IsNullOrEmpty(status) && status != "All")
            {
                query = query.Where(j => j.Status == status);
            }

            if (recruiterId.HasValue)
            {
                query = query.Where(j => j.RecruiterId == recruiterId.Value);
            }

            if (!string.IsNullOrWhiteSpace(q))
            {
                query = query.Where(j => j.Title.Contains(q) || j.Description.Contains(q));
            }

            if (!string.IsNullOrWhiteSpace(location))
            {
                var locations = location.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                query = query.Where(j => locations.Any(loc => j.Location.Contains(loc)));
            }

            if (!string.IsNullOrWhiteSpace(jobType))
            {
                var types = jobType.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                query = query.Where(j => types.Contains(j.EmploymentType));
            }

            if (!string.IsNullOrWhiteSpace(experience) && experience != "Any Experience")
            {
                query = query.Where(j => j.ExperienceLevel == experience);
            }
            query = sortBy switch
            {
                "Salary High to Low" => query.OrderByDescending(j => j.Salary),
                "Salary Low to High" => query.OrderBy(j => j.Salary),
                "Most Relevant" => query.OrderByDescending(j => j.CreatedAt), // placeholder, real relevance scoring nahi hai
                _ => query.OrderByDescending(j => j.CreatedAt) // "Newest First" default
            };

            var totalCount = await query.CountAsync();

            var jobs = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(j => new JobListItemDto
                {
                    Id = j.Id,
                    Title = j.Title,
                    Department = j.Department,
                    Description = j.Description,
                    Location = j.Location,
                    EmploymentType = j.EmploymentType,
                    Salary = j.Salary,
                    Status = j.Status,
                    CreatedAt = j.CreatedAt
                })
                .ToListAsync();

            return new PagedResult<JobListItemDto>
            {
                Data = jobs,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<Job> GetJobByIdAsync(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                throw new NotFoundException($"Job with Id {id} not found.");
            }
            return job;
        }

        public async Task<Job> CreateJobAsync(Job job, int? recruiterId)
        {
            job.RecruiterId = recruiterId;
            job.CreatedAt = DateTime.UtcNow;

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return job;
        }

        public async Task UpdateJobAsync(int id, Job job)
        {
            if (id != job.Id)
            {
                throw new BadRequestException("Id in URL does not match Id in body.");
            }

            var existingJob = await _context.Jobs.FindAsync(id);
            if (existingJob == null)
            {
                throw new NotFoundException($"Job with Id {id} not found.");
            }

            existingJob.Title = job.Title;
            existingJob.Description = job.Description;
            existingJob.RequiredSkills = job.RequiredSkills;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteJobAsync(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                throw new NotFoundException($"Job with Id {id} not found.");
            }

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();
        }
    }
}