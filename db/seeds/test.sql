INSERT INTO orders (created_at,accepted_at,completed_at,user_id) VALUES (CURRENT_TIMESTAMP,NULL,CURRENT_TIMESTAMP,2);
INSERT INTO orders (created_at,accepted_at,completed_at,user_id) VALUES (CURRENT_TIMESTAMP,NULL,CURRENT_TIMESTAMP,3);
INSERT INTO orders (created_at,accepted_at,completed_at,user_id) VALUES (CURRENT_TIMESTAMP,NULL,NULL,4);
INSERT INTO orders (created_at,accepted_at,completed_at,user_id) VALUES (CURRENT_TIMESTAMP,NULL,NULL,2);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (3,3,1,2);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (4,2,1,4);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (2,3,1,3);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (1,5,1,2);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (3,4,1,2);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (3,5,1,2);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (4,2,1,2);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (4,1,1,2);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (4,5,1,2);
INSERT INTO order_items (order_id, item_id, restaurant_id, customer_id) VALUES (4,4,1,2);