using HotChocolate.Types;
using RepositoryLayer.Models;
namespace OrderProcessing.Types;
public class InventoryType : ObjectType<Inventory>
{
    protected override void Configure(IObjectTypeDescriptor<Inventory> descriptor)
    {
        descriptor.Field(i => i.InventoryId).Type<NonNullType<IdType>>();
        descriptor.Field(i => i.StockQuantity).Type<IntType>();
        descriptor.Field(i => i.Products).Type<ListType<ProductType>>();
    }
}
