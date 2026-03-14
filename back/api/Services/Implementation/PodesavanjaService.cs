using api.Models;
using api.Models.Dtos;
using api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using ZstdSharp.Unsafe;

namespace api.Services.Implementation
{
    public class PodesavanjaService : IPodesavanjaService
    {
        private readonly ProjectManagementContext _context;

        public PodesavanjaService(ProjectManagementContext context)
        {
            _context = context;
        }

        public async Task<List<Podesavanja>> GetAllSettings()
        {
            var podesavanja = await _context.ListaPodesavanja.ToListAsync();

            return podesavanja;
        }

        public async Task<Podesavanja> GetSettingsById(int id)
        {
            var podesavanje = await _context.ListaPodesavanja.FindAsync(id);

            return podesavanje;
        }

        public async Task<List<Podesavanja>> GetSettingsByKorisnikId(int korisnikId)
        {
            var podesavanja = await _context.ListaPodesavanja.Where(x => x.korisnikId == korisnikId).ToListAsync();

            return podesavanja;
        }

        public async Task<Podesavanja> AddDefaultSettings(int korisnikId)
        {
            var podesavanje = new Podesavanja();

            podesavanje.korisnikId = korisnikId;
            podesavanje.jezik = "english";
            podesavanje.notifikacija = true;
            podesavanje.status = "Active";
            podesavanje.homeHK = "w";
            podesavanje.profileHK = "a";
            podesavanje.tasksHK = "s";
            podesavanje.settingsHK = "d";
            podesavanje.logoutHK = "x";
            podesavanje.temaId = 1;

            _context.ListaPodesavanja.Add(podesavanje);
            await _context.SaveChangesAsync();

            return podesavanje;
        }

        public async Task<Podesavanja> UpdateSettings(PodesavanjaDto podesavanjeZahtev)
        {
            var podesavanje = await _context.ListaPodesavanja.FindAsync(podesavanjeZahtev.id);

            podesavanje.jezik = podesavanjeZahtev.jezik;
            podesavanje.notifikacija = podesavanjeZahtev.notifikacija;
            podesavanje.status = podesavanjeZahtev.status;
            podesavanje.homeHK = podesavanjeZahtev.homeHK;
            podesavanje.profileHK = podesavanjeZahtev.profileHK;
            podesavanje.tasksHK = podesavanjeZahtev.tasksHK;
            podesavanje.settingsHK = podesavanjeZahtev.settingsHK;
            podesavanje.logoutHK = podesavanjeZahtev.logoutHK;
            podesavanje.temaId = podesavanjeZahtev.temaId;

            _context.ListaPodesavanja.Update(podesavanje);
            await _context.SaveChangesAsync();

            return podesavanje;
        }

        public async Task<Podesavanja> DeleteSettings(int id)
        {
            var podesavanje = await _context.ListaPodesavanja.FindAsync(id);

            _context.ListaPodesavanja.Remove(podesavanje);
            await _context.SaveChangesAsync();

            return podesavanje;
        }

    }
}
