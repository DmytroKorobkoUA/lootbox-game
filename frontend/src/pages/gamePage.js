import React, { useState } from 'react';
import LootboxGrid from '../components/lootboxGrid';
import axios from 'axios';

const GamePage = ({ socket, player, gameStarted, setGameStarted, handleLogout }) => {
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
                socket.emit('startGame');
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
                <button onClick={startGame} disabled={loading}>
                    {loading ? 'Starting...' : 'Start Game'}
                </button>
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
