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
    res.send('Lootbox game server is running');
});

app.use('/api/players', playerRoutes);
app.use('/api/lootboxes', lootboxRoutes);
app.use('/api/rewards', rewardRoutes);

io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });

    socket.on('openLootbox', async (data) => {
        const { username, lootboxId } = data;
        try {
            const lootbox = await Lootbox.findById(lootboxId);

            if (!lootbox || lootbox.isOpened) {
                return socket.emit('error', { message: 'Loot box is already opened or does not exist' });
            }

            lootbox.isOpened = true;
            lootbox.openedBy = username;
            await lootbox.save();

            io.emit('lootboxOpened', {
                lootboxId: lootbox._id,
                reward: lootbox.rewards[0].name,
                imagePath: lootbox.rewards[0].imagePath
            });
        } catch (error) {
            console.error('Error opening lootbox:', error);
            socket.emit('error', { message: 'An error occurred while opening the loot box' });
        }
    });

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
