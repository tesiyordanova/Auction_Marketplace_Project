using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Models.Donation;
using Auction_Marketplace.Data.Models.Stripe;
using Auction_Marketplace.Services.Abstract;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

namespace Auction_Marketplace.Services.Interface
{
	public interface IStripeService : IService
	{
		Task<Session?> CreateCheckoutSession(DonationAmountViewModel model);

		Task<Session?> CreateCheckoutSessionAuctions(long amount, int auctionId, string winningUserEmail);

		Task HandleWebhookEvent(string json, string stripeSignature);

        Task CreateConnectedUser(StripeFormViewModel model);

		Task PayOut();

		bool CheckStripeAccount();
    }
}

