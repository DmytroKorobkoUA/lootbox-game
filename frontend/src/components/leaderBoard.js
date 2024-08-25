import React, { useEffect, useState } from 'react';
import '../styles/leaderBoard.css';
import axios from 'axios';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/players/leaderboard`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => setLeaderboard(response.data))
            .catch(error => console.error('Failed to fetch leaderboard:', error));
    }, []);

    const getStatusColor = (isOnline) => {
        return isOnline ? 'green' : 'red';
    };

    return (
        <div className="leaderboard">
            <h2>Leaderboard</h2>
            <table>
                <thead>
                <tr>
                    <th>Status</th>
                    <th>Player</th>
                    <th>Total</th>
                    <th>Common</th>
                    <th>Rare</th>
                    <th>Epic</th>
                    <th>Legendary</th>
                </tr>
                </thead>
                <tbody>
                {leaderboard.map((entry, index) => (
                    <tr key={index}>
                        <td>
                                <span
                                    className="status-indicator"
                                    style={{ backgroundColor: getStatusColor(entry.isOnline) }}
                                />
                        </td>
                        <td>{entry.username}</td>
                        <td className={`total`}>{entry.totalBoxesOpened}</td>
                        <td className={`common`}>{entry.commonBoxesOpened}</td>
                        <td className={`rare`}>{entry.rareBoxesOpened}</td>
                        <td className={`epic`}>{entry.epicBoxesOpened}</td>
                        <td className={`legendary`}>{entry.legendaryBoxesOpened}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
