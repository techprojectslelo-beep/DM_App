import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/header';
import DailyStackView from '../components/views/DailyStackView';
import BrandsList from '../pages/BrandList'; 
import BrandDetail from '../pages/BrandDetail';
import UsersList from '../pages/UsersList'; 
import UserDetail from '../pages/UserDetail';
import CreateTaskPage from '../pages/ScheduleTask';

// UPDATE: Added props to the Dashboard arguments
const Dashboard = ({ isDark, setIsDark }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard'); 
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); 

  const handleViewChange = (view) => {
    setActiveView(view);
    setSelectedBrandId(null); 
    setSelectedUserId(null);
  };

  const pageWrapperClass = "flex-1 overflow-y-auto pt-8 px-4 md:px-8 pb-12";

  return (
    // UPDATE: Added dark mode conditional classes to the background
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      
      {/* UPDATE: Pass isDark to Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isDark={isDark} 
      />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* UPDATE: Pass isDark AND setIsDark to Header */}
        <Header 
          activePage={activeView} 
          setActivePage={handleViewChange} 
          setIsSidebarOpen={setIsSidebarOpen} 
          isDark={isDark}
          setIsDark={setIsDark}
        />

        <main className={`flex-1 relative min-h-0 transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
          <div className={`w-full h-full rounded-tl-[24px] lg:rounded-tl-[70px] flex flex-col shadow-[inset_4px_4px_15px_rgba(0,0,0,0.02)] overflow-hidden transition-colors duration-300 ${
            isDark ? 'bg-slate-900/50' : 'bg-[#f1f5f9]'
          }`}>
            
            <div className="flex-1 overflow-hidden flex flex-col">
              
              {activeView === 'dashboard' && (
                <div className="flex-1 overflow-hidden flex flex-col pt-0 pl-6">
                  {/* UPDATE: Pass isDark to DailyStackView if needed */}
                  <DailyStackView isSidebarOpen={isSidebarOpen} isDark={isDark} />
                </div>
              )}

              {/* Brands */}
              {activeView === 'brands' && (
                <div className={pageWrapperClass}>
                  {selectedBrandId ? (
                    <BrandDetail 
                      brandId={selectedBrandId} 
                      onBack={() => setSelectedBrandId(null)} 
                    />
                  ) : (
                    <BrandsList 
                      onBrandClick={(id) => setSelectedBrandId(id)} 
                    />
                  )}
                </div>
              )}

              {/* Users */}
              {activeView === 'users' && (
                <div className={pageWrapperClass}>
                  {selectedUserId === 'new' ? (
                    <UserDetail 
                      isCreateMode={true} 
                      onBack={() => setSelectedUserId(null)} 
                    />
                  ) : selectedUserId ? (
                    <UserDetail 
                      userId={selectedUserId} 
                      onBack={() => setSelectedUserId(null)} 
                    />
                  ) : (
                    <UsersList 
                      onUserClick={(id) => setSelectedUserId(id)} 
                      onAddStaff={() => setSelectedUserId('new')} 
                    />
                  )}
                </div>
              )}

              {/* Schedule */}
              {activeView === 'schedule' && (
                <div className={pageWrapperClass}>
                   <CreateTaskPage />
                </div>
              )}
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;