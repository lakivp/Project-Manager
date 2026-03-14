using api.Models;
using api.Models.Dtos;

namespace api.Services.Interfaces
{
    public interface IEmailService
    {
        public Task<EmailDto> SendEmail(EmailDto email);

        public Korisnik FindEmail(string email);
    }
}
