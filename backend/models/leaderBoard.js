const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    username: { type: String, required: true },
    commonBoxesOpened: { type: Number, default: 0 },
    rareBoxesOpened: { type: Number, default: 0 },
    epicBoxesOpened: { type: Number, default: 0 },
    legendaryBoxesOpened: { type: Number, default: 0 }
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
