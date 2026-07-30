using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ResumeScreener.Api.Data;
using ResumeScreener.Api.Services;
using Polly;
using Polly.Extensions.Http;
using Polly.Timeout;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ResumeScreener API",
        Version = "v1"
    });

    // Enable JWT bearer auth in Swagger UI
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your token"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure Database Connection with Retry Logic for Remote Servers
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null
        )
    )
);

// Register Custom Services
builder.Services.AddScoped<IResumeParserService, ResumeParserService>();

builder.Services.AddHttpClient<ILlmScoringService, LlmScoringService>(client =>
{
    // Overall safety net across ALL retry attempts combined
    client.Timeout = TimeSpan.FromSeconds(60);
})
.AddPolicyHandler(GetRetryPolicy())    // outer: retries
.AddPolicyHandler(GetTimeoutPolicy()); // inner: per-attempt timeout

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IApplicationService, ApplicationService>();
builder.Services.AddScoped<IInterviewService, InterviewService>();
builder.Services.AddScoped<IJobService, JobService>();
//builder.Services.AddScoped<ICandidateService, ICandidateService>();

// Configure File Upload Limits
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 10 * 1024 * 1024; // 10 MB
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://ai-resume-screener-job-matcher-liart.vercel.app"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"]!;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

var app = builder.Build();
// Global error handling 
app.UseMiddleware<ResumeScreener.Api.Middleware.GlobalExceptionMiddleware>();
// Configure Middleware Pipeline
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.RoutePrefix = "api-docs";
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "ResumeScreener API v1");
});

app.UseCors("AllowReactFrontend");

// app.UseHttpsRedirection(); // Disabled for dev

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

// ---- Polly Policies ----

static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError() // 5xx aur 408 automatically handle karta hai
        .OrResult(msg => (int)msg.StatusCode == 429) // Gemini rate limit
        .Or<TimeoutRejectedException>() // Polly ka apna timeout bhi retry trigger kare
        .WaitAndRetryAsync(
            retryCount: 3,
            sleepDurationProvider: attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt)) // 2s, 4s, 8s
        );
}

static IAsyncPolicy<HttpResponseMessage> GetTimeoutPolicy()
{
    // Har individual attempt ke liye 15 second limit
    return Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(15));
}