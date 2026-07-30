using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Services;
using System.Security.Claims;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/recruiter/interviews")]
    [Authorize]
    public class RecruiterInterviewsController : ControllerBase
    {
        private readonly IInterviewService _interviewService;

        public RecruiterInterviewsController(IInterviewService interviewService)
        {
            _interviewService = interviewService;
        }

        private int GetRecruiterId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetInterviews(
            [FromQuery] string? search = null,
            [FromQuery] int? jobId = null,
            [FromQuery] string? status = null,
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await _interviewService.GetInterviewsAsync(GetRecruiterId(), search, jobId, status, dateFrom, dateTo, page, pageSize);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Interviews fetched successfully", Data = result });
        }

        [HttpGet("{interviewId}")]
        public async Task<IActionResult> GetInterviewDetail(int interviewId)
        {
            var result = await _interviewService.GetInterviewDetailAsync(GetRecruiterId(), interviewId);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Interview detail fetched successfully", Data = result });
        }

        [HttpPost]
        public async Task<IActionResult> ScheduleInterview([FromBody] ScheduleRecruiterInterviewDto dto)
        {
            var result = await _interviewService.ScheduleInterviewAsync(GetRecruiterId(), dto);
            return StatusCode(201, new ApiResponse<object> { StatusCode = 201, Message = "Interview scheduled successfully", Data = result });
        }

        [HttpGet("{interviewId}/reschedule-requests")]
        public async Task<IActionResult> GetRescheduleRequests(int interviewId)
        {
            var result = await _interviewService.GetRescheduleRequestsAsync(GetRecruiterId(), interviewId);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Reschedule requests fetched successfully", Data = result });
        }

        [HttpPut("{interviewId}/reschedule")]
        public async Task<IActionResult> ConfirmReschedule(int interviewId, [FromBody] RescheduleConfirmDto dto)
        {
            var result = await _interviewService.ConfirmRescheduleAsync(GetRecruiterId(), interviewId, dto);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Interview rescheduled successfully", Data = result });
        }

        [HttpPost("{interviewId}/cancel")]
        public async Task<IActionResult> CancelInterview(int interviewId, [FromBody] CancelInterviewDto? dto)
        {
            var result = await _interviewService.CancelInterviewAsRecruiterAsync(GetRecruiterId(), interviewId);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Interview cancelled successfully", Data = result });
        }

        [HttpPost("{interviewId}/feedback")]
        public async Task<IActionResult> SubmitFeedback(int interviewId, [FromBody] SubmitRecruiterFeedbackDto dto)
        {
            var result = await _interviewService.SubmitFeedbackAsync(GetRecruiterId(), interviewId, dto);
            return StatusCode(201, new ApiResponse<object> { StatusCode = 201, Message = "Feedback submitted successfully", Data = result });
        }

        [HttpGet("{interviewId}/feedback")]
        public async Task<IActionResult> GetFeedback(int interviewId)
        {
            var result = await _interviewService.GetFeedbackAsRecruiterAsync(GetRecruiterId(), interviewId);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Feedback fetched successfully", Data = result });
        }

        [HttpPost("{interviewId}/send-reminder")]
        public async Task<IActionResult> SendReminder(int interviewId)
        {
            await _interviewService.SendReminderAsync(GetRecruiterId(), interviewId);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Reminder sent" });
        }
    }
}