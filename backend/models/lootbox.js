const mongoose = require('mongoose');

const lootboxSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rewards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reward'
        }
    ],
    rarity: { type: String, enum: ['common', 'rare', 'epic'], default: 'common' },
    isOpened: { type: Boolean, default: false },
    openedBy: { type: String, default: null }
});

module.exports = mongoose.model('Lootbox', lootboxSchema);
