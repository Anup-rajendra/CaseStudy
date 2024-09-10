using RepositoryLayer.Models;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace RepositoryLayer.Repo
{
    public interface SignInInterface<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        bool CheckEmailPresent(string email);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task AddAsync(T entity);

        //Add Cart Entry

        Task AddCart(int Userid);
        Task AddRangeAsync(IEnumerable<T> entities);
        Task UpdateAsync(T entity);
        int Givenewid();
        Task DeleteAsync(T entity);
        Task DeleteRangeAsync(IEnumerable<T> entities);

        Task<T> SingleOrDefaultAsync(Expression<Func<T, bool>> predicate);

        void HashAllUserPasswords();

        //only for user entities
        Task<T> AuthenticateAsync(string username, string password);

    }
}
