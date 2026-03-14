using api.Models;
using api.Models.Dtos;
using api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Tls.Crypto.Impl.BC;
using System;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace api.Services.Implementation
{
    public class ProjekatService : IProjekatService
    {
        private readonly ProjectManagementContext _context;
        private readonly IConfiguration _configuration;

        public ProjekatService(ProjectManagementContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<List<Projekat>> GetAllProjekti()
        {
            var projekti = await _context.Projekti.ToListAsync();

            return projekti;
        }

        public async Task<Projekat> GetProjekatById(int id)
        {
            var projekat = await _context.Projekti.FirstOrDefaultAsync(x => x.id == id);

            return projekat;
        }

        public async Task<Projekat> AddProjekat(Projekat projekat)
        {
            _context.Projekti.Add(projekat);

            await _context.SaveChangesAsync();

            return projekat;
        }

        public async Task<bool> RemoveMember(int project_id, int user_id) 
        {
            var projekat_uloga = await _context.ListaUlogaKorisnikProjekat.FirstOrDefaultAsync(x => x.idProjekat == project_id && x.idKorisnik == user_id);

            if (projekat_uloga == null)
                return true;
            /*
            if (projekat_uloga.idUloga == 1) // zabrani uklanjanje ownera <- ovako je hardkodovano, mozda moze bolje
            {
                return false;
            }
            */

            _context.ListaUlogaKorisnikProjekat.Remove(projekat_uloga);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Projekat> UpdateProjekat(Projekat projekat)
        {
            _context.Projekti.Update(projekat);

            await _context.SaveChangesAsync();

            return projekat;
        }

        public async Task<Projekat> DeleteProjekat(int id)
        {
            var projekat = await _context.Projekti.FindAsync(id);

            _context.Projekti.Remove(projekat);


            _context.SaveChangesAsync();

            return projekat;
        }

        public async Task<Projekat> CloseProjekat(Projekat projekat)
        {
            _context.Projekti.Update(projekat);

            await _context.SaveChangesAsync();

            return projekat;
        }

        public async Task<List<UlogaKorisnikProjekat>> GetProjektiByKorisnikId(int korisnikId) // DEPRECATED
        {
            var projekti = await _context.ListaUlogaKorisnikProjekat.Where(x => x.idKorisnik == korisnikId).ToListAsync();

            return projekti;
        }

        public async Task<List<ProjekatKorisnikDto>> GetProjektiByKorisnikIdLinq(int korisnikId)
        {
            var result = await (
                from medjutabela in _context.ListaUlogaKorisnikProjekat
                from projekti in _context.Projekti
                     .Where(projekti => projekti.id == medjutabela.idProjekat && medjutabela.idKorisnik == korisnikId)
                from uloga in _context.ListaUlogaProjekat
                     .Where(uloga => uloga.id == medjutabela.idUloga)


                select new ProjekatKorisnikDto()
                {
                    id = projekti.id,

                    naziv = projekti.naziv,

                    prioritet = projekti.prioritet,

                    pocetak = projekti.pocetak,

                    kraj = projekti.kraj,

                    status = projekti.status,

                    role = uloga.naziv // HardcodedProjectRoles(medjutabela.idUloga) // pod uslovom da se izbrise treci from gore!!!
                }

                ).ToListAsync();

            return result;
        }

        public async Task<List<DashboardProjekatDto>> GetDashboardTableFiltered(FilterProjectDto filter)
        {
            var result = await (
                from medjutabela in _context.ListaUlogaKorisnikProjekat
                from projekti in _context.Projekti
                     .Where(projekti => projekti.id == medjutabela.idProjekat && medjutabela.idKorisnik == filter.user_id)
                from uloga in _context.ListaUlogaProjekat
                     .Where(uloga => uloga.id == medjutabela.idUloga)

                select new DashboardProjekatDto()
                {
                    id = projekti.id,

                    naziv = projekti.naziv,

                    // opis = projekti.opis, // za sada ovo nije potrebno na dashboard-u

                    prioritet = projekti.prioritet,

                    pocetak = projekti.pocetak,

                    kraj = projekti.kraj,

                    status = projekti.status,

                    role = uloga.naziv,

                    progress_params = (from x in _context.Tasks.Where(tasks => tasks.idProjekat == projekti.id) select new Tuple<int, string>(x.status, x.prioritet) /*{ status = x.status, prioritet = x.prioritet }*/ ).ToList(),
                
                    progress_percentage = 0,

                    timescale_percentage = 0 // timescale
                }
                ).ToListAsync();

            if (filter.status == 1 || filter.status == 0)
            {
                result = result.Where(x => x.status == filter.status).ToList();
            }

            if (!filter.naziv.IsNullOrEmpty())
            {
                result = result.Where(x => x.naziv.ToLower().Contains(filter.naziv.ToLower())).ToList();
            }

            if (!filter.prioritet.IsNullOrEmpty()) 
            {
                result = result.Where(x => filter.prioritet.Contains(x.prioritet)).ToList();
            }

            if (!filter.pocetak.IsNullOrEmpty())
            {
                result = result.Where(x => DateTime.ParseExact(filter.pocetak, "dd.MM.yyyy", CultureInfo.InvariantCulture) <= DateTime.ParseExact(x.pocetak, "dd.MM.yyyy", CultureInfo.InvariantCulture)).ToList();
            }

            if (!filter.kraj.IsNullOrEmpty())
            {
                result = result.Where(x => DateTime.ParseExact(filter.kraj, "dd.MM.yyyy", CultureInfo.InvariantCulture) >= DateTime.ParseExact(x.kraj, "dd.MM.yyyy", CultureInfo.InvariantCulture)).ToList();
            }

            if (!filter.role.IsNullOrEmpty())
            {
                result = result.Where(x => x.role == filter.role).ToList();
            }

            for (int i = 0; i < result.Count; i++)
            {
                result[i].progress_percentage = ProjectPercentageDone(result[i].progress_params);
                result[i].timescale_percentage = ProjectTimescale(DateTime.ParseExact(result[i].pocetak, "dd.MM.yyyy", CultureInfo.InvariantCulture), DateTime.ParseExact(result[i].kraj, "dd.MM.yyyy", CultureInfo.InvariantCulture)); // timescale
            }

            if ((filter.progress_greater_than >= 0 && filter.progress_greater_than <= 100) || (filter.progress_lesser_than >= 0 && filter.progress_lesser_than <= 100)) // set field to -1 to skip
            {
                if (filter.progress_filter_as_union) // result is a union of greather_than and lesser_than
                {
                    var result_greater_than = new List<DashboardProjekatDto>();
                    var result_lesser_than = new List<DashboardProjekatDto>();

                    if (filter.progress_greater_than >= 0 && filter.progress_greater_than <= 100) 
                    {
                        result_greater_than = result.Where(x => x.progress_percentage >= filter.progress_greater_than).ToList();
                    }
                    if (filter.progress_lesser_than >= 0 && filter.progress_lesser_than <= 100)
                    {
                        result_lesser_than = result.Where(x => x.progress_percentage <= filter.progress_lesser_than).ToList();
                    }

                    result = result_greater_than.Union(result_lesser_than).ToList(); // join two conditions and discard duplicates
                }
                else // result is an interstice
                {
                    if (filter.progress_greater_than >= 0 && filter.progress_greater_than <= 100)
                    {
                        result = result.Where(x => x.progress_percentage >= filter.progress_greater_than).ToList();
                    }
                    if (filter.progress_lesser_than >= 0 && filter.progress_lesser_than <= 100)
                    {
                        result = result.Where(x => x.progress_percentage <= filter.progress_lesser_than).ToList();
                    }
                }
                
            }

            // PAGING
            if (filter.page_number > 0 && filter.page_size > 0) // use 0 in either field to skip paging
            {
                result = result.Skip(filter.page_number - 1).Take(filter.page_size).ToList(); // assuming that first page index is 1
            }

            return result;
        }

        public async Task<List<UlogaKorisnikProjekat>> GetUsersOnProject(int projekatId)
        {
            var korisnici = await _context.ListaUlogaKorisnikProjekat.Where(x => x.idProjekat == projekatId).ToListAsync();

            return korisnici;
        }

        public async Task<List<object>> GetUsersOnProjectLinq(int projekatId)
        {
            var user = await _context.ListaUlogaKorisnikProjekat
                .Where(x => x.idProjekat == projekatId)
                .Join(
                    _context.Korisnici,
                    ukp => ukp.idKorisnik,
                    korisnik => korisnik.id,
                    (ukp,korisnik) => new {UlogaKorisnikProjekat = ukp,Korisnici = korisnik})
                .Where(x => x.Korisnici.status == 1)
                .Join(
                    _context.ListaUlogaProjekat,
                    ukp => ukp.UlogaKorisnikProjekat.idUloga,
                    uloga => uloga.id,
                    (ukp,uloga) => new {UlogaKorisnikProjekat = ukp, Uloge = uloga})
                .ToListAsync();

            var result = user.Select(x => new
            {
                id = x.UlogaKorisnikProjekat.Korisnici.id, //return user id
                ime = x.UlogaKorisnikProjekat.Korisnici.ime,
                prezime = x.UlogaKorisnikProjekat.Korisnici.prezime,
                username = x.UlogaKorisnikProjekat.Korisnici.username,
                email = x.UlogaKorisnikProjekat.Korisnici.email,
                slika = x.UlogaKorisnikProjekat.Korisnici.imageURL,
                uloga = x.Uloge.naziv

            });

            return result.Cast<object>().ToList();
        }

        public async Task<UlogaKorisnikProjekatDto> AddMember(UlogaKorisnikProjekatDto input) 
        {
            _context.ListaUlogaKorisnikProjekat.Add(new UlogaKorisnikProjekat()
            {
                idKorisnik = input.korisnikId,
                idProjekat = input.projekatId,
                idUloga = input.ulogaId,
                status = 1
            });
            
            await _context.SaveChangesAsync();

            return input;
        }

        public string HardcodedProjectRoles(int role_id) 
        {
            string role;
            switch (role_id)
            {
                case 1: role = "owner"; break;
                case 2: role = "maintainer"; break;
                case 3: role = "developer"; break;
                default: role = "guest"; break;
            }
            return role;
        }

        public double ProjectPercentageDone(List<Tuple<int, string>> result)
        {
            int count = result.Count;

            if (count == 0) 
            {
                return 0;
            }

            int closed = result.Where(x => x.Item1 == 0).Count(); // count inactive -> status = 0

            double progress = (100 * closed) / count;

            return Math.Round(progress, 2);
        }

        public double ProjectTimescale(DateTime start, DateTime finish)
        {
            double timescale_percentage = 0;

            if (DateTime.Now <= start)
            {
                timescale_percentage = 0;
            }
            else if (DateTime.Now >= finish)
            {
                timescale_percentage = 100;
            }
            else 
            {
                TimeSpan current_span = DateTime.Now - start;
                TimeSpan total_span = finish - start;

                timescale_percentage = (100 * current_span.TotalSeconds) / total_span.TotalSeconds;
            }

            return Math.Round(timescale_percentage, 2);
        }
    }
}
