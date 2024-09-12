using Microsoft.EntityFrameworkCore;
using RepositoryLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.Repo
{
    public class Implementation<T> : SignInInterface <T> where T : class
    {
        private readonly RetailApplicationContext _context;
        private readonly DbSet<T> _dbSet;

        public Implementation(RetailApplicationContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task AddRangeAsync(IEnumerable<T> entities)
        {
            await _dbSet.AddRangeAsync(entities);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRangeAsync(IEnumerable<T> entities)
        {
            _dbSet.RemoveRange(entities);
            await _context.SaveChangesAsync();
        }

        public async Task<T> AuthenticateAsync(string username, string password)
        {
            if (typeof(T) == typeof(User))
            {
                var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Username == username && u.Upassword == password);
                return user as T;
            }
            throw new NotSupportedException("Authentication is only supported for User entity.");
        }

        public async Task<T> SingleOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.SingleOrDefaultAsync(predicate);
        }

        public int Givenewid()
        {
            var list=_dbSet.ToList();
            return list.Count+1;
        }

        public bool CheckEmailPresent(string email)
        {
            var list = _context.Users.ToList();
            for (int i = 0; i < list.Count; i++)
            {
                if (list[i].Email == email)
                    return true;
            }
            return false;
            
        }

        public void HashAllUserPasswords()
        {
            List<User> users = _context.Users.ToList();

            foreach (var user in users)
            {
                // Hash the password
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Upassword);

                // Update the user object with the hashed password
                user.Upassword = hashedPassword;

                // Mark the entity as modified
                _context.Entry(user).State = EntityState.Modified;
            }

            // Save all changes to the database
            _context.SaveChanges();
        }

    }
}
