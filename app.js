// app.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const categoryRoutes = require('./routes/categories');
const itemRoutes = require('./routes/items');

// Set up routes
app.use('/categories', categoryRoutes);
app.use('/items', itemRoutes);

// Home route
app.get('/', (req, res) => {
  res.send("Welcome to the Inventory Management App");
});

app.listen(port, () => {
  console.log(`Express app listening on port ${port}!`);
});
