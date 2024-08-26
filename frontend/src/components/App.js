import React, { useState, useEffect } from 'react';
import AuthPage from '../pages/autPage';
import GamePage from '../pages/gamePage';
import io from 'socket.io-client';
import axios from "axios";

function App() {
    const [player, setPlayer] = useState(null);
    const [socket, setSocket] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameInitiated, setGameInitiated] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [lootboxes, setLootboxes] = useState([]);
    const [countdown, setCountdown] = useState(0);
    const [playersInGame, setPlayersInGame] = useState([]);

    useEffect(() => {
        const storedPlayer = JSON.parse(localStorage.getItem('player'));
        if (storedPlayer) {
            setPlayer(storedPlayer);
            initializeSocket(storedPlayer);
        }
    }, []);

    const initializeSocket = (playerData) => {
        const newSocket = io(process.env.REACT_APP_BACKEND_SERVER_BASE_URL);
        newSocket.on('connect', () => {
            console.log('Connected to socket server');
        });
        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        newSocket.on('gameStarted', (data) => {
            setGameStarted(true);
            setLootboxes(data.lootboxes);
        });

        newSocket.on('gameEnded', () => {
            setGameStarted(false);
            setGameInitiated(false);
            setPlayersInGame([]);
        });

        newSocket.on('gameInitiated', (data) => {
            setGameInitiated(true);
            setCountdown(data.countdown);
            setPlayersInGame(data.playersInGame);
        });

        newSocket.on('playerJoined', (data) => {
            setPlayersInGame(data.playersInGame);
        });

        newSocket.on('playerLeft', (data) => {
            setPlayersInGame(data.playersInGame);
        });

        newSocket.on('maxPlayersReached', (data) => {
            console.log(data.message);
        });

        newSocket.on('updateLeaderboard', (data) => {
            setLeaderboard(data);
        });

        setSocket(newSocket);
    };

    const handleLogin = (playerData) => {
        setPlayer(playerData);
        localStorage.setItem('player', JSON.stringify(playerData));
        initializeSocket(playerData);
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/players/logout`, { username: player.username });

            if (socket) socket.disconnect();
            setPlayer(null);
            setGameStarted(false);
            setGameInitiated(false);
            setPlayersInGame([]);
            localStorage.removeItem('player');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="App">
            {!player ? (
                <AuthPage setPlayer={handleLogin} />
            ) : (
                <>
                    {socket && (
                        <GamePage
                            socket={socket}
                            player={player}
                            gameStarted={gameStarted}
                            gameInitiated={gameInitiated}
                            setGameInitiated={setGameInitiated}
                            setGameStarted={setGameStarted}
                            handleLogout={handleLogout}
                            leaderboard={leaderboard}
                            lootboxes={lootboxes}
                            countdown={countdown}
                            playersInGame={playersInGame}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default App;
