using RepositoryLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace RepositoryLayer.Repo
{
    public interface IRetailApplication<T> where T : class
    {
        IQueryable<T> GetAll();
        Task<T> GetByIdAsync(int id);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task<Cart> CreateOrUpdateCartAsync(int userId);
        Task<Cart> GetCartByUserIdAsync(int userId);

        Task<CartItem> UpdateCartItem(int cartId, int productId);

        Task<Address> AddAddress(int userId,string street,string city,string state,string zipcode);

        Task<CartItem> UpdateCartByCartItemId(int cartItemId, int quantityChange);

        Task<Order>AddNewOrder(int userId,int totalprice,int addressId);

        Task<List<ProductAndQuantity>> DeleteByCartId(int cartId);

        Task<Inventory> UpdateInventory(int inventoryId,int quantity);

        Task<Shipment> AddShipment(int orderId);

        Task<OrderItem> AddOrderItem(int userId, int productId, int quantity);

        Task<CartItem> RemoveCartItem(int cartItemId);

        Task<Address> RemoveAddress(int addressId);
        
        

        

    }


}
