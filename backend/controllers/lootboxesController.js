const Lootbox = require('../models/lootbox');
const Player = require('../models/player');
const Reward = require('../models/reward');

exports.getAllLootboxes = async (req, res) => {
    try {
        const lootboxes = await Lootbox.find();
        res.json(lootboxes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteAllLootboxes = async (req, res) => {
    try {
        await Lootbox.deleteMany({});
        res.json({ message: 'All lootboxes have been deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createLootboxes = async (req, res) => {
    try {
        const rewards = await Reward.find();
        const lootboxes = [];
        const numLegendary = 1;
        const numEpic = 3;
        const numRare = 6;
        const numCommon = 25 - numLegendary - numEpic - numRare;

        const rewardSets = {
            legendary: rewards.filter(r => r.rarity === 'legendary'),
            epic: rewards.filter(r => r.rarity === 'epic'),
            rare: rewards.filter(r => r.rarity === 'rare'),
            common: rewards.filter(r => r.rarity === 'common'),
        };

        const createLootbox = async (rarity, num) => {
            for (let i = 0; i < num; i++) {
                const rewardOptions = rewardSets[rarity];
                if (rewardOptions.length === 0) {
                    console.warn(`No rewards found for rarity ${rarity}`);
                    continue;
                }

                const reward = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];
                const newLootbox = new Lootbox({
                    rewards: [reward._id],
                    rarity,
                    reward: reward.name,
                    imagePath: reward.imagePath
                });
                await newLootbox.save();
                lootboxes.push(newLootbox);
            }
        };

        await createLootbox('legendary', numLegendary);
        await createLootbox('epic', numEpic);
        await createLootbox('rare', numRare);
        await createLootbox('common', numCommon);

        res.status(200).json(lootboxes);
    } catch (error) {
        console.error('Error creating lootboxes:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getLootboxById = async (req, res) => {
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
};

exports.updateLootbox = async (req, res) => {
    const { id } = req.params;
    const { rewardIds, rarity } = req.body;

    try {
        const rewards = await Reward.find({ '_id': { $in: rewardIds } });
        if (rewardIds && rewards.length !== rewardIds.length) {
            return res.status(400).json({ error: 'One or more rewards do not exist' });
        }

        const updatedLootbox = await Lootbox.findByIdAndUpdate(
            id,
            { rewards: rewardIds, rarity },
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
};

exports.deleteLootbox = async (req, res) => {
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
};

exports.openLootbox = async (req, res) => {
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

        lootbox.rewards.forEach(item => {
            cumulativeProbability += item.probability;
            if (rand < cumulativeProbability) {
                reward = item;
            }
        });

        if (!reward) {
            return res.status(400).json({ error: 'No reward found' });
        }

        lootbox.isOpened = true;
        lootbox.openedBy = username;

        await lootbox.save();

        const player = await Player.findOne({ username });
        if (player) {
            player.rewards.push(reward.name);
            await player.save();
        }

        res.status(200).json({ reward: reward.name, imagePath: reward.imagePath });
    } catch (error) {
        console.error('Error opening loot box:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
