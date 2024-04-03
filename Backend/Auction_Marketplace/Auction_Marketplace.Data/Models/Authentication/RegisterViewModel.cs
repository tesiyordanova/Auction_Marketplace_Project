using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Auction_Marketplace.Data.Models.Authentication
{
        public class RegisterViewModel
        {
                public string? FirstName { get; set; }

                public string? LastName { get; set; }

                [EmailAddress]
                [Required(ErrorMessage = "Email is required")]
                public string Email { get; set; } = string.Empty;

                [Required(ErrorMessage = "Password is required")]
                public string Password { get; set; } = string.Empty;

                public IFormFile? ProfilePicture { get; set; }
        }
}

