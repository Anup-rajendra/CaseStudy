using Humanizer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WishlistMicroservice.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WishlistMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistItemsController : ControllerBase
    {
        private readonly RetailApplicationContext _context;

        public WishlistItemsController(RetailApplicationContext context)
        {
            _context = context;
        }
     
        // GET api/<WishlistItemsController>/5
        [HttpGet("{id}")]
        public List<Product> Get(int id)
        {
            var productIds = _context.WishlistItems
                            .Where(w => w.WishlistId == id)
                            .Select(w => w.ProductId)
                            .ToList();

            // Fetch all products that match the retrieved ProductIds
            List<Product> products = _context.Products
                                    .Where(p => productIds.Contains(p.ProductId))
                                    .ToList();

            // Check if products are found
            if (products == null || !products.Any())
            {
                return null; // Return a 404 Not Found if no products are found
            }

            // Return the list of products as JSON
            return products;
        }

        // POST api/<WishlistItemsController>
        [HttpPost]
        public void Post(WishlistItemDto dto)
        {
            var wishlistItem = new WishlistItem
            {
                WishlistId = dto.WishlistId,
                ProductId = dto.ProductId,
                // Map other properties if needed
            };
            Random random = new Random();
            wishlistItem.WishlistItemId= random.Next(0, 1000);
            _context.WishlistItems.Add(wishlistItem);
            _context.SaveChanges();

        }

        // DELETE api/<WishlistItemsController>/5
        [HttpDelete]
        public void Delete(int wishlistid, int productid)
        {
            var item = _context.WishlistItems
        .FirstOrDefault(w => w.WishlistId == wishlistid && w.ProductId == productid);


            // Remove the item from the context
            _context.WishlistItems.Remove(item);

            // Save changes to the database
            _context.SaveChanges();
        }
    }
}
