const express = require('express');
const mongoose = require('mongoose');
const playerRoutes = require('./routes/playerRoutes');
const lootboxRoutes = require('./routes/lootboxRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
    res.send('Lootbox game server is running');
});

app.use('/api/players', playerRoutes);
app.use('/api/lootboxes', lootboxRoutes);
app.use('/api/rewards', rewardRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
