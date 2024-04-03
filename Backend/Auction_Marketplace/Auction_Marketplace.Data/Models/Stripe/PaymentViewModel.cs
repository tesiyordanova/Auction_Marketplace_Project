using Auction_Marketplace.Data.Enums;

namespace Auction_Marketplace.Data.Models.Donation
{
	public class PaymentViewModel
	{
		public string StripePaymentId { get; set; }

		public string EndUserId { get; set; }

		public PaymentFor Type { get; set; }

		public bool IsCompleted { get; set; }

		public decimal Amount { get; set; }

		public DateTime Date { get; set; }
	}
}

