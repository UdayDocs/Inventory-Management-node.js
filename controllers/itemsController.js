// controllers/itemsController.js
const pool = require('../db/pool');

exports.getAllItems = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createItem = async (req, res) => {
  const { name, description, quantity, price, category_id } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO items (name, description, quantity, price, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, quantity, price, category_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, quantity, price, category_id } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE items SET name = $1, description = $2, quantity = $3, price = $4, category_id = $5 WHERE id = $6 RETURNING *',
      [name, description, quantity, price, category_id, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
