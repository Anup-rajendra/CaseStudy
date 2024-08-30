using RetailRestAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace YourNamespace.Repositories
{
    public interface IRetailApplication<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task AddAsync(T entity);
        Task AddRangeAsync(IEnumerable<T> entities);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task DeleteRangeAsync(IEnumerable<T> entities);

        Task<T> SingleOrDefaultAsync(Expression<Func<T, bool>> predicate);


        //only for user entities
        Task<T> AuthenticateAsync(string username, string password);
        Task<IEnumerable<ProductDto>> GetProductsWithDetailsAsync();

        Task<object> GetUserDetails(string username, string password);

    }
}
