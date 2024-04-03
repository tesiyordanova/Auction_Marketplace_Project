using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Auction_Marketplace.Data.Repositories.Implementations
{
    public class BidRepository : BaseRepository<Bid>, IBidRepository
    {
        public BidRepository(ApplicationDbContext context) : base(context)
        {
           
        }

        public async Task<Auction?> FindAuctionById(int auctionId)
        {
            return await this._context.Auctions.FirstOrDefaultAsync(c => c.AuctionId == auctionId);
        }

        public async Task<List<Bid>> GetBidsByAuctionId(int auctionId)
        {
            return await _context.Bids
                .Where(b => b.AuctionId == auctionId)
                .ToListAsync();
        }


        public async Task<List<Bid>> GetBidsMadeByUser(int userId)
        {
            return await _context.Bids
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }
    }
}