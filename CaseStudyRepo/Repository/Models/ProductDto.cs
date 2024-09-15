﻿namespace RetailRestAPI.Models
{
    public class ProductDto
    {
        public int ProductID { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string CategoryName { get; set; }
        public int StockQuantity { get; set; }
    }
}
