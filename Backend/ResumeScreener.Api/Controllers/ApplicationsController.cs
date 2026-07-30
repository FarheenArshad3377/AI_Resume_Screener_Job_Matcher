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
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public ApplicationsController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        // POST: api/applications (Auto Create & Score)
        [HttpPost]
        public async Task<IActionResult> CreateApplication([FromBody] Models.Application applicationDto)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new ApiResponse<object>
                {
                    StatusCode = 401,
                    Message = "Invalid token or user not authenticated."
                });
            }

            var result = await _applicationService.CreateApplicationAsync(email, applicationDto.JobId);

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Application submitted and scored successfully.",
                Data = new
                {
                    applicationId = result.ApplicationId,
                    matchScore = result.MatchScore,
                    status = result.Status
                }
            });
        }

        // POST: api/applications/5/score (Manual Re-scoring)
        [HttpPost("{id}/score")]
        public async Task<IActionResult> ScoreApplication(int id)
        {
            var result = await _applicationService.ScoreApplicationAsync(id);
            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Application scored successfully.",
                Data = result
            });
        }

        // GET: api/applications/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetApplication(int id)
        {
            var result = await _applicationService.GetApplicationByIdAsync(id);
            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Application fetched successfully.",
                Data = result
            });
        }

        // GET: api/applications/by-job/5 (ranked list for a job)
        [HttpGet("by-job/{jobId}")]
        public async Task<IActionResult> GetApplicationsByJob(int jobId, int pageNumber = 1, int pageSize = 10)
        {
            var result = await _applicationService.GetApplicationsByJobAsync(jobId, pageNumber, pageSize);
            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Applications fetched successfully.",
                Data = result
            });
        }
    }
}