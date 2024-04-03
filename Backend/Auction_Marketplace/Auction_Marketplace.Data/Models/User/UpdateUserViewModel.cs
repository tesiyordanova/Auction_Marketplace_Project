using Microsoft.AspNetCore.Http;

namespace Auction_Marketplace.Data.Models.User
{
	public class UpdateUserViewModel
	{
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        public IFormFile? ProfilePicture { get; set; }
    }
}

