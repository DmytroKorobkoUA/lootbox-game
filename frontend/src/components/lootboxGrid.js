import React, { useState, useEffect } from 'react';
import '../styles/lootboxGrid.css';
import { getLootboxes } from '../services/api';

const LootboxGrid = ({ socket, username }) => {
    const [lootboxes, setLootboxes] = useState([]);

    useEffect(() => {
        getLootboxes()
            .then(response => {
                setLootboxes(response.data);
            })
            .catch(error => {
                console.error("Error fetching lootboxes:", error);
            });
    }, []);

    const handleLootboxClick = (id) => {
        const lootbox = lootboxes.find(box => box._id === id);

        if (lootbox.isOpened) return;
        if (socket) {
            socket.emit('openLootbox', { username, lootboxId: id });
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
        <div className="lootbox-grid">
            {lootboxes.map((lootbox) => (
                <div
                    key={lootbox._id}
                    className={`lootbox ${lootbox.isOpened ? 'opened' : ''}`}
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
    );
};

export default LootboxGrid;
