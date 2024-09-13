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
    public class IRetailImplementation<T> : IRetailApplication<T> where T : class
    {
        private readonly RetailApplicationContext _context;
        private readonly DbSet<T> _dbSet;

        public IRetailImplementation(RetailApplicationContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public IQueryable<T> GetAll()
        {
            return _dbSet;
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
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
        public async Task<Cart> GetCartByUserIdAsync(int userId)
        {
            return await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }

        // Custom method for creating or updating a cart
        public async Task<Cart> CreateOrUpdateCartAsync(int userId)
        {
            try
            {
                // Check if a cart exists for the user
                var existingCart = await GetCartByUserIdAsync(userId);
                if (existingCart != null)
                {
                    return existingCart; // Cart already exists
                }

                // If no cart exists, create a new cart
                var newCart = new Cart
                {
                    // Do not manually set CartId if it's an identity column
                    CartId = userId,
                    UserId = userId,

                    // Set other properties as needed
                };

                await _context.Carts.AddAsync(newCart);
                await _context.SaveChangesAsync(); // Save the changes to the database

                return newCart;
            }
            catch (DbUpdateException ex)
            {
                // Log the error or inspect the exception
                Console.WriteLine($"An error occurred: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                throw; // Rethrow the exception if you can't handle it
            }
        }

        public async Task<CartItem> UpdateCartItem(int cartId, int productId)
        {
            var cartItemDetails = await _context.CartItems.FirstOrDefaultAsync(u => u.CartId == cartId && u.ProductId == productId);

            if (cartItemDetails != null)
            {
                // Increment the quantity of the existing cart item.
                cartItemDetails.Quantity += 1;
                _context.CartItems.Update(cartItemDetails);

            }
            else
            {
                // Generate a random integer.
                Random random = new Random();
                int randomInt = random.Next(1, 10000); // Adjust range as needed.

                // Create a new cart item with the provided productId and quantity set to 1.
                var newCartItem = new CartItem
                {
                    CartItemId = randomInt,
                    CartId = cartId,
                    ProductId = productId,
                    Quantity = 1,

                };

                await _context.CartItems.AddAsync(newCartItem);
                cartItemDetails = newCartItem; // Assign new cart item to return it later
            }

            await _context.SaveChangesAsync();

            return cartItemDetails;
        }

        public async Task<Address> AddAddress(int userId, string street, string city, string state, string zipcode)
        {
            Random rand = new Random();
            int num = _context.Addresses.Count();
            Address address = new Address();
            address.UserId = userId;
            address.AddressId = rand.Next(0, 1000);
            address.City = city;
            address.State = state;
            address.ZipCode = zipcode;
            address.Street = street;
            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();
            return address;
        }

        public async Task<CartItem> UpdateCartByCartItemId(int cartItemId, int quantityChange)
        {
            var cartItemDetails = await _context.CartItems.FirstOrDefaultAsync(u => u.CartItemId == cartItemId);
            if (cartItemDetails != null)
            {
                if (cartItemDetails.Quantity == 1 && quantityChange == -1)
                {
                    _context.CartItems.Remove(cartItemDetails);
                    await _context.SaveChangesAsync();
                    return cartItemDetails;

                }
                cartItemDetails.Quantity += quantityChange;
                _context.CartItems.Update(cartItemDetails);
                await _context.SaveChangesAsync();
                return cartItemDetails;

            }
            else return null;
        }

        public async Task<Order> AddNewOrder(int userId, int totalprice)
        {
            Random random = new Random();

            // Generate a small random number 
            int randomNumber = random.Next(1, 10000);
            Order order = new Order();
            order.UserId = userId;
            order.OrderId = randomNumber;
            order.TotalAmount = totalprice;
            order.OrderDate = DateTime.Now;

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<List<ProductAndQuantity>> DeleteByCartId(int cartId)
        {
            List<ProductAndQuantity> list = new List<ProductAndQuantity>();
            List<CartItem> cartItems=_context.CartItems.Where(item=>item.CartId == cartId).ToList();

            foreach (var cartitem in cartItems) {
                ProductAndQuantity productAndQuantity = new ProductAndQuantity();
                productAndQuantity.ProductId = (int)cartitem.ProductId;
                productAndQuantity.ProductQuantity = (int)cartitem.Quantity;
                list.Add(productAndQuantity);
                _context.Remove(cartitem);
                await _context.SaveChangesAsync();
            }
            return list;
        }

        public async Task<Inventory> UpdateInventory(int inventoryId, int quantity)
        {
            Inventory inventory =await  _context.Inventories.FirstOrDefaultAsync(u => u.InventoryId == inventoryId);
            
            inventory.StockQuantity -= quantity;

            _context.Inventories.Update(inventory);
            await _context.SaveChangesAsync();
            return inventory;
            
        }

        //We tried to add a more complex algorithm of delivery date but donno why the datediff was not working
        //1.calculate the average price of orders.
        //2.calculate the average delivery of orders.
        //3. find a relation between them 
        //4. calculate the delivery date
        public async Task<Shipment> AddShipment(int orderId)
        {
            // Create a new shipment
            Shipment shipment = new Shipment();

            // Fetch the existing shipments and order
            List<Shipment> shipmentItems = await _context.Shipments.ToListAsync();
            Order order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);

            // Ensure the order exists
            if (order == null)
            {
                throw new ArgumentException("Order not found.");
            }

            // Determine the delivery date based on the order's total price
            DateTime currentDate = DateTime.Now;
            DateTime deliveryDate;

            if (order.TotalAmount < 160)
            {
                // Delivery within 3 days for orders under $50
                deliveryDate = currentDate.AddDays(1);
            }
            else if (order.TotalAmount < 250)
            {
                // Delivery within 5 days for orders between $50 and $100
                deliveryDate = currentDate.AddDays(5);
            }
            else
            {
                // Delivery within 7 days for orders over $100
                deliveryDate = currentDate.AddDays(7);
            }

            // Set the calculated delivery date
            shipment.ShipmentId = shipmentItems.Count + 1;
            shipment.OrderId = orderId;
            shipment.ShipmentDate = DateOnly.FromDateTime(currentDate);
            shipment.DeliveryDate = DateOnly.FromDateTime(deliveryDate);

            // Generate a tracking number
            const string prefix = "TRACK";
            Random random = new Random();
            int number = random.Next(100, 1000); // Generates a number between 100 and 999
            shipment.TrackingNumber = $"{prefix}{number}";

            // Add the shipment to the context and save changes
            _context.Shipments.Add(shipment);
            await _context.SaveChangesAsync();

            return shipment;
        }


        public async Task<OrderItem> AddOrderItem(int userId, int productId, int quantity)
        {
            List<OrderItem> oitem=_context.OrderItems.ToList();
            OrderItem orderItem = new OrderItem();
            orderItem.OrderItemId = oitem.Count + 1;
            orderItem.OrderId = userId;
            orderItem.ProductId = productId;
            orderItem.Quantity=quantity;
            Product product = await _context.Products.FirstOrDefaultAsync(u => u.ProductId==productId);
            orderItem.Price=product.Price*quantity;
            _context.OrderItems.Add(orderItem);
            await _context.SaveChangesAsync();
            return orderItem;
        }

        public async Task<CartItem> RemoveCartItem(int cartItemId)
        {
            var cartItem = await _context.CartItems.FirstOrDefaultAsync(u => u.CartItemId == cartItemId);

            if (cartItem != null)
            {
                _context.CartItems.Remove(cartItem);
                await _context.SaveChangesAsync();
            }

            return cartItem;
        }

        public async Task<Address> RemoveAddress(int addressId)
        {
            Address address = await _context.Addresses.FirstOrDefaultAsync(a=>a.AddressId==addressId);

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();
            return address;

        }
    }
}
 
