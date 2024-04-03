using System.Linq.Expressions;
using Auction_Marketplace.Data.Entities.Abstract;
using Auction_Marketplace.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Auction_Marketplace.Data.Repositories.Implementations
{
    public abstract class BaseRepository : IRepository { }
    public abstract class BaseRepository<T> : BaseRepository, IRepository<T>
        where T : class, IBaseEntity
    {
        protected readonly ApplicationDbContext _context;

        public BaseRepository(ApplicationDbContext context)
        {
            this._context = context;
        }

        public async Task<int> CountRecordsAsync()
        {
            var result = await this._context.Set<T>().CountAsync();

            return result;
        }

        public async Task<T> GetAsync(int id)
        {
            var result = await this._context.FindAsync<T>(id);

            return result;
        }

        public IQueryable<T> GetAll()
        {
            return this._context.Set<T>();
        }


        public async Task<T> AddAsync(T entity)
        {
            await this._context.AddAsync<T>(entity);

            return entity;
        }

        public async Task AddRangeAsync(IEnumerable<T> entities)
        {
            await this._context.AddRangeAsync(entities);
        }

        public void Update(T entity)
        {
            this._context.Update(entity);
        }

        public void UpdateRange(IEnumerable<T> entities)
        {
            this._context.UpdateRange(entities);
        }

        public void RemoveRecord(T entitiy)// Permanent delete
        {
            this._context.Set<T>().Remove(entitiy);
        }

        public void RemoveRangeRecords(IEnumerable<T> entities)// Permanent delete
        {
            this._context.Set<T>().RemoveRange(entities);
        }

        public void RemoveRecordRange(int[] ids)
        {
            this._context.RemoveRange(ids);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await this._context.SaveChangesAsync();
        }

        public async Task<int> DeleteAsync(int entityId)// Soft delete
        {
            await this.SetDeletedOn(entityId);
            return await this.SaveChangesAsync();
        }

        public async Task<int> DeleteRangeAsync(IEnumerable<T> entities)// Soft delete
        {
            foreach (var entity in entities)
            {
                entity.DeletedOn = DateTime.UtcNow;
            }

            return await this.SaveChangesAsync();
        }

        public IQueryable<T> Find(Expression<Func<T, bool>> predicate)
        {
            return this.GetAll().Where(predicate);
        }

        public void Entry(T entry, params string[] props)
        {
            _context.Entry<T>(entry);
            foreach (var prop in props)
            {
                _context.Entry(entry).Property(prop).IsModified = true;
            }
        }
        private async Task SetDeletedOn(int id)
        {
            var entity = await GetAsync(id);

            entity.DeletedOn = DateTime.UtcNow;
        }
    }
}

