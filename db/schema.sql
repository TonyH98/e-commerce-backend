DROP DATABASE IF EXISTS commerce;
CREATE DATABASE commerce;

\c commerce; 



CREATE TABLE products (
id SERIAL PRIMARY KEY,
product_name VARCHAR(100) NOT NULL,
release_date TEXT NOT NULL,
image TEXT DEFAULT 'https://dummyimage.com/400x400/6e6c6e/e9e9f5.png&text=No+Image',
description TEXT NOT NULL,
price decimal (6,2) NOT NULL,
category VARCHAR(50) NOT NULL,
favorites BOOLEAN DEFAULT false,
cart_counter INTEGER,
CHECK(cart_counter >= 0),
manufacturer TEXT NOT NULL
);


DROP TABLE IF EXISTS users;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phoneNumber TEXT NOT NULL,
    password TEXT NOT NULL
);



DROP TABLE IF EXISTS users_products;

CREATE TABLE users_products(
    identification SERIAL PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE,
    products_id INTEGER,
    users_id INTEGER
);



DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
 id SERIAL PRIMARY KEY,
 reviewer TEXT,
 title TEXT,
 content TEXT,
 rating NUMERIC,
 CHECK (rating >= 0 AND rating <= 5),
 product_id INTEGER REFERENCES products (id),
 user_id INTEGER REFERENCES users (id)
 ON DELETE CASCADE
);

