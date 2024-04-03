using System.ComponentModel.DataAnnotations;

namespace Auction_Marketplace.Data.Models.Authentication
{
	public class LoginViewModel
	{
        [Required(ErrorMessage = "Username is required")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }
}

