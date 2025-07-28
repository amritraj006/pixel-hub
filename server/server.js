const express = require('express');
const app = express();
const mainRoutes = require('./routes/mainRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// All routes
app.use('/', mainRoutes);

// Start server
app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});
