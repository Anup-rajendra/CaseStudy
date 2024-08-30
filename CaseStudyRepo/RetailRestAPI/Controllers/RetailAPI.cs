using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repository.Models;
 
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using YourNamespace.Repositories;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RetailRestAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RetailAPI : ControllerBase
    {

        private readonly IRetailApplication<User> _interfaceUser;
        private readonly IRetailApplication<Product> _product;
        private readonly IRetailApplication<Inventory> _inventory;
        private readonly IRetailApplication<Category> _category;
        private readonly IConfiguration _config;

        public RetailAPI(IRetailApplication<User> retailApplicationinterface, IRetailApplication<Product> product, IRetailApplication<Category> category, IRetailApplication<Inventory> inventory, IConfiguration config)
        {
            _interfaceUser=retailApplicationinterface;
            _product = product;
            _category = category;
            _inventory = inventory;
            _config = config;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] UserCredentials user)
        {
            var existingUser = await _interfaceUser.SingleOrDefaultAsync(u => u.Username == user.Username && u.Upassword == user.Password);

            if (existingUser == null)
            {
                return Unauthorized(); // Return 401 if authentication fails
            }
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, existingUser.Username),
            new Claim(ClaimTypes.NameIdentifier, existingUser. UserId.ToString())
        }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // Save the token to the database if needed (optional)
            existingUser.Token = tokenString;
            await _interfaceUser.UpdateAsync(existingUser);
            // Return the token in the response
            return Ok(new { Token = tokenString });
        }

        // GET: api/<RetailAPI>
        [HttpGet]
        public Task<IEnumerable<User>> Get()
        {
            return _interfaceUser.GetAllAsync();  
        }

        [AllowAnonymous]
        [HttpGet("products")]
        public async Task<IEnumerable<Models.ProductDto>> GetProducts()
        {
            return await _product.GetProductsWithDetailsAsync();
        }


        // GET api/<RetailAPI>/5
        [HttpGet("{id}")]
        public async Task<User> Get(int id)
        {
            return await _interfaceUser.GetByIdAsync(id);
        }

        // POST api/<RetailAPI>
        [HttpPost]
        public async Task Post([FromBody] User user)
        {
            await _interfaceUser.AddAsync(user);
        }

        // PUT api/<RetailAPI>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] User user)
        {
            var existingUser = await _interfaceUser.GetByIdAsync(id);
            if (existingUser != null)
            {
                existingUser.Username = user.Username;
                existingUser.Email = user.Email;
                // Update other fields as necessary
                await _interfaceUser.UpdateAsync(existingUser);
            }
        }

        // DELETE api/<RetailAPI>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            var user = await _interfaceUser.GetByIdAsync(id);
            if (user != null)
            {
                await _interfaceUser.DeleteAsync(user);
            }
        }
        [AllowAnonymous]
        [HttpGet("{username}/{password}")]

        public async Task<object> GetUserID(string username,string password)
        {
            return await _interfaceUser.GetUserDetails(username, password);
        }
    }
}
