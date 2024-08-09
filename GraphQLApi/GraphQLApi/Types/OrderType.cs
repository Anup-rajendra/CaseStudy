using HotChocolate.Types;
using GraphQLApi.Models;
namespace GraphQLApi.Types;
public class OrderType : ObjectType<Order>
{
    protected override void Configure(IObjectTypeDescriptor<Order> descriptor)
    {
        descriptor.Field(o => o.OrderId).Type<NonNullType<IdType>>();
        descriptor.Field(o => o.UserId).Type<IntType>();
        descriptor.Field(o => o.OrderDate).Type<DateTimeType>();
        descriptor.Field(o => o.TotalAmount).Type<DecimalType>();
        descriptor.Field(o => o.OrderItems).Type<ListType<OrderItemType>>();
        descriptor.Field(o => o.Payment).Type<PaymentType>();
        descriptor.Field(o => o.Shipment).Type<ShipmentType>();
        descriptor.Field(o => o.User).Type<UserType>();
    }
}
