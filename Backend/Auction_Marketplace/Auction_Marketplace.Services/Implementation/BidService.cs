using System.Security.Claims;
using Auction_Marketplace.Data;
using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Models;
using Auction_Marketplace.Data.Models.Bid;
using Auction_Marketplace.Data.Repositories.Interfaces;
using Auction_Marketplace.Services.Interface;
using Microsoft.AspNetCore.Http;

namespace Auction_Marketplace.Services.Implementation
{
	public class BidService : IBidService
	{
        private readonly ApplicationDbContext _dbContext;
        private readonly IBidRepository _bidRepository;
        private readonly IUserService _userService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IAuctionRepository _auctionRepository;

        public BidService(ApplicationDbContext dbContext, IBidRepository bidRepository, IUserService userService, IHttpContextAccessor contextAccessor, IAuctionRepository auctionRepository)
        {
            _dbContext = dbContext;
            _bidRepository = bidRepository;
            _userService = userService;
            _contextAccessor = contextAccessor;
            _auctionRepository = auctionRepository;
        }

        public async Task<Response<Bid>> PlaceBid(BidViewModel bid)
        {
            try
            {
                Auction auction = await _auctionRepository.FindAuctionById(bid.AuctionId);

                if (auction == null)
                {
                    return new Response<Bid>
                    {
                        Succeed = false,
                        Message = "Auction is not found."
                    };
                }

                List<Bid> bids = await _bidRepository.GetBidsByAuctionId(bid.AuctionId);

                if (bids == null || bids.Count == 0)
                {
                    if (bid.Amount <= auction.StartPrice)
                    {
                        return new Response<Bid>
                        {
                            Succeed = false,
                            Message = "Invalid bid data."
                        };
                    }
                }
                else
                {
                    decimal highestBidAmount = bids.Max(b => b.Amount);
                    if (bid.Amount <= highestBidAmount)
                    {
                        return new Response<Bid>
                        {
                            Succeed = false,
                            Message = "Invalid bid data."
                        };
                    }

                }

                var email = _contextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
                if (email == null)
                {
                    return new Response<Bid>
                    {
                        Succeed = false,
                        Message = "Invalid bid data."
                    };
                }
                var user = await _userService.GetByEmailAsync(email);

                var newBid = new Bid
                {
                    UserId = user.Id,
                    AuctionId = bid.AuctionId,
                    Amount = bid.Amount
                };

                if (newBid == null)
                {
                    return new Response<Bid>
                    {
                        Succeed = false,
                        Message = "Invalid bid data."
                    };
                }

                await _bidRepository.AddAsync(newBid);
                await _bidRepository.SaveChangesAsync();

                return new Response<Bid>
                {
                    Succeed = true,
                    Data = newBid
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"{ex.Message}");
                throw;
            }
        }

    }
}

