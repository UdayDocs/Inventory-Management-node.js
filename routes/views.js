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

// List all categories with filtering and sorting
router.get('/categories', async (req, res) => {
  try {
    const { search, sort } = req.query;
    let query = 'SELECT * FROM categories';
    const params = [];
    
    // Add search filter
    if (search) {
      query += ' WHERE name ILIKE $1 OR description ILIKE $1';
      params.push(`%${search}%`);
    }

    // Add sorting
    const sortOptions = {
      'id_asc': 'id ASC',
      'id_desc': 'id DESC',
      'name_asc': 'name ASC',
      'name_desc': 'name DESC'
    };
    const sortOrder = sortOptions[sort] || 'id ASC';
    query += ` ORDER BY ${sortOrder}`;

    const { rows: categories } = await pool.query(query,params);
    res.render('categories' ,{categories, search, sort});

  } catch {

  }
})

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

// List all items with filtering and sorting
router.get('/items', async (req, res) => {
  try {
    const { search, category, min_price, max_price, sort } = req.query;
    let query = `
      SELECT items.id, items.name, items.description, items.quantity, items.price,
             categories.name AS category_name, items.category_id
      FROM items
      LEFT JOIN categories ON items.category_id = categories.id
    `;
    const params = [];
    let whereClauses = [];

    // Add search filter
    if (search) {
      whereClauses.push('items.name ILIKE $' + (params.length + 1));
      params.push(`%${search}%`);
    }

    // Add category filter
    if (category) {
      whereClauses.push('category_id = $' + (params.length + 1));
      params.push(category);
    }

    // Add price range filter
    if (min_price) {
      whereClauses.push('price >= $' + (params.length + 1));
      params.push(min_price);
    }
    if (max_price) {
      whereClauses.push('price <= $' + (params.length + 1));
      params.push(max_price);
    }

    // Combine WHERE clauses
    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    // Add sorting
    const sortOptions = {
      'name_asc': 'items.name ASC',
      'name_desc': 'items.name DESC',
      'price_asc': 'items.price ASC',
      'price_desc': 'items.price DESC',
      'quantity_asc': 'items.quantity ASC',
      'quantity_desc': 'items.quantity DESC'
    };
    const sortOrder = sortOptions[sort] || 'items.id ASC';
    query += ` ORDER BY ${sortOrder}`;

    // Get categories for dropdown
    const { rows: categories } = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    
    // Execute items query
    const { rows: items } = await pool.query(query, params);
    
    res.render('items', { 
      items, 
      categories,
      search,
      category,
      min_price,
      max_price,
      sort
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send("Error loading items view");
  }
});

// Render form to create a new item
router.get('/items/new', async (req, res) => {
  try {
    const { rows: categories } = await pool.query('SELECT * FROM categories ORDER BY name ASC');
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
    const { rows: items } = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (items.length === 0) {
      return res.status(404).send("Item not found");
    }
    const item = items[0];
    const { rows: categories } = await pool.query('SELECT * FROM categories ORDER BY name ASC');
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