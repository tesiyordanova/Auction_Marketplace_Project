using System.Linq.Expressions;
using Auction_Marketplace.Data.Entities.Abstract;

namespace Auction_Marketplace.Data.Repositories.Interfaces
{
    public interface IRepository { }
    public interface IRepository<T> : IRepository where T : IBaseEntity
    {
        Task<int> CountRecordsAsync();

        Task<T> GetAsync(int id);

        IQueryable<T> GetAll();

        Task<T> AddAsync(T entity);

        Task AddRangeAsync(IEnumerable<T> entities);

        void Update(T entity);

        void UpdateRange(IEnumerable<T> entities);

        void RemoveRecord(T entity);

        void RemoveRangeRecords(IEnumerable<T> entities);

        Task<int> SaveChangesAsync();

        Task<int> DeleteAsync(int entityId);

        Task<int> DeleteRangeAsync(IEnumerable<T> entities);

        IQueryable<T> Find(Expression<Func<T, bool>> predicate);

        void Entry(T entry, params string[] props);
    }
}

