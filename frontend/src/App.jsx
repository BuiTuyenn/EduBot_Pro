import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import Login from './components/Login';
import Register from './components/Register';
import { authAPI } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  // Initialize dark mode from localStorage immediately
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      return savedDarkMode === 'true';
    }
    // Check system preference if no saved preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Check authentication on mount
  useEffect(() => {
    const user = authAPI.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (userData) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <ChatWindow
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      onLogout={handleLogout}
    />
  );
}

export default App;
