using ResumeScreener.Api.Models;

namespace ResumeScreener.Api.Services
{
    public interface ITokenService
    {
        string GenerateToken(User user, out DateTime expiresAt);
    }
}