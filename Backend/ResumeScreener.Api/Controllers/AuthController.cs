using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.DTOs;
using ResumeScreener.Api.Models;
using ResumeScreener.Api.Services;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(ApplicationDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request.Role != "Recruiter" && request.Role != "Candidate")
            {
                return BadRequest(new { message = "Role must be either 'Recruiter' or 'Candidate'." });
            }

            if (request.Role == "Recruiter" && string.IsNullOrWhiteSpace(request.CompanyName))
            {
                return BadRequest(new { message = "Company name is required for recruiters." });
            }

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser != null)
            {
                return Conflict(new { message = "A user with this email already exists." });
            }

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = request.Role,
                CompanyName = request.Role == "Recruiter" ? request.CompanyName : null,   // 👈 NEW
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _tokenService.GenerateToken(user, out var expiresAt);

            return Ok(new AuthResponse
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                CompanyName = user.CompanyName,   // 👈 NEW
                ExpiresAt = expiresAt
            });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var token = _tokenService.GenerateToken(user, out var expiresAt);

            return Ok(new AuthResponse
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                CompanyName = user.CompanyName,   // 👈 NEW
                ExpiresAt = expiresAt
            });
        }
        }
}