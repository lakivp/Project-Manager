using api.Models.Dtos;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ZavisnostTaskController : ControllerBase
    {
        private readonly IZavisnostTaskService _zavisnost_service;

        public ZavisnostTaskController(IZavisnostTaskService zavisnost_service)
        {
            _zavisnost_service = zavisnost_service;
        }

        [HttpGet("GetAll")]

        public async Task<IActionResult> GetAll()
        {
            var zavisnosti = await _zavisnost_service.GetAll();

            if(zavisnosti  == null)
            {
                return NotFound();
            }

            return Ok(zavisnosti);
        }

        [HttpGet("GetBySourceId{id}")]

        public async Task<IActionResult> GetBySourceId(int id)
        {
            var zavisnosti = await _zavisnost_service.GetZavisnostBySourceId(id);

            if(zavisnosti.IsNullOrEmpty()) 
            {
                return NotFound("Ni jedan task ne zavisi od tog taska");
            }

            return Ok(zavisnosti);
        }

        [HttpGet("GetByTargetId{id}")]

        public async Task<IActionResult> GetByTargetId(int id)
        {
            var zavisnosti = await _zavisnost_service.GetZavisnostByTargetId(id);

            if(zavisnosti.IsNullOrEmpty())
            {
                return NotFound("Taj task ne zavisi ni od jednog drugog taska");
            }

            return Ok(zavisnosti);
        }

        [HttpPost("Add")]

        public async Task<IActionResult> AddZavisnost(ZavisnostTaskDto zavisnostZahtev)
        {
            var zavisnost = await _zavisnost_service.AddZavisnost(zavisnostZahtev);

            return Ok(zavisnost);
        }

        [HttpPut("Update")]

        public async Task<IActionResult> UpdateZavisnost(ZavisnostTaskUpdateDto zavisnostZahtev)
        {
            var postojecaZavisnost = await _zavisnost_service.GetZavisnostById(zavisnostZahtev.id);

            if(postojecaZavisnost == null)
            {
                return NotFound("Zavisnost ne postoji");
            }

            await _zavisnost_service.UpdateZavisnost(zavisnostZahtev);

            return Ok(postojecaZavisnost);
            
        }

        [HttpDelete("Delete{id}")]

        public async Task<IActionResult> Delete(int id)
        {
            var postojecaZavisnost = await _zavisnost_service.GetZavisnostById(id);

            if(postojecaZavisnost == null)
            {
                return NotFound("Zavisnost ne postoji");
            }

            await _zavisnost_service.DeleteZavisnost(id);

            return Ok(postojecaZavisnost);
        }
    }
}
