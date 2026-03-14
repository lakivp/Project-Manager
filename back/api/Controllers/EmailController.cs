using api.Models;
using api.Models.Dtos;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _email_service;
        private readonly ProjectManagementContext _context;

        public EmailController(IEmailService email_service,ProjectManagementContext context)
        {
            _email_service = email_service;
            _context = context;
        }

        [HttpPost("SendEmail")]
        
        public async Task<IActionResult> SendEmail(EmailDto emailRequest)
        {
            var poruka = await _email_service.SendEmail(emailRequest);
            return Ok(poruka);
        }

        [HttpPost("ForgotPassword")]

        public async Task<IActionResult> ForgotPassword(string email)
        {
            var korisnik = _email_service.FindEmail(email);

            if(korisnik == null)
            {
                return NotFound("Korisnik sa tim emailom ne postoji");
            }

            EmailDto emailRequest = new EmailDto();
            UserResetPassToken medjutabela = new UserResetPassToken();

            var resetToken = Guid.NewGuid();
            emailRequest.To = email;
            emailRequest.Subject = "Zaboravljena lozinka";
            emailRequest.Body = $@"Postovani korisnice poslat je zahtev za promenu lozinke na nalogu {korisnik.email},klikom na <a href='http://localhost:4200/resetPassword?resetToken={resetToken}'>Link</a> mozete promeniti sifru";
            _email_service.SendEmail(emailRequest);

            medjutabela.userId = korisnik.id;
            medjutabela.token = resetToken;

            _context.ListaUserResetToken.Add(medjutabela);

            await _context.SaveChangesAsync();

            

            return Ok(emailRequest);

        }
    }
}
