using api.Models;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly IFileService _file_service;
        private readonly IKorisnikService _korisnik_service;

        public ImageController(IFileService file_service, IKorisnikService korisnik_service)
        {
            _file_service = file_service;
            _korisnik_service = korisnik_service;
        }

        [HttpGet("user/{username}/image")]
        public async Task<ActionResult> GetUserImage(string username)
        {
            var user = await _korisnik_service.GetKorisnikByUsername(username);

            if (user == null)
            {
                return NotFound("User or image not found");
            }

            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "../") + user.imageURL;
            var imageBytes = await System.IO.File.ReadAllBytesAsync(imagePath);


            return Ok(File(imageBytes, "image/png"));
        }
    }
}
