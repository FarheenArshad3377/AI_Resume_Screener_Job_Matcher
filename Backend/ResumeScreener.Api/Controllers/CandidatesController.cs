using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Models;
using ResumeScreener.Api.Services;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CandidatesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IResumeParserService _resumeParserService;
        private readonly IWebHostEnvironment _env;

        private static readonly string[] AllowedExtensions = { ".pdf", ".docx" };

        public CandidatesController(
            ApplicationDbContext context,
            IResumeParserService resumeParserService,
            IWebHostEnvironment env)
        {
            _context = context;
            _resumeParserService = resumeParserService;
            _env = env;
        }

        // POST: api/candidates/upload
        [HttpPost("upload")]
        public async Task<IActionResult> UploadResume(
            [FromForm] string name,
            [FromForm] string email,
            [FromForm] int jobId,
            [FromForm] IFormFile resumeFile)
        {
            if (resumeFile == null || resumeFile.Length == 0)
            {
                return BadRequest(new ApiResponse<object> { StatusCode = 400, Message = "Resume file is required." });
            }

            var extension = Path.GetExtension(resumeFile.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
            {
                return BadRequest(new ApiResponse<object> { StatusCode = 400, Message = "Only PDF and DOCX files are allowed." });
            }

            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = $"Job with Id {jobId} not found." });
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "UploadedResumes");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await resumeFile.CopyToAsync(stream);
            }

            var parsedText = await _resumeParserService.ExtractTextAsync(filePath);

            var candidate = new Candidate
            {
                Name = name,
                Email = email,
                ResumeFilePath = filePath,
                ParsedText = parsedText,
                UploadedAt = DateTime.UtcNow
            };

            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();

            var application = new Application
            {
                JobId = jobId,
                CandidateId = candidate.Id,
                Status = ApplicationStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Resume uploaded and parsed successfully.",
                Data = new
                {
                    candidateId = candidate.Id,
                    applicationId = application.Id,
                    status = application.Status
                }
            });
        }

        // GET: api/candidates/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCandidate(int id)
        {
            var candidate = await _context.Candidates.FindAsync(id);

            if (candidate == null)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = $"Candidate with Id {id} not found." });
            }

            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Candidate fetched successfully", Data = candidate });
        }

        // GET: api/candidates
        [HttpGet]
        public async Task<IActionResult> GetCandidates([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            var query = _context.Candidates.OrderByDescending(c => c.UploadedAt);

            var totalCount = await query.CountAsync();

            var candidates = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Candidates fetched successfully",
                Data = new
                {
                    items = candidates,
                    pageNumber,
                    pageSize,
                    totalCount,
                    totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                }
            });
        }
    }
}