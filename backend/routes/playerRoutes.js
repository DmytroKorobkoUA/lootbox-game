const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const Lootbox = require("../models/lootbox");

router.post('/register', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        let player = await Player.findOne({ username });

        if (!player) {
            player = new Player({ username });
            await player.save();
        }

        res.status(201).json(player);
    } catch (error) {
        console.error('Error registering player:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const players = await Player.find();
        res.status(200).json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:username', async (req, res) => {
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
});

router.put('/update/:username', async (req, res) => {
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
});

router.delete('/delete/:username', async (req, res) => {
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
});

module.exports = router;
