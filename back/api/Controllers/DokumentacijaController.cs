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
    public class DokumentacijaController : ControllerBase
    {
        private readonly IDokumentacijaTaskovaService _dokumentacija_service;
        private readonly ITaskService _task_service;

        public DokumentacijaController(IDokumentacijaTaskovaService dokumentacijaService, ITaskService taskService)
        {
            _dokumentacija_service = dokumentacijaService;
            _task_service = taskService;
        }

        [HttpPost("issue-documentation/{taskId}")]

        public async Task<ActionResult> UploadDocument(int taskId, List<IFormFile> files)
        {
            var issue = await _task_service.GetTaskById(taskId);
            if (issue == null)
            {
                return BadRequest("There is no issue with the given id");
            }

            // Console.WriteLine("Postoji projekat");

            if (_dokumentacija_service.IssueDocumentationDirectoryExist() == false)
            {
                Directory.CreateDirectory("../Uploads/Documents");
            }

            var result = await _dokumentacija_service.WriteMultipleFilesAsync(issue.id, files);
            if (result != "OK")
            {
                return BadRequest($"Failed to upload documents: {result}");
            }

            // Console.WriteLine("Upload??? : " + result);

            return Ok();
        }

        [HttpGet("issue-documentation/get-titles/{taskId}")]
        public async Task<ActionResult<IEnumerable<NaslovDokument>>> GetDocumentTitles(int taskId)
        {

            var issue = await _task_service.GetTaskById(taskId);
            if (issue == null)
            {
                return BadRequest("There is no issue with the given id");
            }

            List<NaslovDokument> documentTitles = new List<NaslovDokument>();

            List<DokumentacijaTaskova> papers = (await _dokumentacija_service.GetDocumentationForIssue(issue.id)).ToList();

            foreach (var paper in papers)
            {
                var sameTitle = papers.Where(p => p.Id != paper.Id && p.Putanja == paper.Putanja);

                if (sameTitle.Any() == false)
                {
                    documentTitles.Add(new NaslovDokument
                    {
                        Id = paper.Id,
                        Title = paper.Naslov,
                        DateUploaded = paper.DateUploaded,
                    });

                    continue;
                }
            }

            return documentTitles;
        }

        [HttpDelete("issue-documentation")]
        public async Task<ActionResult> DeleteRecord(int id)
        {
            var deleted = await _dokumentacija_service.DeleteDocument(id);

            if (deleted == false)
            {
                return BadRequest("Unable to delete record");
            }

            return Ok(deleted);
        }

        [HttpGet("issue-documentation/{id}/download")]
        public async Task<IActionResult> GetDocumentContent(int id)
        {
            // Console.WriteLine("TEST");
            var document = await _dokumentacija_service.GetDocumentById(id);
            if (document == null)
            {
                return NotFound();
            }
            // Console.WriteLine("TEST1 " + document.Naslov);

            var filePath = document.Putanja;
            // Console.WriteLine("TEST2 " + filePath);

            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(fileBytes, "application/octet-stream", document.Naslov);
        }

    }
}
