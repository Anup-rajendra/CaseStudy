# There is one error in the database

In the orderitems table , the primary key for the table is orderid and orderitemid, which is not allowing us to add many orderitems with same orderid.


do this


-- Step 1: Drop the existing composite primary key
ALTER TABLE OrderItems
DROP CONSTRAINT IF EXISTS PK__OrderIte__57ED06A177CEF039;--replace it with your primary key constraint it (you can git it by runnig the query sp_help OrderItems)

-- Step 2: Add a new primary key on OrderItemID
ALTER TABLE OrderItems
ADD CONSTRAINT PK_OrderItemID PRIMARY KEY (OrderItemID);




Add these lines in the 25th line of the index.js file of react app for the chatbox to work

// Dynamically add chatbot script
const script = document.createElement('script');
script.src = 'https://widget.lovi.ai/lovi-widget.min.js';
script.setAttribute('lovi-id', 'WUjtGg0aasNdWeK1bswgu5xMIRC2');
script.async = true;
document.body.appendChild(script);

