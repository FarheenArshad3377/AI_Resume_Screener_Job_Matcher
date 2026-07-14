using System.Text;
using System.Text.Json;
using ResumeScreener.Api.Models;

namespace ResumeScreener.Api.Services
{
    public class LlmScoringService : ILlmScoringService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _model;

        public LlmScoringService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["GeminiSettings:ApiKey"]
                ?? throw new InvalidOperationException("Gemini API key not configured.");
            _model = configuration["GeminiSettings:Model"] ?? "gemini-2.5-flash";
        }

        public async Task<ScoringResult> ScoreResumeAsync(string resumeText, string jobDescription, string requiredSkills)
        {
            var prompt = BuildPrompt(resumeText, jobDescription, requiredSkills);

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_model}:generateContent?key={_apiKey}";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = 0.2,
                    responseMimeType = "application/json"
                }
            };

            var jsonBody = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Gemini API error: {response.StatusCode} - {responseString}");
            }

            return ParseGeminiResponse(responseString);
        }

        private string BuildPrompt(string resumeText, string jobDescription, string requiredSkills)
        {
            return $@"
You are a resume screening assistant. Compare the candidate resume against the job description and required skills.

JOB DESCRIPTION:
{jobDescription}

REQUIRED SKILLS:
{requiredSkills}

CANDIDATE RESUME:
{resumeText}

Return ONLY valid JSON with this exact shape, no extra text, no markdown:
{{
  ""score"": <number 0-100>,
  ""matchedSkills"": [""skill1"", ""skill2""],
  ""missingSkills"": [""skill1"", ""skill2""],
  ""summary"": ""2-3 sentence summary of the candidate's fit for this role""
}}
";
        }

        private ScoringResult ParseGeminiResponse(string responseJson)
        {
            using var doc = JsonDocument.Parse(responseJson);

            var text = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            if (string.IsNullOrWhiteSpace(text))
            {
                throw new Exception("Empty response from Gemini API.");
            }

            // Clean up in case model wraps in markdown code fences
            text = text.Trim();
            if (text.StartsWith("```"))
            {
                text = text.Replace("```json", "").Replace("```", "").Trim();
            }

            var result = JsonSerializer.Deserialize<ScoringResult>(text, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return result ?? throw new Exception("Failed to parse scoring result.");
        }
    }
}