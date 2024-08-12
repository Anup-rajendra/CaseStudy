using HotChocolate.Types;
using GraphQLApi.Models;
namespace GraphQLApi.Types;
public class WishlistType : ObjectType<Wishlist>
{
    protected override void Configure(IObjectTypeDescriptor<Wishlist> descriptor)
    {
        descriptor.Field(w => w.WishlistId).Type<NonNullType<IdType>>();
        descriptor.Field(w => w.UserId).Type<IntType>();
        descriptor.Field(w => w.User).Type<UserType>();
        descriptor.Field(w => w.WishlistItems).Type<ListType<WishlistItemType>>();
    }
}
