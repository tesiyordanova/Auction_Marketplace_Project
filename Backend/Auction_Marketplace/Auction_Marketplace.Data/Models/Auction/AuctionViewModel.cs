using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Auction_Marketplace.Data.Models.Auction
{
	public class AuctionViewModel
	{
		public string? Name { get; set; } = string.Empty;

		public string? Description { get; set; } = string.Empty;

        public bool IsCompleted { get; set; }

        public IFormFile Photo { get; set; }
    }
}