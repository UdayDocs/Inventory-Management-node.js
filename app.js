// app.js
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();
const port = 8080;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS view engine and express-ejs-layouts
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout'); // default layout (views/layout.ejs)

// Import API routes (remain available if needed)
const categoryRoutes = require('./routes/categories');
const itemRoutes = require('./routes/items');

// Import UI view routes (for full CRUD via forms)
const viewRoutes = require('./routes/views');

// API routes (accessed via /api)
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);

// UI routes (CRUD pages)
app.use('/', viewRoutes);

app.listen(port, () => {
  console.log(`Express app listening on port ${port}!`);
});
