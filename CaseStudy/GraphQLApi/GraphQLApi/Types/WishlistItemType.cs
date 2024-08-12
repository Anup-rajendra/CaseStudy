using HotChocolate.Types;
using GraphQLApi.Models;
namespace GraphQLApi.Types;
public class WishlistItemType : ObjectType<WishlistItem>
{
    protected override void Configure(IObjectTypeDescriptor<WishlistItem> descriptor)
    {
        descriptor.Field(wi => wi.WishlistItemId).Type<NonNullType<IdType>>();
        descriptor.Field(wi => wi.WishlistId).Type<IntType>();
        descriptor.Field(wi => wi.ProductId).Type<IntType>();
        descriptor.Field(wi => wi.Product).Type<ProductType>();
        descriptor.Field(wi => wi.Wishlist).Type<WishlistType>();
    }
}
