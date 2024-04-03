using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Models;
using Auction_Marketplace.Data.Models.User;
using Auction_Marketplace.Services.Abstract;

namespace Auction_Marketplace.Services.Interface
{
    public interface IUserService : IService
	{
        Task<User?> GetByEmailAsync(string email);

        Task<Response<List<User>>> GetAllUsers();

        Task<User> GetUserById(int userId);

        Task<Response<UserViewModel>> GetUser();

        Task<Response<UpdateUserViewModel>> UpdateUserInfo(UpdateUserViewModel updatedUser);
    }
}

