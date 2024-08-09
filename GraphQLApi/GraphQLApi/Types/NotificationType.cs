using HotChocolate.Types;
using GraphQLApi.Models;
namespace GraphQLApi.Types;
public class NotificationType : ObjectType<Notification>
{
    protected override void Configure(IObjectTypeDescriptor<Notification> descriptor)
    {
        descriptor.Field(n => n.NotificationId).Type<NonNullType<IdType>>();
        descriptor.Field(n => n.UserId).Type<IntType>();
        descriptor.Field(n => n.Message).Type<StringType>();
        descriptor.Field(n => n.User).Type<UserType>();
    }
}
