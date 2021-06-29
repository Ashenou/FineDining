-- Get all orders
SELECT orders.id,created_at,completed_at, user_id, (items.name) as item_name
FROM orders
JOIN users on users.id=user_id
JOIN order_items on order_id = orders.id
JOIN items on items.id = order_items.item_id
WHERE completed_at IS NULL
GROUP BY orders.id,item_name,user_id;
