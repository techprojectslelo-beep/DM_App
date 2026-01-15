import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Auth
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

// Pages
import DailyStackView from './components/views/DailyStackView';
import BrandsList from './pages/BrandList'; 
import BrandDetail from './pages/BrandDetail';
import UsersList from './pages/UsersList'; 
import UserDetail from './pages/UserDetail';
import CreateTaskPage from './pages/ScheduleTask';
import ClientList from './pages/ClientList'; 
import ClientDetail from './pages/ClientDetail';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <BrowserRouter>
      <div className="App min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
        <Routes>
          {/* Public Route */}
          <Route 
            path="/login" 
            element={!user ? <Login isDark={isDark} setIsDark={setIsDark} onLogin={handleLogin} /> : <Navigate to="/" />} 
          />

          {/* Protected Routes (Dashboard Shell) */}
          <Route 
            path="/" 
            element={user ? <Dashboard isDark={isDark} setIsDark={setIsDark} user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          >
            
            {/* 1. MAIN ENTRY: Schedule Display (DailyStackView) 
               Using 'index' makes this the default view at "/"
            */}
            <Route index element={<div className="pl-6 flex-1"><DailyStackView isDark={isDark} /></div>} />

            {/* 2. SIDEKICK: Create Task Page 
               Mapped to "create-task" to separate it from the main display naming logic
            */}
            <Route path="create-task" element={<CreateTaskPage isDark={isDark} />} />

            {/* 3. Users Routes */}
            <Route path="users" element={<UsersList isDark={isDark} />} />
            <Route path="users/:id" element={<UserDetail isDark={isDark} />} />
            <Route path="users/new" element={<UserDetail isCreateMode={true} isDark={isDark} />} />

            {/* 4. Brands Routes */}
            <Route path="brands" element={<BrandsList isDark={isDark} />} />
            <Route path="brands/:id" element={<BrandDetail isDark={isDark} />} />

            {/* 5. Clients Routes */}
            <Route path="enquiry" element={<ClientList isDark={isDark} />} />
            <Route path="enquiry/:id" element={<ClientDetail isDark={isDark} />} />

          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;