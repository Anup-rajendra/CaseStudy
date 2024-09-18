using System;
using System.Collections.Generic;

namespace AdminAccess.Models;

public partial class Inventory
{
    public int InventoryId { get; set; }

    public int? StockQuantity { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
