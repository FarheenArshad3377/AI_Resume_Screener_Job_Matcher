using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Services;
using System.Security.Claims;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/recruiter")]
    [Authorize]
    public class RecruiterExtrasController : ControllerBase
    {
        private readonly IJobService _jobService;
        private readonly ICandidateService _candidateService;
        private readonly ApplicationDbContext _context;

        public RecruiterExtrasController(IJobService jobService, ICandidateService candidateService, ApplicationDbContext context)
        {
            _jobService = jobService;
            _candidateService = candidateService;
            _context = context;
        }

        private int GetRecruiterId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }

        [HttpGet("jobs/active")]
        public async Task<IActionResult> GetActiveJobs()
        {
            var result = await _jobService.GetJobsAsync("Open", 1, 100, GetRecruiterId());
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Active jobs fetched", Data = result.Data });
        }

        [HttpGet("team-members")]
        public async Task<IActionResult> GetTeamMembers()
        {
            var recruiterId = GetRecruiterId();
            var recruiter = await _context.Users.FindAsync(recruiterId);

            if (recruiter == null)
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = "Recruiter not found" });

            var members = await _context.Users
                .Where(u => u.Id != recruiterId
                    && u.Role == "Recruiter"
                    && u.CompanyName == recruiter.CompanyName)
                .Select(u => new TeamMemberDto { Id = u.Id, Name = u.FullName, Email = u.Email })
                .ToListAsync();

            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Team members fetched", Data = members });
        }

        [HttpGet("candidates/search")]
        public async Task<IActionResult> SearchCandidates([FromQuery] string? query)
        {
            var candidates = await _candidateService.SearchCandidatesAsync(query);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Candidates found", Data = candidates });
        }
    }
}