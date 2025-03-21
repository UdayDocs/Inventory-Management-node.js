const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

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

// Import routes
const categoryRoutes = require('./routes/categories');
const itemRoutes = require('./routes/items');
const viewRoutes = require('./routes/views');

// Route setup
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/', viewRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});