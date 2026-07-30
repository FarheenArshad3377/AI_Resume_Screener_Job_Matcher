using System.Net;
using System.Text.Json;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Services.Exceptions;

namespace ResumeScreener.Api.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                // Poori exception detail hamesha server log mein jaayegi, developer ke liye
                _logger.LogError(ex, "Unhandled exception occurred: {Message}", ex.Message);

                var (statusCode, message) = MapException(ex);

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = statusCode;

                var response = new ApiResponse<object>
                {
                    StatusCode = statusCode,
                    Message = message
                };

                var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                await context.Response.WriteAsync(json);
            }
        }

        private static (int statusCode, string message) MapException(Exception ex)
        {
            return ex switch
            {
                NotFoundException => ((int)HttpStatusCode.NotFound, ex.Message),
                BadRequestException => ((int)HttpStatusCode.BadRequest, ex.Message),
                ForbiddenException => ((int)HttpStatusCode.Forbidden, "You do not have permission to perform this action."),

                // Koi bhi anjaan/unexpected error — user ko kabhi raw ex.Message mat dikhao
                _ => ((int)HttpStatusCode.InternalServerError, $"DEBUG: {ex.GetType().Name} - {ex.Message} | Inner: {ex.InnerException?.Message}")
            };
        }
    }
}