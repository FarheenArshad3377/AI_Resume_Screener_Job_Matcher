using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResumeScreener.Api.DTOs;

namespace ResumeScreener.Api.Controllers
{
    [ApiController]
    [Route("api")]
    [AllowAnonymous]
    public class MetaController : ControllerBase
    {
        [HttpGet("departments")]
        public IActionResult GetDepartments()
        {
            var departments = new[]
            {
                new { id = 1, name = "Engineering" },
                new { id = 2, name = "Design" },
                new { id = 3, name = "Marketing" },
                new { id = 4, name = "Sales" },
                new { id = 5, name = "HR" },
            };

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Departments fetched successfully",
                Data = departments
            });
        }

        [HttpGet("employment-types")]
        public IActionResult GetEmploymentTypes()
        {
            var types = new[]
            {
                new { id = 1, name = "Full-time" },
                new { id = 2, name = "Part-time" },
                new { id = 3, name = "Contract" },
                new { id = 4, name = "Internship" },
            };

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Employment types fetched successfully",
                Data = types
            });
        }

        [HttpGet("skills")]
        public IActionResult GetSkills([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            var allSkills = new[]
            {
                "React", "TypeScript", "JavaScript", "Node.js", "Python", "C#",
                "ASP.NET Core", "SQL Server", "Figma", "AWS", "Docker", "PostgreSQL"
            }.Select((name, idx) => new { id = idx + 1, name }).ToList();

            var totalCount = allSkills.Count;

            var skills = allSkills
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Skills fetched successfully",
                Data = new
                {
                    items = skills,
                    pageNumber,
                    pageSize,
                    totalCount,
                    totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                }
            });
        }
    }
}