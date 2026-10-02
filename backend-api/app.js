const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const regionRoutes = require('./routes/regionRoutes');
const townshipRoutes = require('./routes/townshipRoutes');
const assetRoutes = require('./routes/assetRoutes');
require('dotenv').config();

// Apply toJSON transform to ALL schemas globally
mongoose.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

// Same for toObject if you ever use .toObject() instead of .toJSON()
mongoose.set('toObject', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});


const app = express();

// CORS Configuration - Allow all origins for development
// For production, specify exact origins
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/assets_management')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Connection Error: ', err));

// Mount Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/regions', regionRoutes);
app.use('/api/v1/townships', townshipRoutes);
app.use('/api/v1/assets', assetRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});