import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = window.localStorage.getItem('library-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        window.localStorage.removeItem('library-user');
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem('library-user', JSON.stringify(currentUser));
    } else {
      window.localStorage.removeItem('library-user');
    }
  }, [currentUser]);

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