import React, { useState } from 'react';
import '../../styles/authPage.css';
import { registerPlayer, loginPlayer } from '../../services/api';

const AuthPage = ({ setPlayer }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = isRegister
                ? await registerPlayer(username, password)
                : await loginPlayer(username, password);

            setPlayer({ token: response.data.token, username: response.data.username });
        } catch (err) {
            setError('Error: ' + err.response?.data?.message || 'Unexpected error');
        }
    };

    return (
        <div className="auth-page">
            <h1>{isRegister ? 'Register' : 'Login'}</h1>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
            </form>
            <div className="toggle-button-container">
                <button className="toggle-button" onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? 'Switch to Login' : 'Switch to Register'}
                </button>
            </div>
        </div>
    );
};

export default AuthPage;
