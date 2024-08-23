const mongoose = require('mongoose');

const lootboxSchema = new mongoose.Schema({
    rewards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reward'
        }
    ],
    rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
    isOpened: { type: Boolean, default: false },
    openedBy: { type: String, default: null },
    reward: { type: String, default: null },
    imagePath: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Lootbox', lootboxSchema);
