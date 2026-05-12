import React, { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setIsSignupMode(false);
  };

  const handleSignupSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setIsSignupMode(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsSignupMode(false);
  };

  const toggleSignupMode = () => {
    setIsSignupMode(!isSignupMode);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        isSignupMode ? (
          <Signup 
            onSignupSuccess={handleSignupSuccess}
            onToggleMode={toggleSignupMode}
          />
        ) : (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onToggleSignup={toggleSignupMode}
          />
        )
      ) : (
        <Dashboard 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;