const mongoose = require('mongoose');
const Reward = require('../models/reward');
require('dotenv').config();

const rewards = [
    // Common
    { name: 'Bronze Coin', probability: 0.3, rarity: 'common', imagePath: '/images/bronze_coin.png' },
    { name: 'Small Topaz', probability: 0.2, rarity: 'common', imagePath: '/images/small_topaz.png' },
    { name: '100 Points', probability: 0.5, rarity: 'common', imagePath: '/images/100_points.png' },

    // Rare
    { name: 'Silver Coin', probability: 0.3, rarity: 'rare', imagePath: '/images/silver_coin.png' },
    { name: 'Small Emerald', probability: 0.2, rarity: 'rare', imagePath: '/images/small_emerald.png' },
    { name: '250 Points', probability: 0.5, rarity: 'rare', imagePath: '/images/250_points.png' },

    // Epic
    { name: 'Gold Coin', probability: 0.3, rarity: 'epic', imagePath: '/images/gold_coin.png' },
    { name: 'Small Ruby', probability: 0.2, rarity: 'epic', imagePath: '/images/small_ruby.png' },
    { name: '500 Points', probability: 0.5, rarity: 'epic', imagePath: '/images/500_points.png' },

    // Legendary
    { name: 'Platinum Coin', probability: 0.3, rarity: 'legendary', imagePath: '/images/platinum_coin.png' },
    { name: 'Small Diamond', probability: 0.2, rarity: 'legendary', imagePath: '/images/small_diamond.png' },
    { name: '1000 Points', probability: 0.5, rarity: 'legendary', imagePath: '/images/1000_points.png' }
];

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
        Reward.deleteMany({})
            .then(() => Reward.insertMany(rewards))
            .then(() => {
                console.log('Rewards seeded successfully!');
                mongoose.connection.close();
            })
            .catch(err => {
                console.error('Error seeding rewards:', err);
                mongoose.connection.close();
            });
    })
    .catch(err => console.error('Database connection error:', err));
