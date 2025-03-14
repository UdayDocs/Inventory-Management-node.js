// routes/categories.js ( JSON API endpoints)
const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

// GET all categories (API)
router.get('/', categoriesController.getAllCategories);

// GET a single category by id (API)
router.get('/:id', categoriesController.getCategoryById);

// POST a new category (API)
router.post('/', categoriesController.createCategory);

// PUT (update) a category by id (API)
router.put('/:id', categoriesController.updateCategory);

// DELETE a category by id (API)
router.delete('/:id', categoriesController.deleteCategory);

module.exports = router;
