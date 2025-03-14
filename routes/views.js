// routes/views.js
const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

/**
 * Home Page
 */
router.get('/', (req, res) => {
  res.render('index');
});

/**
 * CATEGORY CRUD
 */

// List all categories
router.get('/categories', async (req, res) => {
  try {
    const { rows: categories } = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.render('categories', { categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send("Error loading categories view");
  }
});

// Render form to create a new category
router.get('/categories/new', (req, res) => {
  res.render('new_category');
});

// Process new category form submission
router.post('/categories/new', async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query('INSERT INTO categories (name, description) VALUES ($1, $2)', [name, description]);
    res.redirect('/categories');
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).send("Error creating category");
  }
});

// Render form to edit an existing category
router.get('/categories/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).send("Category not found");
    }
    res.render('edit_category', { category: rows[0] });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).send("Error loading edit category form");
  }
});

// Process edit form submission for category
router.post('/categories/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    await pool.query('UPDATE categories SET name = $1, description = $2 WHERE id = $3', [name, description, id]);
    res.redirect('/categories');
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).send("Error updating category");
  }
});

// Process category deletion
router.post('/categories/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    res.redirect('/categories');
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).send("Error deleting category");
  }
});

/**
 * ITEM CRUD
 */

// List all items (with category names and rupee symbol)
router.get('/items', async (req, res) => {
  try {
    const { rows: items } = await pool.query(`
      SELECT items.id, items.name, items.description, items.quantity, items.price,
             categories.name AS category_name, items.category_id
      FROM items
      LEFT JOIN categories ON items.category_id = categories.id
      ORDER BY items.id ASC
    `);
    res.render('items', { items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send("Error loading items view");
  }
});

// Render form to create a new item
router.get('/items/new', async (req, res) => {
  try {
    // Get categories for the dropdown list
    const { rows: categories } = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.render('new_item', { categories });
  } catch (error) {
    console.error('Error loading new item form:', error);
    res.status(500).send("Error loading new item form");
  }
});

// Process new item form submission
router.post('/items/new', async (req, res) => {
  const { name, description, quantity, price, category_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO items (name, description, quantity, price, category_id) VALUES ($1, $2, $3, $4, $5)',
      [name, description, quantity, price, category_id]
    );
    res.redirect('/items');
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).send("Error creating item");
  }
});

// Render form to edit an existing item
router.get('/items/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Retrieve the item data
    const { rows: items } = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (items.length === 0) {
      return res.status(404).send("Item not found");
    }
    const item = items[0];
    // Retrieve categories for dropdown
    const { rows: categories } = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.render('edit_item', { item, categories });
  } catch (error) {
    console.error('Error loading edit item form:', error);
    res.status(500).send("Error loading edit item form");
  }
});

// Process edit form submission for item
router.post('/items/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, quantity, price, category_id } = req.body;
  try {
    await pool.query(
      'UPDATE items SET name = $1, description = $2, quantity = $3, price = $4, category_id = $5 WHERE id = $6',
      [name, description, quantity, price, category_id, id]
    );
    res.redirect('/items');
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).send("Error updating item");
  }
});

// Process item deletion
router.post('/items/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM items WHERE id = $1', [id]);
    res.redirect('/items');
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send("Error deleting item");
  }
});

module.exports = router;
