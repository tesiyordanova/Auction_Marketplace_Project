using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Auction_Marketplace.Data.Repositories.Implementations
{
    public class AuctionRepository : BaseRepository<Auction>, IAuctionRepository
    {
        public AuctionRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task DeleteAuction(int auctionId)
        {
            var auction = await FindAuctionById(auctionId);

            if (auction != null)
            {
                _context.Auctions.Remove(auction);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Auction> FindAuctionById(int auctionId)
        {
            return await _context.Auctions.Where(a => a.AuctionId == auctionId).FirstOrDefaultAsync();
        }

        public async Task UpdateAuction(Auction auction)
        {
            _context.Entry(auction).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}