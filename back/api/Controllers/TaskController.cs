using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Services.Interfaces;
using api.Services.Implementation;
using api.Models.Dtos;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _task_service;
        private readonly IKorisnikService _korisnik_service;
        private readonly IObavestenjaService _obavestenje_service;
        private readonly IEmailService _email_service;
        private readonly IPodesavanjaService _podesavanja_service;
        private readonly IHubContext<NotificationHub,INotificationClient> _notification_service;
        private readonly ProjectManagementContext _context;
        public TaskController(ITaskService task_service,IKorisnikService korisnikService,IObavestenjaService obavestenjaService,IEmailService emailService, IHubContext<NotificationHub, INotificationClient> notificationService, IPodesavanjaService podesavanjaService,ProjectManagementContext context)
        {
            _task_service = task_service;
            _korisnik_service = korisnikService;
            _obavestenje_service = obavestenjaService;
            _email_service = emailService;
            _notification_service = notificationService;
            _podesavanja_service = podesavanjaService;
            _context = context;
        }

        [HttpGet("GetAll")]
        
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _task_service.GetAllTasksWithLabelNames());
        }

        [HttpPost("GetFilteredTasks{id}")]

        public async Task<IActionResult> GetFilteredTasks(FilterTaskDto filter, int id)
        {
            var taskovi = await _task_service.GetFilteredTasks(filter,id);

            return Ok(taskovi);
        }

        [HttpPost("GetToDoList{id}")]

        public async Task<IActionResult> GetToDoList(FilterTaskDto filter, int user_id)
        {
            var taskovi = await _task_service.GetToDoTable(filter, user_id);

            return Ok(taskovi);
        }

        [HttpGet("GetActive")]

        public async Task<IActionResult> GetActive()
        {
            return Ok(await _task_service.GetActiveTasks());
        }

        [HttpGet("GetInActive")]

        public async Task<IActionResult> GetInActive()
        {
            return Ok(await _task_service.GetInActiveTasks());
        }

        [HttpGet("Get{id}")]

        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _task_service.GetTaskById(id));
        }

        [HttpPost("Add")]

        public async Task<IActionResult> Add(TaskoviDto task)
        {
            return Ok(await _task_service.AddTask(task));
        }

        [HttpPut("Update")]

        public async Task<IActionResult> Update(TaskoviDto task)
        {
            var postojeciTaskProba = await _task_service.GetTaskById(task.id);

            if(postojeciTaskProba == null)
            {
                return BadRequest($"Task {task.id} not found");
            }

            await _task_service.UpdateTask(task);

            return Ok(await _task_service.GetTask(task.id));
        }

        [HttpDelete("Delete{id}")]

        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _task_service.GetTaskById(id);

            if(task == null)
            {
                return NotFound("Ne postoji task");
            }

            await _task_service.DeleteTask(id);

            return Ok(task);
        }

        [HttpPut("Close")]

        public async Task<IActionResult> Close(int id)
        {

            var task = await _task_service.GetTaskById(id);

            if(task == null)
            {
                return BadRequest($"Task {id} not found");
            }

            await _task_service.CloseTask(id);

            return Ok(task);
        }

        [HttpPut("Open")]

        public async Task<IActionResult> Open(int id)
        {
            var task = await _task_service.GetTaskById(id);

            if(task == null )
            {
                return BadRequest($"Task {id} not found");
            }

            TaskoviDto postojeciTask = new TaskoviDto();

            postojeciTask.id = task.id;
            postojeciTask.naziv = task.naziv;
            postojeciTask.opis = task.opis;
            postojeciTask.prioritet = task.prioritet;
            postojeciTask.pocetak = task.pocetak;
            postojeciTask.kraj = task.kraj;
            postojeciTask.idParent = task.idParent;
            postojeciTask.idProjekat = task.idProjekat;
            postojeciTask.idLabel = task.idLabel;
            postojeciTask.status = 1;

            await _task_service.UpdateTask(postojeciTask);
            return Ok(postojeciTask);
        }

        /*[HttpGet("ProjectActiveTasks{id}")]

        public async Task<IActionResult> ProjectActiveTasks(int id)
        {
            var taskovi = await _task_service.GetTasksByProjekatId(id,1);

            if(taskovi == null )
            {
                return NoContent();
            }

            return Ok(taskovi);
        }

        [HttpGet("ProjectInActiveTasks{id}")]

        public async Task<IActionResult> ProjectInactiveTasks(int id)
        {
            var taskovi = await _task_service.GetTasksByProjekatId(id, 0);

            if( taskovi == null )
            {
                return NoContent();
            }

            return Ok(taskovi);
        }*/

        [HttpGet("ProjectTasks{id}")]

        public async Task<IActionResult> ProjectTasks(int id)
        {
            var taskovi = await _task_service.GetTasksByProjekatId(id);

            if(taskovi ==  null)
            {
                return NoContent();
            }

            return Ok(taskovi);
        }

        [HttpGet("TaskMembers{id}")]

        public async Task<IActionResult> TaskMembers(int id)
        {
            var medjutabela = await _task_service.GetMembersByTaskId(id);
            List<TaskMembersDto> ucesnici = new List<TaskMembersDto>();

            if(medjutabela == null)
            {
                return NoContent();
            }

            foreach(var m in medjutabela)
            {
                var member = await _korisnik_service.GetKorisnikById(m.idKorisnik);

                if(member.status == 1)
                {
                    TaskMembersDto ucesnik = new TaskMembersDto();

                    ucesnik.Ime = member.ime;
                    ucesnik.Prezime = member.prezime;
                    ucesnik.Username = member.username;
                    ucesnik.Email = member.email;
                    ucesnik.imageURL = member.imageURL;
                    ucesnici.Add(ucesnik);
                }
            }

            return Ok(ucesnici);
        }

        [HttpPost("AddTaskMember")]
        public async Task<IActionResult> AddTaskMember(TaskUcesniciDto input)
        {
            Korisnik korisnik = await _korisnik_service.GetKorisnikById(input.korisnikId);
            List<TaskUcesnici> ucesnici = await _context.ListaTaskUcesnici.Where(x => x.idTask == input.taskId).ToListAsync();
            if(korisnik == null)
            {
                return BadRequest("Korisnik ne postoji");
            }
            foreach(var u in ucesnici)
            {
                if(u.idKorisnik == korisnik.id)
                {
                    return BadRequest("Korisnik je vec na tasku");
                }
            }
            Taskovi task = new Taskovi();
            var postojeciTask = await _task_service.GetTaskById(input.taskId);
            if(postojeciTask == null)
            {
                return BadRequest("Task ne postoji");
            }
            EmailDto email = new EmailDto();
            email.To = korisnik.email;
            email.Subject = "Task";
            email.Body = $"Postovani {korisnik.ime} dodati ste na task {postojeciTask.naziv}";
            Obavestenje obavestenje = new Obavestenje();
            obavestenje.text = $"Dodati ste na task {postojeciTask.naziv}";
            obavestenje.isRead = 0;
            obavestenje.dateCreated = DateTime.Now;
            
            await _obavestenje_service.AddObavestenje(obavestenje);
            await _obavestenje_service.AddUserObavestenje(obavestenje.id, input.korisnikId);
            var result = await _task_service.AddMember(input);

            // do i send notif
            var podesavanja = await _podesavanja_service.GetSettingsByKorisnikId(korisnik.id);
            
            if( podesavanja[0].notifikacija == false)
            {
                return Ok();
            }

            await _email_service.SendEmail(email);

            if (!NotificationHub.UserConnections.ContainsKey(korisnik.username))
            {
                Console.WriteLine($"Korisnik {korisnik.username} nije povezan");
                return Ok();
            }

            foreach (var k in NotificationHub.UserConnections[korisnik.username])
            {
                await _notification_service.Clients.Client(k).ReceiveNotification($"Dodati ste na task {postojeciTask.naziv} {postojeciTask.id}");
            }

            return Ok(result);
        }

        [HttpPost("RemoveTaskMember")]

        public async Task<IActionResult> RemoveTaskMember(int task_id, int user_id)
        {
            await _task_service.RemoveMember(task_id, user_id);

            return Ok();
        }

        [HttpGet("UserTasks{id}")]

        public async Task<IActionResult> GetTasksByUserId(int id)
        {
            var taskovi = await _task_service.GetTasksByKorisnikId(id);

            if(taskovi == null)
            {
                return NoContent();
            }

            return Ok(taskovi);
        }
    }
}
