using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Models;
using Auction_Marketplace.Data.Models.Auction;
using Auction_Marketplace.Services.Abstract;

namespace Auction_Marketplace.Services.Interface
{
	public interface IAuctionsService : IService
    {
        Task<Response<List<Auction>>> GetAllAuctions();

        Task<Response<Auction>> GetAuctionById(int auctionId);

        Task<Response<string>> DeleteAuction(int auctionId);

        Task<Response<Auction>> CreateAuction(NewAuctionViewModel auction);

        Task<Response<Auction>> UpdateAuction(int auctionId, UpdateAuctionViewModel updatedAuction);

        public Task<Response<string>> CheckFinalBid(int auctionId);
        
        public Task<Response<string>> SendEmailToWinner(int auctionId);

        public Task<Response<List<Auction>>> GetAllAuctionsUserBidded();
    }
}

