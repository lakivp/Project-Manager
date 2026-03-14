using api.Models;
using api.Models.Dtos;
using api.Services.Implementation;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MimeKit.Cryptography;

namespace api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ObavestenjeController : ControllerBase
    {

        private readonly IObavestenjaService _obavestenje_service;

        public ObavestenjeController(IObavestenjaService obavestenje_service)
        {
            _obavestenje_service = obavestenje_service;
        }

        [HttpGet("GetAll")]

        public async Task<IActionResult> GetAll()
        {
            return Ok(await _obavestenje_service.GetObavestenja());
        }

        [HttpPut("Update")]

        public async Task<IActionResult> Update(ObavestenjeDto obavestenje)
        {
            var postojeceObavestenje = await _obavestenje_service.GetObavestenjeById(obavestenje.id);

            if(postojeceObavestenje == null)
            {
                return BadRequest("Obavestenje ne postoji");
            }

            if (obavestenje.text != "" && obavestenje.text != null)
                postojeceObavestenje.text = obavestenje.text;

            await _obavestenje_service.UpdateObavestenje(postojeceObavestenje);

            return Ok(postojeceObavestenje);
        }

        [HttpDelete("Delete")]

        public async Task<IActionResult> Delete(int id)
        {
            var obavestenje = await _obavestenje_service.GetObavestenjeById(id);

            if(obavestenje == null)
            {
                return NoContent();
            }

            await _obavestenje_service.DeleteObavestenje(obavestenje);

            return Ok(obavestenje);
        }

        [HttpPost("Add")]

        public async Task<IActionResult> Add(Obavestenje obavestenje)
        {
            await _obavestenje_service.AddObavestenje(obavestenje);

            return Ok(obavestenje);
        }

        [HttpGet("GetObavestenjaByKorisnikId{id}")]

        public async Task<IActionResult> GetObavestenjaByKorisnik(int id)
        {
            var obavestenja = await _obavestenje_service.GetObavestenjaByKorisnikId(id);

            return Ok(obavestenja);
        }

        [HttpPut("MarkAsRead")]

        public async Task<IActionResult> UpdateReadStatus(int id)
        {
            var obavestenje = await _obavestenje_service.GetObavestenjeById(id);

            if(obavestenje == null)
            {
                return NoContent();
            }

            obavestenje.isRead = 1;

            await _obavestenje_service.UpdateObavestenje(obavestenje);

            return Ok(obavestenje);
        }
    }
}
