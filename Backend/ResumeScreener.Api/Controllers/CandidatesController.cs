using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.Models;
using ResumeScreener.Api.Services;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        public async Task<ActionResult<Application>> UploadResume(
            [FromForm] string name,
            [FromForm] string email,
            [FromForm] int jobId,
            [FromForm] IFormFile resumeFile)
        {
            // 1. Basic validation
            if (resumeFile == null || resumeFile.Length == 0)
            {
                return BadRequest(new { message = "Resume file is required." });
            }

            var extension = Path.GetExtension(resumeFile.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
            {
                return BadRequest(new { message = "Only PDF and DOCX files are allowed." });
            }

            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null)
            {
                return NotFound(new { message = $"Job with Id {jobId} not found." });
            }

            // 2. Save file to disk
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

            // 3. Extract text from resume
            string parsedText;
            try
            {
                parsedText = await _resumeParserService.ExtractTextAsync(filePath);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to parse resume.", error = ex.Message });
            }

            // 4. Create Candidate record
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

            // 5. Create Application record (links Candidate to Job)
            var application = new Application
            {
                JobId = jobId,
                CandidateId = candidate.Id,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Resume uploaded and parsed successfully.",
                candidateId = candidate.Id,
                applicationId = application.Id,
                status = application.Status
            });
        }

        // GET: api/candidates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Candidate>> GetCandidate(int id)
        {
            var candidate = await _context.Candidates.FindAsync(id);

            if (candidate == null)
            {
                return NotFound(new { message = $"Candidate with Id {id} not found." });
            }

            return Ok(candidate);
        }

        // GET: api/candidates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Candidate>>> GetCandidates()
        {
            var candidates = await _context.Candidates
                .OrderByDescending(c => c.UploadedAt)
                .ToListAsync();

            return Ok(candidates);
        }
    }
}