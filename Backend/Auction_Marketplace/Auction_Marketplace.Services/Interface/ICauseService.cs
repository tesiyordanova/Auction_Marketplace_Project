using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Models;
using Auction_Marketplace.Data.Models.Authentication;
using Auction_Marketplace.Data.Models.Donation;
using Auction_Marketplace.Services.Abstract;

namespace Auction_Marketplace.Services.Interface
{
	public interface ICauseService : IService
	{
        Task<Response<List<Cause>>> GetAllCauses();

        Task<Response<Cause>> GetCauseById(int causeId);

        Task<Response<string>> DeleteCause(int causeId);

        Task<Response<Cause>> CreateCause(NewCauseViewModel cause);

        Task<Response<Cause>> UpdateCause(int causeId, UpdateCauseViewModel cause);
    }
}