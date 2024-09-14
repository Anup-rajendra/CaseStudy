using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace OrderProcessing.Controllers
{
    public class ForgotPasswordController : Controller
    {
        // GET: ForgotPasswordController
        public ActionResult Index()
        {
            return View();
        }

        // GET: ForgotPasswordController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ForgotPasswordController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ForgotPasswordController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ForgotPasswordController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ForgotPasswordController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ForgotPasswordController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ForgotPasswordController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
