using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using WishlistMicroservice.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WishlistMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistitemController : ControllerBase
    {
        private readonly RetailApplicationContext _context;

        public WishlistitemController(RetailApplicationContext context)
        {
            _context = context;
        }
       
        [HttpPost]
        public IActionResult Post(WishlistItem value)
        {
            if (_context.Products.FirstOrDefault(p => p.ProductId == value.ProductId) == null)
            {
                return BadRequest("product does not exist");
            }
            else if (_context.Wishlists.FirstOrDefault(w=>w.WishlistId == value.WishlistId) == null)
            {
                return BadRequest("Wishlist does not exist");
            }

            bool exists = _context.WishlistItems
                        .Any(wp => wp.WishlistId == value.WishlistId && wp.ProductId == value.ProductId);
            if (exists)
            {
                return Ok("product already exists in wishlist");
            }

            _context.WishlistItems.Add(value);
            _context.SaveChanges();
            return Ok();
        }

        //Delete wishlist 
        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            WishlistItem wishlistItem = _context.WishlistItems.FirstOrDefault(w=> w.WishlistItemId == id);
            _context.Remove(wishlistItem);
            _context.SaveChanges();
            return "success fully removed";
        }
    }
}
