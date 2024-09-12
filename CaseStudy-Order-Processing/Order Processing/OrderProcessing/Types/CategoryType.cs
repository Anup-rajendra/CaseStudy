using HotChocolate.Types;
using RepositoryLayer.Models;
namespace OrderProcessing.Types;
public class CategoryType : ObjectType<Category>
{
    protected override void Configure(IObjectTypeDescriptor<Category> descriptor)
    {
        descriptor.Field(c => c.CategoryId).Type<NonNullType<IdType>>();
        descriptor.Field(c => c.CategoryName).Type<StringType>();
        descriptor.Field(c => c.Products).Type<ListType<ProductType>>();
    }
}
