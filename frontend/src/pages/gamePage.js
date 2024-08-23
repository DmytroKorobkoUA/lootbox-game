import React from 'react';
import LootboxGrid from '../components/lootboxGrid';

const GamePage = ({ socket, player, gameStarted, setGameStarted, handleLogout }) => {
    const startGame = () => {
        if (socket) {
            socket.emit('startGame');
        }
    };

    const endGame = () => {
        if (socket) {
            socket.emit('endGame');
        }
    };

    return (
        <div className="game-page">
            <h1>Loot Box Game</h1>
            {!gameStarted ? (
                <button onClick={startGame}>Start Game</button>
            ) : (
                <>
                    <LootboxGrid socket={socket} username={player.username} />
                    <button onClick={endGame}>End Game</button>
                </>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default GamePage;
