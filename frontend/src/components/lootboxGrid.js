import React, { useState, useEffect } from 'react';
import '../styles/lootboxGrid.css';
import { createLootboxes, getLootboxes } from '../services/api';

const LootboxGrid = ({ socket, username }) => {
    const [lootboxes, setLootboxes] = useState([]);

    useEffect(() => {
        createLootboxes().then(() => {
            getLootboxes().then(response => {
                setLootboxes(response.data);
            }).catch(error => {
                console.error("Error fetching lootboxes:", error);
            });
        }).catch(error => {
            console.error("Error creating lootboxes:", error);
        });
    }, []);

    const handleLootboxClick = (id) => {
        const lootbox = lootboxes.find(box => box.id === id);

        if (lootbox.isOpened) return;
        socket.emit('openLootbox', { username, lootboxId: id });
    };

    useEffect(() => {
        socket.on('lootboxOpened', ({ lootboxId, reward, imagePath }) => {
            setLootboxes(prevLootboxes => prevLootboxes.map(box =>
                box.id === lootboxId ? { ...box, isOpened: true, reward, imagePath } : box
            ));
        });

        return () => {
            socket.off('lootboxOpened');
        };
    }, [socket]);

    return (
        <div className="lootbox-grid">
            {lootboxes.map((lootbox) => (
                <div
                    key={lootbox.id}
                    className={`lootbox ${lootbox.isOpened ? 'opened' : ''}`}
                    onClick={() => handleLootboxClick(lootbox.id)}
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
