using System;
using System.Collections.Generic;

namespace GraphQLApi.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int? OrderId { get; set; }

    public decimal? Amount { get; set; }

    public DateOnly? PaymentDate { get; set; }

    public virtual Order? Order { get; set; }
}
