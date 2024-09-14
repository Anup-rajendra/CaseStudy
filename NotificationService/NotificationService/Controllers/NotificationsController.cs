using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Logging;

using NotificationService.Services;
using RepositoryLayer.Models;
using RepositoryLayer.Repo;
using System.ComponentModel;

namespace NotificationService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        SendEmailService _emailservice;
        INotification _notificationinterface;
        public NotificationsController( SendEmailService emailService,INotification _notification)
        {
            _emailservice = emailService;
            _notificationinterface = _notification;
        }


        [HttpPost]
        public async Task<IActionResult> SendReceiptEmail([FromBody] OrderConfirmation orderConfirmation)
        {
            try
            {
                // Fetch user details based on UserId
                var user =  _notificationinterface.getUserByIdAsync(orderConfirmation.UserId);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                // Fetch address based on AddressNumber
                var address =  _notificationinterface.getAddressByIdAsync(orderConfirmation.UserId, orderConfirmation.AddressNumber);
                if (address == null)
                {
                    return NotFound("Address not found");
                }

                // Fetch product details based on ProductIds
                var products =  _notificationinterface.getProductsByIdAsync(orderConfirmation.ProductsIds);
                if (products == null || products.Count == 0)
                {
                    return NotFound("Products not found");
                }

                // Generate product rows for the email
                string productRows = "";
                decimal totalPrice = 0;
                for (int i = 0; i < products.Count; i++)
                {
                    var product = products[i];
                    var quantity = orderConfirmation.Quantity[i];
                    decimal productTotalPrice = (decimal)(product.Price * quantity);
                    totalPrice += productTotalPrice;

                    productRows += $@"
                <div class='product-item'>
                    <img src='{product.PhotoUrl}' alt='{product.Name}' style='width:100px;' />
                    <div class='product-details'>
                        <p><strong>{product.Name}</strong></p>
                        <p>Quantity: {quantity}</p>
                        <p>Price: ${product.Price:F2}</p>
                        <p>Total: ${productTotalPrice:F2}</p>
                    </div>
                </div>";
                }

                // Load and populate the email template
                string emailTemplatePath = Path.Combine(Directory.GetCurrentDirectory(), "email-templates", "details.html");
                string emailTemplate = System.IO.File.ReadAllText(emailTemplatePath);
                emailTemplate = emailTemplate.Replace("{{Username}}", user.Username)
                                             .Replace("{{OrderId}}", orderConfirmation.OrderId.ToString())
                                             .Replace("{{OrderDate}}", orderConfirmation.OrderDate.ToString("dd MMM yyyy"))
                                             .Replace("{{City}}", address.City)
                                             .Replace("{{State}}", address.State)
                                             .Replace("{{ZipCode}}", address.ZipCode)
                                             .Replace("{{ProductRows}}", productRows)
                                             .Replace("{{TotalPrice}}", totalPrice.ToString("F2"));

                // Send the email
                _emailservice.SendEmail(user.Email, "Your Order Receipt", emailTemplate);

                return Ok("Receipt email sent successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("{userid}")]
        public List<Product> GetAvailableProductNotifications(int userid)
        {
            return _notificationinterface.GetProductNotificationsByUserId(userid);
        }

    }
}
