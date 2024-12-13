import React, { useState, useEffect } from 'react';
import { 
  Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { io } from 'socket.io-client';
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card"

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

// Authentication Component
const AuthPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin({ username });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Chess Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
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
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

// Game Modes Selection Component
const GameModeSelector = ({ onSelectMode }) => {
  const gameModes = [
    { 
      name: 'Play vs Bot', 
      description: 'Challenge AI at different difficulty levels',
      icon: '🤖'
    },
    { 
      name: 'Local Multiplayer', 
      description: 'Play with a friend on the same device',
      icon: '👥'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-2 gap-4">
        {gameModes.map((mode) => (
          <div 
            key={mode.name}
            onClick={() => onSelectMode(mode.name)}
            className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-lg transition text-center"
          >
            <div className="text-4xl mb-2 flex justify-center">{mode.icon}</div>
            <h3 className="font-bold">{mode.name}</h3>
            <p className="text-sm text-gray-600">{mode.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Chess Game Component
const ChessBoard = ({ gameMode, user }) => {
  const [game, setGame] = useState(new ChessGame());
  const [selectedSquare, setSelectedSquare] = useState(null);

  const renderPiece = (piece) => {
    const pieceIcons = {
      'wp': '♙', 'wr': '♖', 'wn': '♘', 'wb': '♗', 'wq': '♕', 'wk': '♔',
      'bp': '♟', 'br': '♜', 'bn': '♞', 'bb': '♝', 'bq': '♛', 'bk': '♚'
    };
    return pieceIcons[piece] || null;
  };

  const handleSquareClick = (row, col) => {
    if (selectedSquare) {
      // Attempt to move the piece
      const success = game.movePiece(
        selectedSquare.row, 
        selectedSquare.col, 
        row, 
        col
      );
      
      if (success) {
        // Simple bot logic for 'Play vs Bot' mode
        if (gameMode === 'Play vs Bot') {
          // Very basic random move generation for the bot
          const availableMoves = [];
          game.board.forEach((rowData, rowIndex) => {
            rowData.forEach((piece, colIndex) => {
              if (piece && piece.startsWith('b')) {
                for (let toRow = 0; toRow < 8; toRow++) {
                  for (let toCol = 0; toCol < 8; toCol++) {
                    if (game.isValidMove(rowIndex, colIndex, toRow, toCol)) {
                      availableMoves.push({ 
                        fromRow: rowIndex, 
                        fromCol: colIndex, 
                        toRow, 
                        toCol 
                      });
                    }
                  }
                }
              }
            });
          });

          if (availableMoves.length > 0) {
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            game.movePiece(
              randomMove.fromRow, 
              randomMove.fromCol, 
              randomMove.toRow, 
              randomMove.toCol
            );
          }
        }

        setSelectedSquare(null);
        setGame(new ChessGame());
      }
    } else {
      // Select a piece
      const piece = game.board[row][col];
      if (piece && piece.startsWith('w')) {
        setSelectedSquare({ row, col });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle className="text-center">{gameMode}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="grid grid-cols-8 gap-0 border-2 border-gray-300">
            {game.board.map((row, rowIndex) => (
              row.map((piece, colIndex) => (
                <div 
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  className={`
                    w-[75px] h-[75px] flex items-center justify-center text-5xl cursor-pointer
                    ${(rowIndex + colIndex) % 2 === 0 ? 'bg-white' : 'bg-gray-200'}
                    ${selectedSquare && 
                      selectedSquare.row === rowIndex && 
                      selectedSquare.col === colIndex 
                      ? 'bg-yellow-200' : ''}
                  `}
                >
                  {renderPiece(piece)}
                </div>
              ))
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main App Component
const ChessApp = () => {
  const [user, setUser] = useState(null);
  const [gameMode, setGameMode] = useState(null);

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  if (!gameMode) {
    return <GameModeSelector onSelectMode={setGameMode} />;
  }

  return <ChessBoard gameMode={gameMode} user={user} />;
};

export default ChessApp;