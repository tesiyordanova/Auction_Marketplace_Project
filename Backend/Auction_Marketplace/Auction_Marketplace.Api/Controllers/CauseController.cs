using Auction_Marketplace.Data.Models.Donation;
using Auction_Marketplace.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Auction_Marketplace.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CauseController : ControllerBase
    {
        private readonly ICauseService _causeService;

        public CauseController(ICauseService causeService)
        {
            _causeService = causeService;
        }

        [HttpGet]
        [Route("All")]
        public async Task<IActionResult> GetAllCauses()
        {
            try
            {
                var response = await _causeService.GetAllCauses();
                return response.Succeed == true ? Ok(response) : BadRequest(response.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetCauseById([FromRoute] int id)
        {
            try
            {
                var response = await _causeService.GetCauseById(id);
                if (response == null)
                {
                    return NotFound();
                }
                return response.Succeed == true ? Ok(response) : BadRequest(response.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCause([FromForm] NewCauseViewModel cause)
        {
            try
            {
                var response = await _causeService.CreateCause(cause);
                return response.Succeed == true ? Ok(response) : BadRequest(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"{ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCause([FromRoute] int id,[FromForm] UpdateCauseViewModel updatedCause)
        {
            try
            {
                var response = await _causeService.UpdateCause(id, updatedCause);
                return response.Succeed == true ? Ok(response) : BadRequest(response.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCause([FromRoute] int id)
        {
            try
            {
                var response = await _causeService.DeleteCause(id);
                return response.Succeed == true ? Ok(response) : BadRequest(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}

