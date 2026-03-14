using api.Models;
using api.Models.Dtos;
using api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace api.Services.Implementation
{
    public class TemaService : ITemaService
    {
        private readonly ProjectManagementContext _context;

        public TemaService(ProjectManagementContext context)
        {
            _context = context;
        }

        public async Task<List<Tema>> GetAllThemes()
        {
            var teme = await _context.ListaTema.ToListAsync();

            return teme;
        }

        public async Task<Tema> GetThemeById(int temaId)
        {
            var tema = await _context.ListaTema.FindAsync(temaId);

            return tema;
        }

        public async Task<List<Tema>> GetThemesByKorisnikId(int korisnikId)
        {
            var teme = await _context.ListaTema.Where(x => x.korisnikId == null || x.korisnikId == korisnikId).ToListAsync();

            return teme;
        }

        public async Task<Tema> AddTheme(TemaAddDto temaZahtev)
        {
            var tema = new Tema();

            tema.naziv = temaZahtev.naziv;
            tema.outer = temaZahtev.outer;
            tema.inner = temaZahtev.inner;
            tema.navBar = temaZahtev.navBar;
            tema.korisnikId = temaZahtev.korisnikId;

            _context.ListaTema.Add(tema);
            await _context.SaveChangesAsync();

            return tema;

        }

        public async Task<Tema> UpdateTheme(TemaDto temaZahtev)
        {
            var tema = await _context.ListaTema.FindAsync(temaZahtev.id);

            if (tema == null || tema.korisnikId == null) // if(temaZahtev.id <= 2) // <- ne moze ovako
            {
                return null;
            }

            tema.naziv = temaZahtev.naziv;
            tema.outer = temaZahtev.outer;
            tema.inner = temaZahtev.inner;
            tema.navBar = temaZahtev.navBar;

            _context.ListaTema.Update(tema);
            await _context.SaveChangesAsync();

            return tema;
        }

        public async Task<Tema> DeleteTheme(int temaId)
        {
            var tema = await _context.ListaTema.FindAsync(temaId);

            if (tema == null || tema.korisnikId == null)
            {
                return null;
            }

            _context.ListaTema.Remove(tema);
            await _context.SaveChangesAsync();

            return tema;
        }
    }
}
