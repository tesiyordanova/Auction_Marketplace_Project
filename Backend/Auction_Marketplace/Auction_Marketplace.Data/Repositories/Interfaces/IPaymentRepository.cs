using Auction_Marketplace.Data.Entities;

namespace Auction_Marketplace.Data.Repositories.Interfaces
{
	public interface IPaymentRepository : IRepository<Payment>
	{
        Task AddPayment(Payment payment);

        Task<List<Payment>> GetPaymentsByUserId(int userId);

    }
}