const express = require('express');
const mongoose = require('mongoose');
const playerRoutes = require('./routes/playerRoutes');
const lootboxRoutes = require('./routes/lootboxRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
    }
});

const setupSockets = require('./sockets/gameSockets');

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
    res.send('Loot box game server is running');
});
app.use('/api/players', playerRoutes);
app.use('/api/lootboxes', lootboxRoutes);
app.use('/api/rewards', rewardRoutes);

setupSockets(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
