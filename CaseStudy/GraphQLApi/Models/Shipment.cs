using System;
using System.Collections.Generic;

namespace GraphQLApi.Models;

public partial class Shipment
{
    public int ShipmentId { get; set; }

    public int? OrderId { get; set; }

    public string? TrackingNumber { get; set; }

    public DateOnly? ShipmentDate { get; set; }

    public virtual Order? Order { get; set; }
}
