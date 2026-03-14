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
    public class KomentarController : ControllerBase
    {
        private readonly IKomentarService _komentar_service;

        public KomentarController(IKomentarService komentar_service)
        {
            _komentar_service = komentar_service;
        }

        [HttpGet("GetAllComments")]

        public async Task<IActionResult> GetAllComments()
        {
            var komentari = await _komentar_service.GetAllComments();

            if(komentari == null)
            {
                return BadRequest();
            }

            return Ok(komentari);
        }

        [HttpGet("GetCommentById{id}")]

        public async Task<IActionResult> GetCommentById(int id)
        {
            var komentar = await _komentar_service.GetCommentById(id);

            if(komentar == null)
            {
                return NotFound("Komentar sa tim id ne postoji");
            }

            return Ok(komentar);
        }


        [HttpGet("GetCommentsByAuthorId{id}")]

        public async Task<IActionResult> GetCommentsByAuthorId(int id)
        {
            var komentari = await _komentar_service.GetCommentsByAuthorId(id);

            if(komentari == null)
            {
                return NotFound("Nije pronadjen nijedan komentar za ovog korisnika");
            }

            return Ok(komentari);
        }

        [HttpGet("GetCommentsByTaskId")]

        public async Task<IActionResult> GetCommentsByTaskId(int taskId, int userId)
        {
            //var komentari = await _komentar_service.GetCommentsByTaskId(taskId);
            var komentari = await _komentar_service.GetCommentsByTaskIdWithLikes(taskId, userId);

            if(komentari == null)
            {
                return NotFound("Ne postoje komentari na ovom tasku");
            }

            return Ok(komentari);
        }

        [HttpGet("GetRepliesOnComment")]

        public async Task<IActionResult> GetRepliesOnComment(int parentId, int userId)
        {
            //var komentari = await _komentar_service.GetRepliesOnComment(parentId);
            var komentari = await _komentar_service.GetRepliesOnCommentWithLikes(parentId, userId);

            if(komentari == null)
            {
                return NotFound("Ne postoje odgovori za ovaj komentar");
            }

            return Ok(komentari);
        }

        [HttpPost("AddComment")]

        public async Task<IActionResult> AddComment(KomentarAddDto komentarZahtev)
        {
            return Ok(await _komentar_service.AddComment(komentarZahtev));
        }

        [HttpPut("UpdateComment")]

        public async Task<IActionResult> UpdateComment(KomentarUpdateDto komentarZahtev)
        {
            var komentar = await _komentar_service.GetCommentById(komentarZahtev.id);

            if(komentar == null)
            {
                return NotFound("Komentar ne postoji");
            }

            await _komentar_service.UpdateComment(komentarZahtev);

            return Ok(komentar);
        }

        [HttpDelete("DeleteComment{id}")]

        public async Task<IActionResult> DeleteComment(int id)
        {
            var komentar = await _komentar_service.GetCommentById(id);

            if(komentar == null)
            {
                return NotFound("Komentar ne postoji");
            }

            await _komentar_service.DeleteComment(id);

            return Ok(komentar);
        }

        [HttpPost("LikeCommentToggle")]

        public async Task<IActionResult> LikeToggle(int id_komentara, int id_korisnika)
        {
            return Ok(await _komentar_service.LikeCommentToggle(id_komentara, id_korisnika));
        }
    }
}
