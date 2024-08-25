import React, { useState, useEffect } from 'react';
import LootboxGrid from '../components/lootboxGrid';
import Leaderboard from '../components/leaderBoard';
import axios from 'axios';

const GamePage = ({ socket, player, gameStarted, gameInitiated, setGameStarted, handleLogout, leaderboard, lootboxes, countdown }) => {
    const [loading, setLoading] = useState(false);

    const startGame = async () => {
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/lootboxes/create`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (socket) {
                socket.emit('initGame');
            }
        } catch (error) {
            console.error('Failed to start game:', error);
        } finally {
            setLoading(false);
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
                <>
                    <Leaderboard leaderboard={leaderboard}/>
                    {gameInitiated ? (
                        <p>Game starts in: {countdown} seconds</p>
                    ) : (
                        <button onClick={startGame} disabled={loading}>
                            {loading ? 'Starting...' : 'Initiate Game'}
                        </button>
                    )}
                </>
            ) : (
                <>
                    <LootboxGrid socket={socket} username={player.username} initialLootboxes={lootboxes}/>
                    <button onClick={endGame}>End Game</button>
                </>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default GamePage;
