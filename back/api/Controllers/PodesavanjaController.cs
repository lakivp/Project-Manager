using api.Models.Dtos;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PodesavanjaController : ControllerBase
    {
        private readonly IPodesavanjaService _podesavanja_service;

        public PodesavanjaController(IPodesavanjaService podesavanja_service)
        {
            _podesavanja_service = podesavanja_service;
        }

        [HttpGet("GetAllSettings")]

        public async Task<IActionResult> GetAllSettings()
        {
            var podesavanja = await _podesavanja_service.GetAllSettings();

            if(podesavanja == null)
            {
                return BadRequest();
            }

            return Ok(podesavanja);
        }

        [HttpGet("GetSettingsById{id}")]

        public async Task<IActionResult> GetSettingsById(int id)
        {
            var podesavanje = await _podesavanja_service.GetSettingsById(id);

            if(podesavanje == null)
            {
                return NotFound("Podesavanje ne postoji");
            }

            return Ok(podesavanje);
        }

        [HttpGet("GetSettingsByKorisnikId{korisnikId}")]

        public async Task<IActionResult> GetSettingsByKorisnikId(int korisnikId)
        {
            var podesavanje = await _podesavanja_service.GetSettingsByKorisnikId(korisnikId);

            if(podesavanje == null)
            {
                return NotFound("Podesavanje ne postoji");
            }

            return Ok(podesavanje);
        }

        [HttpPut("UpdateSettings")]

        public async Task<IActionResult> UpdateSettings(PodesavanjaDto podesavanjeZahtev)
        {
            var podesavanje = await _podesavanja_service.GetSettingsById(podesavanjeZahtev.id);

            if(podesavanje == null)
            {
                return NotFound("Podesavanje ne postoji");
            }

            await _podesavanja_service.UpdateSettings(podesavanjeZahtev);

            return Ok(podesavanje);
        }

        [HttpDelete("DeleteSettings")]

        public async Task<IActionResult> DeleteSettings(int id)
        {
            var podesavanje = await _podesavanja_service.GetSettingsById(id);

            if(podesavanje == null)
            {
                return NotFound("Podesavanje ne postoji");
            }

            await _podesavanja_service.DeleteSettings(id);

            return Ok(podesavanje);
        }
    }
}
