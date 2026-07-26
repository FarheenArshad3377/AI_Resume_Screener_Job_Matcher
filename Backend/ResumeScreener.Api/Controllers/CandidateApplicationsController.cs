using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Services;
using ResumeScreener.Api.Services.Exceptions;
using System.Security.Claims;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/candidates/me")]
    [Authorize]
    public class CandidateApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public CandidateApplicationsController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        // POST: api/candidates/me/apply/5
        [HttpPost("apply/{jobId}")]
        public async Task<IActionResult> ApplyToJob(int jobId)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new ApiResponse<object> { StatusCode = 401, Message = "Invalid token." });
            }

            try
            {
                var result = await _applicationService.CreateApplicationAsync(email, jobId);

                return Ok(new ApiResponse<object>
                {
                    StatusCode = 200,
                    Message = "Application submitted successfully.",
                    Data = new { applicationId = result.ApplicationId, matchScore = result.MatchScore, status = result.Status }
                });
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new ApiResponse<object> { StatusCode = 400, Message = ex.Message });
            }
        }

        // GET: api/candidates/me/applications
        [HttpGet("applications")]
        public async Task<IActionResult> GetMyApplications([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new ApiResponse<object> { StatusCode = 401, Message = "Invalid token." });
            }

            var result = await _applicationService.GetMyApplicationsAsync(email, pageNumber, pageSize);

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Applications fetched successfully",
                Data = result
            });
        }

        // GET: api/candidates/me/applications/{applicationId}
        [HttpGet("applications/{applicationId}")]
        public async Task<IActionResult> GetMyApplicationDetail(int applicationId)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            try
            {
                var detail = await _applicationService.GetMyApplicationDetailAsync(applicationId, email ?? "");

                return Ok(new ApiResponse<object>
                {
                    StatusCode = 200,
                    Message = "Application detail fetched successfully",
                    Data = detail
                });
            }
            catch (NotFoundException ex)
            {
                return NotFound(new ApiResponse<object> { StatusCode = 404, Message = ex.Message });
            }
        }
    }
}