using System.ComponentModel.DataAnnotations;
using ResumeScreener.Api.Models;

namespace ResumeScreener.Api.DTOs
{
    public class UpdateStatusDto
    {
        [Required]
        public ApplicationStatus Status { get; set; }
    }
}