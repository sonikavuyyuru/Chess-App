import React from 'react';

const GameModeSelector = ({ onSelectMode }) => {
  return (
    <div>
      <h1>Select Game Mode</h1>
      <button onClick={() => onSelectMode('singleplayer')}>Singleplayer</button>
      <button onClick={() => onSelectMode('multiplayer')}>Multiplayer</button>
    </div>
  );
};

export default GameModeSelector;