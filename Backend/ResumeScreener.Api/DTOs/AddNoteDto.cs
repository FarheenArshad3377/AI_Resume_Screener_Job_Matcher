using System.ComponentModel.DataAnnotations;

namespace ResumeScreener.Api.DTOs
{
    public class AddNoteDto
    {
        [Required]
        public string Text { get; set; } = string.Empty;
    }
}