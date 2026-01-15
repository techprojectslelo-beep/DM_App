import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/header';
import DailyStackView from '../components/views/DailyStackView';
import BrandsList from '../pages/BrandList'; 
import BrandDetail from '../pages/BrandDetail';
import UsersList from '../pages/UsersList'; 
import UserDetail from '../pages/UserDetail';
import CreateTaskPage from '../pages/ScheduleTask';
import ClientList from '../pages/ClientList'; 
import ClientDetail from '../pages/ClientDetail'; // 1. Import ClientDetail

const Dashboard = ({ isDark, setIsDark }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard'); 
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); 
  const [selectedClientId, setSelectedClientId] = useState(null); 

  const handleViewChange = (view) => {
    setActiveView(view);
    setSelectedBrandId(null); 
    setSelectedUserId(null);
    setSelectedClientId(null);
  };

  const pageWrapperClass = "flex-1 overflow-y-auto pt-8 px-4 md:px-8 pb-12";

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-slate-950' : 'bg-white'
    }`}>
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isDark={isDark} 
      />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Header 
          activePage={activeView} 
          setActivePage={handleViewChange} 
          setIsSidebarOpen={setIsSidebarOpen} 
          isDark={isDark}
          setIsDark={setIsDark}
        />

        <main className={`flex-1 relative min-h-0 transition-colors duration-300 ${
          isDark ? 'bg-slate-900' : 'bg-white'
        }`}>
          
          <div className={`w-full h-full rounded-tl-[24px] lg:rounded-tl-[70px] flex flex-col shadow-[inset_4px_4px_15px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300 ${
            isDark ? 'bg-slate-800 border-t border-l border-slate-600' : 'bg-[#f1f5f9]  border-t border-l border-slate-250'
          }`}>
            
            <div className="flex-1 overflow-hidden flex flex-col">
              
              {activeView === 'dashboard' && (
                <div className="flex-1 overflow-hidden flex flex-col pt-0 pl-6">
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
                      isDark={isDark}
                    />
                  ) : (
                    <BrandsList 
                      onBrandClick={(id) => setSelectedBrandId(id)} 
                      isDark={isDark}
                    />
                  )
                }
                </div>
              )}

              {/* Clients (UPDATED LOGIC) */}
              {activeView === 'clients' && (
                <div className={pageWrapperClass}>
                  {/* 2. Toggle between List and Detail based on selectedClientId */}
                  {selectedClientId ? (
                    <ClientDetail 
                      clientId={selectedClientId} 
                      onBack={() => setSelectedClientId(null)} 
                      isDark={isDark} 
                    />
                  ) : (
                    <ClientList 
                      onClientClick={(id) => setSelectedClientId(id)} 
                      isDark={isDark} 
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
                      isDark={isDark}
                    />
                  ) : selectedUserId ? (
                    <UserDetail 
                      userId={selectedUserId} 
                      onBack={() => setSelectedUserId(null)} 
                      isDark={isDark}
                    />
                  ) : (
                    <UsersList 
                      onUserClick={(id) => setSelectedUserId(id)} 
                      onAddStaff={() => setSelectedUserId('new')} 
                      isDark={isDark}
                    />
                  )}
                </div>
              )}

              {/* Schedule */}
              {activeView === 'schedule' && (
                <div className={pageWrapperClass}>
                   <CreateTaskPage isDark={isDark} />
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