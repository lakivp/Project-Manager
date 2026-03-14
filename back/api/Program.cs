using api.Models;
using api.Services.Interfaces;
using api.Services.Implementation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });

    // Configure Swagger to use JWT Authentication
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
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
            new string[] {}
        }
    });
});

// Registering Services
builder.Services.AddTransient<ProjectManagementContext>();
builder.Services.AddTransient<IKorisnikService, KorisnikService>();
builder.Services.AddTransient<IProjekatService, ProjekatService>();
builder.Services.AddTransient<ITaskService, TaskService>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<IObavestenjaService, ObavestenjaService>();
builder.Services.AddTransient<ILabelService, LabelService>();
builder.Services.AddTransient<IAdminService, AdminService>();
builder.Services.AddTransient<IFileService, FileService>();
builder.Services.AddTransient<IZavisnostTaskService, ZavisnostTaskService>();
builder.Services.AddTransient<ITemaService, TemaService>();
builder.Services.AddTransient<IPodesavanjaService, PodesavanjaService>();
builder.Services.AddTransient<IKomentarService, KomentarService>();
builder.Services.AddTransient<IDokumentacijaTaskovaService, DokumentacijaTaskovaService>();

builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
    options.MaximumReceiveMessageSize = 102400000; // 100 MB
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", builder =>
    {
        builder.WithOrigins("http://localhost:4200", "http://localhost:5235", "http://softeng.pmf.kg.ac.rs:10162", "http://softeng.pmf.kg.ac.rs:10161", "https://pro.fontawesome.com")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

// JWT Authentication configuration
var key = Encoding.ASCII.GetBytes("my top secret key for jwt token get");
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
        ValidIssuer = "http://localhost:5235", // http://localhost:5235, http://softeng.pmf.kg.ac.rs:10161
        ValidAudience = "http://localhost:5235", // http://localhost:5235, http://softeng.pmf.kg.ac.rs:10161
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API V1");
    });
}

app.UseHttpsRedirection();

app.UseCors("Angular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("chat-hub");

app.Run();
