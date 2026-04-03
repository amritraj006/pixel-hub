require('./config/env');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const mainRoutes = require('./routes/mainRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', mainRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
