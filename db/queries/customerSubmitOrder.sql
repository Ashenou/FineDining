-- Creates the order to get orderId
INSERT INTO orders(created_at,user_id) VALUES(DATE(),$1) RETURNING id;

-- Creates the list of items in that orderId(should be in a for loop with if conditions)
-- $3 should be 1
-- $4 should be in cookie
INSERT INTO order_items(orders_id,items_id,restaurant_id,customer_id) VALUES ($1,$2,$3,$4);
