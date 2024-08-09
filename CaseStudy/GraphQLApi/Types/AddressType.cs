using GraphQLApi.Models;

namespace GraphQLApi.Types
{
    public class AddressType :ObjectType<Address>
    {
        protected override void Configure(IObjectTypeDescriptor<Address> descriptor)
        {
            descriptor.Field(x => x.AddressId).Type<NonNullType<IdType>>();
            descriptor.Field(x => x.UserId).Type<IdType>();
            descriptor.Field(x => x.Street).Type<StringType>();
            descriptor.Field(x => x.City).Type<StringType>();
            descriptor.Field(x => x.State).Type<StringType>();
            descriptor.Field(x => x.ZipCode).Type<StringType>();
        }
    }
}
