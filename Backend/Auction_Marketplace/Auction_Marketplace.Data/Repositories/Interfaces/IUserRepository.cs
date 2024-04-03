using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Models;

namespace Auction_Marketplace.Data.Repositories.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        public Task<User?> GetByEmailAsync(string email);
        public Task<Response<List<User>>> GetAllUsers();
        public Task<User> GetUserById(int userId);
        public Task UpdateUserInfo(User existingUser);
        Task<User> GetUserByCustomerId(string customerId);
        public Task<string> GetUserByEmail();
    }
}