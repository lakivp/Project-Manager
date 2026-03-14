using api.Models;
using api.Models.Dtos;
using api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace api.Services.Implementation
{
    public class TaskService : ITaskService
    {

        private readonly ProjectManagementContext _context;
        private readonly ILabelService _label_service;

        public TaskService(ProjectManagementContext context, ILabelService label_service)
        {
            _context = context;
            _label_service = label_service;
        }

        public async Task<List<Taskovi>> GetAllTasks()
        {
            var taskovi = await _context.Tasks.ToListAsync();

            return taskovi;
        }

        public async Task<List<GetTasksDto>> GetAllTasksWithLabelNames()
        {

            var task = await (
                from t in _context.Tasks
                join l in _context.ListaLabela on t.idLabel equals l.id into labelGroup
                from labels in labelGroup.DefaultIfEmpty()
                join p in _context.Projekti on t.idProjekat equals p.id
                join tu in _context.ListaTaskUcesnici on t.id equals tu.idTask into taskUcesniciGroup
                from taskUcesnici in taskUcesniciGroup.DefaultIfEmpty()
                join k in _context.Korisnici on taskUcesnici.idKorisnik equals k.id into korisniciGroup
                from korisnik in korisniciGroup.DefaultIfEmpty()
                    select new
                    {
                        Task = t,
                        Label = labels,
                        Projekat = p,
                        TaskUcesnici = taskUcesnici,
                        Korisnik = korisnik
                    }).ToListAsync();

            var result = task.GroupBy(x => x.Task.id)
                             .Select(group => new GetTasksDto
                             {
                                 id = group.Key,
                                 naziv = group.First().Task.naziv,
                                 opis = group.First().Task.opis,
                                 prioritet = group.First().Task.prioritet,
                                 pocetak = group.First().Task.pocetak,
                                 kraj = group.First().Task.kraj,
                                 idParent = group.First().Task.idParent,
                                 idProjekat = group.First().Task.idProjekat,
                                 idLabel = group.First().Task.idLabel,
                                 status = group.First().Task.status,
                                 LabelNaziv = group.First().Label?.naziv,
                                 projectName = group.First().Projekat.naziv,
                                 korisnici = group.Select(x => x.Korisnik != null ? new MemberGetTaskDto
                                 {
                                     Ime = x.Korisnik.ime,
                                     Prezime = x.Korisnik.prezime,
                                     Username = x.Korisnik.username,
                                     Email = x.Korisnik.email,
                                     imageURL = x.Korisnik.imageURL
                                 } : null).ToList()
                             });

            return result.Cast<GetTasksDto>().ToList();
        }

        public async Task<List<GetTasksDto>> GetTask(int id)
        {

            var task = await (
                from t in _context.Tasks
                join l in _context.ListaLabela on t.idLabel equals l.id into labelGroup
                from labels in labelGroup.DefaultIfEmpty()
                join p in _context.Projekti on t.idProjekat equals p.id
                join tu in _context.ListaTaskUcesnici on t.id equals tu.idTask into taskUcesniciGroup
                from taskUcesnici in taskUcesniciGroup.DefaultIfEmpty()
                join k in _context.Korisnici on taskUcesnici.idKorisnik equals k.id into korisniciGroup
                from korisnik in korisniciGroup.DefaultIfEmpty()
                where t.id == id
                select new
                {
                    Task = t,
                    Label = labels,
                    Projekat = p,
                    TaskUcesnici = taskUcesnici,
                    Korisnik = korisnik
                }).ToListAsync();

            var result = task.GroupBy(x => x.Task.id)
                             .Select(group => new GetTasksDto
                             {
                                 id = group.Key,
                                 naziv = group.First().Task.naziv,
                                 opis = group.First().Task.opis,
                                 prioritet = group.First().Task.prioritet,
                                 pocetak = group.First().Task.pocetak,
                                 kraj = group.First().Task.kraj,
                                 idParent = group.First().Task.idParent,
                                 idProjekat = group.First().Task.idProjekat,
                                 idLabel = group.First().Task.idLabel,
                                 status = group.First().Task.status,
                                 LabelNaziv = group.First().Label?.naziv,
                                 projectName = group.First().Projekat.naziv,
                                 korisnici = group.Select(x => x.Korisnik != null ? new MemberGetTaskDto
                                 {
                                     Ime = x.Korisnik.ime,
                                     Prezime = x.Korisnik.prezime,
                                     Username = x.Korisnik.username,
                                     Email = x.Korisnik.email,
                                     imageURL = x.Korisnik.imageURL
                                 } : null).ToList()
                             });

            return result.Cast<GetTasksDto>().ToList();
        }

        public async Task<List<GetTasksDto>> GetFilteredTasks(FilterTaskDto filter,int projekatId)
        {
            var task = await (
            from t in _context.Tasks
            join l in _context.ListaLabela on t.idLabel equals l.id into labelGroup
            from labels in labelGroup.DefaultIfEmpty()
            join p in _context.Projekti on t.idProjekat equals p.id
            join tu in _context.ListaTaskUcesnici on t.id equals tu.idTask into taskUcesniciGroup
            from taskUcesnici in taskUcesniciGroup.DefaultIfEmpty()
            join k in _context.Korisnici on taskUcesnici.idKorisnik equals k.id into korisniciGroup
            from korisnik in korisniciGroup.DefaultIfEmpty()
            where t.idProjekat == projekatId
            
            select new
            {
                Task = t,
                Label = labels,
                Projekat = p,
                TaskUcesnici = taskUcesnici,
                Korisnik = korisnik
            }).ToListAsync();

            var result = task.GroupBy(x => x.Task.id)
                             .Select(group => new GetTasksDto
                             {
                                 id = group.Key,
                                 naziv = group.First().Task.naziv,
                                 opis = group.First().Task.opis,
                                 prioritet = group.First().Task.prioritet,
                                 pocetak = group.First().Task.pocetak,
                                 kraj = group.First().Task.kraj,
                                 idParent = group.First().Task.idParent,
                                 idProjekat = group.First().Task.idProjekat,
                                 idLabel = group.First().Task.idLabel,
                                 status = group.First().Task.status,
                                 LabelNaziv = group.First().Label?.naziv,
                                 projectName = group.First().Projekat.naziv,
                                 korisnici = group.Select(x => x.Korisnik != null ? new MemberGetTaskDto
                                 {
                                     Ime = x.Korisnik.ime,
                                     Prezime = x.Korisnik.prezime,
                                     Username = x.Korisnik.username,
                                     Email = x.Korisnik.email,
                                     imageURL = x.Korisnik.imageURL
                                 } : null).ToList()
                             });

            if(!filter.naziv.IsNullOrEmpty())
            {
                result = result.Where(x => x.naziv.ToLower().Contains(filter.naziv.ToLower())).ToList();
            }

            if(!filter.prioritet.IsNullOrEmpty())
            {
                result = result.Where(x => x.prioritet.Contains(filter.prioritet)).ToList();
            }

            if (!filter.pocetak.IsNullOrEmpty())
            {
                result = result.Where(x => DateTime.ParseExact(filter.pocetak, "dd.MM.yyyy", CultureInfo.InvariantCulture) <= DateTime.ParseExact(x.pocetak, "dd.MM.yyyy", CultureInfo.InvariantCulture)).ToList();
            }

            if (!filter.kraj.IsNullOrEmpty())
            {
                result = result.Where(x => DateTime.ParseExact(filter.kraj, "dd.MM.yyyy", CultureInfo.InvariantCulture) >= DateTime.ParseExact(x.kraj, "dd.MM.yyyy", CultureInfo.InvariantCulture)).ToList();
            }
            
            if(filter.status == null)
            {
                result = result.Where(x => x.status == 1 || x.status == 0);
            }
            else
            {
                result = result.Where(x => x.status == filter.status);
            }

            if(!filter.labelNaziv.IsNullOrEmpty())
            {
                result = result.Where(x => x.LabelNaziv.Contains(filter.labelNaziv)).ToList();
            }

            if(!filter.projekatNaziv.IsNullOrEmpty())
            {
                result = result.Where(x => x.projectName.Contains(filter.projekatNaziv)).ToList();
            }

            // PAGING
            if (filter.page_number > 0 && filter.page_size > 0) // use 0 in either field to skip paging
            {
                result = result.Skip(filter.page_number - 1).Take(filter.page_size).ToList(); // assuming that first page index is 1
            }

            return result.Cast<GetTasksDto>().ToList();
        }

        public async Task<List<GetTasksDto>> GetToDoTable(FilterTaskDto filter, int korisnikId)
        {
            var task = await (
            from t in _context.Tasks
            join l in _context.ListaLabela on t.idLabel equals l.id into labelGroup
            from labels in labelGroup.DefaultIfEmpty()
            join p in _context.Projekti on t.idProjekat equals p.id
            join tu in _context.ListaTaskUcesnici on new { X1 = t.id, X2 = korisnikId }  equals new { X1 = tu.idTask, X2 = tu.idKorisnik } into taskUcesniciGroup
            from taskUcesnici in taskUcesniciGroup.DefaultIfEmpty()
            join k in _context.Korisnici on taskUcesnici.idKorisnik equals k.id into korisniciGroup
            from korisnik in korisniciGroup.DefaultIfEmpty()
            where taskUcesnici.idKorisnik == korisnikId

            select new
            {
                Task = t,
                Label = labels,
                Projekat = p,
                TaskUcesnici = taskUcesnici,
                Korisnik = korisnik
            }).ToListAsync();

            var result = task.GroupBy(x => x.Task.id)
                             .Select(group => new GetTasksDto
                             {
                                 id = group.Key,
                                 naziv = group.First().Task.naziv,
                                 opis = group.First().Task.opis,
                                 prioritet = group.First().Task.prioritet,
                                 pocetak = group.First().Task.pocetak,
                                 kraj = group.First().Task.kraj,
                                 idParent = group.First().Task.idParent,
                                 idProjekat = group.First().Task.idProjekat,
                                 idLabel = group.First().Task.idLabel,
                                 status = group.First().Task.status,
                                 LabelNaziv = group.First().Label?.naziv,
                                 projectName = group.First().Projekat.naziv,
                                 korisnici = group.Select(x => x.Korisnik != null ? new MemberGetTaskDto
                                 {
                                     Ime = x.Korisnik.ime,
                                     Prezime = x.Korisnik.prezime,
                                     Username = x.Korisnik.username,
                                     Email = x.Korisnik.email,
                                     imageURL = x.Korisnik.imageURL
                                 } : null).ToList()
                             });

            if (!filter.naziv.IsNullOrEmpty())
            {
                result = result.Where(x => x.naziv.ToLower().Contains(filter.naziv.ToLower())).ToList();
            }

            if (!filter.prioritet.IsNullOrEmpty())
            {
                result = result.Where(x => x.prioritet.Contains(filter.prioritet)).ToList();
            }

            if (!filter.pocetak.IsNullOrEmpty())
            {
                result = result.Where(x => DateTime.ParseExact(filter.pocetak, "dd.MM.yyyy", CultureInfo.InvariantCulture) <= DateTime.ParseExact(x.pocetak, "dd.MM.yyyy", CultureInfo.InvariantCulture)).ToList();
            }

            if (!filter.kraj.IsNullOrEmpty())
            {
                result = result.Where(x => DateTime.ParseExact(filter.kraj, "dd.MM.yyyy", CultureInfo.InvariantCulture) >= DateTime.ParseExact(x.kraj, "dd.MM.yyyy", CultureInfo.InvariantCulture)).ToList();
            }

            if (filter.status == null)
            {
                result = result.Where(x => x.status == 1 || x.status == 0);
            }
            else
            {
                result = result.Where(x => x.status == filter.status);
            }

            if (!filter.labelNaziv.IsNullOrEmpty())
            {
                result = result.Where(x => x.LabelNaziv.Contains(filter.labelNaziv)).ToList();
            }

            if (!filter.projekatNaziv.IsNullOrEmpty())
            {
                result = result.Where(x => x.projectName.Contains(filter.projekatNaziv)).ToList();
            }

            // PAGING
            if (filter.page_number > 0 && filter.page_size > 0) // use 0 in either field to skip paging
            {
                result = result.Skip(filter.page_number - 1).Take(filter.page_size).ToList(); // assuming that first page index is 1
            }

            return result.Cast<GetTasksDto>().ToList();
        }

        public async Task<Taskovi> GetTaskById(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            return task;
        }

        public async Task<Taskovi> AddTask(TaskoviDto taskZahtev)
        {
            Taskovi task = new Taskovi();
            task.naziv = taskZahtev.naziv;
            task.opis = taskZahtev.opis;
            task.prioritet = taskZahtev.prioritet;
            task.pocetak = taskZahtev.pocetak;
            task.kraj = taskZahtev.kraj;
            task.idParent = taskZahtev.idParent;
            task.idProjekat = taskZahtev.idProjekat;
            task.idLabel = taskZahtev.idLabel;
            task.status = taskZahtev.status;
            _context.Tasks.Add(task);

            await _context.SaveChangesAsync();

            return task;
        }

        public async Task<Taskovi> UpdateTask(TaskoviDto taskZahtev)
        {
            var task = await _context.Tasks.FindAsync(taskZahtev.id);
            task.naziv = taskZahtev.naziv;
            task.opis = taskZahtev.opis;
            task.prioritet = taskZahtev.prioritet;
            task.pocetak = taskZahtev.pocetak;
            task.kraj = taskZahtev.kraj;
            task.idParent = taskZahtev.idParent;
            task.idProjekat = taskZahtev.idProjekat;
            task.idLabel = taskZahtev.idLabel;
            task.status = taskZahtev.status;
            _context.Tasks.Update(task);

            await _context.SaveChangesAsync();

            return task;
        }

        public async Task<Taskovi> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            _context.Tasks.Remove(task);

            await _context.SaveChangesAsync();

            return task;
        }

        public async Task<Taskovi> CloseTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            task.status = 0;
            _context.Tasks.Update(task);

            await _context.SaveChangesAsync();

            return task;
        }

        public async Task<List<GetTasksDto>> GetActiveTasks()
        {

            var task = await (
                from t in _context.Tasks
                join l in _context.ListaLabela on t.idLabel equals l.id into labelGroup
                from labels in labelGroup.DefaultIfEmpty()
                join p in _context.Projekti on t.idProjekat equals p.id
                join tu in _context.ListaTaskUcesnici on t.id equals tu.idTask into taskUcesniciGroup
                from taskUcesnici in taskUcesniciGroup.DefaultIfEmpty()
                join k in _context.Korisnici on taskUcesnici.idKorisnik equals k.id into korisniciGroup
                from korisnik in korisniciGroup.DefaultIfEmpty()
                where t.status == 1
                select new
                {
                    Task = t,
                    Label = labels,
                    Projekat = p,
                    TaskUcesnici = taskUcesnici,
                    Korisnik = korisnik
                }).ToListAsync();

            var result = task.GroupBy(x => x.Task.id)
                             .Select(group => new GetTasksDto
                             {
                                 id = group.Key,
                                 naziv = group.First().Task.naziv,
                                 opis = group.First().Task.opis,
                                 prioritet = group.First().Task.prioritet,
                                 pocetak = group.First().Task.pocetak,
                                 kraj = group.First().Task.kraj,
                                 idParent = group.First().Task.idParent,
                                 idProjekat = group.First().Task.idProjekat,
                                 idLabel = group.First().Task.idLabel,
                                 status = group.First().Task.status,
                                 LabelNaziv = group.First().Label?.naziv,
                                 projectName = group.First().Projekat.naziv,
                                 korisnici = group.Select(x => x.Korisnik != null ? new MemberGetTaskDto
                                 {
                                     Ime = x.Korisnik.ime,
                                     Prezime = x.Korisnik.prezime,
                                     Username = x.Korisnik.username,
                                     Email = x.Korisnik.email,
                                     imageURL = x.Korisnik.imageURL
                                 } : null).ToList()
                             });

            return result.Cast<GetTasksDto>().ToList();
        }

        public async Task<List<GetTasksDto>> GetInActiveTasks()
        {

            var task = await (
                from t in _context.Tasks
                join l in _context.ListaLabela on t.idLabel equals l.id into labelGroup
                from labels in labelGroup.DefaultIfEmpty()
                join p in _context.Projekti on t.idProjekat equals p.id
                join tu in _context.ListaTaskUcesnici on t.id equals tu.idTask into taskUcesniciGroup
                from taskUcesnici in taskUcesniciGroup.DefaultIfEmpty()
                join k in _context.Korisnici on taskUcesnici.idKorisnik equals k.id into korisniciGroup
                from korisnik in korisniciGroup.DefaultIfEmpty()
                where t.status == 0


                select new
                {
                    Task = t,
                    Label = labels,
                    Projekat = p,
                    TaskUcesnici = taskUcesnici,
                    Korisnik = korisnik
                }).ToListAsync();

            var result = task.GroupBy(x => x.Task.id)
                             .Select(group => new GetTasksDto
                             {
                                 id = group.Key,
                                 naziv = group.First().Task.naziv,
                                 opis = group.First().Task.opis,
                                 prioritet = group.First().Task.prioritet,
                                 pocetak = group.First().Task.pocetak,
                                 kraj = group.First().Task.kraj,
                                 idParent = group.First().Task.idParent,
                                 idProjekat = group.First().Task.idProjekat,
                                 idLabel = group.First().Task.idLabel,
                                 status = group.First().Task.status,
                                 LabelNaziv = group.First().Label?.naziv,
                                 projectName = group.First().Projekat.naziv,
                                 korisnici = group.Select(x => x.Korisnik != null ? new MemberGetTaskDto
                                 {
                                     Ime = x.Korisnik.ime,
                                     Prezime = x.Korisnik.prezime,
                                     Username = x.Korisnik.username,
                                     Email = x.Korisnik.email,
                                     imageURL = x.Korisnik.imageURL
                                 } : null).ToList()
                             });

            return result.Cast<GetTasksDto>().ToList();
        }

        public async Task<List<GetTasksDto>> GetTasksByProjekatId(int projekatId)
        {
            var task = await (
                from p in _context.Projekti
                where p.id == projekatId
                join t in _context.Tasks on p.id equals t.idProjekat
                join l in _context.ListaLabela on t.idLabel equals l.id into LabelGroup
                from labels in LabelGroup.DefaultIfEmpty()
                join p1 in _context.Projekti on t.idProjekat equals p1.id
                join tu in _context.ListaTaskUcesnici on t.id equals tu.idTask into taskUcesniciGroup
                from taskUcesnici in taskUcesniciGroup.DefaultIfEmpty()
                join k in _context.Korisnici on taskUcesnici.idKorisnik equals k.id into korisniciGroup
                from korisnik in korisniciGroup.DefaultIfEmpty()
                select new
                {
                    Task = t,
                    Label = labels,
                    Projekat = p,
                    TaskUcesnici = taskUcesnici,
                    Korisnik = korisnik
                }).ToListAsync();

            var result = task.GroupBy(x => x.Task.id)
                 .Select(group => new GetTasksDto
                 {
                     id = group.Key,
                     naziv = group.First().Task.naziv,
                     opis = group.First().Task.opis,
                     prioritet = group.First().Task.prioritet,
                     pocetak = group.First().Task.pocetak,
                     kraj = group.First().Task.kraj,
                     idParent = group.First().Task.idParent,
                     idProjekat = group.First().Task.idProjekat,
                     idLabel = group.First().Task.idLabel,
                     status = group.First().Task.status,
                     LabelNaziv = group.First().Label?.naziv,
                     projectName = group.First().Projekat.naziv,
                     korisnici = group.Select(x => x.Korisnik != null ? new MemberGetTaskDto
                     {
                         Ime = x.Korisnik.ime,
                         Prezime = x.Korisnik.prezime,
                         Username = x.Korisnik.username,
                         Email = x.Korisnik.email,
                         imageURL = x.Korisnik.imageURL
                     } : null).Where(x => x != null).GroupBy(x => x.Username != null ? x.Username : null).Select(g => g.First()).ToList()
                 });

            return result.Cast<GetTasksDto>().ToList();
        }

        public async Task<List<TaskUcesnici>> GetMembersByTaskId(int taskId)
        {
            var ucesnici = await _context.ListaTaskUcesnici.Where(x => x.idTask == taskId).ToListAsync();

            return ucesnici;
        }

        public async Task<TaskUcesniciDto> AddMember(TaskUcesniciDto input)
        {
            _context.ListaTaskUcesnici.Add(new TaskUcesnici()
            {
                idKorisnik = input.korisnikId,
                idTask = input.taskId
            });

            await _context.SaveChangesAsync();

            return input;
        }

        public async Task<bool> RemoveMember(int task_id, int user_id)
        {
            var task = await _context.ListaTaskUcesnici.FirstOrDefaultAsync(x => x.idTask == task_id && x.idKorisnik == user_id);

            if (task == null)
                return true;

            _context.ListaTaskUcesnici.Remove(task);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<GetTasksDto>> GetTasksByKorisnikId(int korisnikId)
        {

            var task = await (
                from tu in _context.ListaTaskUcesnici
                where tu.idKorisnik == korisnikId
                join t in _context.Tasks on tu.idTask equals t.id
                join l in _context.ListaLabela on t.idLabel equals l.id into labelGroup
                from labels in labelGroup.DefaultIfEmpty()
                join p in _context.Projekti on t.idProjekat equals p.id
                join tu1 in _context.ListaTaskUcesnici on t.id equals tu1.idTask into taskUcesniciGroup
                from taskUcesnici in taskUcesniciGroup.DefaultIfEmpty()
                join k in _context.Korisnici on taskUcesnici.idKorisnik equals k.id into korisniciGroup
                from korisnik in korisniciGroup.DefaultIfEmpty()
                select new
                {
                    Task = t,
                    Label = labels,
                    Projekat = p,
                    TaskUcesnici = taskUcesnici,
                    Korisnik = korisnik
                }).ToListAsync();

            var result = task.GroupBy(x => x.Task.id)
            .Select(group => new GetTasksDto
            {
                id = group.Key,
                naziv = group.First().Task.naziv,
                opis = group.First().Task.opis,
                prioritet = group.First().Task.prioritet,
                pocetak = group.First().Task.pocetak,
                kraj = group.First().Task.kraj,
                idParent = group.First().Task.idParent,
                idProjekat = group.First().Task.idProjekat,
                idLabel = group.First().Task.idLabel,
                status = group.First().Task.status,
                LabelNaziv = group.First().Label?.naziv,
                projectName = group.First().Projekat.naziv,
                korisnici = group.Select(x => x.Korisnik != null ? new MemberGetTaskDto
                {
                    Ime = x.Korisnik.ime,
                    Prezime = x.Korisnik.prezime,
                    Username = x.Korisnik.username,
                    Email = x.Korisnik.email,
                    imageURL = x.Korisnik.imageURL
                } : null).Where(x => x != null).GroupBy(x => x.Username != null ? x.Username : null).Select(g => g.First()).ToList()
            });

            return result.Cast<GetTasksDto>().ToList();
        }

        public async Task<HistogramTaskovaDto> GetHistogramTaskova(int korisnikId,int projekatId)
        {
            var task = await (
                from t in _context.Tasks
                where t.idProjekat == projekatId && t.status == 1
                join kp in _context.ListaUlogaKorisnikProjekat on projekatId equals kp.idProjekat
                join tu in _context.ListaTaskUcesnici on new { idTask = t.id, idKorisnik = kp.idKorisnik } equals new { idTask = tu.idTask, idKorisnik = tu.idKorisnik }
                where tu.idKorisnik == korisnikId
                join k in _context.Korisnici on tu.idKorisnik equals k.id
                group t by new { tu.idKorisnik, k.username, k.imageURL} into g
                select new HistogramTaskovaDto
                {
                    korisnikId = g.Key.idKorisnik,
                    username = g.Key.username,
                    imageUrl = g.Key.imageURL,
                    lowTasks = g.Count(t => t.prioritet == "Low"),
                    mediumTasks = g.Count(t => t.prioritet == "Medium"),
                    highTasks = g.Count(t => t.prioritet == "High")
                }).FirstOrDefaultAsync();

            return task;

        }

        public async Task<List<HistogramTaskovaDto>> GetHistogramTaskovaByProjectId(int projekatId)
        {
            var task = await (
                from t in _context.Tasks
                where t.idProjekat == projekatId && t.status == 1
                join kp in _context.ListaUlogaKorisnikProjekat on t.idProjekat equals kp.idProjekat
                join tu in _context.ListaTaskUcesnici on new { idTask = t.id, idKorisnik = kp.idKorisnik } equals new { idTask = tu.idTask, idKorisnik = tu.idKorisnik }
                join k in _context.Korisnici on tu.idKorisnik equals k.id
                group t by new { tu.idKorisnik, k.username, k.imageURL } into g
                select new HistogramTaskovaDto
                {
                    korisnikId = g.Key.idKorisnik,
                    username = g.Key.username,
                    imageUrl = g.Key.imageURL,
                    lowTasks = g.Count(t => t.prioritet == "Low"),
                    mediumTasks = g.Count(t => t.prioritet == "Medium"),
                    highTasks = g.Count(t => t.prioritet == "High")
                }).ToListAsync();

            var result = task.ToList();

            return result;

        }


    }
}
