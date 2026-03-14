using api.Models;
using api.Models.Dtos;

namespace api.Services.Interfaces
{
    public interface IZavisnostTaskService
    {
        public Task<List<ZavisnostTaskTipDto>> GetAll();

        public Task<ZavisnostTask> GetZavisnostById(int id);

        public Task<List<ZavisnostTaskTipDto>> GetZavisnostBySourceId(int sourceId);

        public Task<List<ZavisnostTaskTipDto>> GetZavisnostByTargetId(int targetId);

        public Task<ZavisnostTask> AddZavisnost(ZavisnostTaskDto zavisnostZahtev);

        public Task<ZavisnostTask> UpdateZavisnost(ZavisnostTaskUpdateDto zavisnostZahtev);

        public Task<ZavisnostTask> DeleteZavisnost(int id);
    }
}
