using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.DTOs;
using System.Security.Claims;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/recruiter")]
    [Authorize]
    public class RecruiterCandidatesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RecruiterCandidatesController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return claim != null ? int.Parse(claim) : null;
        }

        // GET: api/recruiter/jobs/{jobId}/candidates
        [HttpGet("jobs/{jobId}/candidates")]
        public async Task<IActionResult> GetJobCandidates(
            int jobId,
            [FromQuery] string status = "All",
            [FromQuery] string sortBy = "score_desc",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] int? minScore = null)
        {
            var query = _context.Applications
                .Include(a => a.Candidate)
                .Where(a => a.JobId == jobId);

            if (status != "All")
            {
                query = query.Where(a => a.Status == status);
            }

            if (minScore.HasValue)
            {
                query = query.Where(a => a.MatchScore >= minScore.Value);
            }

            query = sortBy switch
            {
                "score_asc" => query.OrderBy(a => a.MatchScore),
                "applied_recent" => query.OrderByDescending(a => a.CreatedAt),
                _ => query.OrderByDescending(a => a.MatchScore)
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new
                {
                    id = a.Id,
                    candidateId = a.CandidateId,   // 👈 NEW - ye add karo
                    name = a.Candidate!.Name,
                    email = a.Candidate.Email,
                    appliedDate = a.CreatedAt,
                    matchScore = a.MatchScore ?? 0,
                    status = a.Status,
                    resumeUrl = $"/api/candidates/{a.CandidateId}/resume",
                    profileUrl = $"/api/recruiter/candidates/{a.CandidateId}",
                    matchedSkills = a.MatchedSkills,
                    missingSkills = a.MissingSkills,
                    aiSummary = a.AiSummary
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Candidates fetched successfully",
                Data = new { items, totalCount }
            });
        }

        // PUT: api/recruiter/jobs/{jobId}/candidates/{candidateId}/status
        [HttpPut("jobs/{jobId}/candidates/{candidateId}/status")]
        public async Task<IActionResult> UpdateStatus(int jobId, int candidateId, [FromBody] UpdateStatusDto dto)
        {
            var application = await _context.Applications
                .FirstOrDefaultAsync(a => a.JobId == jobId && a.CandidateId == candidateId);

            if (application == null)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = "Application not found" });
            }

            application.Status = dto.Status;

            if (dto.Status == "Hired")
            {
                application.HiredAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Status updated successfully",
                Data = new { application.Id, application.Status, updatedAt = DateTime.UtcNow }
            });
        }
        // GET: api/recruiter/applications
        [HttpGet("applications")]
        public async Task<IActionResult> GetAllApplications()
        {
            var recruiterId = GetUserId();

            var applications = await _context.Applications
                .Include(a => a.Candidate)
                .Include(a => a.Job)
                .Where(a => a.Job!.RecruiterId == recruiterId)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new
                {
                    id = a.Id,
                    jobId = a.JobId,
                    jobTitle = a.Job!.Title,
                    candidateId = a.CandidateId,
                    name = a.Candidate!.Name,
                    email = a.Candidate.Email,
                    matchScore = a.MatchScore ?? 0,
                    status = a.Status,
                    appliedDate = a.CreatedAt
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Applications fetched successfully",
                Data = applications
            });
        }
        // GET: api/recruiter/candidates/recent
        [HttpGet("candidates/recent")]
        public async Task<IActionResult> GetRecentCandidates([FromQuery] int limit = 5)
        {
            var recruiterId = GetUserId();

            var recentCandidates = await _context.Applications
                .Include(a => a.Candidate)
                .Include(a => a.Job)
                .Where(a => a.Job!.RecruiterId == recruiterId)
                .OrderByDescending(a => a.CreatedAt)
                .Take(limit)
                .Select(a => new
                {
                    id = a.Id,
                    name = a.Candidate!.Name,
                    email = a.Candidate.Email,
                    position = a.Job!.Title,
                    matchScore = a.MatchScore ?? 0,
                    appliedDate = a.CreatedAt,
                    status = a.Status,
                    profileImage = (string?)null,
                    resume = $"/api/candidates/{a.CandidateId}/resume"
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Recent candidates fetched",
                Data = recentCandidates
            });
        }
        // GET: api/recruiter/candidates/{candidateId}
        [HttpGet("candidates/{candidateId}")]
        public async Task<IActionResult> GetCandidateProfile(int candidateId)
        {
            var candidate = await _context.Candidates.FindAsync(candidateId);
            if (candidate == null)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = "Candidate not found" });
            }

            var applications = await _context.Applications
                .Include(a => a.Job)
                .Where(a => a.CandidateId == candidateId)
                .Select(a => new
                {
                    id = a.Id,
                    jobId = a.JobId,
                    jobTitle = a.Job!.Title,
                    appliedDate = a.CreatedAt,
                    status = a.Status,
                    matchScore = a.MatchScore,
                    matchedSkills = a.MatchedSkills,    // 👈 NEW
                    missingSkills = a.MissingSkills,    // 👈 NEW
                    aiSummary = a.AiSummary             // 👈 NEW
                })
                .ToListAsync();

            var notes = await _context.CandidateNotes
                .Include(n => n.CreatedByUser)
                .Where(n => n.CandidateId == candidateId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new
                {
                    id = n.Id,
                    text = n.Text,
                    createdBy = n.CreatedByUser != null ? n.CreatedByUser.FullName : "Unknown",
                    createdAt = n.CreatedAt
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Candidate profile fetched successfully",
                Data = new
                {
                    id = candidate.Id,
                    name = candidate.Name,
                    email = candidate.Email,
                    resumeUrl = $"/api/candidates/{candidate.Id}/resume",
                    parsedText = candidate.ParsedText,
                    applications,
                    notes
                }
            });
        }

        // POST: api/recruiter/candidates/{candidateId}/notes
        [HttpPost("candidates/{candidateId}/notes")]
        public async Task<IActionResult> AddNote(int candidateId, [FromBody] AddNoteDto dto)
        {
            var candidateExists = await _context.Candidates.AnyAsync(c => c.Id == candidateId);
            if (!candidateExists)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = "Candidate not found" });
            }

            var note = new Models.CandidateNote
            {
                CandidateId = candidateId,
                Text = dto.Text,
                CreatedByUserId = GetUserId(),
                CreatedAt = DateTime.UtcNow
            };

            _context.CandidateNotes.Add(note);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Note added successfully",
                Data = new { note.Id, note.Text, note.CreatedAt }
            });
        }
    }
}