using System.Net.Http;
using System.Security.Claims;
using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Models;
using Auction_Marketplace.Data.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Auction_Marketplace.Data.Repositories.Implementations
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        private readonly IHttpContextAccessor _httpContext;

        public UserRepository(ApplicationDbContext context, IHttpContextAccessor httpContext) : base(context)
        {
            _httpContext = httpContext;
        }

        public Task<Response<List<User>>> GetAllUsers()
        {
            throw new NotImplementedException();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.Where(x => x.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User> GetUserById(int userId)
        {
            return await _context.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();
        }

        public async Task<User> GetUserByCustomerId(string customerId)
        {
            return await _context.Users.Where(u => u.CustomerId == customerId).FirstOrDefaultAsync();
        }

        public async Task UpdateUserInfo(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<string> GetUserByEmail()
        {
            return _httpContext.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
        }

    }
}