using System.Security.Claims;
using Auction_Marketplace.Data;
using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Models;
using Auction_Marketplace.Data.Models.Donation;
using Auction_Marketplace.Data.Repositories.Interfaces;
using Auction_Marketplace.Services.Constants;
using Auction_Marketplace.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;


namespace Auction_Marketplace.Services.Implementation
{
    public class CauseService : ICauseService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ICauseRepository _causeRepository;
        private readonly IStripeService _stripeService;
        private readonly IUserService _userService;
        private readonly IS3Service _s3Service;
        private readonly IHttpContextAccessor _contextAccessor;

        public CauseService(ApplicationDbContext dbContext, ICauseRepository causeRepository, IUserService userService, IS3Service s3Service, IHttpContextAccessor contextAccessor, IStripeService stripeService)
		{
            _dbContext = dbContext;
            _causeRepository = causeRepository;
            _userService = userService;
            _s3Service = s3Service;
            _contextAccessor = contextAccessor;
            _stripeService = stripeService;
        }

        public async Task<Response<Cause>> CreateCause(NewCauseViewModel cause)
        {
            try
            {
                if (cause == null)
                {
                    return new Response<Cause>
                    {
                        Succeed = false,
                        Message = "Invalid cause data."
                    };
                }

                var email = _contextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
                if (email == null)
                {
                    return new Response<Cause>
                    {
                        Succeed = false,
                        Message = "Invalid cause data."
                    };
                }
                var user = await _userService.GetByEmailAsync(email);


                var newCause = new Cause
                {
                    UserId = user.Id,
                    Name = cause.Name,
                    Description = cause.Description,
                    AmountNeeded = cause.AmountNeeded,
                    IsCompleted = false
                };

                if (cause.Photo != null)
                {
                    var fileName = String.Format(AWSConstants.UploadCausePictureName, cause.Name);
                    var path = String.Format(AWSConstants.UploadCausePicturePath, cause.Name);
                    newCause.Photo = await _s3Service.UploadFileAsync(cause.Photo, path, fileName);
                }              

                if (newCause == null || string.IsNullOrEmpty(newCause.Name))
                {
                    return new Response<Cause>
                    {
                        Succeed = false,
                        Message = "Invalid cause data."
                    };
                }

                await _causeRepository.AddAsync(newCause);
                await _causeRepository.SaveChangesAsync();

                //await _stripeService.PayOut();

                return new Response<Cause>
                {
                    Succeed = true,
                    Data = newCause
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"{ex.Message}");
                throw;
            }
        }

        public async Task<Response<string>> DeleteCause(int causeId)
        {
            try
            {
                Cause cause = await _causeRepository.FindCauseById(causeId);
                if (cause != null)
                {
                    await _causeRepository.DeleteCause(causeId);
                }

                return new Response<string>
                {
                    Succeed = true,
                    Message = $"Successfully deleted auction with Id: {causeId}"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error: {ex.Message}");
                throw;
            }
        }

        public async Task<Response<List<Cause>>> GetAllCauses()
        {
            try
            {
                List<Cause> causes = await _dbContext.Causes.ToListAsync();
                return new Response<List<Cause>>
                {
                    Succeed = true,
                    Data = causes
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting all causes: {ex.Message}");
                throw;
            }
        }

        public async Task<Response<Cause>> GetCauseById(int causeId)
        {
            try
            {
                Cause cause = await _causeRepository.FindCauseById(causeId);
                return new Response<Cause>
                {
                    Succeed = true,
                    Data = cause
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting all causes: {ex.Message}");
                throw;
            }
        }

        public async Task<Response<Cause>> UpdateCause(int causeId, UpdateCauseViewModel updatedCause)
        {
            try
            {
                var existingCause = await _causeRepository.FindCauseById(causeId);

                if (existingCause == null)
                {
                    return new Response<Cause>
                    {
                        Succeed = false,
                        Message = $"Auction with ID {causeId} not found."
                    };
                }

                existingCause.Name = updatedCause.Name;
                existingCause.Description = updatedCause.Description;
                existingCause.AmountNeeded = updatedCause.AmountNeeded;

                await _causeRepository.UpdateCause(existingCause);

                Cause cause = await _causeRepository.FindCauseById(existingCause.CauseId);

                return new Response<Cause>
                {
                    Succeed = true,
                    Data = cause
                };
            }
            catch (Exception ex)
            {
                return new Response<Cause>
                {
                    Succeed = false,
                    Message = $"An error occurred while updating the cause. See logs for details: {ex.Message}"
                };
            }
        }
    }
}