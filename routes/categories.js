// routes/categories.js
const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

// GET all categories
router.get('/', categoriesController.getAllCategories);

// GET a single category by id
router.get('/:id', categoriesController.getCategoryById);

// POST a new category
router.post('/', categoriesController.createCategory);

// PUT (update) a category by id
router.put('/:id', categoriesController.updateCategory);

// DELETE a category by id
router.delete('/:id', categoriesController.deleteCategory);

module.exports = router;
