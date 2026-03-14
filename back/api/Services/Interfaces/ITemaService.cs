using api.Models;
using api.Models.Dtos;

namespace api.Services.Interfaces
{
    public interface ITemaService
    {
        public Task<List<Tema>> GetAllThemes();

        public Task<Tema> GetThemeById(int temaId);

        public Task<List<Tema>> GetThemesByKorisnikId(int korisnikId);

        public Task<Tema> UpdateTheme(TemaDto theme);

        public Task<Tema> DeleteTheme(int themeId);

        public Task<Tema> AddTheme(TemaAddDto theme);
    }
}
