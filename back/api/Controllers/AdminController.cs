using api.Models;
using api.Services.Implementation;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Validations;

namespace api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _admin_service;
        private readonly IKorisnikService _korisnik_service;
        private readonly ProjectManagementContext _context;
        private readonly IHubContext<NotificationHub, INotificationClient> _notification_service;

        public AdminController(IAdminService admin_service,IKorisnikService korisnikService,ProjectManagementContext context, IHubContext<NotificationHub, INotificationClient> notificationService)
        {
            _admin_service = admin_service;
            _korisnik_service = korisnikService;
            _context = context;
            _notification_service = notificationService;
        }

        [HttpGet("getAll")]

        public async Task<IActionResult> GetAll()
        {
            var korisnici = await _admin_service.GetAll();

            if(korisnici == null)
            {
                return BadRequest("Ne postoji ni jedan korisnik!");
            }

            return Ok(korisnici);
        }

        [HttpGet("GetActive")]

        public async Task<IActionResult> GetActive()
        {
            var aktivniKorisnici = await _admin_service.GetActive();

            if(aktivniKorisnici == null)
            {
                return BadRequest("Nema aktivnih korisnika!");
            }

            return Ok(aktivniKorisnici);
        }

        [HttpGet("GetInActive")]

        public async Task<IActionResult> GetInactive()
        {
            var neaktivniKorisnici = await _admin_service.GetInActive();

            if(neaktivniKorisnici == null)
            {
                return BadRequest("Nema neaktivnih korisnika!");
            }

            return Ok(neaktivniKorisnici);
        }

        [HttpPost("ActivateUser{id}")]

        public async Task<IActionResult> ActivateUser(int id)
        {
            var postojeciKorisnik = await _korisnik_service.GetKorisnikById(id);

            if(postojeciKorisnik == null)
            {
                return NotFound();
            }

            postojeciKorisnik.status = 1;

            await _admin_service.ActivateUser(postojeciKorisnik);

            return Ok(postojeciKorisnik);
        }

        [HttpPost("DeactivateUser{id}")]

        public async Task<IActionResult> DeactivateUser(int id)
        {
            var postojeciKorisnik = await _korisnik_service.GetKorisnikById(id);

            if(postojeciKorisnik == null)
            {
                return NotFound();
            }

            postojeciKorisnik.status = 0;

            await _admin_service.DeactivateUser(postojeciKorisnik);

            if (!NotificationHub.UserConnections.ContainsKey(postojeciKorisnik.username))
            {
                Console.WriteLine($"Korisnik {postojeciKorisnik.username} nije povezan");
                return Ok();
            }

            foreach (var k in NotificationHub.UserConnections[postojeciKorisnik.username])
            {
                await _notification_service.Clients.Client(k).ReceiveNotification($"logout");
            }

            return Ok(postojeciKorisnik);
        }

        [HttpPut("ChangeUser{idUser}/Role{idUloge}")]

        public async Task<IActionResult> MakeUserAdmin(int idUser,int idUloge)
        {
            var user = await _korisnik_service.GetKorisnikById(idUser);

            if(user == null)
            {
                return NotFound("Korisnik ne postoji");
            }

            user.idUlogeAplikacija = idUloge;

            await _admin_service.ChangeRole(user);

            return Ok(user);

        }
    }
}
