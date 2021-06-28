DROP TABLE IF EXISTS order_items CASCADE;


CREATE TABLE order_items(
	id SERIAL PRIMARY KEY,
	  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id),
    customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
