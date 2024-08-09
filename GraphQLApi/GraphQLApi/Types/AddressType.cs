using HotChocolate.Types;
using GraphQLApi.Models;

namespace GraphQLApi.Types;
public class AddressType : ObjectType<Address>
{
    protected override void Configure(IObjectTypeDescriptor<Address> descriptor)
    {
        descriptor.Field(a => a.AddressId).Type<NonNullType<IdType>>();
        descriptor.Field(a => a.UserId).Type<IntType>();
        descriptor.Field(a => a.Street).Type<StringType>();
        descriptor.Field(a => a.City).Type<StringType>();
        descriptor.Field(a => a.State).Type<StringType>();
        descriptor.Field(a => a.ZipCode).Type<StringType>();
        descriptor.Field(a => a.User).Type<UserType>();

        
    }
}
