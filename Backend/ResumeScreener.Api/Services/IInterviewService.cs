using ResumeScreener.Api.DTOs;

namespace ResumeScreener.Api.Services
{
    public interface IInterviewService
    {
        // Recruiter side
        Task<InterviewListResultDto> GetInterviewsAsync(int recruiterId, string? search, int? jobId, string? status, DateTime? dateFrom, DateTime? dateTo, int page, int pageSize);
        Task<RecruiterInterviewDetailDto> GetInterviewDetailAsync(int recruiterId, int interviewId);
        Task<ScheduleInterviewResultDto> ScheduleInterviewAsync(int recruiterId, DTOs.ScheduleRecruiterInterviewDto dto);
        Task<RescheduleRequestsDto> GetRescheduleRequestsAsync(int recruiterId, int interviewId);
        Task<RescheduleConfirmResultDto> ConfirmRescheduleAsync(int recruiterId, int interviewId, DTOs.RescheduleConfirmDto dto);
        Task<CancelResultDto> CancelInterviewAsRecruiterAsync(int recruiterId, int interviewId);
        Task<SubmitFeedbackResultDto> SubmitFeedbackAsync(int recruiterId, int interviewId, DTOs.SubmitRecruiterFeedbackDto dto);
        Task<RecruiterFeedbackDto> GetFeedbackAsRecruiterAsync(int recruiterId, int interviewId);
        Task SendReminderAsync(int recruiterId, int interviewId);

        // Candidate side
        Task<PagedResult<MyInterviewDto>> GetMyInterviewsAsync(string candidateEmail, string? status, int page, int pageSize);
        Task<MyInterviewDetailDto> GetInterviewDetailForCandidateAsync(string candidateEmail, int interviewId);
        Task<RescheduleRequestResultDto> RequestRescheduleAsync(string candidateEmail, int interviewId, DTOs.RescheduleRequestDto dto);
        Task<CancelResultDto> CancelInterviewAsCandidateAsync(string candidateEmail, int interviewId);
        Task<CandidateFeedbackDto> GetFeedbackForCandidateAsync(string candidateEmail, int interviewId);
    }
}