using Microsoft.AspNetCore.Mvc;
using WishlistMicroservice.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WishlistMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly RetailApplicationContext _context;

        public WishlistController(RetailApplicationContext context)
        {
            _context = context;
        }
        // GET: api/<WishlistController>
        [HttpGet("/wishlist/{id}")]
        public IEnumerable<Wishlist> Getwishlists(int id)
        {
            return _context.Wishlists.Where(w=> w.UserId==id);
        }

        // GET api/<WishlistController>/5
        [HttpGet("{id}")]
        public IEnumerable<Product> Getproducts(int id)
        {
            var productIds = _context.WishlistItems
                            .Where(w => w.WishlistId == id)
                            .Select(w => w.ProductId)
                            .ToList();

            // Fetch all products that match the retrieved ProductIds
            var products = _context.Products
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

        // POST api/<WishlistController>
        [HttpPost]
        public string Post(Wishlist value)
        {
            User u= _context.Users.FirstOrDefault(r=> r.UserId == value.UserId);
            if (u == null){
                return "no user";
            }
            _context.Wishlists.Add(value);
            return "wishlist created successfully";

        }



        // PUT api/<WishlistController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<WishlistController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
