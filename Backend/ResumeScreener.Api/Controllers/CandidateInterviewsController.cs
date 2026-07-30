using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Services;
using System.Security.Claims;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/candidates/me/interviews")]
    [Authorize]
    public class CandidateInterviewsController : ControllerBase
    {
        private readonly IInterviewService _interviewService;

        public CandidateInterviewsController(IInterviewService interviewService)
        {
            _interviewService = interviewService;
        }

        private string? GetCandidateEmail()
        {
            return User.FindFirst(ClaimTypes.Email)?.Value;
        }

        // GET: api/candidates/me/interviews
        [HttpGet]
        public async Task<IActionResult> GetMyInterviews([FromQuery] string? status = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var email = GetCandidateEmail();
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new ApiResponse<object> { StatusCode = 401, Message = "Invalid or expired token." });
            }

            var result = await _interviewService.GetMyInterviewsAsync(email, status, page, pageSize);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Interviews fetched successfully", Data = result });
        }

        // GET: api/candidates/me/interviews/{interviewId}
        [HttpGet("{interviewId}")]
        public async Task<IActionResult> GetInterviewDetail(int interviewId)
        {
            var email = GetCandidateEmail();
            var result = await _interviewService.GetInterviewDetailForCandidateAsync(email ?? "", interviewId);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Interview detail fetched successfully", Data = result });
        }

        // POST: api/candidates/me/interviews/{interviewId}/reschedule
        [HttpPost("{interviewId}/reschedule")]
        public async Task<IActionResult> RequestReschedule(int interviewId, [FromBody] RescheduleRequestDto dto)
        {
            var email = GetCandidateEmail();
            var result = await _interviewService.RequestRescheduleAsync(email ?? "", interviewId, dto);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Reschedule request sent", Data = result });
        }

        // POST: api/candidates/me/interviews/{interviewId}/cancel
        [HttpPost("{interviewId}/cancel")]
        public async Task<IActionResult> CancelInterview(int interviewId)
        {
            var email = GetCandidateEmail();
            var result = await _interviewService.CancelInterviewAsCandidateAsync(email ?? "", interviewId);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Interview cancelled", Data = result });
        }

        // GET: api/candidates/me/interviews/{interviewId}/feedback
        [HttpGet("{interviewId}/feedback")]
        public async Task<IActionResult> GetFeedback(int interviewId)
        {
            var email = GetCandidateEmail();
            var result = await _interviewService.GetFeedbackForCandidateAsync(email ?? "", interviewId);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Feedback fetched successfully", Data = result });
        }
    }
}