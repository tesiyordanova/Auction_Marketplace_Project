using System;
namespace Auction_Marketplace.Data.Models.Payment
{
    public class CreatePaymentViewModel
    {
        public string PaymentId { get; set; }

        public decimal Amount { get; set; }

        public bool IsCompleted { get; set; }

        public int StartUser { get; set; }

        public int EndUser { get; set; }
    }
}

