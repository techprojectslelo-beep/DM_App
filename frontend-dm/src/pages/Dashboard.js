import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/header';

const Dashboard = ({ isDark, setIsDark, user, onLogout, onFilterChange, rawData }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const getActivePageName = () => {
    const path = location.pathname.split('/')[1];
    if (!path || path === "schedule") return "Schedule";
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-slate-950' : 'bg-white'
    }`}>
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isDark={isDark} 
        user={user}
        rawData={rawData} // THIS POPULATES THE FILTER OPTIONS
        onFilterChange={onFilterChange} // THIS TRIGGERS THE RE-FILTERING
      />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Header 
          activePage={getActivePageName()} 
          setIsSidebarOpen={setIsSidebarOpen} 
          isDark={isDark}
          setIsDark={setIsDark}
          user={user}
          onLogout={onLogout}
        />

        <main className={`flex-1 relative min-h-0 transition-colors duration-300 ${
          isDark ? 'bg-slate-900' : 'bg-white'
        }`}>
          <div className={`w-full h-full rounded-tl-[24px] lg:rounded-tl-[70px] flex flex-col shadow-[inset_4px_4px_15px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300 ${
            isDark ? 'bg-slate-800 border-t border-l border-slate-600' : 'bg-[#f1f5f9] border-t border-l border-slate-200'
          }`}>
            <div className="flex-1 overflow-y-auto pt-8 px-4 md:px-8 pb-12 custom-scrollbar">
               <Outlet context={{ isDark }} /> 
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;