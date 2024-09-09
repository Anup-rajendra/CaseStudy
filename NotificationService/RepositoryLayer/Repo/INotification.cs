using RepositoryLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.Repo
{
    public interface INotification
    {
        User getUserByIdAsync(int id);

        Address getAddressByIdAsync(int userid,int num);

        List<Product> getProductsByIdAsync(List<int> productids);

    }
}
