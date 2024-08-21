const express = require('express');
const router = express.Router();
const Lootbox = require('../models/lootbox');
const Player = require('../models/player');
const Reward = require('../models/reward');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/create', authenticateJWT, async (req, res) => {
    const { name, rewardIds, rarity } = req.body;

    if (!name || !Array.isArray(rewardIds) || !['common', 'rare', 'epic'].includes(rarity)) {
        return res.status(400).json({ error: 'Name, rewardIds, and valid rarity are required' });
    }

    try {
        const rewards = await Reward.find({ '_id': { $in: rewardIds } });
        if (rewards.length !== rewardIds.length) {
            return res.status(400).json({ error: 'One or more rewards do not exist' });
        }

        const newLootbox = new Lootbox({ name, rewards: rewardIds, rarity });
        await newLootbox.save();
        res.status(201).json(newLootbox);
    } catch (error) {
        console.error('Error creating loot box:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', authenticateJWT, async (req, res) => {
    try {
        const lootboxes = await Lootbox.find();
        res.status(200).json(lootboxes);
    } catch (error) {
        console.error('Error fetching loot boxes:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
        const lootbox = await Lootbox.findById(id).populate('rewards');
        if (!lootbox) {
            return res.status(404).json({ error: 'Loot box not found' });
        }
        res.status(200).json(lootbox);
    } catch (error) {
        console.error('Error fetching loot box:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/update/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { name, rewardIds, rarity } = req.body;

    try {
        const rewards = await Reward.find({ '_id': { $in: rewardIds } });
        if (rewardIds && rewards.length !== rewardIds.length) {
            return res.status(400).json({ error: 'One or more rewards do not exist' });
        }

        const updatedLootbox = await Lootbox.findByIdAndUpdate(
            id,
            { name, rewards: rewardIds, rarity },
            { new: true, runValidators: true }
        ).populate('rewards');

        if (!updatedLootbox) {
            return res.status(404).json({ error: 'Loot box not found' });
        }

        res.status(200).json(updatedLootbox);
    } catch (error) {
        console.error('Error updating loot box:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/delete/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLootbox = await Lootbox.findByIdAndDelete(id);
        if (!deletedLootbox) {
            return res.status(404).json({ error: 'Loot box not found' });
        }
        res.status(200).json({ message: 'Loot box deleted successfully' });
    } catch (error) {
        console.error('Error deleting loot box:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/open/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    try {
        const lootbox = await Lootbox.findById(id).populate('rewards');
        if (!lootbox) {
            return res.status(404).json({ error: 'Loot box not found' });
        }

        if (lootbox.isOpened) {
            return res.status(400).json({ error: 'Loot box is already opened' });
        }

        let reward;
        const rand = Math.random();
        let cumulativeProbability = 0;

        for (const item of lootbox.rewards) {
            cumulativeProbability += item.probability;
            if (rand < cumulativeProbability) {
                reward = item.name;
                break;
            }
        }

        lootbox.isOpened = true;
        lootbox.openedBy = username;
        await lootbox.save();

        const player = await Player.findOne({ username });
        if (player) {
            player.rewards.push(reward);
            await player.save();
        }

        res.status(200).json({ reward });
    } catch (error) {
        console.error('Error opening loot box:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
