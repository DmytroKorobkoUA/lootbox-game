import React from 'react';
import '../../styles/gamePage.css';
import LootboxGrid from '../../components/LootboxGrid';
import Leaderboard from '../../components/LeaderBoard';
import { useGamePage } from './hooks/useGamePage';

const GamePage = ({ socket, player, gameStarted, gameInitiated, setGameStarted, setGameInitiated, handleLogout, leaderboard, lootboxes, countdown }) => {
	const {
		endGame,
		joinGame,
		startGame,
		playersInGame,
		loading,
		gameLog,
		gameLogContainerRef,
	} = useGamePage({socket, setGameInitiated, setGameStarted, gameInitiated, countdown, player})

	return (
		<div className="game-page">
			<h1 className="game-title">Lootbox Game</h1>
			<h2 className="welcome-message">Welcome, {player.username}!</h2>
			<div className="content-container">
				<div className="first-column">
					<div className="players-list">
						<h3>Players in the Game:</h3>
						<ul>
							{playersInGame.map((username, index) => (
								<li key={index}>{username}</li>
							))}
						</ul>
					</div>
					<div className="game-log">
						<h3>Game Log:</h3>
						<div className="game-log-content" ref={gameLogContainerRef}>
							<ul>
								{gameLog.map((logEntry, index) => (
									<li key={index}>{logEntry}</li>
								))}
							</ul>
						</div>
					</div>
				</div>
				<div className="second-column">
					{!gameStarted && <Leaderboard leaderboard={leaderboard} />}
					{gameStarted && <LootboxGrid socket={socket} username={player.username} initialLootboxes={lootboxes} />}
				</div>
				<div className="game-actions">
					{!gameStarted && (
						<>
							{gameInitiated && (
								<>
									<p>Game starts in: {countdown} seconds</p>
									{!playersInGame.includes(player.username) && (
										<button onClick={joinGame}>Ready</button>
									)}
								</>
							)}
							{!gameInitiated && (
								<button onClick={startGame} disabled={loading}>
									{loading ? 'Starting...' : 'Initiate Game'}
								</button>
							)}
						</>
					)}
					{gameStarted && (
						<button onClick={endGame}>End Game</button>
					)}
					<button onClick={handleLogout}>Logout</button>
				</div>
			</div>
		</div>
	);
};

export default GamePage;