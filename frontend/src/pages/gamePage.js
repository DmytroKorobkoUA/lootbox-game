import React, { useState, useEffect, useRef } from 'react';
import '../styles/gamePage.css';
import LootboxGrid from '../components/lootboxGrid';
import Leaderboard from '../components/leaderBoard';
import axios from 'axios';

const GamePage = ({ socket, player, gameStarted, gameInitiated, setGameStarted, setGameInitiated, handleLogout, leaderboard, lootboxes, countdown }) => {
    const [loading, setLoading] = useState(false);
    const [playersInGame, setPlayersInGame] = useState([]);
    const [gameLog, setGameLog] = useState([]);
    const gameLogContainerRef = useRef(null);

    useEffect(() => {
        if (socket) {
            socket.on('playersInGameUpdate', (data) => {
                setPlayersInGame(data);
            });

            socket.on('gameLogUpdate', (log) => {
                setGameLog(log);
            });

            return () => {
                socket.off('playersInGameUpdate');
                socket.off('gameLogUpdate');
            };
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            socket.on('gameEnded', () => {
                setGameStarted(false);
                setGameInitiated(false);
                setPlayersInGame([]);
                setGameLog([]);
            });

            return () => {
                socket.off('gameEnded');
            };
        }
    }, [socket]);

    useEffect(() => {
        if (gameInitiated && !playersInGame.length && countdown <= 0) {
            setGameStarted(false);
            setGameInitiated(false);
            setPlayersInGame([]);
        }
    }, [countdown, playersInGame, gameInitiated]);

    useEffect(() => {
        if (gameLogContainerRef.current) {
            gameLogContainerRef.current.scrollTop = gameLogContainerRef.current.scrollHeight;
        }
    }, [gameLog]);

    const startGame = async () => {
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/lootboxes/create`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (socket) {
                socket.emit('initGame', { username: player.username });
            }
        } catch (error) {
            console.error('Failed to start game:', error);
        } finally {
            setLoading(false);
        }
    };

    const joinGame = () => {
        if (socket) {
            socket.emit('joinGame', { username: player.username });
        }
    };

    const endGame = () => {
        if (socket) {
            socket.emit('endGame', { username: player.username });
        }
    };

    return (
        <div className="game-page">
            <h1 className="game-title">Lootbox Game</h1>
            <h2 className="welcome-message">Welcome, {player.username}!</h2>
            <div className="content-container">
                <div className="first-column">
                    <div className="players-list">
                        <h3>Players in the Game:</h3>
                        <ul>
                            {playersInGame.map((username, index) => (
                                <li key={index}>{username}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="game-log">
                        <h3>Game Log:</h3>
                        <div className="game-log-content" ref={gameLogContainerRef}>
                            <ul>
                                {gameLog.map((logEntry, index) => (
                                    <li key={index}>{logEntry}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="second-column">
                    {!gameStarted ? (
                        <Leaderboard leaderboard={leaderboard}/>
                    ) : (
                        <LootboxGrid socket={socket} username={player.username} initialLootboxes={lootboxes}/>
                    )}
                </div>
                <div className="game-actions">
                    {!gameStarted ? (
                        <>
                            {gameInitiated ? (
                                <>
                                    <p>Game starts in: {countdown} seconds</p>
                                    {!playersInGame.includes(player.username) && (
                                        <button onClick={joinGame}>Ready</button>
                                    )}
                                </>
                            ) : (
                                <button onClick={startGame} disabled={loading}>
                                    {loading ? 'Starting...' : 'Initiate Game'}
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <button onClick={endGame}>End Game</button>
                        </>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default GamePage;
