using System;
using Microsoft.AspNetCore.Http;

namespace Auction_Marketplace.Data.Models.Auction
{
	public class UpdateAuctionViewModel
	{
        public string? Name { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;

        public IFormFile Photo { get; set; }

        public int ExistingDays { get; set; }
    }
}

