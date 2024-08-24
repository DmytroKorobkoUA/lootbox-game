const mongoose = require('mongoose');

const openBoxLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    username: { type: String, required: true },
    boxId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lootbox', required: true },
    rewardName: { type: String, required: true },
    rarity: { type: String, required: true },
    openedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OpenBoxLog', openBoxLogSchema);
