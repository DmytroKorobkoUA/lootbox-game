import React from 'react';
import '../styles/leaderBoard.css';

const Leaderboard = ({ leaderboard }) => {
    return (
        <div className="leaderboard">
            <h2>Leaderboard</h2>
            <table>
                <thead>
                <tr>
                    <th>Player</th>
                    <th>Common</th>
                    <th>Rare</th>
                    <th>Epic</th>
                    <th>Legendary</th>
                </tr>
                </thead>
                <tbody>
                {leaderboard.map((entry, index) => (
                    <tr key={index}>
                        <td>{entry.username}</td>
                        <td>{entry.commonBoxesOpened}</td>
                        <td>{entry.rareBoxesOpened}</td>
                        <td>{entry.epicBoxesOpened}</td>
                        <td>{entry.legendaryBoxesOpened}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
