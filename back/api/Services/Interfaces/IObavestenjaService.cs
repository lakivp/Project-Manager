using api.Models;
using api.Models.Dtos;

namespace api.Services.Interfaces
{
    public interface IObavestenjaService
    {
        public Task<List<Obavestenje>> GetObavestenja();

        public Task<Obavestenje> UpdateObavestenje(Obavestenje obavestenje);

        public Task<Obavestenje> DeleteObavestenje(Obavestenje obavestenje);

        public Task<Obavestenje> AddObavestenje(Obavestenje obavestenje);

        public Task<Obavestenje> GetObavestenjeById(int id);

        public Task<List<Obavestenje>> GetObavestenjaByKorisnikId(int korisnikId);

        public Task<bool> AddUserObavestenje(int idObavestenje, int idKorisnik);
    }
}
