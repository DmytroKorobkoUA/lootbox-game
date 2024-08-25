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

let gameInitiated = false;
let gameStarted = false;
let lootboxes = [];
let countdownTimer;
let countdownValue = 5;
let playersInGame = [];
let openedLootboxes = [];
let gameLog = [];

io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('disconnect', async () => {
        console.log('user disconnected', socket.id);

        const connectedSockets = await io.fetchSockets();

        if (connectedSockets.length === 0) {
            gameStarted = false;
            gameInitiated = false;
            playersInGame = [];
            clearInterval(countdownTimer);
            await Lootbox.deleteMany({});
            io.emit('gameEnded');
        }
    });

    socket.on('initGame', async ({ username }) => {
        if (!gameInitiated) {
            gameInitiated = true;
            countdownValue = 5;
            playersInGame = [username];
            io.emit('playersInGameUpdate', playersInGame);
            io.emit('gameInitiated', { countdown: countdownValue });

            countdownTimer = setInterval(async () => {
                countdownValue -= 1;
                io.emit('gameInitiated', { countdown: countdownValue });

                if (countdownValue <= 0) {
                    clearInterval(countdownTimer);
                    if (playersInGame.length > 1) {
                        gameStarted = true;
                        lootboxes = await Lootbox.find().sort({ createdAt: -1 }).limit(25);
                        lootboxes = lootboxes.sort(() => Math.random() - 0.5);
                        openedLootboxes = [];
                        gameLog = [];
                        io.emit('gameStarted', { lootboxes });
                    } else {
                        gameInitiated = false;
                        playersInGame = [];
                        io.emit('playersInGameUpdate', playersInGame);
                    }
                }
            }, 1000);
        }
    });

    socket.on('joinGame', async ({username}) => {
        if (!playersInGame.includes(username)) {
            playersInGame.push(username);
            io.emit('playersInGameUpdate', playersInGame);
        }

        if (playersInGame.length >= 5) {
            clearInterval(countdownTimer);
            gameStarted = true;
            gameInitiated = true;
            lootboxes = await Lootbox.find();
            lootboxes = lootboxes.sort(() => Math.random() - 0.5);
            openedLootboxes = [];
            gameLog = [];
            io.emit('gameStarted', {lootboxes});
        }
    });

    socket.on('lootboxOpened', async ({lootboxId, reward, imagePath, username, rarity}) => {
        openedLootboxes.push(lootboxId);
        gameLog.push(`Player ${username} opened ${rarity} box and got ${reward}`);
        io.emit('lootboxOpened', {lootboxId, reward, imagePath});
        io.emit('gameLogUpdate', gameLog);

        if (openedLootboxes.length >= 25) {
            gameStarted = false;
            gameInitiated = false;
            gameLog = [];
            playersInGame = [];
            clearInterval(countdownTimer);
            await Lootbox.deleteMany({});
            io.emit('gameEnded');
        }
    });

    socket.on('endGame', async ({ username }) => {
        playersInGame = playersInGame.filter(player => player !== username);
        io.emit('playersInGameUpdate', playersInGame);

        if (playersInGame.length === 0) {
            gameStarted = false;
            gameInitiated = false;
            gameLog = [];
            clearInterval(countdownTimer);
            await Lootbox.deleteMany({});
            io.emit('gameEnded');
        } else {
            if (!playersInGame.includes(username)) {
                socket.emit('gameEnded');
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
