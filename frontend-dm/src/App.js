import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Apply or remove the 'dark' class to the <html> tag whenever isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="App min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* We pass the state and the setter functions as props 
          so Dashboard (and eventually Sidebar) can use them.
      */}
      <Dashboard 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        isDark={isDark} 
        setIsDark={setIsDark} 
      />
    </div>
  );
}

export default App;