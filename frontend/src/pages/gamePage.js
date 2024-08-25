import React, { useState, useEffect } from 'react';
import LootboxGrid from '../components/lootboxGrid';
import Leaderboard from '../components/leaderBoard';
import axios from 'axios';

const GamePage = ({ socket, player, gameStarted, setGameStarted, handleLogout, leaderboard, lootboxes }) => {
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (gameStarted) {
            setTimer(30);
        } else {
            const countdown = setInterval(() => {
                setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
            }, 1000);

            return () => clearInterval(countdown);
        }
    }, [gameStarted]);

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
                <>
                    <Leaderboard leaderboard={leaderboard}/>
                    <p>Game starts in: {timer} seconds</p>
                    <button onClick={startGame} disabled={loading || timer > 0}>
                        {loading ? 'Starting...' : 'Start Game'}
                    </button>
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
