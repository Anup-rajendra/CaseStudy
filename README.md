Final Branch Setup Guide
Overview
This guide outlines the steps to prepare the database and environment for the final branch. Ensure that the database is in a new state with no previous data such as orders, shipments, or order items.

Steps to Follow
1. Prepare the Database
Ensure the database is in a new state:

Delete all existing data from relevant tables (e.g., orders, shipments, order items).

2. Remove Identity Property from Columns
To remove the IDENTITY property from columns in the wishlist, wishlist_item, and review tables, follow these steps:

Backup Your Data: Ensure you have a backup of your data before making schema changes.
Create a New Table: Create a new table with the same schema but without the IDENTITY property.
Copy Data: Transfer data from the old table to the new table.
Drop the Old Table: Remove the old table.
Rename the New Table: Rename the new table to the original table's name.
For detailed instructions on removing the IDENTITY property, refer to: SSMS Query to Remove Identity Property for a Column.


3. Update Product URLs
If the PhotoURL column does not exist in the Products table, add it using the following SQL command:


ALTER TABLE Products
ADD PhotoURL NVARCHAR(MAX);
Update the PhotoURL column with the following queries:


UPDATE Products SET PhotoURL = 'https://www.asus.com/media/Odin/Websites/global/Series/9.png' WHERE ProductID = 1;
UPDATE Products SET PhotoURL = 'https://m.media-amazon.com/images/I/8179uEK+gcL._AC_UF1000,1000_QL80_.jpg' WHERE ProductID = 2;
UPDATE Products SET PhotoURL = 'https://5.imimg.com/data5/SELLER/Default/2021/7/FL/FU/BT/13095201/14.jpg' WHERE ProductID = 3;
UPDATE Products SET PhotoURL = 'https://res.cloudinary.com/sharp-consumer-eu/image/fetch/w_3000,f_auto/https://s3.infra.brandquad.io/accounts-media/SHRP/DAM/origin/c7c9dc3a-b720-11ec-bd5f-eecbf35dfbeb.jpg' WHERE ProductID = 4;
UPDATE Products SET PhotoURL = 'https://images-cdn.ubuy.co.in/64e6c3f7ae0c047bce596027-batman-12-inch-rebirth-batman-action.jpg' WHERE ProductID = 5;


4. Increase the Size of PhotoURL Column
If the PhotoURL column already exists but needs to be resized, use the following SQL command:

ALTER TABLE Products
ALTER COLUMN PhotoURL NVARCHAR(MAX);

5. Run the following query to make the Shipments logic to work

-- Create the Shipments table
CREATE TABLE Shipments (
    ShipmentID INT PRIMARY KEY,
    OrderID INT,
    TrackingNumber NVARCHAR(50),
    ShipmentDate DATE,
    DeliveryDate DATE
);

-- Insert the data into the Shipments table
INSERT INTO Shipments (ShipmentID, OrderID, TrackingNumber, ShipmentDate, DeliveryDate)
VALUES
    (1, 1, 'TRACK123', '2024-08-02', '2024-09-11'),
    (2, 2, 'TRACK124', '2024-08-03', '2024-09-15'),
    (3, 3, 'TRACK125', '2024-08-04', '2024-09-11'),
    (4, 4, 'TRACK126', '2024-08-05', '2024-09-15'),
    (5, 5, 'TRACK127', '2024-08-06', '2024-09-15');



6.Create ProductNotifications Table

Create the ProductNotifications table with a composite primary key and foreign key constraints:


CREATE TABLE ProductNotifications (
    userid INT,
    productid INT,
    isread BIT NOT NULL,

    -- Define the composite primary key
    CONSTRAINT PK_ProductNotifications PRIMARY KEY (userid, productid),

    -- Add foreign key constraints
    CONSTRAINT FK_ProductNotifications_User FOREIGN KEY (userid) REFERENCES Users(userid),
    CONSTRAINT FK_ProductNotifications_Product FOREIGN KEY (productid) REFERENCES Products(productid)
);


# Running All Files
Ensure you run all relevant SQL scripts or files in the current branch to apply changes and updates.

# For Live Notifications
To enable live notifications from the admin, run the following command to start a RabbitMQ container:

docker run -d --hostname my-rabbit --name ecomm-rabbit -p 15672:15672 -p 5672:5672 rabbitmq:3-management

This command sets up RabbitMQ with the management plugin enabled, allowing you to manage queues and exchanges via a web interface.




# Pending Issues !!!

1. Wishlist Items Cannot Be bought
2. Ashish's Forgot Password Not merged + The Profile UI must be better.
