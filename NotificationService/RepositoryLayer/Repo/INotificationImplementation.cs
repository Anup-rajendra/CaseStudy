using Microsoft.EntityFrameworkCore;
using RepositoryLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.Repo
{
    internal class INotificationImplementation : INotification
    {
        RetailApplicationContext _context;
        public INotificationImplementation( RetailApplicationContext context)
        {
            _context = context;
        }
        public Address getAddressByIdAsync(int userid, int num)
        {
            List<Address> addresses = _context.Addresses.ToList();

            List<Address> useraddresses=new List<Address>();

            foreach (Address address in addresses) {
                if (address.UserId == userid) {
                    
                    useraddresses.Add(address);
                
                }
            }
            return useraddresses[num];
        }

        

        public List<Product> getProductsByIdAsync(List<int>productIds)
        {
            List<Product> result=new List<Product>();
            foreach (int productid in productIds) {
                Product product = _context.Products.FirstOrDefault(p => p.ProductId == productid);
                result.Add(product);
            }
            
            return result;
        }

        public User getUserByIdAsync(int id)
        {
            return _context.Users.FirstOrDefault(u => u.UserId == id);
        }

        

         List<Product> INotification.GetProductNotificationsByUserId(int userId)
        {
            List<ProductNotification> productNotifications = _context.ProductNotifications.ToList();
            List<Product> result = new List<Product>();
            for (int i = 0; i < productNotifications.Count; i++)
            {
                if (productNotifications[i].Userid == userId && productNotifications[i].Isread == false)
                {
                    Product product =  _context.Products.FirstOrDefault(p => p.ProductId == productNotifications[i].Productid);
                    result.Add(product);
                    productNotifications[i].Isread = true;
                    _context.ProductNotifications.Update(productNotifications[i]);
                    _context.SaveChanges();
                }
            }
            return result;
        }
    }
}
