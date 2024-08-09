using HotChocolate.Types;
using GraphQLApi.Models;
namespace GraphQLApi.Types;
public class CartType : ObjectType<Cart>
{
    protected override void Configure(IObjectTypeDescriptor<Cart> descriptor)
    {
        descriptor.Field(c => c.CartId).Type<NonNullType<IdType>>();
        descriptor.Field(c => c.UserId).Type<IntType>();
        descriptor.Field(c => c.User).Type<UserType>();
        descriptor.Field(c => c.CartItems).Type<ListType<CartItemType>>();
    }
}
