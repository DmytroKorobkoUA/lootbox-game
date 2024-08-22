import React, { useState } from 'react';
import AuthPage from './pages/authPage';
import GamePage from './pages/gamePage';
import io from 'socket.io-client';

function App() {
    const [player, setPlayer] = useState(null);
    const [socket, setSocket] = useState(null);

    const handleLogin = (playerData) => {
        setPlayer(playerData);
        const newSocket = io(process.env.REACT_APP_BACKEND_SERVER_BASE_URL);
        newSocket.on('connect', () => {
            console.log('Connected to socket server');
        });
        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });
        setSocket(newSocket);
    };

    return (
        <div className="App">
            {!player ? (
                <AuthPage setPlayer={handleLogin} />
            ) : (
                <>
                    <h1>Welcome, {player.username}!</h1>
                    {socket && <GamePage socket={socket} player={player} />}
                </>
            )}
        </div>
    );
}

export default App;
