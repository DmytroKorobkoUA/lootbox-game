const Player = require('../models/player');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        let player = await Player.findOne({ username });

        if (player) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        player = new Player({ username, password });
        await player.save();
        await exports.updateOnlineStatus(username, true);
        res.status(201).json({ message: 'Player registered successfully' });
    } catch (error) {
        console.error('Error registering player:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const player = await Player.findOne({ username });
        if (!player) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await player.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        await exports.updateOnlineStatus(username, true);

        const token = jwt.sign({ id: player._id, username: player.username }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({ token, username: player.username });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllPlayers = async (req, res) => {
    try {
        const players = await Player.find();
        res.status(200).json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getPlayerByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const player = await Player.findOne({ username });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.status(200).json(player);
    } catch (error) {
        console.error('Error fetching player:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updatePlayer = async (req, res) => {
    const { username } = req.params;
    const { rewards, isOnline } = req.body;

    try {
        const updatedPlayer = await Player.findOneAndUpdate(
            { username },
            { rewards, isOnline },
            { new: true, runValidators: true }
        );

        if (!updatedPlayer) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.status(200).json(updatedPlayer);
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deletePlayer = async (req, res) => {
    const { username } = req.params;

    try {
        const deletedPlayer = await Player.findOneAndDelete({ username });
        if (!deletedPlayer) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.status(200).json({ message: 'Player deleted successfully' });
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const players = await Player.find({})
            .sort({ totalBoxesOpened: -1 })
            .limit(5)
            .select('username totalBoxesOpened commonBoxesOpened rareBoxesOpened epicBoxesOpened legendaryBoxesOpened isOnline');

        res.status(200).json(players);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateOnlineStatus = async (username, isOnline) => {
    try {
        await Player.findOneAndUpdate({ username }, { isOnline });
    } catch (error) {
        console.error('Error updating online status:', error);
    }
};

exports.logout = async (req, res) => {
    const { username } = req.body;

    try {
        await exports.updateOnlineStatus(username, false);

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
