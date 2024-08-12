using HotChocolate.Types;
using GraphQLApi.Models;
namespace GraphQLApi.Types;
public class UserType : ObjectType<User>
{
    protected override void Configure(IObjectTypeDescriptor<User> descriptor)
    {
        descriptor.Field(u => u.UserId).Type<NonNullType<IdType>>();
        descriptor.Field(u => u.Username).Type<NonNullType<StringType>>();
        descriptor.Field(u => u.Firstname).Type<StringType>();
        descriptor.Field(u => u.Lastname).Type<StringType>();
        descriptor.Field(u => u.Email).Type<NonNullType<StringType>>();
        descriptor.Field(u => u.Token).Type<StringType>();
        descriptor.Field(u => u.EmailVerified).Type<BooleanType>();
        descriptor.Field(u => u.Upassword).Type<NonNullType<StringType>>();
        descriptor.Field(u => u.Urole).Type<StringType>();
        descriptor.Field(u => u.TokenExpiry).Type<DateTimeType>();
        descriptor.Field(u => u.PhoneNumber).Type<StringType>();
        descriptor.Field(u => u.ProfilePicture).Type<StringType>();
        descriptor.Field(u => u.Addresses).Type<ListType<AddressType>>();
        descriptor.Field(u => u.Carts).Type<ListType<CartType>>();
        descriptor.Field(u => u.Notifications).Type<ListType<NotificationType>>();
        descriptor.Field(u => u.Orders).Type<ListType<OrderType>>();
        descriptor.Field(u => u.Reviews).Type<ListType<ReviewType>>();
        descriptor.Field(u => u.Wishlist).Type<WishlistType>();
    }
}
