//using Microsoft.AspNetCore.Mvc;
//using Repository.Models;
//using YourNamespace.Repositories;

//// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

//namespace RetailRestAPI.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class ProductsController : ControllerBase
//    {
//        private readonly IRetailApplication<Product> _interfaceUser;
//        private readonly IConfiguration _config;

//        public ProductsController(IRetailApplication<Product> retailApplicationinterface, IConfiguration config)
//        {
//            _interfaceUser = retailApplicationinterface;
//            _config = config;
//        }
//        // GET: api/<ProductsController>
//        [HttpGet]
//        public Task<IEnumerable<Product>> Get()
//        {
//            return _interfaceUser.GetAllAsync();
//        }

//        // GET api/<ProductsController>/5
//        [HttpGet("{id}")]
//        public string Get(int id)
//        {
//            return "value";
//        }

//        // POST api/<ProductsController>
//        [HttpPost]
//        public void Post([FromBody] string value)
//        {
//        }

//        // PUT api/<ProductsController>/5
//        [HttpPut("{id}")]
//        public void Put(int id, [FromBody] string value)
//        {
//        }

//        // DELETE api/<ProductsController>/5
//        [HttpDelete("{id}")]
//        public void Delete(int id)
//        {
//        }
//    }
//}
