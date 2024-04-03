using System;
using Microsoft.AspNetCore.Http;

namespace Auction_Marketplace.Data.Models.Donation
{
	public class UpdateCauseViewModel
	{
        public string? Name { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;

        public decimal AmountNeeded { get; set; }
    }
}

