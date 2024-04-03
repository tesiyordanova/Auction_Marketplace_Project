using Microsoft.AspNetCore.Http;

namespace Auction_Marketplace.Data.Models.Donation
{
	public class NewCauseViewModel
	{
        public string? Name { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;

        public IFormFile Photo { get; set; }

        public decimal AmountNeeded { get; set; }

    }
}

