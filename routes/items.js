// routes/items.js
const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

// GET all items
router.get('/', itemsController.getAllItems);

// GET a single item by id
router.get('/:id', itemsController.getItemById);

// POST a new item
router.post('/', itemsController.createItem);

// PUT (update) an item by id
router.put('/:id', itemsController.updateItem);

// DELETE an item by id
router.delete('/:id', itemsController.deleteItem);

module.exports = router;
