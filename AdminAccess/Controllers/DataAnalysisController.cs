using AdminAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace AdminAccess.Controllers
{
    public class DataAnalysisController : Controller
    {
        RetailApplicationContext _context;
        public DataAnalysisController(RetailApplicationContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            // Sample data; replace with real data source
            var cards = new List<Card>
            {
                new Card { Id = 1, Title = "Users", Description = "Users With Most Orders" ,Method="MostOrderingUsers"},
                new Card { Id = 2, Title = "Products", Description = "Current Stock Quantity Of Products",Method="CurrentStockQuantityOfProducts" },
                new Card { Id = 2, Title = "Products", Description = "Most Ordered Products",Method="MostOrderedProducts" },
                // Add more cards as needed
            };

            return View(cards);
        }
        public async Task<IActionResult> MostOrderingUsers(int cartid) // View and data to display the Query
        {
            var userOrderCounts = await GetUserOrderCountsAsync();

            // Extract usernames and order counts
            var usernames = userOrderCounts.Select(u => _context.Users.FirstOrDefault(k => k.UserId == u.UserId).Username).ToList(); ;
            var orderCounts = userOrderCounts.Select(u => u.OrderCount).ToList();

            // Pass data to the view
            ViewBag.Usernames = usernames;
            ViewBag.OrderCounts = orderCounts;

            return View();
        }

        public async Task<IActionResult> CurrentStockQuantityOfProducts()
        {
            var productsWithStock = await GetProductStockAsync();

            // Extract product names and stock quantities
            var productNames = productsWithStock.Select(p => p.Name).ToList();
            var stockQuantities = productsWithStock.Select(p => p.StockQuantity).ToList();

            // Pass data to the view
            ViewBag.ProductNames = productNames;
            ViewBag.StockQuantities = stockQuantities;

            return View();
        }

        public async Task<IActionResult> MostOrderedProducts()
        {
            var mostOrderedProducts = await GetMostOrderedProductsAsync();

            // Extract product names and order counts
            var productNames = mostOrderedProducts.Select(p => p.Name).ToList();
            var orderCounts = mostOrderedProducts.Select(p => p.OrderCount).ToList();

            // Pass data to the view
            ViewBag.ProductNames = productNames;
            ViewBag.OrderCounts = orderCounts;

            return View();
        }





        public async Task<List<ProductStock>> GetProductStockAsync()
        {
            var result = await _context.Products
                .Join(_context.Inventories,
                      product => product.InventoryId,
                      inventory => inventory.InventoryId,
                      (product, inventory) => new ProductStock
                      {
                          Name = product.Name,
                          StockQuantity = (int)inventory.StockQuantity,
                      })
                .ToListAsync();

            return result;
        }

        public async Task<List<UserOrderCount>> GetUserOrderCountsAsync()// Navigate to the use to see which query is being used, Helper function for a query
        {
            var result = await _context.Orders
                .GroupBy(o => o.UserId)
                .Select(g => new UserOrderCount
                {
                    UserId = (int)g.Key,
                    OrderCount = g.Count()
                })
                .OrderByDescending(uoc => uoc.OrderCount)
                .ToListAsync();

            return result;
        }


        public async Task<List<ProductOrderCount>> GetMostOrderedProductsAsync()
        {
            var result = await _context.OrderItems
                .Join(_context.Products,
                      orderItem => orderItem.ProductId,
                      product => product.ProductId,
                      (orderItem, product) => new
                      {
                          product.Name,
                          orderItem.Quantity
                      })
                .GroupBy(x => x.Name)
                .Select(g => new ProductOrderCount
                {
                    Name = g.Key,
                    OrderCount = (int)g.Sum(x => x.Quantity)
                })
                .OrderByDescending(p => p.OrderCount)
                .ToListAsync();

            return result;
        }



    }

    public class Card
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public string Method { get; set; }
    }
    public class UserOrderCount
    { 
        public int UserId { get; set; }
        public int OrderCount { get; set; }

    }


    public class StockCount
    {
        public string ProductName { get; set; }
        public int StockQuantity { get; set; }
    }

    public class ProductStock
    {
        public string Name { get; set; }
        public int StockQuantity { get; set; }
    }

    public class ProductOrderCount
    {
        public string Name { get; set; }
        public int OrderCount { get; set; }
    }


}
