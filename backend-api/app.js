const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/assets_management')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Connection Error: ', err));

// Mount Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/locations', locationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});