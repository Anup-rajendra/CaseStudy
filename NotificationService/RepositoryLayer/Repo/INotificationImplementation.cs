using RepositoryLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
    }
}
