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
        const createLootbox = async (rarity, num) => {
            const rewardOptions = rewards.filter(r => r.rarity === rarity);

            if (rewardOptions.length === 0) {
                console.warn(`No rewards found for rarity ${rarity}`);
                return;
            }

            const cumulativeProbabilities = [];
            let cumulative = 0;
            rewardOptions.forEach(reward => {
                cumulative += reward.probability;
                cumulativeProbabilities.push({ reward, cumulative });
            });

            for (let i = 0; i < num; i++) {
                const rand = Math.random();
                const selectedReward = cumulativeProbabilities.find(cp => rand < cp.cumulative);

                if (selectedReward) {
                    const newLootbox = new Lootbox({
                        rewards: [selectedReward.reward._id],
                        rarity,
                        reward: selectedReward.reward.name,
                        imagePath: selectedReward.reward.imagePath
                    });
                    await newLootbox.save();
                }
            }
        };

        const numLegendary = 1;
        const numEpic = 3;
        const numRare = 6;
        const numCommon = 25 - numLegendary - numEpic - numRare;

        await createLootbox('legendary', numLegendary);
        await createLootbox('epic', numEpic);
        await createLootbox('rare', numRare);
        await createLootbox('common', numCommon);

        const lootboxes = await Lootbox.find();

        res.status(200).json({ lootboxes, message: 'Loot boxes created successfully' });
    } catch (error) {
        console.error('Error creating loot boxes:', error);
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

        const reward = lootbox.rewards[0];

        if (!reward) {
            return res.status(400).json({ error: 'No reward found' });
        }

        const currentVersion = lootbox.__v; // текущая версия документа
        lootbox.isOpened = true;
        lootbox.openedBy = username;

        const updatedLootbox = await Lootbox.findOneAndUpdate(
            { _id: id, __v: currentVersion },
            {
                $set: {
                    isOpened: true,
                    openedBy: username
                },
                $inc: { __v: 1 }
            },
            { new: true }
        );

        if (!updatedLootbox) {
            return res.status(409).json({ error: 'Conflict detected. Please try again.' });
        }

        const player = await Player.findOne({ username });

        if (player) {
            player.totalBoxesOpened++;

            if (reward.rarity === 'common') player.commonBoxesOpened++;
            else if (reward.rarity === 'rare') player.rareBoxesOpened++;
            else if (reward.rarity === 'epic') player.epicBoxesOpened++;
            else if (reward.rarity === 'legendary') player.legendaryBoxesOpened++;

            await player.save();
        }

        res.status(200).json({
            message: 'Loot box opened successfully',
            reward: reward.name,
            rarity: reward.rarity,
            imagePath: reward.imagePath,
            player: username
        });
    } catch (error) {
        console.error('Error opening lootbox:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
