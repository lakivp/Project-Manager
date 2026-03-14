using api.Models;
using api.Models.Dtos;

namespace api.Services.Interfaces
{
    public interface IProjekatService
    {
        Task<List<Projekat>> GetAllProjekti();
        Task<Projekat> GetProjekatById(int id);
        Task<Projekat> AddProjekat(Projekat projekat);
        Task<Projekat> UpdateProjekat(Projekat projekat);
        Task<Projekat> DeleteProjekat(int id);

        Task<Projekat> CloseProjekat(Projekat projekat);
        Task<List<UlogaKorisnikProjekat>> GetProjektiByKorisnikId(int korisnikId);
        Task<List<ProjekatKorisnikDto>> GetProjektiByKorisnikIdLinq(int korisnikId);
        Task<List<DashboardProjekatDto>> GetDashboardTableFiltered(FilterProjectDto filter);
        Task<List<UlogaKorisnikProjekat>> GetUsersOnProject(int projekatId);
        Task<List<object>> GetUsersOnProjectLinq(int projekatId);
        Task<UlogaKorisnikProjekatDto> AddMember(UlogaKorisnikProjekatDto input);
        Task<bool> RemoveMember(int project_id, int user_id);
    }
}
