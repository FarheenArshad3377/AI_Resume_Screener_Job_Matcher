using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeScreener.Api.Models
{
    public class InterviewInterviewer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(Interview))]
        public int InterviewId { get; set; }
        public Interview? Interview { get; set; }

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}