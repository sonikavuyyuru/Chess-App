import React, { useState, useEffect } from 'react';
import { 
  Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { io } from 'socket.io-client';
// Authentication Component
const AuthPage = ({ onLogin, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // New state for registration

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data); // Set user state and redirect
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    // Send registration request to backend
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Send username and password
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data); // Update user state with response data
        setIsRegistering(false); // Close registration form after successful registration
      } else {
        console.error('Registration failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">{isRegistering ? 'Register' : 'Chess Masters Login'}</h2>
        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 border rounded"
            required
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        <button 
          onClick={() => setIsRegistering(!isRegistering)} 
          className="mt-4 text-blue-600 hover:underline"
        >
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
};

// Game Modes Selection Component
const GameModeSelector = ({ onSelectMode }) => {
  const gameModes = [
    { 
      name: 'Play Online', 
      description: 'Match with random players worldwide',
      icon: '🌐'
    },
    { 
      name: 'Play vs Bot', 
      description: 'Challenge AI at different difficulty levels',
      icon: '🤖'
    },
    { 
      name: 'Practice', 
      description: 'Learn and improve your skills',
      icon: '📚'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {gameModes.map((mode) => (
        <div 
          key={mode.name}
          onClick={() => onSelectMode(mode.name)}
          className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
        >
          <div className="text-4xl mb-2">{mode.icon}</div>
          <h3 className="font-bold">{mode.name}</h3>
          <p className="text-sm text-gray-600">{mode.description}</p>
        </div>
      ))}
    </div>
  );
};

// Main Chess Game Component
const ChessGame = ({ gameMode, user }) => {
  const [game, setGame] = useState(new Chess());
  const [playerColor, setPlayerColor] = useState('white');
  const [opponentType, setOpponentType] = useState(gameMode);

  // Socket setup for online play
  useEffect(() => {
    if (gameMode === 'Play Online') {
      const socket = io('https://your-chess-server.com');
      
      socket.on('game_found', (gameDetails) => {
        // Handle game matching logic
      });

      return () => socket.disconnect();
    }
  }, [gameMode]);

  const onDrop = (sourceSquare, targetSquare) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // always promote to queen
      });

      // Update game state
      setGame(new Chess(game.fen()));

      // Handle bot move if playing against computer
      if (opponentType === 'Play vs Bot') {
        setTimeout(() => {
          // Simple bot move logic (replace with more sophisticated AI)
          const possibleMoves = game.moves();
          const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          game.move(randomMove);
          setGame(new Chess(game.fen()));
        }, 500);
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p>Rating: 1200</p>
          </div>
          <div>
            <h3 className="text-lg">Game Mode: {gameMode}</h3>
          </div>
        </div>
        <Chessboard 
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={600}
        />
        <div className="mt-4 text-center">
          {game.isGameOver() && (
            <div className="text-red-600 font-bold">
              Game Over! {game.isCheckmate() ? 'Checkmate' : 'Draw'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
// const ChessApp = () => {
//   const [user, setUser] = useState(null);
//   const [gameMode, setGameMode] = useState(null);

//   useEffect(() => {
//     fetch('http://localhost:8000/')
//       .then(response => response.text()) // or response.json() if you're returning JSON
//       .then(data => console.log(data))
//       .catch(error => console.log('Error:', error));
//   }, []);

//   if (!user) {
//     return <AuthPage onLogin={setUser} />;
//   }

//   if (!gameMode) {
//     return <GameModeSelector onSelectMode={setGameMode} />;
//   }

//   return <ChessGame gameMode={gameMode} user={user} />;
// };

const ChessApp = () => {
  const [user, setUser] = useState(null);
  const [gameMode, setGameMode] = useState(null);

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  if (!gameMode) {
    return <GameModeSelector onSelectMode={setGameMode} />;
  }

  return <ChessGame gameMode={gameMode} user={user} />;
};

export default ChessApp;

// import React, { useState, useEffect } from 'react';
// import { getUser } from './api';
// import AuthPage from './components/AuthPage.jsx';
// import GameModeSelector from './components/GameModeSelector.jsx';
// import ChessGame from './components/ChessGame.jsx';

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [gameMode, setGameMode] = useState(null);

//   useEffect(() => {
//     if (user) {
//       fetch(`http://localhost:8000/api/users/${user.username}`)
//         .then((response) => response.json())
//         .then((data) => {
//           console.log('Fetched user data:', data);
//           setUser(data); // Update the state with fetched user data
//         })
//         .catch((error) => {
//           console.error('Error fetching user:', error);
//         });
//     }
//   }, [user]); // Runs every time the user changes

//   if (!user) {
//     return <AuthPage onLogin={setUser} />;
//   }

//   if (!gameMode) {
//     return <GameModeSelector onSelectMode={setGameMode} />;
//   }

//   return <ChessGame user={user} gameMode={gameMode} />;
// };

// export default App;