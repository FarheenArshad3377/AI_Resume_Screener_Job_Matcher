using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Models;
using System.Security.Claims;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/recruiter/jobs")]
    [Authorize]
    public class RecruiterJobsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RecruiterJobsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int? GetRecruiterId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return claim != null ? int.Parse(claim) : null;
        }

        private JobDto ToDto(Job job, int applicantsCount)
        {
            return new JobDto
            {
                Id = job.Id,
                Title = job.Title,
                Department = job.Department,
                Description = job.Description,
                Location = job.Location,
                EmploymentType = job.EmploymentType,
                Salary = job.Salary,
                Status = job.Status,
                Applicants = applicantsCount,
                Requirements = string.IsNullOrWhiteSpace(job.Requirements)
                    ? new List<string>()
                    : job.Requirements.Split('\n', StringSplitOptions.RemoveEmptyEntries).ToList(),
                Skills = string.IsNullOrWhiteSpace(job.RequiredSkills)
                    ? new List<string>()
                    : job.RequiredSkills.Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(s => s.Trim()).ToList(),
                CreatedDate = job.CreatedAt,
                UpdatedDate = job.UpdatedDate,
                PublishedDate = job.PublishedDate
            };
        }
        // GET: api/recruiter/jobs/{jobId}/details
        [HttpGet("{jobId}/details")]
        public async Task<IActionResult> GetJobDetails(int jobId)
        {
            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = "Job not found" });
            }

            var applicantsCount = await _context.Applications.CountAsync(a => a.JobId == jobId);

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Job details fetched successfully",
                Data = new
                {
                    id = job.Id,
                    title = job.Title,
                    company = job.Recruiter != null ? job.Recruiter.CompanyName : null,
                    department = job.Department,
                    description = job.Description,
                    location = job.Location,
                    employmentType = job.EmploymentType,
                    salary = job.Salary,
                    status = job.Status,
                    requirements = string.IsNullOrWhiteSpace(job.Requirements)
                        ? new List<string>()
                        : job.Requirements.Split('\n', StringSplitOptions.RemoveEmptyEntries).ToList(),
                    skills = string.IsNullOrWhiteSpace(job.RequiredSkills)
                        ? new List<string>()
                        : job.RequiredSkills.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()).ToList(),
                    applicants = applicantsCount,
                    postedDate = job.CreatedAt
                }
            });
        }

        // GET: api/recruiter/jobs/{jobId}/stats
        [HttpGet("{jobId}/stats")]
        public async Task<IActionResult> GetJobStats(int jobId)
        {
            var jobExists = await _context.Jobs.AnyAsync(j => j.Id == jobId);
            if (!jobExists)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = "Job not found" });
            }

            var applications = await _context.Applications
                .Where(a => a.JobId == jobId)
                .ToListAsync();

            var data = new
            {
                totalApplications = applications.Count,
                newApplications = applications.Count(a => a.Status == "Pending"),
                shortlisted = applications.Count(a => a.Status == "Shortlisted"),
                rejected = applications.Count(a => a.Status == "Rejected")
            };

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Job statistics fetched successfully",
                Data = data
            });
        }
        // GET: api/recruiter/jobs
        [HttpGet]
        public async Task<IActionResult> GetMyJobs([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var recruiterId = GetRecruiterId();

            var baseQuery = _context.Jobs
                .Where(j => j.RecruiterId == recruiterId)
                .OrderByDescending(j => j.CreatedAt);

            var totalCount = await baseQuery.CountAsync();

            var jobs = await baseQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var jobIds = jobs.Select(j => j.Id).ToList();

            var appStats = await _context.Applications
                .Where(a => jobIds.Contains(a.JobId))
                .GroupBy(a => a.JobId)
                .Select(g => new
                {
                    JobId = g.Key,
                    Count = g.Count(),
                    AvgScore = g.Average(a => a.MatchScore ?? 0)
                })
                .ToListAsync();

            var result = jobs.Select(j =>
            {
                var stat = appStats.FirstOrDefault(a => a.JobId == j.Id);
                return new
                {
                    id = j.Id,
                    title = j.Title,
                    department = j.Department,
                    location = j.Location,
                    employmentType = j.EmploymentType,
                    salary = j.Salary,
                    status = j.Status,
                    applicants = stat?.Count ?? 0,
                    matchScore = stat != null ? $"{Math.Round(stat.AvgScore)}%" : "N/A",
                    postedDate = j.CreatedAt,
                    description = j.Description,
                    skills = string.IsNullOrWhiteSpace(j.RequiredSkills)
                        ? new List<string>()
                        : j.RequiredSkills.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()).ToList()
                };
            });

            return Ok(new
            {
                statusCode = 200,
                message = "Jobs fetched successfully",
                data = result,
                pageNumber,
                pageSize,
                totalCount,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        // POST: api/recruiter/jobs/{jobId}/close
        [HttpPost("{jobId}/close")]
        public async Task<IActionResult> CloseJob(int jobId)
        {
            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = "Job not found" });
            }

            job.Status = "Closed";
            job.ClosedDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Job closed successfully",
                Data = new { job.Id, job.Title, job.Status, job.ClosedDate }
            });
        }

        // POST: api/recruiter/jobs/{jobId}/reopen
        [HttpPost("{jobId}/reopen")]
        public async Task<IActionResult> ReopenJob(int jobId)
        {
            var job = await _context.Jobs
             .Include(j => j.Recruiter)
             .FirstOrDefaultAsync(j => j.Id == jobId);
            if (job == null)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = "Job not found" });
            }

            job.Status = "Open";
            job.ClosedDate = null;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Job reopened successfully",
                Data = new { job.Id, job.Title, job.Status }
            });
        }

        // DELETE: api/recruiter/jobs/{jobId}
        [HttpDelete("{jobId}")]
        public async Task<IActionResult> DeleteJob(int jobId)
        {
            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = "Job not found" });
            }

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Job deleted successfully",
                Data = new { job.Id, job.Title }
            });
        }
        // POST: api/recruiter/jobs
        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] CreateJobDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    StatusCode = 400,
                    Message = "Validation failed",
                    Data = ModelState
                });
            }

            var job = new Job
            {
                Title = dto.Title,
                Department = dto.Department,
                Description = dto.Description,
                Location = dto.Location,
                EmploymentType = dto.EmploymentType,
                Salary = dto.Salary,
                Requirements = string.Join('\n', dto.Requirements),
                RequiredSkills = string.Join(", ", dto.Skills),
                Status = "Draft",
                RecruiterId = GetRecruiterId(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobById), new { jobId = job.Id }, new ApiResponse<JobDto>
            {
                StatusCode = 201,
                Message = "Job created successfully",
                Data = ToDto(job, 0)
            });
        }

        // GET: api/recruiter/jobs/{jobId}
        [HttpGet("{jobId}")]
        public async Task<IActionResult> GetJobById(int jobId)
        {
            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = "Job not found" });
            }

            var applicantsCount = await _context.Applications.CountAsync(a => a.JobId == jobId);

            return Ok(new ApiResponse<JobDto>
            {
                StatusCode = 200,
                Message = "Job fetched successfully",
                Data = ToDto(job, applicantsCount)
            });
        }

        // PUT: api/recruiter/jobs/{jobId}
        [HttpPut("{jobId}")]
        public async Task<IActionResult> UpdateJob(int jobId, [FromBody] CreateJobDto dto)
        {
            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = "Job not found" });
            }

            job.Title = dto.Title;
            job.Department = dto.Department;
            job.Description = dto.Description;
            job.Location = dto.Location;
            job.EmploymentType = dto.EmploymentType;
            job.Salary = dto.Salary;
            job.Requirements = string.Join('\n', dto.Requirements);
            job.RequiredSkills = string.Join(", ", dto.Skills);
            job.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var applicantsCount = await _context.Applications.CountAsync(a => a.JobId == jobId);

            return Ok(new ApiResponse<JobDto>
            {
                StatusCode = 200,
                Message = "Job updated successfully",
                Data = ToDto(job, applicantsCount)
            });
        }

        // POST: api/recruiter/jobs/{jobId}/publish
        [HttpPost("{jobId}/publish")]
        public async Task<IActionResult> PublishJob(int jobId)
        {
            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = "Job not found" });
            }

            job.Status = "Open";
            job.PublishedDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var applicantsCount = await _context.Applications.CountAsync(a => a.JobId == jobId);

            return Ok(new ApiResponse<JobDto>
            {
                StatusCode = 200,
                Message = "Job published successfully",
                Data = ToDto(job, applicantsCount)
            });
        }
    }
}