#!/usr/bin/env node
require('dotenv').config();
const { Client } = require('pg');

const SQL = `
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 0,
  price NUMERIC,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);

INSERT INTO categories (name, description)
VALUES
  ('Electronics', 'Electronic gadgets and devices'),
  ('Furniture', 'Home and office furniture');

INSERT INTO items (name, description, quantity, price, category_id)
VALUES
  ('Smartphone', 'Latest smartphone model', 100, 699.99, 1),
  ('Laptop', 'High performance laptop', 50, 1299.99, 1),
  ('Desk Chair', 'Ergonomic office chair', 20, 199.99, 2),
  ('Coffee Table', 'Modern coffee table', 15, 299.99, 2);
`;

async function main() {

  console.log("Starting database seeding...");

  const client = new Client({
    connectionString: process.env.DB_CONNECTION ||
    `postgresql://${encodeURIComponent(process.env.DB_USERNAME)}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  ssl: process.env.NODE_ENV === 'production' ? { 
    rejectUnauthorized: false 
  } : false
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

main();