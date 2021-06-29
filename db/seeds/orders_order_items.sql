INSERT INTO orders (created_at,completed_at,user_id) VALUES (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,2);
INSERT INTO orders (created_at,completed_at,user_id) VALUES (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,3);
INSERT INTO orders (created_at,completed_at,user_id) VALUES (CURRENT_TIMESTAMP,NULL,4);
INSERT INTO orders (created_at,completed_at,user_id) VALUES (CURRENT_TIMESTAMP,NULL,2);



INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (3,3,1,2);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (4,2,1,4);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (2,3,1,3);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (1,5,1,2);

INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (3,4,1,2);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (3,5,1,2);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (4,2,1,2);



SELECT orders.id,created_at,completed_at, user_id, (items.name) as item_name
          FROM orders
          JOIN users on users.id=user_id
          JOIN order_items on order_id = orders.id
          JOIN items on items.id = order_items.item_id
          WHERE completed_at IS NULL
          GROUP BY orders.id,item_name,user_id;
