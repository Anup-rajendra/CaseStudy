using AdminAccess.Controllers;
using AdminAccess.Models;

using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using System.Diagnostics;

namespace AdminAccessService.Controllers
{
    public class HomeController : Controller
    {
        private readonly RetailApplicationContext _context;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger, RetailApplicationContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            var cards = new List<Card>
            {
                new Card { Id = 1, Title = "Data Analysis", Description = "Analyze various data aspects", Method = "http://localhost:5170/DataAnalysis/Index" },
                new Card { Id = 2, Title = "Products", Description = "View and manage products", Method = "http://localhost:5170/Products/Index" },
                new Card { Id = 3, Title = "Users", Description = "Manage user accounts", Method = "http://localhost:5170/Users/Index" },
                new Card { Id = 4, Title = "Inventories", Description = "Check inventory levels", Method = "http://localhost:5170/Inventories/Index" },
                new Card { Id = 5, Title = "Categories", Description = "Manage product categories", Method = "http://localhost:5170/Categories/Index" }
            };

            return View(cards);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(Admin model)
        {
            if (ModelState.IsValid)
            {

                var existingUser =  _context.Users.FirstOrDefault(u => u.Username == model.Username);

                // Then, perform the password verification in memory
                if (existingUser == null || !BCrypt.Net.BCrypt.Verify(model.Password, existingUser.Upassword)|| existingUser.Urole!="Admin")
                {
                    ModelState.AddModelError("", "Invalid username or password");
                    return View(model);
                }
                    return RedirectToAction("Index");
                

            }
            // For demonstration purposes only. Replace this with your own validation logic.


            else
            {
                ModelState.AddModelError("", "Invalid username or password");
                return View(model);
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}