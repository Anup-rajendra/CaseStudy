using HotChocolate.Types;
using GraphQLApi.Models;
namespace GraphQLApi.Types;
public class CartItemType : ObjectType<CartItem>
{
    protected override void Configure(IObjectTypeDescriptor<CartItem> descriptor)
    {
        descriptor.Field(ci => ci.CartItemId).Type<NonNullType<IdType>>();
        descriptor.Field(ci => ci.CartId).Type<IntType>();
        descriptor.Field(ci => ci.ProductId).Type<IntType>();
        descriptor.Field(ci => ci.Quantity).Type<IntType>();
        descriptor.Field(ci => ci.Cart).Type<CartType>();
        descriptor.Field(ci => ci.Product).Type<ProductType>();
    }
}
