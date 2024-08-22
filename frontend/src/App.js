import React, { useState } from 'react';
import AuthPage from './pages/authPage';

function App() {
  const [player, setPlayer] = useState(null);

  return (
      <div className="App">
        {!player ? (
            <AuthPage setPlayer={setPlayer} />
        ) : (
            <h1>Welcome, {player.username}!</h1>
        //     Coming soon
        )}
      </div>
  );
}

export default App;
