import React from 'react';

const ChessGame = ({ user, gameMode }) => {
  return (
    <div>
      <h1>Welcome {user.username}!</h1>
      <h2>Game Mode: {gameMode}</h2>
      {/* Here you would render the actual chessboard component */}
      {/* For now, we can just display a placeholder */}
      <div>
        <p>Chess Game will go here...</p>
        <button onClick={() => alert('Game Started!')}>Start Game</button>
      </div>
    </div>
  );
};

export default ChessGame;