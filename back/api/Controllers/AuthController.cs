using api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Models.Dtos;
using api.Services.Implementation;
using System.Text.Json;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public static Korisnik korisnik = new Korisnik();
        private readonly IKorisnikService _korisnik_service;
        private readonly ProjectManagementContext _context;
        public AuthController(IKorisnikService korisnik_service, IConfiguration configuration, ProjectManagementContext context)
        {
            _korisnik_service = korisnik_service;
            _context = context;
        }



        [HttpPost("login")]

        public async Task<ActionResult<string>> Login(KorisnikDto k)
        {
            var korisnik = await _korisnik_service.GetKorisnikByUsername(k.username);

            if (korisnik == null || korisnik.status == 0)
            {
                return BadRequest("User not found.");
            }

            if (!_korisnik_service.VerifyPasswordHash(k.password, korisnik.passwordHash, korisnik.passwordSalt))
            {
                return BadRequest("Wrong password.");
            }

            string token = _korisnik_service.CreateToken(korisnik);

            return Ok(token);
        }



    }
}
