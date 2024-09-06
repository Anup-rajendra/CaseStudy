using HotChocolate;
using HotChocolate.Types;
using System.Linq;
using RepositoryLayer.Repo;
using RepositoryLayer.Models;
using Microsoft.EntityFrameworkCore;

public class Query
{
    public IQueryable<Product> GetProducts([Service] IRetailApplication<Product> productRepository)
    {
        return productRepository.GetAll()
                                .Include(p => p.Category)
                                .Include(p => p.Supplier)
                                .Include(p => p.Inventory);
    }
    public IQueryable<Inventory> GetInventory([Service] IRetailApplication<Inventory> inventoryRepository)
    {
        return inventoryRepository.GetAll();
                
                                 
    }
    public IQueryable<User> GetUser([Service] IRetailApplication<User> userRepository)
    {
        return userRepository.GetAll()
                                .Include(u => u.Addresses)
                                .Include(u => u.Carts)
                                .ThenInclude(c => c.CartItems)
                                .Include(u => u.Notifications)
                                .Include(u => u.Orders)
                                .ThenInclude(o => o.OrderItems)
                                .Include(u => u.Reviews)
                                .Include(u => u.Wishlist)
                                .ThenInclude(w => w.WishlistItems);

    }
    public IQueryable<Address> GetAddresses([Service] IRetailApplication<Address> addressRepository)
    {
        return addressRepository.GetAll()
                                .Include(a => a.User);
    }

    public IQueryable<Cart> GetCarts([Service] IRetailApplication<Cart> cartRepository)
    {
        return cartRepository.GetAll()
                             .Include(c => c.User)
                             .Include(c => c.CartItems)
                             .ThenInclude(ci => ci.Product);
    }

    public IQueryable<CartItem> GetCartItems([Service] IRetailApplication<CartItem> cartItemRepository)
    {
        return cartItemRepository.GetAll()
                                 .Include(ci => ci.Cart)
                                 .Include(ci => ci.Product);
    }

    public IQueryable<Order> GetOrders([Service] IRetailApplication<Order> orderRepository)
    {
        return orderRepository.GetAll()
                              .Include(o => o.User)
                              .Include(o => o.OrderItems)
                              .ThenInclude(oi => oi.Product)
                              .Include(o => o.Payment)
                              .Include(o => o.Shipment);
    }

    public IQueryable<OrderItem> GetOrderItems([Service] IRetailApplication<OrderItem> orderItemRepository)
    {
        return orderItemRepository.GetAll()
                                  .Include(oi => oi.Order)
                                  .Include(oi => oi.Product);
    }
    public IQueryable<Shipment> GetShipments([Service] IRetailApplication<Shipment> shipmentRepository)
    {
        return shipmentRepository.GetAll()
                                 .Include(s => s.Order);
    }
    public async Task<User> GetUserByIdAsync([Service] IRetailApplication<User> userRepository, int id)
    {
        return await userRepository.GetAll()
            .Include(u => u.Addresses)
            .Include(u => u.Carts)
                .ThenInclude(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                    .ThenInclude(i=>i.Inventory)
            .Include(u => u.Notifications)
            .Include(u => u.Orders)
                .ThenInclude(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
            .Include(u => u.Reviews)
                .ThenInclude(r => r.Product)
            .Include(u => u.Wishlist)
                .ThenInclude(w => w.WishlistItems)
                    .ThenInclude(wi => wi.Product)
            .FirstOrDefaultAsync(u => u.UserId == id);
    }
    public async Task<List<Address>> GetAddressesByUserIdAsync([Service] IRetailApplication<Address> addressRepository, int userId)
    {
        return await addressRepository.GetAll()
            .Where(a => a.UserId == userId)
            .ToListAsync();
    }
    


}
