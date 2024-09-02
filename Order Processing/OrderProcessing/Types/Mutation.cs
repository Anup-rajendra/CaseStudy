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
}
