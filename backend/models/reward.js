const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    probability: { type: Number, required: true },
    rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
    imagePath: { type: String, default: '' }
});

module.exports = mongoose.model('Reward', rewardSchema);
