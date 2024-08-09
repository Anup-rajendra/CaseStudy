using HotChocolate.Types;
using GraphQLApi.Models;
namespace GraphQLApi.Types;
public class PaymentType : ObjectType<Payment>
{
    protected override void Configure(IObjectTypeDescriptor<Payment> descriptor)
    {
        descriptor.Field(p => p.PaymentId).Type<NonNullType<IdType>>();
        descriptor.Field(p => p.OrderId).Type<IntType>();
        descriptor.Field(p => p.Amount).Type<DecimalType>();
        descriptor.Field(p => p.PaymentDate).Type<DateType>();
        descriptor.Field(p => p.Order).Type<OrderType>();
    }
}
