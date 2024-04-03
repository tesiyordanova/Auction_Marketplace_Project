using System;
namespace Auction_Marketplace.Data.Models.Stripe
{
	public class StripeFormViewModel
	{
		public string? FirstName { get; set; }

		public string? LastName { get; set; }

        public string? CountryCode { get; set; }

        public string? City { get; set; }

        public string? Street { get; set; }

        public string? PostalCode { get; set; }

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public string? DateOfBirth { get; set; }

        public string? BankAccountNumber { get; set; }
    }
}

