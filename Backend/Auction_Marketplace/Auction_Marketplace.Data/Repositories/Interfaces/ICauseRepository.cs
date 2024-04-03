using Auction_Marketplace.Data.Entities;

namespace Auction_Marketplace.Data.Repositories.Interfaces
{
	public interface ICauseRepository : IRepository<Cause>
	{
		public Task AddCause(Cause cause);
		public Task DeleteCause(int causeId);
		public Task<Cause?> FindCauseById(int causeId);
		Task<Cause?> FindCauseByUserId(int userId);
        public Task UpdateCause(Cause exsistingCause);
	}
}