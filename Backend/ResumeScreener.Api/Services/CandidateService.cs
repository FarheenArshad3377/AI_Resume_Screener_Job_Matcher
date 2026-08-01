using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.DTOs;

namespace ResumeScreener.Api.Services
{
    public class CandidateService : ICandidateService

    {
        private readonly ApplicationDbContext _context;

        public CandidateService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<CandidateSearchResultDto>> SearchCandidatesAsync(string? query)
        {
            var candidatesQuery = _context.Candidates.AsQueryable();

            if (!string.IsNullOrEmpty(query))
            {
                candidatesQuery = candidatesQuery.Where(c =>
                    c.Name.Contains(query) || c.Email.Contains(query));
            }

            return await candidatesQuery
                .OrderBy(c => c.Name)
                .Take(20)
                .Select(c => new CandidateSearchResultDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Email = c.Email
                })
                .ToListAsync();
        }
    }
}