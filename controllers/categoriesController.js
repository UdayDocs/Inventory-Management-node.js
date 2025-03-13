// controllers/categoriesController.js
const pool = require('../db/pool');

exports.getAllCategories = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // ON DELETE CASCADE in table ensures related items are deleted
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
