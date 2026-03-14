using api.Models;
using api.Models.Dtos;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace api.Services.Implementation
{
    public class ObavestenjaService : IObavestenjaService
    {
        private readonly ProjectManagementContext _context;

        public ObavestenjaService(ProjectManagementContext context)
        {
            _context = context;
        }

        public async Task<List<Obavestenje>> GetObavestenja()
        {
            var obavestenja = await _context.Obavestenja.ToListAsync();

            return obavestenja;
        }

        public async Task<Obavestenje> UpdateObavestenje(Obavestenje obavestenje)
        {
            _context.Obavestenja.Update(obavestenje);

            await _context.SaveChangesAsync();

            return obavestenje;
        }

        public async Task<Obavestenje> DeleteObavestenje(Obavestenje obavestenje)
        {
            _context.Obavestenja.Remove(obavestenje);

            await _context.SaveChangesAsync();

            return obavestenje;
        }

        public async Task<Obavestenje> AddObavestenje(Obavestenje obavestenje)
        {
            if(obavestenje.text == "")
            {
                return null;
            }

            obavestenje.dateCreated = DateTime.Now;

            _context.Obavestenja.Add(obavestenje);

            await _context.SaveChangesAsync();

            return obavestenje;
        }

        public async Task<Obavestenje> GetObavestenjeById(int id)
        {
            var obavestenje = await _context.Obavestenja.FindAsync(id);

            return obavestenje;
        }

        public async Task<List<Obavestenje>> GetObavestenjaByKorisnikId(int korisnikId)
        {
            var result = await (
                from medjutabela in _context.ListaObavestenjeKorisnik
                from obavestenja in _context.Obavestenja
                    .Where(obavestenja => obavestenja.id == medjutabela.idObavestenje && medjutabela.idKorisnik == korisnikId)

                select new Obavestenje()
                {
                    id = obavestenja.id,

                    text = obavestenja.text,

                    isRead = obavestenja.isRead,

                    dateCreated = obavestenja.dateCreated
                }

            ).ToListAsync();

            return result;
        }

        public async Task<bool> AddUserObavestenje(int obavestenjeId, int korisnikId)
        {
            var medjutable = _context.ListaObavestenjeKorisnik.Add(new ObavestenjeKorisnik()
            {
                idKorisnik = korisnikId,
                idObavestenje = obavestenjeId
            });

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
