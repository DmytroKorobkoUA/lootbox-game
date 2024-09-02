import React, { useState, useEffect } from 'react';
import '../../styles/lootboxGrid.css';
import axios from 'axios';

const LootboxGrid = ({ socket, username, initialLootboxes }) => {
    const [lootboxes, setLootboxes] = useState(() => initialLootboxes);
    const [isOpening, setIsOpening] = useState({});
    const [error, setError] = useState(null);

    const handleLootboxClick = async (id) => {
        const lootbox = lootboxes.find(box => box._id === id);

        if (lootbox.isOpened || isOpening[id]) return;

        setIsOpening(prevState => ({ ...prevState, [id]: true }));

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
                    imagePath: response.data.imagePath,
                    username: response.data.player,
                    rarity: response.data.rarity
                });
                setError(null);
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error === 'Loot box is already opened') {
                alert('Loot box is already opened by another player');
            } else {
                console.error("Error opening the loot box:", error);
                setError("There was an error opening the loot box. Please try again.");
            }
        } finally {
            setIsOpening(prevState => ({ ...prevState, [id]: false }));
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
            {error && <div className="error-message">{error}</div>}
            <div className="lootbox-grid">
                {lootboxes.map((lootbox) => (
                    <div
                        key={lootbox._id}
                        className={`lootbox ${lootbox.isOpened ? 'opened' : ''} ${lootbox.rarity}`}
                        onClick={() => handleLootboxClick(lootbox._id)}
                    >
                        {lootbox.isOpened && (
                            <>
                                <img src={lootbox.imagePath} alt={lootbox.reward} />
                                <span>{lootbox.reward}</span>
                            </>
                        )}
                        {!lootbox.isOpened && (
                            <img
                                src={isOpening[lootbox._id] ? "/images/loading.gif" : "/images/chest.png"}
                                alt="Closed Chest"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LootboxGrid;
