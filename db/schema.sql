DROP DATABASE IF EXISTS commerce;
CREATE DATABASE commerce;

\c commerce; 

DROP TABLE IF EXISTS products;

CREATE TABLE products (
id SERIAL PRIMARY KEY,
price_id TEXT,
product_name VARCHAR(100) NOT NULL,
release_date TEXT NOT NULL,
image TEXT DEFAULT 'https://dummyimage.com/400x400/6e6c6e/e9e9f5.png&text=No+Image',
description TEXT NOT NULL,
price decimal (6,2) NOT NULL,
category VARCHAR(50) NOT NULL,
manufacturer TEXT NOT NULL
);


DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phonenumber TEXT NOT NULL,
    password TEXT NOT NULL
);



DROP TABLE IF EXISTS users_products;

CREATE TABLE users_products (
    identification SERIAL PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE,
    users_id INTEGER,
    products_id INTEGER ,
    quantity INTEGER DEFAULT 0,
    CHECK(quantity >= 0)
);

DROP TABLE IF EXISTS users_favorite;

CREATE TABLE users_favorite(
    created TIMESTAMP WITH TIME ZONE DEFAULT TO_TIMESTAMP(TO_CHAR(CURRENT_TIMESTAMP, 'MM/DD/YYYY'), 'MM/DD/YYYY'),
    favorites BOOLEAN DEFAULT TRUE,
    selected BOOLEAN DEFAULT FALSE,
    products_id INTEGER,
    users_id INTEGER
);


CREATE OR REPLACE FUNCTION set_selected_default() RETURNS TRIGGER AS $$
BEGIN
  NEW.selected := FALSE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_selected_default_trigger
BEFORE INSERT ON users_favorite
FOR EACH ROW
EXECUTE FUNCTION set_selected_default();




DROP TABLE IF EXISTS users_search;

CREATE TABLE users_search (
    created TIMESTAMP WITH TIME ZONE DEFAULT TO_TIMESTAMP(TO_CHAR(CURRENT_TIMESTAMP, 'MM/DD/YYYY'), 'MM/DD/YYYY'),
    selected BOOLEAN DEFAULT FALSE,
    products_id INTEGER,
    users_id INTEGER
);

CREATE OR REPLACE FUNCTION set_selected_default() RETURNS TRIGGER AS $$
BEGIN
  NEW.selected := FALSE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_selected_default_trigger
BEFORE INSERT ON users_search
FOR EACH ROW
EXECUTE FUNCTION set_selected_default();




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

