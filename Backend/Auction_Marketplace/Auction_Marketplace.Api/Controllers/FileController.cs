using Auction_Marketplace.Data.Repositories.Implementations;
using Auction_Marketplace.Data.Repositories.Interfaces;
using Auction_Marketplace.Services.Constants;
using Auction_Marketplace.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Auction_Marketplace.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
	{
        private readonly IS3Service _s3Service;
        private readonly IUserRepository _userRepository;

        public FileController(IS3Service s3Service, IUserRepository userRepository)
        {
            _s3Service = s3Service;
            _userRepository = userRepository;
        }

        [HttpGet("{documentName}")]
        public IActionResult GetDocumentFromS3(string documentName)
        {
            try
            {
                var document = _s3Service.DownloadFileAsync(documentName).Result;

                var contentType = "image/png";

                var fileContentResult = new FileContentResult(document, contentType)
                {
                    FileDownloadName = documentName
                };

                return fileContentResult;

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostDocumentFromComputerAsync(IFormFile photo)
        {
            try
            {
                if (photo == null || photo.Length == 0)
                {
                    return BadRequest("File is not selected or empty.");
                }

                var email = await _userRepository.GetUserByEmail();

                var existingUser = await _userRepository.GetByEmailAsync(email);

                var fileName = String.Format(AWSConstants.UploadProfilePictureName, existingUser.Email);
                var path = String.Format(AWSConstants.UploadProfilePicturePath, existingUser.Email);

                var url = await _s3Service.UploadFileAsync(photo, path, fileName);

                return Ok(url); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}

