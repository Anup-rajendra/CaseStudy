using HotChocolate.Types;
using GraphQLApi.Models;
namespace GraphQLApi.Types;
public class ReviewType : ObjectType<Review>
{
    protected override void Configure(IObjectTypeDescriptor<Review> descriptor)
    {
        descriptor.Field(r => r.ReviewId).Type<NonNullType<IdType>>();
        descriptor.Field(r => r.ProductId).Type<IntType>();
        descriptor.Field(r => r.UserId).Type<IntType>();
        descriptor.Field(r => r.Rating).Type<IntType>();
        descriptor.Field(r => r.Comment).Type<StringType>();
        descriptor.Field(r => r.ReviewDate).Type<DateType>();
        descriptor.Field(r => r.Product).Type<ProductType>();
        descriptor.Field(r => r.User).Type<UserType>();
    }
}
