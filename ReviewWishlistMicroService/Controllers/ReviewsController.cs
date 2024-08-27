using Microsoft.AspNetCore.Mvc;
using ReviewWishlistMicroService.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ReviewWishlistMicroService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    { 
        private readonly RetailApplicationContext _context;

        public ReviewsController(RetailApplicationContext context)
        {
            _context = context;
        }
        // GET: api/<ReviewsController>
        //[HttpGet]
        //public IEnumerable<Review> Get()
        //{  
        //    return _context.Reviews.ToList();
        //}

        // GET api/<ReviewsController>/5
        [HttpGet("{id}")]
        public IEnumerable<Review> Get(int id)
        {
           // User u = _context.Users.FirstOrDefault(us => us.UserId == id);
            
            IEnumerable<Review> rr= _context.Reviews.Where(r => r.UserId == id).ToList();

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

            _context.Reviews.Add(r);
            _context.SaveChanges();
            return "Successfully reviewed";
        }

        // PUT api/<ReviewsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ReviewsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {    
            Review review = _context.Reviews.FirstOrDefault(r=>r.ReviewId == id);

            _context.Remove(review);
        }
    }
}
