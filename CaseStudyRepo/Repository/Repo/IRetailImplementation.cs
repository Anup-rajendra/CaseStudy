using Microsoft.EntityFrameworkCore;
using Repository.Models;
using RetailRestAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using YourNamespace.Repositories;

namespace Repository.Repo
{
    public class IRetailImplementation<T>:IRetailApplication<T> where T : class
    {
        private readonly RetailApplicationContext _context;
        private readonly DbSet<T> _dbSet;

        public IRetailImplementation(RetailApplicationContext context)
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
        public async Task<IEnumerable<ProductDto>> GetProductsWithDetailsAsync()
        {
            if (typeof(T) == typeof(Product))
            {
                var products = await _context.Set<Product>()
                    .Include(p => p.Category)
                    .Include(p => p.Inventory)
                    .Select(p => new ProductDto
                    {
                        ProductID = p.ProductId,
                        Name = p.Name,
                        Price = (decimal)p.Price,
                        CategoryName = p.Category.CategoryName,
                        StockQuantity = (int)p.Inventory.StockQuantity
                    })
                    .ToListAsync();

                return products as IEnumerable<ProductDto>;
            }
            throw new NotSupportedException("This method is only supported for Product entity.");
        }
        public async Task<object> GetUserDetails(string username, string password)
        {
            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);

            // Then, perform the password verification in memory
            if (existingUser == null || !BCrypt.Net.BCrypt.Verify(password, existingUser.Upassword))
            {
                return null; // Return 401 if authentication fails
            }
           

            return existingUser;
        }
    }
}
