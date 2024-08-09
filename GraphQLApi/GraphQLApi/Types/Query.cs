using HotChocolate;
using HotChocolate.Types;
using GraphQLApi.Models;
using Microsoft.EntityFrameworkCore;

public class Query
{
    // Query for Address
    public IQueryable<Address> GetAddresses([Service] RetailApplicationContext context)
    {
        return context.Addresses.Include(a => a.User);
    }

    public Address GetAddress(int id)
    {
        List<Address>addresses = new List<Address>();
        for(int i=0; i<addresses.Count; i++)
        {
            if (addresses[i].AddressId == id)
                    return addresses[i];
        }
        return null;
    }

    // Query for Users
    public IQueryable<User> GetUsers([Service] RetailApplicationContext context)
    {
        return context.Users
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

    // Query for Products
    public IQueryable<Product> GetProducts([Service] RetailApplicationContext context)
    {
        return context.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .Include(p => p.Inventory)
            .Include(p => p.CartItems)
            .Include(p => p.OrderItems)
            .Include(p => p.Reviews)
            .Include(p => p.WishlistItems);
    }

    // Query for Orders
    public IQueryable<Order> GetOrders([Service] RetailApplicationContext context)
    {
        return context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .Include(o => o.Payment)
            .Include(o => o.Shipment);
    }

    // Query for Categories
    public IQueryable<Category> GetCategories([Service] RetailApplicationContext context)
    {
        return context.Categories.Include(c => c.Products);
    }

    // Query for Inventories
    public IQueryable<Inventory> GetInventories([Service] RetailApplicationContext context)
    {
        return context.Inventories.Include(i => i.Products);
    }

    // Query for Notifications
    public IQueryable<Notification> GetNotifications([Service] RetailApplicationContext context)
    {
        return context.Notifications.Include(n => n.User);
    }

    // Query for Cart Items
    public IQueryable<CartItem> GetCartItems([Service] RetailApplicationContext context)
    {
        return context.CartItems
            .Include(ci => ci.Cart)
            .Include(ci => ci.Product);
    }

    // Query for Carts
    public IQueryable<Cart> GetCarts([Service] RetailApplicationContext context)
    {
        return context.Carts
            .Include(c => c.User)
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Product);
    }

    // Query for Payments
    public IQueryable<Payment> GetPayments([Service] RetailApplicationContext context)
    {
        return context.Payments.Include(p => p.Order);
    }

    // Query for Reviews
    public IQueryable<Review> GetReviews([Service] RetailApplicationContext context)
    {
        return context.Reviews
            .Include(r => r.User)
            .Include(r => r.Product);
    }

    // Query for Shipments
    public IQueryable<Shipment> GetShipments([Service] RetailApplicationContext context)
    {
        return context.Shipments.Include(s => s.Order);
    }

    // Query for Suppliers
    public IQueryable<Supplier> GetSuppliers([Service] RetailApplicationContext context)
    {
        return context.Suppliers.Include(s => s.Products);
    }

    // Query for Wishlists
    public IQueryable<Wishlist> GetWishlists([Service] RetailApplicationContext context)
    {
        return context.Wishlists
            .Include(w => w.User)
            .Include(w => w.WishlistItems)
            .ThenInclude(wi => wi.Product);
    }

    // Query for Wishlist Items
    public IQueryable<WishlistItem> GetWishlistItems([Service] RetailApplicationContext context)
    {
        return context.WishlistItems
            .Include(wi => wi.Wishlist)
            .Include(wi => wi.Product);
    }
}
