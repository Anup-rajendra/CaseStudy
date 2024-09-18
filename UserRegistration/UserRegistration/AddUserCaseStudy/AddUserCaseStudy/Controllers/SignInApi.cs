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
        public async Task<String> Create([FromBody] UserCredentials user)
        {
            
            if (user == null)
            {
                return "User credentials cannot be null.";
            }
            if (_interfaceUser2.CheckEmailPresent(user.Email))
            {
                return "Email Already Present";
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
                newUser.Urole = "Customer";

                

                Random random = new Random();
                int otp = random.Next(1000, 9999);

                // Prepare email body with OTP
                string emailBody = $"<h1>Thank you for registering!</h1><br /><h3>Your OTP is: {otp}</h3>";

                // Send email with OTP
                _emailService.SendEmail(newUser.Email, "Welcome to Our App", emailBody);

                // Mark the email as verified and save the user
                newUser.EmailVerified = true;
                await _interfaceUser2.AddAsync(newUser);

                //Add Corresponding CartNumber To the Database
                await _interfaceUser2.AddCart(newUser.UserId);

                await _interfaceUser2.AddWishlist(newUser.UserId);

                // Return OTP in the response
                return $"{otp}";

            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine(ex.Message);
                return "Internal server error.";
            }
        }


        [HttpGet("users")] // Distinguishing endpoint for getting users
        public Task<IEnumerable<User>> GetUsers()
        {
            return _interfaceUser2.GetAllAsync();
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] RepositoryLayer.Models.ResetPasswordRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request.");
            }
            // Log incoming request
            Console.WriteLine($"ResetPassword request: Email = {request.Email}, Otp = {request.Otp}, NewPassword = {request.NewPassword}");

            var user = await _interfaceUser2.GetByEmailAsync(request.Email);
            if (user == null || user.Otpcode != request.Otp)
            {
                return BadRequest("Invalid OTP or user not found.");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.Upassword = hashedPassword;
            user.Otpverified = true;  // Mark OTP as used
            await _interfaceUser2.UpdateAsync(user);

            return Ok("Password has been reset successfully.");

        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] RepositoryLayer.Models.ForgotPasswordRequest request)
        {
            var user = await _interfaceUser2.GetByEmailAsync(request.Email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var otp = new Random().Next(1000, 9999).ToString();
            user.Otpcode = otp;
            user.Otpverified = false;
            await _interfaceUser2.UpdateAsync(user);

            var emailBody = $"<h1>Forgot Password</h1><br /><h3>Your OTP is: {otp}</h3>";
            _emailService.SendEmail(request.Email, "Password Reset OTP", emailBody);

            return Ok("OTP sent to your email.");
        }
        [HttpGet("get-email-by-user/{userId}")]
        public async Task<IActionResult> GetEmailByUserId(int userId)
        {
            var user = await _interfaceUser2.GetByIdAsync(userId); // Make sure this method exists in your repository
            if (user == null)
            {
                return NotFound("User not found.");
            }
            return Ok(new { email = user.Email });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request.");
            }
            // Log incoming request
            Console.WriteLine($"ChangePassword request: UserId = {request.UserId}, CurrentPassword = {request.CurrentPassword}, NewPassword = {request.NewPassword}");

            var user = await _interfaceUser2.GetByIdAsync(request.UserId);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Upassword))
            {
                return BadRequest("Invalid current password or user not found.");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.Upassword = hashedPassword;
            await _interfaceUser2.UpdateAsync(user);

            return Ok("Password has been changed successfully.");
        }



    }
}
