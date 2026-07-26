using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Services;
using ResumeScreener.Api.Services.Exceptions;
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

        // GET: api/recruiter/interviews
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
            return Ok(result);
        }

        // GET: api/recruiter/interviews/{interviewId}
        [HttpGet("{interviewId}")]
        public async Task<IActionResult> GetInterviewDetail(int interviewId)
        {
            try
            {
                var result = await _interviewService.GetInterviewDetailAsync(GetRecruiterId(), interviewId);
                return Ok(result);
            }
            catch (NotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (ForbiddenException) { return Forbid(); }
        }

        // POST: api/recruiter/interviews
        [HttpPost]
        public async Task<IActionResult> ScheduleInterview([FromBody] ScheduleRecruiterInterviewDto dto)
        {
            try
            {
                var result = await _interviewService.ScheduleInterviewAsync(GetRecruiterId(), dto);
                return StatusCode(201, result);
            }
            catch (NotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (ForbiddenException) { return Forbid(); }
        }

        // GET: api/recruiter/interviews/{interviewId}/reschedule-requests
        [HttpGet("{interviewId}/reschedule-requests")]
        public async Task<IActionResult> GetRescheduleRequests(int interviewId)
        {
            try
            {
                var result = await _interviewService.GetRescheduleRequestsAsync(GetRecruiterId(), interviewId);
                return Ok(result);
            }
            catch (NotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (ForbiddenException) { return Forbid(); }
        }

        // PUT: api/recruiter/interviews/{interviewId}/reschedule
        [HttpPut("{interviewId}/reschedule")]
        public async Task<IActionResult> ConfirmReschedule(int interviewId, [FromBody] RescheduleConfirmDto dto)
        {
            try
            {
                var result = await _interviewService.ConfirmRescheduleAsync(GetRecruiterId(), interviewId, dto);
                return Ok(result);
            }
            catch (NotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (ForbiddenException) { return Forbid(); }
        }

        // POST: api/recruiter/interviews/{interviewId}/cancel
        [HttpPost("{interviewId}/cancel")]
        public async Task<IActionResult> CancelInterview(int interviewId, [FromBody] CancelInterviewDto? dto)
        {
            try
            {
                var result = await _interviewService.CancelInterviewAsRecruiterAsync(GetRecruiterId(), interviewId);
                return Ok(result);
            }
            catch (NotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (ForbiddenException) { return Forbid(); }
        }

        // POST: api/recruiter/interviews/{interviewId}/feedback
        [HttpPost("{interviewId}/feedback")]
        public async Task<IActionResult> SubmitFeedback(int interviewId, [FromBody] SubmitRecruiterFeedbackDto dto)
        {
            try
            {
                var result = await _interviewService.SubmitFeedbackAsync(GetRecruiterId(), interviewId, dto);
                return StatusCode(201, result);
            }
            catch (NotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (ForbiddenException) { return Forbid(); }
        }

        // GET: api/recruiter/interviews/{interviewId}/feedback
        [HttpGet("{interviewId}/feedback")]
        public async Task<IActionResult> GetFeedback(int interviewId)
        {
            try
            {
                var result = await _interviewService.GetFeedbackAsRecruiterAsync(GetRecruiterId(), interviewId);
                return Ok(result);
            }
            catch (NotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (ForbiddenException) { return Forbid(); }
        }

        // POST: api/recruiter/interviews/{interviewId}/send-reminder
        [HttpPost("{interviewId}/send-reminder")]
        public async Task<IActionResult> SendReminder(int interviewId)
        {
            try
            {
                await _interviewService.SendReminderAsync(GetRecruiterId(), interviewId);
                return Ok(new { message = "Reminder sent" });
            }
            catch (NotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (ForbiddenException) { return Forbid(); }
        }
    }
}