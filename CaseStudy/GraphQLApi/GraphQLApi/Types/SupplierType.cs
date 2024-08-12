using HotChocolate.Types;
using GraphQLApi.Models;
namespace GraphQLApi.Types;
public class SupplierType : ObjectType<Supplier>
{
    protected override void Configure(IObjectTypeDescriptor<Supplier> descriptor)
    {
        descriptor.Field(s => s.SupplierId).Type<NonNullType<IdType>>();
        descriptor.Field(s => s.Name).Type<StringType>();
        descriptor.Field(s => s.Products).Type<ListType<ProductType>>();
    }
}
