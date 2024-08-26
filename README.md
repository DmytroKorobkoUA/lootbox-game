# Multiplayer Loot Box Game

A real-time multiplayer game where players compete to open loot boxes and collect rewards.

## Project Structure

```bash
lootbox-game/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── controllers/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── README.md
└── .gitignore
```

## Technologies

### Backend
- **Node.js**: JavaScript runtime for the server-side logic.
- **Express.js**: Web framework for building RESTful APIs.
- **Mongoose**: ODM for MongoDB to manage data in the database.
- **Socket.io**: Library for real-time communication between the server and clients.
- **bcryptjs**: Library for hashing passwords.
- **dotenv**: Module to load environment variables from a .env file.

### Frontend
- **React**: JavaScript library for building user interfaces.
- **React Scripts**: Scripts and configuration used by Create React App.
- **axios**: Promise-based HTTP client for making API requests.
- **socket.io-client**: Client-side library for real-time communication with Socket.io.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/DmytroKorobkoUA/lootbox-game.git
```

2. Install dependencies for both backend and frontend:
```bash
cd lootbox-game
npm install
```

## Running the project

1. Start the backend server:
```bash
npm run start:backend
```

2. Start the frontend server:
```bash
npm run start:frontend
```

3. Alternatively, you can start both servers simultaneously:
```bash
npm start
```

## Features
- Register and log in users using JWT tokens.
- Real-time multiplayer gameplay using WebSockets.
- Dynamic loot box opening with different reward rarities.
- Real-time leaderboard displaying player stats and rankings.
- Stylish and user-friendly interface for an engaging experience.
- Log of opened loot boxes and list of active players.
- Game management with the ability to start a new game when the current one ends.

## Game Rules
1. **Player Registration and Login**: Players can register and log in. All inputs are validated.

2. **Game Setup**:

- **Players**: From 2 to 5 players can join a game.
- **Game Field**: A 5x5 grid of loot boxes.

3. **Gameplay**:

- The first player initiates the game. Other players have 10 seconds to join.
- Players click on boxes to open them. Each box contains a reward with different rarity levels (common, rare, epic, legendary).
- Rewards have different drop probabilities.

4. **Leaderboards**:

- A leaderboard shows the number of boxes opened by each player, categorized by rarity.
- Players are displayed with their online status.
- 
5. **Game Management**:

- If a player leaves the game, they must wait for the next game to join.
- The game ends if all boxes are opened or the last player exits.
- When the game ends, players can initiate a new game.

## Database
The project uses MongoDB for data storage. Ensure MongoDB is running and properly configured before starting the backend server.

## Additional Notes
- Ensure all environment variables, such as MONGO_URI, are set correctly in your .env file.
- To seed the database with initial rewards, run:
```bash
npm run seed
```

## Security Considerations

- **JWT Authentication**: The API uses JSON Web Tokens (JWT) for authentication. Include the token in the Authorization header for endpoints that require authentication.
- **Password Hashing**: User passwords are hashed using bcrypt before being stored in the database.
- **Environment Variable**: Store sensitive information in environment variables to keep them secure.
- 