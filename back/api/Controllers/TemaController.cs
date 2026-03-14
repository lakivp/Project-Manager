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
    public class TemaController : ControllerBase
    {
        private readonly ITemaService _tema_service;

        public TemaController(ITemaService tema_service)
        {
            _tema_service = tema_service;
        }

        [HttpGet("GetAllThemes")]

        public async Task<IActionResult> GetAllThemes()
        {
            var teme = await _tema_service.GetAllThemes();

            if(teme == null)
            {
                return BadRequest();
            }

            return Ok(teme);
        }

        [HttpGet("GetThemeById{id}")]

        public async Task<IActionResult> GetThemeById(int id)
        {
            var tema = await _tema_service.GetThemeById(id);

            if(tema == null)
            {
                return NotFound("Tema ne postoji");
            }

            return Ok(tema);
        }

        [HttpGet("GetThemesByKorisnikId{korisnikId}")]

        public async Task<IActionResult> GetThemesByKorisnikId(int korisnikId)
        {
            var teme = await _tema_service.GetThemesByKorisnikId(korisnikId);

            if(teme == null)
            {
                return BadRequest();
            }
            
            return Ok(teme);
        }

        [HttpPost("AddTheme")]

        public async Task<IActionResult> AddTheme(TemaAddDto temaZahtev)
        {
            var tema = await _tema_service.AddTheme(temaZahtev);

            return Ok(tema);
        }

        [HttpPut("UpdateTheme")]

        public async Task<IActionResult> UpdateTheme(TemaDto temaZahtev)
        {
            var tema = await _tema_service.GetThemeById(temaZahtev.id);

            if(tema == null)
            {
                return NotFound("Tema ne postoji");
            }

            await _tema_service.UpdateTheme(temaZahtev);

            return Ok(tema);
        }

        [HttpDelete("DeleteTheme{id}")]

        public async Task<IActionResult> DeleteTheme(int id)
        {
            var tema = await _tema_service.GetThemeById(id);

            if(tema == null)
            {
                return NotFound("Tema ne postoji");
            }

            await _tema_service.DeleteTheme(id);

            return Ok(tema);
        }
    }
}
