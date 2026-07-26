using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResumeScreener.Api.Models;
using ResumeScreener.Api.Services;
using ResumeScreener.Api.Services.Exceptions;
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

        // POST: api/jobs/5/apply
        [HttpPost("{id}/apply")]
        public async Task<IActionResult> ApplyToJob(int id)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new { message = "Invalid token or email not found." });
            }

            try
            {
                // Same logic jo ApplicationsController.CreateApplication mein hai — ab duplicate nahi
                var result = await _applicationService.CreateApplicationAsync(email, id);

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

        // GET: api/jobs
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetJobs(
            [FromQuery] string? status = "Open",
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            var result = await _jobService.GetJobsAsync(status, pageNumber, pageSize);
            return Ok(result);
        }

        // GET: api/jobs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob(int id)
        {
            try
            {
                var job = await _jobService.GetJobByIdAsync(id);
                return Ok(job);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // POST: api/jobs
        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] Job job)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var recruiterId = userIdClaim != null ? int.Parse(userIdClaim) : (int?)null;

            var created = await _jobService.CreateJobAsync(job, recruiterId);

            return CreatedAtAction(nameof(GetJob), new { id = created.Id }, created);
        }

        // PUT: api/jobs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] Job job)
        {
            try
            {
                await _jobService.UpdateJobAsync(id, job);
                return NoContent();
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // DELETE: api/jobs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            try
            {
                await _jobService.DeleteJobAsync(id);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}