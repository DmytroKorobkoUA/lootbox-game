const Reward = require('../models/reward');

exports.createReward = async (req, res) => {
    const { name, probability } = req.body;

    if (!name || probability === undefined) {
        return res.status(400).json({ error: 'Name and probability are required' });
    }

    try {
        const newReward = new Reward({ name, probability });
        await newReward.save();
        res.status(201).json(newReward);
    } catch (error) {
        console.error('Error creating reward:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllRewards = async (req, res) => {
    try {
        const rewards = await Reward.find();
        res.status(200).json(rewards);
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getRewardById = async (req, res) => {
    const { id } = req.params;

    try {
        const reward = await Reward.findById(id);
        if (!reward) {
            return res.status(404).json({ error: 'Reward not found' });
        }
        res.status(200).json(reward);
    } catch (error) {
        console.error('Error fetching reward:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateReward = async (req, res) => {
    const { id } = req.params;
    const { name, probability } = req.body;

    try {
        const updatedReward = await Reward.findByIdAndUpdate(id, { name, probability }, { new: true, runValidators: true });

        if (!updatedReward) {
            return res.status(404).json({ error: 'Reward not found' });
        }

        res.status(200).json(updatedReward);
    } catch (error) {
        console.error('Error updating reward:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteReward = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReward = await Reward.findByIdAndDelete(id);

        if (!deletedReward) {
            return res.status(404).json({ error: 'Reward not found' });
        }

        res.status(200).json({ message: 'Reward deleted successfully' });
    } catch (error) {
        console.error('Error deleting reward:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
