using AddUserCaseStudy.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RepositoryLayer.Models;
using RepositoryLayer.Repo;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AddUserCaseStudy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignInApi : ControllerBase
    {
        private readonly SignInInterface<UserCredentials> _interfaceUser;
        private readonly SignInInterface<User> _interfaceUser2;
        private readonly SendEmailService _emailService;
        public SignInApi(SignInInterface<UserCredentials> retailApplicationinterface, SignInInterface<User> product, SendEmailService emailService)
        {
            _interfaceUser = retailApplicationinterface;
            _interfaceUser2 = product;
            _emailService = emailService;
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserCredentials user)
        {
            
            if (user == null)
            {
                return BadRequest("User credentials cannot be null.");
            }
            if (_interfaceUser2.CheckEmailPresent(user.Email))
            {
                return StatusCode(401, "Email Already Present");
            }
            try
            {
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);

                var newUser = new User
                {
                    Firstname = user.FirstName,
                    Username = user.Username,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Lastname = user.LastName,
                    Upassword = hashedPassword,
                    UserId = _interfaceUser2.Givenewid()
                };

                  
                _emailService.SendEmail(newUser.Email, "Welcome to Our App", "<h1>Thank you for registering!</h1>");
                newUser.EmailVerified= true;
                await _interfaceUser2.AddAsync(newUser);


                return Ok(new { message = "Registration successful!" });

            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error.");
            }
        }


        [HttpGet("users")] // Distinguishing endpoint for getting users
        public Task<IEnumerable<User>> GetUsers()
        {
            return _interfaceUser2.GetAllAsync();
        }

        [HttpPost("update-passwords")] // Distinguishing endpoint for updating passwords
        public IActionResult UpdatePasswordToHash()
        {
            try
            {
                _interfaceUser2.HashAllUserPasswords();
                return Ok(new { message = "All user passwords have been hashed." });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error.");
            }
        }




    }
}
