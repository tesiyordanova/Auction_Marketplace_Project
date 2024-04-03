using Microsoft.AspNetCore.Http;

namespace Auction_Marketplace.Data.Models.Donation
{
	public class CauseViewModel
	{
        public string? Name { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;

        public IFormFile Photo { get; set; }

        public decimal AmountNeeded { get; set; }

        public decimal AmountCurrent { get; set; }

        public bool IsCompleted { get; set; } = false;

        public ICollection<PaymentViewModel> Donations { get; set; } = new List<PaymentViewModel>();
    }
}

