using HotChocolate.Types;
using GraphQLApi.Models;
using Microsoft.VisualBasic;

namespace GraphQLApi.Types
{
    public class UserType:ObjectType<User>
    {
        protected override void Configure(IObjectTypeDescriptor<User> descriptor)
        {
            descriptor.Field(x => x.UserId).Type<NonNullType<IdType>>();
            descriptor.Field(x => x.Username).Type<NonNullType<StringType>>();
            descriptor.Field(x => x.Firstname).Type<StringType>();
            descriptor.Field(x => x.Lastname).Type<StringType>();
            descriptor.Field(x => x.Email).Type<NonNullType<StringType>>();
            descriptor.Field(x => x.Token).Type<StringType>();
            descriptor.Field(x => x.EmailVerified).Type<NonNullType<BooleanType>>();
            descriptor.Field(x => x.Upassword).Type<NonNullType<StringType>>();
            descriptor.Field(x => x.Urole).Type<StringType>();
            descriptor.Field(x => x.TokenExpiry).Type<DateTimeType>();
            descriptor.Field(x => x.PhoneNumber).Type<StringType>();
            descriptor.Field(x => x.ProfilePicture).Type<StringType>();
            descriptor.Field(x => x.Addresses).Type<ListType<AddressType>>();
            descriptor.Field(x => x.Notifications).Type<ListType<NotificationType>>();
            descriptor.Field(x => x.Carts).Type<ListType<CartType>>();
            descriptor.Field(x => x.Orders).Type<ListType<OrderType>>();
            descriptor.Field(x => x.Reviews).Type<ListType<ReviewType>>();
            descriptor.Field(x => x.Wishlist).Type<WishlistType>().Nullable();
        }
    }
}
