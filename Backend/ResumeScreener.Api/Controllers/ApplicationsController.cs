using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResumeScreener.Api.Services;
using ResumeScreener.Api.Services.Exceptions;
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
                return Unauthorized(new { message = "Invalid token or user not authenticated." });
            }

            try
            {
                var result = await _applicationService.CreateApplicationAsync(email, applicationDto.JobId);

                return Ok(new
                {
                    message = "Application submitted and scored successfully.",
                    applicationId = result.ApplicationId,
                    matchScore = result.MatchScore,
                    status = result.Status
                });
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/applications/5/score (Manual Re-scoring)
        [HttpPost("{id}/score")]
        public async Task<IActionResult> ScoreApplication(int id)
        {
            try
            {
                var result = await _applicationService.ScoreApplicationAsync(id);
                return Ok(result);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(500, new { message = "AI scoring failed.", error = ex.Message });
            }
        }

        // GET: api/applications/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetApplication(int id, int pageNumber = 1, int pageSize = 10)
        {
            var result = await _applicationService.GetApplicationsAsync(pageNumber, pageSize);
            return Ok(result);
        }

        // GET: api/applications/by-job/5 (ranked list for a job)
        [HttpGet("by-job/{jobId}")]
        public async Task<IActionResult> GetApplicationsByJob(int jobId, int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                var result = await _applicationService.GetApplicationsByJobAsync(jobId, pageNumber, pageSize);
                return Ok(result);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}