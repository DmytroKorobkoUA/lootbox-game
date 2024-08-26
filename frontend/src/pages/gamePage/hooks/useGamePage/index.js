import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export const useGamePage = ({ socket, setGameStarted, setGameInitiated, gameInitiated, countdown, player }) => {
	const [loading, setLoading] = useState(false);
	const [playersInGame, setPlayersInGame] = useState([]);
	const [gameLog, setGameLog] = useState([]);
	const gameLogContainerRef = useRef(null);

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
				setGameLog([]);
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
		if (gameLogContainerRef.current) {
			gameLogContainerRef.current.scrollTop = gameLogContainerRef.current.scrollHeight;
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

	return {
		loading,
		startGame,
		joinGame,
		endGame,
		gameLog,
		gameLogContainerRef,
		playersInGame
	}
}