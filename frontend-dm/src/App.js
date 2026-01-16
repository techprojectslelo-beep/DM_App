import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

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

function AppContent() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  
  // Data States
  const [tasks, setTasks] = useState([]); 
  const [entities, setEntities] = useState([]); 
  const [enquiries, setEnquiries] = useState([]); 
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sync Callbacks to feed data back up to the Sidebar
  const handleDataSync = useCallback((data) => setTasks(data), []);
  const handleEntitiesSync = useCallback((data) => setEntities(data), []);
  const handleEnquiriesSync = useCallback((data) => setEnquiries(data), []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // SIDEBAR DATA LOGIC
  // This determines what "Unique Options" appear in the sidebar checkboxes
  const getSidebarData = () => {
    const path = location.pathname;

    if (path.startsWith('/brands')) {
      return entities.map(e => ({
        ...e,
        brand_status: e.is_active == 1 ? "Active" : "Inactive"
      }));
    }
    
    if (path.startsWith('/enquiry')) {
      return enquiries; 
    }

    // Default to tasks (Dashboard / Daily Stack)
    return tasks; 
  };

  return (
    <div className="App min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Routes>
        {/* Auth Route */}
        <Route 
          path="/login" 
          element={!user ? <Login isDark={isDark} setIsDark={setIsDark} onLogin={handleLogin} /> : <Navigate to="/" />} 
        />

        {/* Protected Dashboard Layout */}
        <Route 
          path="/" 
          element={
            user ? (
              <Dashboard 
                isDark={isDark} 
                setIsDark={setIsDark} 
                user={user} 
                onLogout={handleLogout} 
                onFilterChange={setActiveFilters} 
                rawData={getSidebarData()} 
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          {/* Index: Daily Stack / Dashboard */}
          <Route 
            index 
            element={
              <div className="pl-6 flex-1">
                <DailyStackView 
                  isDark={isDark} 
                  activeFilters={activeFilters} 
                  onDataLoaded={handleDataSync} 
                />
              </div>
            } 
          />

          <Route path="create-task" element={<CreateTaskPage isDark={isDark} />} />
          
          {/* Users Section */}
          <Route path="users" element={<UsersList isDark={isDark} />} />
          <Route path="users/:id" element={<UserDetail isDark={isDark} />} />
          <Route path="users/new" element={<UserDetail isCreateMode={true} isDark={isDark} />} />
          
          {/* Brands Section */}
          <Route 
            path="brands" 
            element={
              <BrandsList 
                isDark={isDark} 
                activeFilters={activeFilters} 
                onDataLoaded={handleEntitiesSync} 
              />
            } 
          />
          <Route path="brands/:id" element={<BrandDetail isDark={isDark} />} />
          
          {/* Enquiries / Clients Section */}
          <Route 
            path="enquiry" 
            element={
              <ClientList 
                isDark={isDark} 
                activeFilters={activeFilters} 
                onDataLoaded={handleEnquiriesSync} 
              />
            } 
          />
          <Route path="enquiry/:id" element={<ClientDetail isDark={isDark} />} />
        </Route>
      </Routes>
    </div>
  );
}

// Root App Component with Provider
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}