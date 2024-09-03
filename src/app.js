const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./configs/db');
const errorHandler = require('./middleware/errorHandler');
const postRoutes = require('./routes/postRoutes');
const requirementRoutes = require('./routes/requirementRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api/posts', postRoutes);
app.use('/api/requirements', requirementRoutes);

app.use(errorHandler);

module.exports = app;
