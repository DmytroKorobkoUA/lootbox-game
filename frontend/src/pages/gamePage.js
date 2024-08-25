import React, {useState, useEffect, useRef} from 'react';
import '../styles/gamePage.css';
import LootboxGrid from '../components/lootboxGrid';
import Leaderboard from '../components/leaderBoard';
import axios from 'axios';

const GamePage = ({ socket, player, gameStarted, gameInitiated, setGameStarted, setGameInitiated, handleLogout, leaderboard, lootboxes, countdown }) => {
    const [loading, setLoading] = useState(false);
    const [playersInGame, setPlayersInGame] = useState([]);
    const [gameLog, setGameLog] = useState([]);
    const gameLogRef = useRef(null);

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
        if (gameLogRef.current) {
            gameLogRef.current.scrollTop = gameLogRef.current.scrollHeight;
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
            <div className="players-list">
                <h3>Players in the Game:</h3>
                <ul>
                    {playersInGame.map((username, index) => (
                        <li key={index}>{username}</li>
                    ))}
                </ul>
            </div>
            {!gameStarted ? (
                <>
                    <Leaderboard leaderboard={leaderboard} />
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
                    <LootboxGrid socket={socket} username={player.username} initialLootboxes={lootboxes} />
                    <div className="game-log">
                        <h3>Game Log:</h3>
                        <ul>
                            {gameLog.map((logEntry, index) => (
                                <li key={index}>{logEntry}</li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={endGame}>End Game</button>
                </>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default GamePage;
