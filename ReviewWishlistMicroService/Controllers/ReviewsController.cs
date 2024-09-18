using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReviewWishlistMicroService.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ReviewWishlistMicroService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReviewsController : ControllerBase
    { 
        private readonly RetailApplicationContext _context;

        public ReviewsController(RetailApplicationContext context)
        {
            _context = context;
        }
        [HttpGet("{id}")]
        public IEnumerable<ReviewDto> Get(int id)
        {
           // User u = _context.Users.FirstOrDefault(us => us.UserId == id);
            
            IEnumerable<ReviewDto> rr= _context.Reviews.Where(r => r.ProductId == id).Select(r => new ReviewDto
    {
        ReviewId=r.ReviewId,
        Rating=r.Rating,
        Comment = r.Comment,
        ReviewDate = r.ReviewDate,
        //r.ProductId,
        Username = r.User.Username // Adding just the Username
    })
    .ToList(); ;
            //.Include(re => re.Product)

            return rr;
        }

        // POST api/<ReviewsController>
        [HttpPost]
        public string Post(Review r)
        {
            Product p = _context.Products.FirstOrDefault(p => p.ProductId == r.ProductId);
            User u = _context.Users.FirstOrDefault(u => u.UserId == r.UserId);
            if (p == null)
            {
                return "product doesnot exist";
            }
            if (u == null)
            {
                return "user doesnot exist";
            }
            Random rand= new Random();
            r.ReviewId = rand.Next(0, 1000);
            _context.Reviews.Add(r);
            _context.SaveChanges();
            return "Successfully reviewed";
        }

        // DELETE api/<ReviewsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {    
            Review review = _context.Reviews.FirstOrDefault(r=>r.ReviewId == id);

            _context.Remove(review);
            _context.SaveChanges();
        }
    }
}
