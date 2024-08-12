using HotChocolate.Types;
using GraphQLApi.Models;
namespace GraphQLApi.Types;
public class ProductType : ObjectType<Product>
{
    protected override void Configure(IObjectTypeDescriptor<Product> descriptor)
    {
        descriptor.Field(p => p.ProductId).Type<NonNullType<IdType>>();
        descriptor.Field(p => p.CategoryId).Type<IntType>();
        descriptor.Field(p => p.SupplierId).Type<IntType>();
        descriptor.Field(p => p.InventoryId).Type<IntType>();
        descriptor.Field(p => p.Name).Type<StringType>();
        descriptor.Field(p => p.Price).Type<DecimalType>();
        descriptor.Field(p => p.CartItems).Type<ListType<CartItemType>>();
        descriptor.Field(p => p.Category).Type<CategoryType>();
        descriptor.Field(p => p.Inventory).Type<InventoryType>();
        descriptor.Field(p => p.OrderItems).Type<ListType<OrderItemType>>();
        descriptor.Field(p => p.Reviews).Type<ListType<ReviewType>>();
        descriptor.Field(p => p.Supplier).Type<SupplierType>();
        descriptor.Field(p => p.WishlistItems).Type<ListType<WishlistItemType>>();
    }
}
