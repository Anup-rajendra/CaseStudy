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

         public async Task<CartItem> UpdateCartItemQuantity(
        [Service] IRetailApplication<CartItem> cartItemRepository,
        int cartItemId,
        int quantityChange)
         {
            return await cartItemRepository.UpdateCartByCartItemId(cartItemId, quantityChange);
         }

        public async Task<Order> AddNewOrder([Service] IRetailApplication<Order> orderItemRepository,int  userId,int totalprice)
        {
            return await orderItemRepository.AddNewOrder(userId, totalprice);   
        }

        public async Task<List<ProductAndQuantity>> DeleteCartItemByCartId([Service] IRetailApplication<CartItem> cartItemRepository,int cartId)
        {
            return await cartItemRepository.DeleteByCartId(cartId);
        }

        public async Task<Inventory> UpdateInventory([Service] IRetailApplication<Inventory> inventoryItemRepository, int inventoryId,int quantity)
        {
            return await inventoryItemRepository.UpdateInventory(inventoryId, quantity);
        }

        public async Task<Shipment> AddShipment([Service] IRetailApplication<Shipment> shipmentRepository,int orderId)
        {
            return await shipmentRepository.AddShipment(orderId);
        }

        public async Task<OrderItem> AddOrderItem([Service] IRetailApplication<OrderItem> orderItemRepository, int orderId,int productId,int quantity)
        {
            return await orderItemRepository.AddOrderItem(orderId, productId, quantity);
        }

        public async Task<CartItem> RemoveCartItem([Service] IRetailApplication<CartItem> cartItemRepository,
        int cartItemId)
        {
            return await cartItemRepository.RemoveCartItem(cartItemId);
        }

    public async Task<Address> RemoveAddress([Service] IRetailApplication<Address> cartItemRepository,
 int addressId)
    {
        return await cartItemRepository.RemoveAddress(addressId);
    }

}
