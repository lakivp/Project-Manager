using api.Models.Dtos;
using api.Models;
using api.Services.Implementation;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using System.Runtime.InteropServices;
using ZstdSharp.Unsafe;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProjekatController : ControllerBase
    {
        private readonly IProjekatService _projekat_service;
        private readonly IKorisnikService _korisnik_service;
        private readonly IEmailService _email_service;
        private readonly IObavestenjaService _obavestenje_service;
        private readonly ILabelService _label_service;
        private readonly ITaskService _task_service;
        private readonly IPodesavanjaService _podesavanja_service;
        private readonly ProjectManagementContext _context;
        private readonly IHubContext<NotificationHub, INotificationClient> _notification_service;
        public ProjekatController(IProjekatService projekat_service, IConfiguration configuration,IKorisnikService korisnik_service, ITaskService task_service, IEmailService emailService,IObavestenjaService obavestenjaService,ProjectManagementContext context,ILabelService labelService, IHubContext<NotificationHub, INotificationClient> notificationService, IPodesavanjaService podesavanjaService) 
        {
            _projekat_service = projekat_service;
            _korisnik_service = korisnik_service;
            _task_service = task_service;
            _email_service = emailService;
            _obavestenje_service = obavestenjaService;
            _context = context;
            _label_service = labelService;
            _notification_service = notificationService;
            _podesavanja_service = podesavanjaService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _projekat_service.GetAllProjekti());
        }

        [HttpPost("GetDashboardTable")]
        public async Task<IActionResult> GetDashboard(FilterProjectDto filter)
        {
            var x = await _projekat_service.GetDashboardTableFiltered(filter);
            return Ok(x);
        }

        [HttpGet("Get{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var existingProjekat = await _projekat_service.GetProjekatById(id);

            if (existingProjekat == null) 
            {
                return NotFound($"Projekat {id} not found");
            }
            
            return Ok(existingProjekat);
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add(Projekat projekat)
        {
            await _projekat_service.AddProjekat(projekat);
            List<string> defaults = new List<string> { "To-Do", "In Progress", "Completed" };

            foreach (var d in defaults)
            {
                Models.Label label = new Models.Label();
                label.naziv = d;
                label.idProjekat = projekat.id;
                _context.ListaLabela.Add(label);
                await _context.SaveChangesAsync();
            }
            
            // label order
            List<Models.Label> labels = await _label_service.GetLabelsByProjectId(projekat.id);
            List<string> label_ids = new List<string>();
            LabelRedosled order = new LabelRedosled();
            
            foreach (var label in labels)
            {
                label_ids.Add(label.id.ToString());
            }

            order.idProjekat = projekat.id;
            order.order = String.Join(".", label_ids);

            _context.ListaLabelRedosled.Add(order);
            await _context.SaveChangesAsync();

            return Ok(projekat);
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(Projekat projekat)
        {
            try
            {
                var existingProjekat = await _projekat_service.GetProjekatById(projekat.id);

                if (existingProjekat == null)
                {
                    return NotFound($"Projekat {projekat.id} not found");
                }
                existingProjekat.naziv = projekat.naziv;
                existingProjekat.opis = projekat.opis;
                existingProjekat.prioritet = projekat.prioritet;
                existingProjekat.pocetak = projekat.pocetak;
                existingProjekat.kraj = projekat.kraj;
                existingProjekat.status = projekat.status;

                await _projekat_service.UpdateProjekat(existingProjekat);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("Delete{id}")]

        public async Task<IActionResult> DeleteProject(int id)
        {
            var projekat = await _projekat_service.DeleteProjekat(id);

            if(projekat == null)
            {
                return NotFound("Projekat ne postoji");
            }

            return Ok(projekat);
        }

        [HttpPut("CloseProject{id}")]

        public async Task<IActionResult> CloseProject(int id)
        {
            var projekat = await _projekat_service.GetProjekatById(id);

            if(projekat == null)
            {
                return NotFound("Projekat ne postoji");
            }

            projekat.status = 0;

            await _projekat_service.CloseProjekat(projekat);

            return Ok(projekat);
        }

        /* // DEPRECATED
        [HttpGet("UserProjects{id}")]

        public async Task<IActionResult> UserProjects(int id)
        {
            var medjutabela = await _projekat_service.GetProjektiByKorisnikId(id);
            List<ProjekatKorisnikDto> projekti = new List<ProjekatKorisnikDto>();

            if(medjutabela == null)
            {
                return NoContent();
            }

            foreach(var m in medjutabela)
            {
                var p = await _projekat_service.GetProjekatById(m.idProjekat);

                if(p.status == 1)
                {
                    ProjekatKorisnikDto projekat = new ProjekatKorisnikDto();

                    projekat.id = p.id;
                    projekat.naziv = p.naziv;
                    projekat.prioritet = p.prioritet;
                    projekat.pocetak = p.pocetak;
                    projekat.kraj = p.kraj;
                    projekat.status = p.status;

                    switch (m.idUloga) {
                        case 1: projekat.role = "owner"; break;
                        case 2: projekat.role = "maintainer"; break;
                        case 3: projekat.role = "developer"; break;
                        default: projekat.role = "guest"; break;
                    }



                    projekti.Add(projekat);
                }
            }

            return Ok(projekti);
        }
        */

        [HttpGet("UserProjects{id}")]

        public async Task<IActionResult> UserProjects(int id)
        {
            List<ProjekatKorisnikDto> projekti = await _projekat_service.GetProjektiByKorisnikIdLinq(id);

            if (projekti == null)
            {
                return NoContent();
            }

            return Ok(projekti);
        }


        [HttpGet("UsersOnProject{id}")]
        /* // DEPRECATED
        public async Task<IActionResult> UsersOnProject(int id)
        {
            var medjutabela = await _projekat_service.GetUsersOnProject(id);
            List<TaskMembersDto> korisnici = new List<TaskMembersDto>();

            if(medjutabela == null)
            {
                return NoContent();
            }

            foreach(var m in medjutabela)
            {
                var korisnik = await _korisnik_service.GetKorisnikById(m.idKorisnik);

                if(korisnik.status == 1)
                {
                    TaskMembersDto trenutniKorisnik = new TaskMembersDto();

                    trenutniKorisnik.Ime = korisnik.ime;
                    trenutniKorisnik.Prezime = korisnik.prezime;
                    trenutniKorisnik.Username = korisnik.username;
                    trenutniKorisnik.Email = korisnik.email;

                    korisnici.Add(trenutniKorisnik);
                }
            }

            return Ok(korisnici);
        }
        */
        public async Task<IActionResult> UsersOnProject(int id)
        {
           var members = await _projekat_service.GetUsersOnProjectLinq(id);

            if (members == null)
            {
                return NoContent();
            }

            return Ok(members);
        }

        [HttpPost("AddProjectMember")]

        public async Task<IActionResult> AddProjectMember(UlogaKorisnikProjekatDto input)
        {
            Korisnik korisnik = await _korisnik_service.GetKorisnikById(input.korisnikId);
            List<UlogaKorisnikProjekat> ucesnici = await _context.ListaUlogaKorisnikProjekat.Where(x => x.idProjekat == input.projekatId).ToListAsync();
            if (korisnik == null)
            {
                return BadRequest("Korisnik ne postoji");
            }
            foreach(var u in ucesnici)
            {
                if(u.idKorisnik == korisnik.id)
                {
                    return BadRequest("Korisnik je vec na projektu");
                }
            }
            Projekat projekat = new Projekat();
            var postojeciProjekat = await _projekat_service.GetProjekatById(input.projekatId);
            if (postojeciProjekat == null)
            {
                return BadRequest("Task ne postoji");
            }
            EmailDto email = new EmailDto();
            email.To = korisnik.email;
            email.Subject = "Project";
            email.Body = $"Postovani {korisnik.ime} dodati ste na projekat {postojeciProjekat.naziv}";
            Obavestenje obavestenje = new Obavestenje();
            obavestenje.text = $"Dodati ste na projekat {postojeciProjekat.naziv}";
            obavestenje.isRead = 0;
            obavestenje.dateCreated = DateTime.Now;
            
            await _obavestenje_service.AddObavestenje(obavestenje);
            await _obavestenje_service.AddUserObavestenje(obavestenje.id, input.korisnikId);

            var result = await _projekat_service.AddMember(input);

            // do i send notif
            var podesavanja = await _podesavanja_service.GetSettingsByKorisnikId(korisnik.id);

            if( podesavanja[0].notifikacija == false)
            {
                return Ok();
            }

            await _email_service.SendEmail(email);
            
            if(!NotificationHub.UserConnections.ContainsKey(korisnik.username))
            {
                Console.WriteLine($"Korisnik {korisnik.username} nije povezan");
                return Ok();
            }

                foreach (var k in NotificationHub.UserConnections[korisnik.username])
                {
                    Console.WriteLine(k.ToString());
                      await _notification_service.Clients.Client(k).ReceiveNotification($"Dodati ste na projekat {postojeciProjekat.naziv} {postojeciProjekat.id}");
                }

            return Ok(result);
        }
        
        [HttpPost("RemoveProjectMember")] // needs to remove user from a project and remove him from all of his tasks

        public async Task<IActionResult> RemoveProjectMember(int project_id, int user_id)
        {
            var taskovi = await _task_service.GetTasksByKorisnikId(user_id);

            foreach (var task in taskovi) 
            {
                await _task_service.RemoveMember(task.id, user_id);
            }

            await _projekat_service.RemoveMember(project_id, user_id);

            return Ok();
        }

        /*[HttpGet("GetHistogramTasks")]

        public async Task<IActionResult> GetHistogramTasks(int korisnikId,int projekatId)
        {
            var korisnik = await _korisnik_service.GetKorisnikById(korisnikId);

            if(korisnik == null)
            {
                return NotFound("Korisnik ne postoji");
            }

            var projekat = await _projekat_service.GetProjekatById(projekatId);

            if(projekat == null)
            {
                return NotFound("Projekat ne postoji");
            }

            var taskovi = await _task_service.GetHistogramTaskova(korisnikId,projekatId);

            if(taskovi == null)
            {
                return NotFound("Ne postoje taskovi");
            }

            return Ok(taskovi);
        }*/

        [HttpGet("GetHistogramTasksByProject")]

        public async Task<IActionResult> GetHistogramTasksByProjectId(int projekatId)
        {
            List<HistogramTaskovaDto> taskovi = new List<HistogramTaskovaDto>();
            var projekat = await _projekat_service.GetProjekatById(projekatId);

            if (projekat == null)
            {
                return NotFound("Projekat ne postoji");
            }

            var ucesnici = await _projekat_service.GetUsersOnProject(projekatId);

            foreach(var u in ucesnici)
            {
                var taskoviUcesnika = await _task_service.GetHistogramTaskova(u.idKorisnik,projekatId);
                if(taskoviUcesnika == null)
                {
                    Korisnik k = new Korisnik();
                    k = await _korisnik_service.GetKorisnikById(u.idKorisnik);
                    HistogramTaskovaDto novi = new HistogramTaskovaDto();
                    novi.korisnikId = u.idKorisnik;
                    novi.username = k.username;
                    novi.imageUrl = k.imageURL;
                    novi.lowTasks = 0;
                    novi.mediumTasks = 0;
                    novi.highTasks = 0;
                    taskovi.Add(novi);
                }
                else
                {
                    Korisnik k = new Korisnik();
                    k = await _korisnik_service.GetKorisnikById(u.idKorisnik);
                    HistogramTaskovaDto novi = new HistogramTaskovaDto();
                    novi.korisnikId = u.idKorisnik;
                    novi.username = k.username;
                    novi.imageUrl = k.imageURL;
                    novi.lowTasks = taskoviUcesnika.lowTasks;
                    novi.mediumTasks = taskoviUcesnika.mediumTasks;
                    novi.highTasks = taskoviUcesnika.highTasks;
                    taskovi.Add(taskoviUcesnika);
                }
            }

            if (taskovi == null)
            {
                return NotFound("Ne postoje taskovi");
            }

            return Ok(taskovi);
        }
    }
}
