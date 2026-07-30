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
        public DbSet<InterviewInterviewer> InterviewInterviewers { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Interview -> Application (Cascade Delete)
            modelBuilder.Entity<Interview>()
                .HasOne(i => i.Application)
                .WithMany()
                .HasForeignKey(i => i.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            // InterviewFeedback -> Interview (One-to-One, Cascade Delete)
            modelBuilder.Entity<InterviewFeedback>()
                .HasOne(f => f.Interview)
                .WithOne(i => i.Feedback)
                .HasForeignKey<InterviewFeedback>(f => f.InterviewId)
                .OnDelete(DeleteBehavior.Cascade);

            // InterviewInterviewer -> Interview (Many-to-One, Cascade Delete)
            modelBuilder.Entity<InterviewInterviewer>()
                .HasOne(ii => ii.Interview)
                .WithMany(i => i.Interviewers)
                .HasForeignKey(ii => ii.InterviewId)
                .OnDelete(DeleteBehavior.Cascade);

            // InterviewInterviewer -> User (Restrict to prevent cascade path conflict)
            modelBuilder.Entity<InterviewInterviewer>()
                .HasOne(ii => ii.User)
                .WithMany()
                .HasForeignKey(ii => ii.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // InterviewFeedback -> SubmittedByUser (Restrict)
            modelBuilder.Entity<InterviewFeedback>()
                .HasOne(f => f.SubmittedByUser)
                .WithMany()
                .HasForeignKey(f => f.SubmittedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Application -> Job (Restrict to prevent multiple cascade paths)
            modelBuilder.Entity<Application>()
                .HasOne(a => a.Job)
                .WithMany(j => j.Applications)
                .HasForeignKey(a => a.JobId)
                .OnDelete(DeleteBehavior.Restrict);

            // Application -> Candidate (Restrict to prevent multiple cascade paths)
            modelBuilder.Entity<Application>()
                .HasOne(a => a.Candidate)
                .WithMany(c => c.Applications)
                .HasForeignKey(a => a.CandidateId)
                .OnDelete(DeleteBehavior.Restrict);

            // 🔒 Unique constraint: ek candidate, ek job pe sirf EK dafa apply kar sakta hai
            modelBuilder.Entity<Application>()
                .HasIndex(a => new { a.CandidateId, a.JobId })
                .IsUnique();

            // Status ko readable string type  store in DB  , enum type use to store in c#
            modelBuilder.Entity<Application>()
                .Property(a => a.Status)
                .HasConversion<string>()
                .HasMaxLength(50);
        }
    }
}