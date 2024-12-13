import React, { useState } from 'react';

const AuthPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    onLogin({ username });
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AuthPage;