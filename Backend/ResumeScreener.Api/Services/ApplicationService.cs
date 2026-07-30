using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Models;
using ResumeScreener.Api.Services.Exceptions;

namespace ResumeScreener.Api.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILlmScoringService _scoringService;

        public ApplicationService(ApplicationDbContext context, ILlmScoringService scoringService)
        {
            _context = context;
            _scoringService = scoringService;
        }

        public async Task<ApplyResultDto> CreateApplicationAsync(string candidateEmail, int jobId)
        {
            var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.Email == candidateEmail);
            var job = await _context.Jobs.FindAsync(jobId);

            if (candidate == null || job == null)
            {
                throw new BadRequestException("Candidate or Job not found.");
            }

            var existingApp = await _context.Applications
                .FirstOrDefaultAsync(a => a.CandidateId == candidate.Id && a.JobId == jobId);

            if (existingApp != null)
            {
                throw new BadRequestException("You have already applied for this job.");
            }

            var application = new Application
            {
                JobId = jobId,
                CandidateId = candidate.Id,
                Status = ApplicationStatus.Processing,
                CreatedAt = DateTime.UtcNow
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            try
            {
                var result = await _scoringService.ScoreResumeAsync(
                    candidate.ParsedText ?? "",
                    job.Description ?? "",
                    job.RequiredSkills ?? ""
                );

                application.MatchScore = result.Score;
                application.MatchedSkills = string.Join(", ", result.MatchedSkills ?? new List<string>());
                application.MissingSkills = string.Join(", ", result.MissingSkills ?? new List<string>());
                application.AiSummary = result.Summary;
                application.Status = ApplicationStatus.Scored;

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                application.Status = ApplicationStatus.Failed;
                application.AiSummary = $"AI Error: {ex.Message}";
                await _context.SaveChangesAsync();
            }

            return new ApplyResultDto
            {
                ApplicationId = application.Id,
                MatchScore = application.MatchScore,
                Status = application.Status.ToString()
            };
        }

        public async Task<ScoreResultDto> ScoreApplicationAsync(int applicationId)
        {
            var application = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Candidate)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (application == null)
            {
                throw new NotFoundException($"Application with Id {applicationId} not found.");
            }

            if (application.Job == null || application.Candidate == null)
            {
                throw new BadRequestException("Application is missing Job or Candidate data.");
            }

            application.Status = ApplicationStatus.Processing;
            await _context.SaveChangesAsync();

            try
            {
                var result = await _scoringService.ScoreResumeAsync(
                    application.Candidate.ParsedText ?? "",
                    application.Job.Description ?? "",
                    application.Job.RequiredSkills ?? ""
                );

                application.MatchScore = result.Score;
                application.MatchedSkills = string.Join(", ", result.MatchedSkills ?? new List<string>());
                application.MissingSkills = string.Join(", ", result.MissingSkills ?? new List<string>());
                application.AiSummary = result.Summary;
                application.Status = ApplicationStatus.Scored;

                await _context.SaveChangesAsync();

                return new ScoreResultDto
                {
                    ApplicationId = application.Id,
                    MatchScore = application.MatchScore,
                    MatchedSkills = result.MatchedSkills ?? new List<string>(),
                    MissingSkills = result.MissingSkills ?? new List<string>(),
                    Summary = application.AiSummary,
                    Status = application.Status.ToString()
                };
            }
            catch (Exception ex)
            {
                application.Status = ApplicationStatus.Failed;
                application.AiSummary = $"AI Error: {ex.Message}";
                await _context.SaveChangesAsync();

                // Controller ko batana hai ye scoring failure hai (500), NotFound/BadRequest nahi
                throw new InvalidOperationException($"AI scoring failed: {ex.Message}", ex);
            }
        }

        public async Task<PagedResult<ApplicationListItemDto>> GetApplicationsAsync(int pageNumber, int pageSize)
        {
            var query = _context.Applications
                .Include(a => a.Candidate)
                .Include(a => a.Job)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new ApplicationListItemDto
                {
                    Id = a.Id,
                    CandidateId = a.CandidateId,
                    JobId = a.JobId,
                    Name = a.Candidate != null ? a.Candidate.Name : "N/A",
                    Email = a.Candidate != null ? a.Candidate.Email : "N/A",
                    JobTitle = a.Job != null ? a.Job.Title : "N/A",
                    MatchScore = a.MatchScore ?? 0,
                    MatchedSkills = a.MatchedSkills,
                    MissingSkills = a.MissingSkills,
                    AiSummary = a.AiSummary,
                    Status = a.Status.ToString(),
                    AppliedDate = a.CreatedAt
                });

            var totalCount = await query.CountAsync();

            var data = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<ApplicationListItemDto>
            {
                Data = data,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }
        public async Task<PagedResult<ApplicationListItemDto>> GetMyApplicationsAsync(string candidateEmail, int pageNumber, int pageSize)
        {
            var query = _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Candidate)
                .Where(a => a.Candidate!.Email == candidateEmail)
                .OrderByDescending(a => a.CreatedAt);

            var totalCount = await query.CountAsync();

            var data = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new ApplicationListItemDto
                {
                    Id = a.Id,
                    JobId = a.JobId,
                    JobTitle = a.Job!.Title,
                    AppliedDate = a.CreatedAt,
                    Status = a.Status.ToString(),
                    MatchScore = a.MatchScore ?? 0
                })
                .ToListAsync();

            return new PagedResult<ApplicationListItemDto>
            {
                Data = data,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }
        public async Task<ApplicationListItemDto> GetApplicationByIdAsync(int id)
        {
            var application = await _context.Applications
                .Include(a => a.Candidate)
                .Include(a => a.Job)
                .Where(a => a.Id == id)
                .Select(a => new ApplicationListItemDto
                {
                    Id = a.Id,
                    CandidateId = a.CandidateId,
                    JobId = a.JobId,
                    Name = a.Candidate != null ? a.Candidate.Name : "N/A",
                    Email = a.Candidate != null ? a.Candidate.Email : "N/A",
                    JobTitle = a.Job != null ? a.Job.Title : "N/A",
                    MatchScore = a.MatchScore ?? 0,
                    MatchedSkills = a.MatchedSkills,
                    MissingSkills = a.MissingSkills,
                    AiSummary = a.AiSummary,
                    Status = a.Status.ToString(),
                    AppliedDate = a.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (application == null)
            {
                throw new NotFoundException($"Application with Id {id} not found.");
            }

            return application;
        }
        public async Task<object> GetMyApplicationDetailAsync(int applicationId, string candidateEmail)
        {
            var application = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Candidate)
                .FirstOrDefaultAsync(a => a.Id == applicationId && a.Candidate!.Email == candidateEmail);

            if (application == null)
            {
                throw new NotFoundException("Application not found");
            }

            return new
            {
                id = application.Id,
                jobTitle = application.Job!.Title,
                job = new { application.Job!.Id, application.Job.Title, application.Job.Description },
                status = application.Status.ToString(),
                matchScore = application.MatchScore,
                matchedSkills = application.MatchedSkills,
                missingSkills = application.MissingSkills,
                aiSummary = application.AiSummary,
                appliedDate = application.CreatedAt
            };
        }
        public async Task<PagedResult<ApplicationByJobDto>> GetApplicationsByJobAsync(int jobId, int pageNumber, int pageSize)
        {
            var jobExists = await _context.Jobs.AnyAsync(j => j.Id == jobId);
            if (!jobExists)
            {
                throw new NotFoundException($"Job with Id {jobId} not found.");
            }

            var query = _context.Applications
                .Include(a => a.Candidate)
                .Where(a => a.JobId == jobId)
                .OrderByDescending(a => a.MatchScore)
                .Select(a => new ApplicationByJobDto
                {
                    Id = a.Id,
                    CandidateId = a.CandidateId,
                    CandidateName = a.Candidate!.Name,
                    CandidateEmail = a.Candidate.Email,
                    MatchScore = a.MatchScore,
                    MatchedSkills = a.MatchedSkills,
                    MissingSkills = a.MissingSkills,
                    AiSummary = a.AiSummary,
                    Status = a.Status.ToString(),
                    CreatedAt = a.CreatedAt
                });

            var totalCount = await query.CountAsync();

            var data = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<ApplicationByJobDto>
            {
                Data = data,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public Task<ApplyResultDto> CreateApplicationByJobIdAsync(string candidateEmail, int jobId)
        {
            throw new NotImplementedException();
        }
    }
}