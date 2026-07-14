namespace ResumeScreener.Api.Services
{
    public interface IResumeParserService
    {
        Task<string> ExtractTextAsync(string filePath);
    }
}