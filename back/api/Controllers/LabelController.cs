using api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LabelController : ControllerBase
    {
        private readonly ILabelService _label_service;

        public LabelController(ILabelService label_service)
        {
            _label_service = label_service;
        }

        [HttpGet("GetLabels")]

        public async Task<IActionResult> GetAll()
        {
            var labels = await _label_service.GetLabels();

            return Ok(labels);
        }

        [HttpGet("GetLabelById{id}")]

        public async Task<IActionResult> GetLabelById(int id)
        {
            var label = await _label_service.GetLabelById(id);

            if(label == null)
            {
                return NotFound();
            }

            return Ok(label);
        }

        [HttpPost("AddLabel")]

        public async Task<IActionResult> AddLabel(Models.Dtos.LabelDto label)
        {
            var dodat = await _label_service.AddLabel(label);

            return Ok(dodat);
        }

        [HttpPut("Update")]

        public async Task<IActionResult> UpdateLabel(Models.Dtos.LabelDto label)
        {
            var postojeciLabel = await _label_service.GetLabelById(label.id);

            if(postojeciLabel == null)
            {
                return NotFound();
            }

            postojeciLabel.naziv = label.naziv;

            await _label_service.UpdateLabel(postojeciLabel);

            return Ok(postojeciLabel);
        }

        [HttpDelete("Delete")]

        public async Task<IActionResult> DeleteLabel(Models.Dtos.LabelDto label)
        {
            var postojeciLabel = await _label_service.GetLabelById(label.id);

            if(postojeciLabel == null)
            {
                return NotFound();
            }

            await _label_service.DeleteLabel(postojeciLabel);

            return Ok(label);
        }

        [HttpGet("GetLabelsByProjectId{id}")]

        public async Task<IActionResult> GetLabelsByProjectId(int id)
        {
            //var labele = await _label_service.GetLabelsByProjectId(id);
            var labele = await _label_service.GetLabelsByProjectIdOrdered(id);

            if (labele == null)
            {
                return BadRequest("Ne postoji ni jedan label za taj projekat");
            }

            return Ok(labele);
        }

        [HttpPost("UpdateLabelOrder")]

        public async Task<IActionResult> UpdateLabelOrder(int project_id, string new_order)
        {
            await _label_service.UpdateLabelOrderString(project_id, new_order);

            return Ok();
        }
    }
}
