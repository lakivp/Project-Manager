using api.Models;
using api.Models.Dtos;
using api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;
using ZstdSharp.Unsafe;

namespace api.Services.Implementation
{
    public class ZavisnostTaskService : IZavisnostTaskService
    {
        private readonly ProjectManagementContext _context;

        public ZavisnostTaskService(ProjectManagementContext context)
        {
            _context = context;
        }

        public async Task<List<ZavisnostTaskTipDto>> GetAll()
        {

            var zavisnost = await (
                from z in _context.listaZavisnostiTaskova
                join t in _context.ListaZavisnostiType on z.type equals t.id
                    select new
                    {
                        Zavisnost = z,
                        Tip = t
                    }).ToListAsync();

            var result = zavisnost.Select(x => new ZavisnostTaskTipDto
            {
                id = x.Zavisnost.id,
                sourceId = x.Zavisnost.sourceId,
                targetId = x.Zavisnost.targetId,
                type = x.Zavisnost.type,
                name = x.Tip.name

            });

            return result.Cast<ZavisnostTaskTipDto>().ToList();
        }

        public async Task<ZavisnostTask> GetZavisnostById(int id)
        {
            var zavisnost = await _context.listaZavisnostiTaskova.FindAsync(id);

            return zavisnost;
        }   

        public async Task<List<ZavisnostTaskTipDto>> GetZavisnostBySourceId(int sourceId)
        {
            var zavisnost = await (
            from z in _context.listaZavisnostiTaskova
            join t in _context.ListaZavisnostiType on z.type equals t.id
            where z.sourceId == sourceId
                select new
                {
                    Zavisnost = z,
                    Tip = t
                }).ToListAsync();

            var result = zavisnost.Select(x => new ZavisnostTaskTipDto
            {
                id = x.Zavisnost.id,
                sourceId = x.Zavisnost.sourceId,
                targetId = x.Zavisnost.targetId,
                type = x.Zavisnost.type,
                name = x.Tip.name

            });

            return result.Cast<ZavisnostTaskTipDto>().ToList();
        }

        public async Task<List<ZavisnostTaskTipDto>> GetZavisnostByTargetId(int targetId)
        {
            var zavisnost = await (
            from z in _context.listaZavisnostiTaskova
            join t in _context.ListaZavisnostiType on z.type equals t.id
            where z.targetId == targetId
                select new
                {
                    Zavisnost = z,
                    Tip = t
                }).ToListAsync();

            var result = zavisnost.Select(x => new ZavisnostTaskTipDto
            {
                id = x.Zavisnost.id,
                sourceId = x.Zavisnost.sourceId,
                targetId = x.Zavisnost.targetId,
                type = x.Zavisnost.type,
                name = x.Tip.name

            });

            return result.Cast<ZavisnostTaskTipDto>().ToList();
        }

        public async Task<ZavisnostTask> AddZavisnost(ZavisnostTaskDto zavisnostZahtev)
        {
            var zavisnost = new ZavisnostTask();

            zavisnost.sourceId = zavisnostZahtev.sourceId;
            zavisnost.targetId = zavisnostZahtev.targetId;
            zavisnost.type = zavisnostZahtev.type;

            foreach(var z in _context.listaZavisnostiTaskova)
            {
                if((z.sourceId == zavisnostZahtev.sourceId && z.targetId == zavisnostZahtev.targetId) || zavisnostZahtev.targetId == zavisnostZahtev.sourceId || (z.sourceId == zavisnostZahtev.targetId && z.targetId == zavisnostZahtev.sourceId))
                {
                    return null;
                }
            }

            await _context.listaZavisnostiTaskova.AddAsync(zavisnost);

            await _context.SaveChangesAsync();

            return zavisnost;
        }

        public async Task<ZavisnostTask> UpdateZavisnost(ZavisnostTaskUpdateDto zavisnostZahtev)
        {
            var zavisnost = await _context.listaZavisnostiTaskova.FindAsync(zavisnostZahtev.id);

            zavisnost.sourceId = zavisnostZahtev.sourceId;
            zavisnost.targetId = zavisnostZahtev.targetId;
            zavisnost.type = zavisnostZahtev.type;

            _context.listaZavisnostiTaskova.Update(zavisnost);
            await _context.SaveChangesAsync();

            return zavisnost;
        }

        public async Task<ZavisnostTask> DeleteZavisnost(int id)
        {
            var zavisnost = await _context.listaZavisnostiTaskova.FindAsync(id);

            _context.listaZavisnostiTaskova.Remove(zavisnost);
            await _context.SaveChangesAsync();

            return zavisnost;
        }
    }
}
