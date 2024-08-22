import React from 'react';
import LootboxGrid from '../components/lootboxGrid';

const GamePage = ({ socket, player }) => {
    return (
        <div className="game-page">
            <h1>Loot Box Game</h1>
            <LootboxGrid socket={socket} username={player.username} />
        </div>
    );
};

export default GamePage;
