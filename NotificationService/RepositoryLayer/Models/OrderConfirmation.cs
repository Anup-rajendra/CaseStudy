using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.Models
{
    public class OrderConfirmation
    {
        public int UserId { get; set; }
        public int AddressNumber {  get; set; }
       public int OrderId { get; set; }
       public DateTime OrderDate { get; set; }
       public List<int> ProductsIds { get; set; }

       public List<int> Quantity { get; set; }

       

    }
}
