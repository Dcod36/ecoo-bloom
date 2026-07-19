const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));


// Serve uploaded ID documents as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const wasteRoutes = require('./routes/wasteRoutes');
const issueRoutes = require('./routes/issueRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/issues', issueRoutes);

app.get('/', (req, res) => {
    res.send('EcoBloom API is running');
});

// Database Connection
const connectDB = require('./config/db');
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
