-- PostgreSQL starter schema (not wired to a server in this build)
CREATE TABLE users(id SERIAL PRIMARY KEY,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN('customer','seller','admin')));
CREATE TABLE products(id SERIAL PRIMARY KEY,seller_id INT REFERENCES users(id),name TEXT NOT NULL,price_inr INT CHECK(price_inr>0),calories INT,stock INT DEFAULT 0,organic_claimed BOOLEAN DEFAULT FALSE,organic_verified BOOLEAN DEFAULT FALSE);
CREATE TABLE orders(id SERIAL PRIMARY KEY,user_id INT REFERENCES users(id),total_inr INT NOT NULL,status TEXT NOT NULL DEFAULT 'placed');
CREATE TABLE order_items(order_id INT REFERENCES orders(id),product_id INT REFERENCES products(id),qty INT CHECK(qty>0),PRIMARY KEY(order_id,product_id));
