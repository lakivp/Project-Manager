using api.Models.Dtos;
using api.Services.Interfaces;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services.Implementation
{
    public class EmailService : IEmailService
    {

        private readonly IConfiguration _configuration;
        private readonly ProjectManagementContext _context;

        public EmailService(IConfiguration configuration,ProjectManagementContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public async Task<EmailDto> SendEmail(EmailDto emailRequest)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_configuration.GetSection("EmailUsername").Value));
            email.To.Add(MailboxAddress.Parse(emailRequest.To));
            email.Subject = emailRequest.Subject;
            email.Body = new TextPart(TextFormat.Html) { Text  = emailRequest.Body };

            using var smtp = new SmtpClient();
            smtp.Connect(_configuration.GetSection("EmailHost").Value, 587, SecureSocketOptions.StartTls);
            smtp.Authenticate(_configuration.GetSection("EmailUsername").Value, _configuration.GetSection("EmailPassword").Value);
            smtp.Send(email);
            smtp.Disconnect(true);

            return emailRequest;
        }

        public Korisnik FindEmail(string email)
        {
            var user = _context.Korisnici.FirstOrDefault(x => x.email == email);

            return user;
        }



    }
}
