using HotChocolate;
using HotChocolate.Types;
using RepositoryLayer.Repo;
using RepositoryLayer.Models;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;



public class Mutation
{
 
        public async Task<Cart> CreateOrUpdateCart(
            [Service] IRetailApplication<Cart> cartRepository,
            int userId)
        {   
            return await cartRepository.CreateOrUpdateCartAsync(userId);
        }
        public async Task<CartItem> AddToCartItem(
            [Service] IRetailApplication<CartItem> cartItemRepository,int cartId,int productId)
        {
            return await cartItemRepository.UpdateCartItem(cartId, productId);
        }

        public async Task<Address> AddToAddress([Service] IRetailApplication<Address> addressRepository, int userId,string street,string city,string state,string zipcode)
        {
            return await addressRepository.AddAddress(userId,street,city,state,zipcode);
        }
}
