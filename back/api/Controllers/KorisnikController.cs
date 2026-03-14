using api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Models.Dtos;
using api.Services.Implementation;
using System.Text.Json;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class KorisnikController : ControllerBase
    {
        public static Korisnik korisnik = new Korisnik();  
        private readonly IKorisnikService _korisnik_service;
        private readonly ProjectManagementContext _context;
        private readonly IFileService _file_service;
        private readonly IPodesavanjaService _podesavanja_service;
        private readonly IHubContext<NotificationHub, INotificationClient> _notification_service;
        public KorisnikController(IKorisnikService korisnik_service, IConfiguration configuration, ProjectManagementContext context, IFileService file_service, IPodesavanjaService podesavanja_service, IHubContext<NotificationHub, INotificationClient> notificationService)
        {
            _korisnik_service = korisnik_service;
            _context = context;
            _file_service = file_service;
            _podesavanja_service = podesavanja_service;
            _notification_service = notificationService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _korisnik_service.GetAllKorisnici());
        }

        [HttpGet("GetActive")]

        public async Task<IActionResult> GetAllActive()
        {
            var aktivniKorisnici = await _korisnik_service.GetActiveKorisnici();

            return Ok(aktivniKorisnici);
        }

        [HttpGet("GetInActive")]

        public async Task<IActionResult> GetAllInActive()
        {
            var neaktivniKorisnici = await _korisnik_service.GetInActiveKorisnici();

            return Ok(neaktivniKorisnici);
        }

        [HttpGet("Get{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _korisnik_service.GetKorisnikById(id));
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add(KorisnikDto k)
        {
            byte[] hash;
            byte[] salt;

            Korisnik korisnik = new Korisnik();
            var postojeciKorisnik = await _korisnik_service.GetKorisnikByUsername(k.username);
            var postojeciKorisnik2 = await _korisnik_service.GetKorisnikByEmail(k.email);

            if (postojeciKorisnik != null)
            {
                return BadRequest("Korisnik sa tim korisnickim imenom vec postoji");
            }

            if (postojeciKorisnik2 != null)
            {
                return BadRequest("Nalog sa tim Emailom vec postoji");
            }

            _korisnik_service.CreatePasswordHash(k.password,out hash,out salt);

            korisnik.ime = k.ime;
            korisnik.prezime = k.prezime;
            korisnik.username = k.username;
            korisnik.email = k.email;
            korisnik.idUlogeAplikacija = k.idUlogeAplikacija;
            korisnik.status = k.status;
            korisnik.passwordHash = hash;
            korisnik.passwordSalt = salt;
            korisnik.imageURL = "Uploads/default.png";
            korisnik.specijalizacija = null;
            korisnik.opis = k.opis;
            korisnik.phoneNumber = k.phoneNumber;
            await _korisnik_service.AddKorisnik(korisnik);
            await _podesavanja_service.AddDefaultSettings(korisnik.id);

            return Ok(korisnik);
        }

        /*[HttpPost("login")]

        public async Task<ActionResult<string>> Login(KorisnikDto k)
        {
            var korisnik = await _korisnik_service.GetKorisnikByUsername(k.username);

            if(korisnik == null || korisnik.status == 0)
            {
                return BadRequest("User not found.");
            }

            if(!_korisnik_service.VerifyPasswordHash(k.password,korisnik.passwordHash,korisnik.passwordSalt))
            {
                return BadRequest("Wrong password.");
            }

            string token = _korisnik_service.CreateToken(korisnik);
                 
            return Ok(token);
        }*/

        [HttpPut("UpdateInfo")]
        public async Task<IActionResult> Update(KorisnikUpdateDto k)
        {
            try
            {
                var existingKorisnik = await _korisnik_service.GetKorisnikById(k.id);

                if (existingKorisnik == null)
                {
                    return NotFound($"Korisnik {k.id} not found");
                }

                if (k.ime != "" && k.ime != null)
                    existingKorisnik.ime = k.ime;

                if (k.prezime != "" && k.prezime != null)
                    existingKorisnik.prezime = k.prezime;

                if (k.email != "" && k.email != null)
                    existingKorisnik.email = k.email;

                if (k.username != existingKorisnik.username && k.username != "" && k.username != null) 
                {
                    var existing_username = await _korisnik_service.GetKorisnikByUsername(k.username);

                    if (existing_username != null)
                    {
                        return NotFound($"Username {k.username} already exists");
                    }
                    else
                        existingKorisnik.username = k.username;
                }

                if(k.phoneNumber != "" && k.phoneNumber != null)
                {
                    existingKorisnik.phoneNumber = k.phoneNumber;
                }

                if(k.opis != "" && k.opis != null)
                {
                    existingKorisnik.opis = k.opis;
                }

                if(k.specijalizacija != "")
                {
                    existingKorisnik.specijalizacija = k.specijalizacija;
                }



                await _korisnik_service.UpdateKorisnik(existingKorisnik);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("Delete{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var existingKorisnik = await _korisnik_service.GetKorisnikById(id);

                if (existingKorisnik == null)
                {
                    return NotFound($"Korisnik {id} not found");
                }
                existingKorisnik.status = 0;

                await _korisnik_service.UpdateKorisnik(existingKorisnik);
                if (!NotificationHub.UserConnections.ContainsKey(existingKorisnik.username))
                {
                    Console.WriteLine($"Korisnik {existingKorisnik.username} nije povezan");
                    return Ok();
                }

                foreach (var k in NotificationHub.UserConnections[existingKorisnik.username])
                {
                    Console.WriteLine(k.ToString());
                    await _notification_service.Clients.Client(k).ReceiveNotification($"Vas nalog {existingKorisnik.username} je ugasen");
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("upload-profile-image/{id}")]
        /*public async Task<IActionResult> UploadProfileImage(IFormFile file, int id)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("Fajl ne postoji");
                }
                if (file.Length > (10 * 1024 * 1024))
                {
                    return BadRequest("Fajl je veci od 10MB");
                }
                if (!file.ContentType.StartsWith("image"))
                {
                    return BadRequest("Fajl nije slika");
                }

                using (var client = new HttpClient())
                {
                    var formData = new MultipartFormDataContent();
                    formData.Add(new StreamContent(file.OpenReadStream()), "image", file.FileName);

                    var response = await client.PostAsync("https://api.imgbb.com/1/upload?key=a290e65980c231d812c5c3c17dc66784", formData);

                    if (response.IsSuccessStatusCode)
                    {
                        var json = await response.Content.ReadAsStringAsync();
                        var result = JsonSerializer.Deserialize<ImgbbResponse>(json);

                        var user = await _context.Korisnici.FindAsync(id);
                        if (user != null)
                        {
                            user.imageURL = result.data.display_url;
                            await _context.SaveChangesAsync();
                        }

                        return Ok(result);
                    }
                    else
                    {
                        return StatusCode((int)response.StatusCode, "Slika nije aploadovana");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error uploading image: {ex.Message}");
            }
        }*/

        public async Task<IActionResult> UploadUserImage(int id, IFormFile imageFile)
        {

            if (imageFile == null)
            {
                return BadRequest("Invalid image file");
            }

            var imageUrl = await _file_service.SaveImage(imageFile);
            var Folder = "Uploads";
            var path = Path.Combine(Folder, imageUrl.Item2);


            if (imageUrl == null)
            {
                return BadRequest();
            }

            var user = await _korisnik_service.GetKorisnikById(id);

            if (!Path.Equals(user.imageURL, @"Uploads/default.png"))
            {
                var imagePath = Path.Combine("../", user.imageURL);
                System.IO.File.Delete(imagePath);
            }

            await _korisnik_service.UpdateUserProfilePhoto(user.username, path);
            return Ok(new { imageUrl = imageUrl });
        }

        [HttpDelete("user/{id}/image")]

        public async Task<IActionResult> DeleteUserImage(int id)
        {
            var user = await _korisnik_service.GetKorisnikById(id);

            if (user == null)
            {
                return NotFound();
            }

            var imagePath = Path.Combine("../", user.imageURL);

            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }

            await _korisnik_service.UpdateUserProfilePhoto(user.username, @"Uploads/default.png");

            return Ok(new { message = "Slika je uspesno obrisana" });

        }

        [HttpPost("ResetPassword")]

        public async Task<IActionResult> ResetPasswordForgotPassword(Guid resetToken, string newPassword, string confirmNewPassword)
        {
            try
            {
                var userPasswordToken = await _context.ListaUserResetToken.FirstOrDefaultAsync(x => x.token == resetToken);

                if (userPasswordToken == null)
                {
                    return BadRequest("Nevalidan token za resetovanje šifre.");
                }

                var user = await _context.Korisnici.FindAsync(userPasswordToken.userId);

                if (user == null)
                {
                    return BadRequest("Korisnik nije pronađen.");
                }
                if (newPassword != confirmNewPassword)
                {
                    return BadRequest("Nova šifra i potvrda nove šifre se ne poklapaju.");
                }

                using (var hmac = new HMACSHA512(user.passwordSalt))
                {
                    user.passwordSalt = hmac.Key;
                    var newPasswordBytes = Encoding.UTF8.GetBytes(newPassword);
                    var computedHash = hmac.ComputeHash(newPasswordBytes);

                    user.passwordHash = computedHash;

                    _context.ListaUserResetToken.Remove(userPasswordToken);

                    await _context.SaveChangesAsync();

                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest($"Greška prilikom resetovanja šifre: {e.Message}");
            }
        }

        [HttpGet("IsUserActive{id}")]

        public async Task<IActionResult> IsUserActive(int id)
        {
            var korisnik = await _korisnik_service.GetKorisnikById(id);

            if (korisnik == null)
            {
                return NotFound("Korisnik ne postoji");
            }

            if (korisnik.status == 1)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        public class ImgbbResponse
        {
            public ImgbbData data { get; set; }
        }

        public class ImgbbData
        {
            public string display_url { get; set; }
        }
    }
}
