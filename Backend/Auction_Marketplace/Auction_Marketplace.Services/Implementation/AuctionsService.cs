
using System;
using System.Security.Claims;
using Auction_Marketplace.Data;
using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Models;
using Auction_Marketplace.Data.Models.Auction;
using Auction_Marketplace.Data.Models.Donation;
using Auction_Marketplace.Data.Repositories.Implementations;
using Auction_Marketplace.Data.Repositories.Interfaces;
using Auction_Marketplace.Services.Constants;
using Auction_Marketplace.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Auction_Marketplace.Services.Implementation
{
    public class AuctionsService : IAuctionsService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IAuctionRepository _auctionRepository;
        private readonly IBidRepository _bidRepository;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUserService _userService;
        private readonly IS3Service _s3Service;
        private readonly IEmailService _emailService;
        private readonly IStripeService _stripeService;


        public AuctionsService(ApplicationDbContext dbContext,
            IAuctionRepository auctionRepository,
            IHttpContextAccessor contextAccessor,
            IUserService userService, IS3Service s3Service, IBidRepository bidRepository, IEmailService emailService, IStripeService stripeService)
        {
            _dbContext = dbContext;
            _auctionRepository = auctionRepository;
            _bidRepository = bidRepository;
            _contextAccessor = contextAccessor;
            _userService = userService;
            _s3Service = s3Service;
            _emailService = emailService;
            _stripeService = stripeService;
        }

        public async Task<Response<Auction>> CreateAuction(NewAuctionViewModel auction)
        {
            try
            {
                if(auction == null)
                {
                    return new Response<Auction>
                    {
                        Succeed = false,
                        Message = "Invalid auction data."
                    };
                }

                var email = _contextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
                if (email == null)
                {
                    return new Response<Auction>
                    {
                        Succeed = false,
                        Message = "User is not existing."
                    };
                }

                var user = await _userService.GetByEmailAsync(email);

                Auction newAuction = new Auction
                {
                    UserId = user.Id,
                    Name = auction.Name,
                    Description = auction.Description,
                    StartPrice = auction.StartPrice,
                    EndDate = DateTime.Now.AddDays(auction.ExistingDays),
                    IsCompleted = false,
                };

                if (auction.Photo != null)
                {
                    var fileName = String.Format(AWSConstants.UploadCausePictureName, auction.Name);
                    var path = String.Format(AWSConstants.UploadCausePicturePath, auction.Name);
                    newAuction.Photo = await _s3Service.UploadFileAsync(auction.Photo, path, fileName);
                }


                if (newAuction == null || string.IsNullOrEmpty(newAuction.Name) || newAuction.UserId <= 0)
                {
                    return new Response<Auction>
                    {
                        Succeed = false,
                        Message = "Invalid auction data."
                    };
                }

                await _auctionRepository.AddAsync(newAuction);
                await _auctionRepository.SaveChangesAsync();

                return new Response<Auction>
                {
                    Succeed = true,
                    Data = newAuction
                };
            }
            catch (Exception ex)
            {
                return new Response<Auction>
                {
                    Succeed = false,
                    Message = "An error occurred while creating the auction. See logs for details."
                };
            }
        }

        public async Task<Response<string>> DeleteAuction(int auctionId)
        {
            try
            {
                Auction auction = await _auctionRepository.FindAuctionById(auctionId);

                if(auction != null)
                {
                    await _auctionRepository.DeleteAuction(auctionId);
                }

                return new Response<string>
                {
                    Succeed = true,
                    Message = $"Successfully deleted auction with Id: {auctionId}"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error: {ex.Message}");
                throw;
            }
        }

        public async Task<Response<List<Auction>>> GetAllAuctions()
        {
            try
            {

                List<Auction> auctions = await _dbContext.Auctions.ToListAsync();
                return new Response<List<Auction>>
                {
                    Succeed = true,
                    Data = auctions
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting all auctions: {ex.Message}");
                throw;
            }
        }

        public async Task<Response<Auction>> GetAuctionById(int auctionId)
        {
            try
            {
                Auction auction = await _auctionRepository.FindAuctionById(auctionId);
                return new Response<Auction>
                {
                    Succeed = true,
                    Data = auction
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting all auctions: {ex.Message}");
                throw;
            }
        }

        public async Task<Response<Auction>> UpdateAuction(int auctionId, UpdateAuctionViewModel updatedAuction)
        {
            try
            {
                var existingAuction = await _auctionRepository.FindAuctionById(auctionId);

                if (existingAuction == null)
                {
                    return new Response<Auction>
                    {
                        Succeed = false,
                        Message = $"Auction with ID {auctionId} not found."
                    };
                }

                existingAuction.Name = updatedAuction.Name;
                existingAuction.Description = updatedAuction.Description;
                if (updatedAuction.Photo != null)
                {
                    var fileName = String.Format(AWSConstants.UploadCausePictureName, existingAuction.Name);
                    var path = String.Format(AWSConstants.UploadCausePicturePath, existingAuction.Name);
                    existingAuction.Photo = await _s3Service.UploadFileAsync(updatedAuction.Photo, path, fileName);
                }

                await _auctionRepository.UpdateAuction(existingAuction);

                return new Response<Auction>
                {
                    Succeed = true
                };
            }
            catch (Exception ex)
            {
                return new Response<Auction>
                {
                    Succeed = false,
                    Message = $"An error occurred while updating the auction. See logs for details: {ex.Message}"
                };
            }
        }

        public async Task<Response<string>> CheckFinalBid(int auctionId)
        {
            try
            {
                Auction auction = await _auctionRepository.FindAuctionById(auctionId);

                if (auction == null)
                {
                    return new Response<string>
                    {
                        Succeed = false,
                        Message = "Auction is not found."
                    };
                }

                List<Bid> bids = await _bidRepository.GetBidsByAuctionId(auctionId);

                if (bids == null || bids.Count == 0)
                {
                    return new Response<string>
                    {
                        Succeed = false,
                        Message = "No bids found for this auction."
                    };
                }

                decimal highestBidAmount = bids.Max(b => b.Amount);
                auction.FinalPrice = highestBidAmount;

                Bid finalBid = bids.FirstOrDefault(b => b.Amount == highestBidAmount);

                if (finalBid == null)
                {
                    return new Response<string>
                    {
                        Succeed = false,
                        Message = "Non bid found."
                    };
                }

                User user = await _userService.GetUserById(finalBid.UserId);

                return new Response<string>
                {
                    Succeed = true,
                    Data = $"User {user.Email} made the final bid of {finalBid.Amount} BGN"
                };
            }
            catch (Exception ex)
            {
                return new Response<string>
                {
                    Succeed = false,
                    Message = $"An error occurred while checking the finalbid: {ex.Message}"
                };
            }


        }

        public async Task<Response<string>> SendEmailToWinner(int auctionId){
            var auctionResponse = await GetAuctionById(auctionId);
            
            var finalBidResponse = await CheckFinalBid(auctionId);
            if (!finalBidResponse.Succeed)
            {
                return new Response<string>
                {
                    Succeed = false,
                    Message = finalBidResponse.Message
                };
            }

            var message = finalBidResponse.Data.Split(" ");
            string winningUserEmail = message[1];
            decimal winningBidAmount = decimal.Parse(finalBidResponse.Data.Split("made the final bid of")[1].Replace("BGN", "").Trim());

            string auctionName = auctionResponse.Data.Name;
            long amount = Convert.ToInt64(auctionResponse.Data.FinalPrice);
            var session = await _stripeService.CreateCheckoutSessionAuctions(amount, auctionId, winningUserEmail);
            string strypeLink = session.Url;

            await _emailService.SendEmail("Auction Winner Notification", winningUserEmail, "Bidder", $"Dear Bidder,\r\n\r\nCongratulations!" +
                $" You've won the auction for {auctionName} with the highest bid of {winningBidAmount} BGN. Here you can make your payment: {strypeLink}");

            return new Response<string>
            {
                Succeed = true,
                Message = $"Email sent successfully to {winningUserEmail}"
            };
            
        }

        public async Task<Response<List<Auction>>> GetAllAuctionsUserBidded()
        {
           var email = _contextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
           if (email == null)
           {
               return new Response<List<Auction>>
               {
                   Succeed = false,
                   Message = "Invalid auction data.",
               };
           }

           var user = await _userService.GetByEmailAsync(email);
           List<Bid> bids = await _bidRepository.GetBidsMadeByUser(user.Id);
           List<Auction> auctions = new List<Auction>();
           foreach (var bid in bids)
           {
               Auction auction = await _auctionRepository.FindAuctionById(bid.AuctionId);
               auctions.Add(auction);
           }

           auctions = auctions.DistinctBy(a => a.AuctionId).ToList();
           if (auctions.Count() == 0 || auctions == null)
           {
               return new Response<List<Auction>>
               {
                   Succeed = false,
                   Message = "Invalid auction data.",
               };
           }

           return new Response<List<Auction>>
           {
               Succeed = true,
               Data = auctions
           };
        }
    }
}

