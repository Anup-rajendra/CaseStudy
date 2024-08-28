using AdminAccessService.Models;
using Microsoft.AspNetCore.Mvc;
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
            return View();
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
            if (ModelState.IsValid) {
                
                Admin admin =_context.Admins.FirstOrDefault(u=>u.Username==model.Username && u.Password==model.Password);
                if (admin == null)
                {
                    ModelState.AddModelError("", "Invalid username or password");
                    return View(model);
                }
                else {
                    return RedirectToAction("Index");
                }

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
