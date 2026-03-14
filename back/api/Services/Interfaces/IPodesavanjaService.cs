using api.Models;
using api.Models.Dtos;

namespace api.Services.Interfaces
{
    public interface IPodesavanjaService
    {
        public Task<List<Podesavanja>> GetAllSettings();

        public Task<Podesavanja> GetSettingsById(int id);

        public Task<List<Podesavanja>> GetSettingsByKorisnikId(int korisnikId);

        public Task<Podesavanja> AddDefaultSettings(int korisnikId);

        public Task<Podesavanja> UpdateSettings(PodesavanjaDto podesavanja);

        public Task<Podesavanja> DeleteSettings(int id);
    }
}
