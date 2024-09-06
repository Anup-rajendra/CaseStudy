# There is one error in the database

In the orderitems table , the primary key for the table is orderid and orderitemid, which is not allowing us to add many orderitems with same orderid.


do this


-- Step 1: Drop the existing composite primary key
ALTER TABLE OrderItems
DROP CONSTRAINT IF EXISTS PK__OrderIte__57ED06A177CEF039;--replace it with your primary key constraint it (you can git it by runnig the query sp_help OrderItems)

-- Step 2: Add a new primary key on OrderItemID
ALTER TABLE OrderItems
ADD CONSTRAINT PK_OrderItemID PRIMARY KEY (OrderItemID);