using HotChocolate.Types;
using GraphQLApi.Models;
namespace GraphQLApi.Types;
public class ShipmentType : ObjectType<Shipment>
{
    protected override void Configure(IObjectTypeDescriptor<Shipment> descriptor)
    {
        descriptor.Field(s => s.ShipmentId).Type<NonNullType<IdType>>();
        descriptor.Field(s => s.OrderId).Type<IntType>();
        descriptor.Field(s => s.TrackingNumber).Type<StringType>();
        descriptor.Field(s => s.ShipmentDate).Type<DateType>();
        descriptor.Field(s => s.Order).Type<OrderType>();
    }
}
