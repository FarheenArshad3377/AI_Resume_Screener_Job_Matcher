using Microsoft.EntityFrameworkCore;
using ResumeScreener.Api.Models;

namespace ResumeScreener.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Job> Jobs { get; set; }
        public DbSet<Candidate> Candidates { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<CandidateNote> CandidateNotes { get; set; }
        public DbSet<Interview> Interviews { get; set; }
        public DbSet<InterviewFeedback> InterviewFeedbacks { get; set; }
        public DbSet<InterviewInterviewer> InterviewInterviewers { get; set; }   // 👈 NEW
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Interview>()
                .HasOne(i => i.Application)
                .WithMany()
                .HasForeignKey(i => i.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<InterviewFeedback>()
                .HasOne(f => f.Interview)
                .WithOne(i => i.Feedback)
                .HasForeignKey<InterviewFeedback>(f => f.InterviewId)
                .OnDelete(DeleteBehavior.Cascade);

            // 👇 NEW - Interviewer assignments
            modelBuilder.Entity<InterviewInterviewer>()
                .HasOne(ii => ii.Interview)
                .WithMany(i => i.Interviewers)
                .HasForeignKey(ii => ii.InterviewId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<InterviewInterviewer>()
                .HasOne(ii => ii.User)
                .WithMany()
                .HasForeignKey(ii => ii.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // 👇 NEW - Feedback submitted by
            modelBuilder.Entity<InterviewFeedback>()
                .HasOne(f => f.SubmittedByUser)
                .WithMany()
                .HasForeignKey(f => f.SubmittedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Fix multiple cascade delete paths issue
            modelBuilder.Entity<Application>()
                .HasOne(a => a.Job)
                .WithMany(j => j.Applications)
                .HasForeignKey(a => a.JobId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.Candidate)
                .WithMany(c => c.Applications)
                .HasForeignKey(a => a.CandidateId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}