const express = require('express');
const mongoose = require('mongoose');
const playerRoutes = require('./routes/playerRoutes');
const lootboxRoutes = require('./routes/lootboxRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const Lootbox = require('./models/lootbox');
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
    res.send('Loot box game server is running');
});

app.use('/api/players', playerRoutes);
app.use('/api/lootboxes', lootboxRoutes);
app.use('/api/rewards', rewardRoutes);

let gameStarted = false;
let lootboxes = [];

io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('disconnect', async () => {
        console.log('user disconnected', socket.id);

        const connectedSockets = await io.fetchSockets();

        if (connectedSockets.length === 0) {
            gameStarted = false;
            await Lootbox.deleteMany({});

            io.emit('gameEnded');
        }
    });

    socket.on('startGame', async () => {
        const connectedSockets = await io.fetchSockets();

        if (connectedSockets.length < 2) {
            return socket.emit('error', { message: 'Not enough players to start the game' });
        }

        lootboxes = await Lootbox.find();
        lootboxes = lootboxes.sort(() => Math.random() - 0.5);
        gameStarted = true;

        io.emit('gameStarted', { lootboxes });
    });

    socket.on('endGame', async () => {
        gameStarted = false;
        await Lootbox.deleteMany({});

        io.emit('gameEnded');
    });

    socket.on('lootboxOpened', ({ lootboxId, reward, imagePath }) => {
        io.emit('lootboxOpened', { lootboxId, reward, imagePath });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
