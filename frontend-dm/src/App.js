import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null); // Tracks logged-in user session

  // Apply dark class to HTML for Tailwind 'dark:' variants
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle Login Logic
  const handleLogin = (userData) => {
    setUser(userData);
    // You can also save to localStorage here if you want persistence
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {!user ? (
        <Login 
          isDark={isDark} 
          setIsDark={setIsDark} 
          onLogin={handleLogin} 
        />
      ) : (
        <Dashboard 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          isDark={isDark} 
          setIsDark={setIsDark} 
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;