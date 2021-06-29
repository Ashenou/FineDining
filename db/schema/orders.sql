DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
	id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
	completed_at TIMESTAMP,
  order_status VARCHAR(255) DEFAULT 'Order Received',
	user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
  );
