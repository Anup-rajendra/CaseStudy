using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using YourNamespace.Repositories;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RetailRestAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RetailAPI : ControllerBase
    {
        private readonly IRetailApplication<User> _interfaceUser;
        public RetailAPI(IRetailApplication<User> retailApplicationinterface)
        {
            _interfaceUser=retailApplicationinterface;
        }

        // GET: api/<RetailAPI>
        [HttpGet]
        public Task<IEnumerable<User>> Get()
        {
            return _interfaceUser.GetAllAsync();  
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
    }
}
