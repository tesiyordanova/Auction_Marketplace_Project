using Microsoft.AspNetCore.Mvc;
using Auction_Marketplace.Data.Models.Authentication;
using Microsoft.AspNetCore.Authorization;
using Auction_Marketplace.Data.Models.Google;
using Auction_Marketplace.Services.Interface;

namespace Auction_Marketplace.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authService;

        public AuthenticationController(IAuthenticationService autService)
        {
            _authService = autService;
        }

        [HttpPost]
        [Route("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromForm] RegisterViewModel registerUser)
        {
            try
            {
                var response = await _authService.Register(registerUser);

                return response.Succeed == true ? Ok(response) : BadRequest(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginViewModel loginUser)
        {
            try
            {
                var response = await _authService.Login(loginUser);

                return response.Succeed == true ? Ok(response) : BadRequest(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
            
        }

        [HttpPost("google-login")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginViewModel googleLogin)
        {
            try
            {
                var response =  await _authService.GoogleLoginAsync(googleLogin);

                return response.Succeed == true ? Ok(response) : BadRequest(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("Logout")]
        [Authorize]
        public async Task<IActionResult> LogOut()
        {
            try
            {
                await _authService.Logout();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }  
        }

    }
}
