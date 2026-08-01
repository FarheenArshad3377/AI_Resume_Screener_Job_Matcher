using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Services;
using System.Security.Claims;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _jobService;
        private readonly IApplicationService _applicationService;

        public JobsController(IJobService jobService, IApplicationService applicationService)
        {
            _jobService = jobService;
            _applicationService = applicationService;
        }

        [HttpPost("{id}/apply")]
        public async Task<IActionResult> ApplyToJob(int id)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new ApiResponse<object> { StatusCode = 401, Message = "Invalid token or email not found." });
            }

            var result = await _applicationService.CreateApplicationAsync(email, id);

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Application submitted and scored successfully.",
                Data = new { applicationId = result.ApplicationId, matchScore = result.MatchScore, status = result.Status }
            });
        }
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetJobs(
            [FromQuery] string? status = "Open",
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? q = null,
            [FromQuery] string? location = null,
            [FromQuery] string? jobType = null,
            [FromQuery] string? experience = null,
            [FromQuery] string? sortBy = null)
        {
            var result = await _jobService.GetJobsAsync(status, pageNumber, pageSize, null, q, location, jobType, experience, sortBy);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Jobs fetched successfully", Data = result });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _jobService.GetJobByIdAsync(id);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Job fetched successfully", Data = job });
        }
    }
}