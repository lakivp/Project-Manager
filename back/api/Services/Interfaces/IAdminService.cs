using api.Models;
using api.Models.Dtos;

namespace api.Services.Interfaces
{
    public interface IAdminService
    {
        public Task<List<AdminKorisniciDto>> GetAll();

        public Task<List<AdminKorisniciDto>> GetActive();

        public Task<List<AdminKorisniciDto>> GetInActive();

        public string GetUlogaById(int id);

        public Task<Korisnik> ActivateUser(Korisnik korisnik);

        public Task<Korisnik> DeactivateUser(Korisnik korisnik);

        public Task<Korisnik> ChangeRole(Korisnik korisnik);
    }
}
