using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Models;
using Auction_Marketplace.Data.Models.Bid;
using Auction_Marketplace.Services.Abstract;

namespace Auction_Marketplace.Services.Interface
{
	public interface IBidService : IService
	{
        Task<Response<Bid>> PlaceBid(BidViewModel bid);
    }
}

