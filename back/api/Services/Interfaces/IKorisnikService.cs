using api.Models;
using api.Models.Dtos;

namespace api.Services.Interfaces
{
    public interface IKorisnikService
    {
        Task<List<Korisnik>> GetAllKorisnici();

        Task<Korisnik> GetKorisnikById(int id);

        Task<Korisnik> AddKorisnik(Korisnik k);

        Task<Korisnik> UpdateKorisnik(Korisnik k);

        Task<Korisnik> DeleteKorisnik(Korisnik k);

        Task<List<Korisnik>> GetActiveKorisnici();

        Task<List<Korisnik>> GetInActiveKorisnici();

        Task<Korisnik> GetKorisnikByUsername(string username);

        Task<Korisnik> GetKorisnikByEmail(string email);

        Task<Korisnik> UpdateUserProfilePhoto(string username, string photo);

        void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt);
        bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt);

        string CreateToken(Korisnik korisnik);

        string GetRoleByid(Korisnik korisnik);
    }
}
