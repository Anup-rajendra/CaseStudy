using HotChocolate.Types;
using GraphQLApi.Models;
namespace GraphQLApi.Types;
public class OrderItemType : ObjectType<OrderItem>
{
    protected override void Configure(IObjectTypeDescriptor<OrderItem> descriptor)
    {
        descriptor.Field(oi => oi.OrderItemId).Type<NonNullType<IdType>>();
        descriptor.Field(oi => oi.OrderId).Type<IntType>();
        descriptor.Field(oi => oi.ProductId).Type<IntType>();
        descriptor.Field(oi => oi.Quantity).Type<IntType>();
        descriptor.Field(oi => oi.Price).Type<DecimalType>();
        descriptor.Field(oi => oi.Order).Type<OrderType>();
        descriptor.Field(oi => oi.Product).Type<ProductType>();
    }
}
