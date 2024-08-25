import React, { useState, useEffect } from 'react';
import '../styles/lootboxGrid.css';
import { getLootboxes } from '../services/api';
import axios from 'axios';

const LootboxGrid = ({ socket, username, initialLootboxes }) => {
    const [lootboxes, setLootboxes] = useState(() => initialLootboxes);

    const handleLootboxClick = async (id) => {
        const lootbox = lootboxes.find(box => box._id === id);

        if (lootbox.isOpened) return;

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/lootboxes/open/${id}`, { username }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                socket.emit('lootboxOpened', {
                    lootboxId: id,
                    reward: response.data.reward,
                    imagePath: response.data.imagePath
                });
            }
        } catch (error) {
            console.error("Error opening lootbox:", error);
        }
    };

    useEffect(() => {
        socket.on('lootboxOpened', ({ lootboxId, reward, imagePath }) => {
            setLootboxes(prevLootboxes =>
                prevLootboxes.map(box =>
                    box._id === lootboxId ? { ...box, isOpened: true, reward, imagePath } : box
                )
            );
        });

        return () => {
            socket.off('lootboxOpened');
        };
    }, [socket]);

    return (
        <div className="lootbox-grid-container">
            <div className="lootbox-grid">
                {lootboxes.map((lootbox) => (
                    <div
                        key={lootbox._id}
                        className={`lootbox ${lootbox.isOpened ? 'opened' : ''} ${lootbox.rarity}`}
                        onClick={() => handleLootboxClick(lootbox._id)}
                    >
                        {lootbox.isOpened ? (
                            <>
                                <img src={lootbox.imagePath} alt={lootbox.reward} />
                                <span>{lootbox.reward}</span>
                            </>
                        ) : (
                            <img src="/images/chest.png" alt="Closed Chest" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LootboxGrid;
