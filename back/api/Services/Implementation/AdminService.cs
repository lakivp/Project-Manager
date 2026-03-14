using api.Models;
using api.Models.Dtos;
using api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;

namespace api.Services.Implementation
{
    public class AdminService : IAdminService
    {
        private readonly ProjectManagementContext _context;

        public AdminService(ProjectManagementContext context)
        {
            _context = context;
        }

        public string GetUlogaById(int id)
        {
            var uloge = _context.ListaUlogeAplikacija.ToList();

            foreach(var u in uloge)
            {
                if(u.id == id)
                {
                    return u.naziv; 
                }
            }

            return "Nema ulogu";
        }

        public async Task<List<AdminKorisniciDto>> GetAll()
        {
            var postojeciKorisnici = await _context.Korisnici.Where(id => id.idUlogeAplikacija != 1).ToListAsync();
            List<AdminKorisniciDto> korisnici = new List<AdminKorisniciDto>(); 
            foreach(var k in postojeciKorisnici)
            {
                AdminKorisniciDto korisnik = new AdminKorisniciDto();

                korisnik.id = k.id;
                korisnik.ime = k.ime;
                korisnik.prezime = k.prezime;
                korisnik.username = k.username;
                korisnik.status = k.status;
                korisnik.ulogaNaziv = GetUlogaById(k.idUlogeAplikacija);
                korisnik.profilnaSlika = k.imageURL;

                korisnici.Add(korisnik);
            }

            return korisnici;
        }

        public async Task<List<AdminKorisniciDto>> GetActive()
        {
            var postojeciKorisnici = await _context.Korisnici.Where(id => id.idUlogeAplikacija != 1 && id.status == 1).ToListAsync();
            List<AdminKorisniciDto> korisnici = new List<AdminKorisniciDto>();
            foreach (var k in postojeciKorisnici)
            {
                AdminKorisniciDto korisnik = new AdminKorisniciDto();

                korisnik.id = k.id;
                korisnik.ime = k.ime;
                korisnik.prezime = k.prezime;
                korisnik.username = k.username;
                korisnik.status = k.status;
                korisnik.ulogaNaziv = GetUlogaById(k.idUlogeAplikacija);
                korisnik.profilnaSlika = k.imageURL;

                korisnici.Add(korisnik);
            }

            return korisnici;
        }

        public async Task<List<AdminKorisniciDto>> GetInActive()
        {
            var postojeciKorisnici = await _context.Korisnici.Where(id => id.idUlogeAplikacija != 1 && id.status == 0).ToListAsync();
            List<AdminKorisniciDto> korisnici = new List<AdminKorisniciDto>();
            foreach (var k in postojeciKorisnici)
            {
                AdminKorisniciDto korisnik = new AdminKorisniciDto();

                korisnik.id = k.id;
                korisnik.ime = k.ime;
                korisnik.prezime = k.prezime;
                korisnik.username = k.username;
                korisnik.status = k.status;
                korisnik.ulogaNaziv = GetUlogaById(k.idUlogeAplikacija);
                korisnik.profilnaSlika = k.imageURL;

                korisnici.Add(korisnik);
            }

            return korisnici;
        }

        public async Task<Korisnik> ActivateUser(Korisnik korisnik)
        {
            _context.Korisnici.Update(korisnik);

            await _context.SaveChangesAsync();

            return korisnik;

        }

        public async Task<Korisnik> DeactivateUser(Korisnik korisnik)
        {
            _context.Korisnici.Update(korisnik);

            await _context.SaveChangesAsync();

            return korisnik;
        }

        public async Task<Korisnik> ChangeRole(Korisnik korisnik)
        {
            _context.Korisnici.Update(korisnik);
            await _context.SaveChangesAsync();

            return korisnik;
        }
    }
}
