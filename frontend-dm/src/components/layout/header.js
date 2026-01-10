import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Bell,
  PlusCircle,
  Menu,
  CalendarDays,
  Sun,
  Moon
} from 'lucide-react';
import LogoName from '../../assets/TechC-Name (2).png';

const HeaderLink = ({ label, icon, active = false, onClick, isDark }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-2 cursor-pointer transition-all relative py-7 px-1 ${
      active 
        ? 'text-indigo-600 dark:text-indigo-400' 
        : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {icon}
    <span className="text-[11px] font-black uppercase tracking-[0.15em] hidden sm:inline">{label}</span>
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full shadow-[0_-4px_12px_rgba(79,70,229,0.4)]"></div>
    )}
  </div>
);

const Header = ({ activePage = 'dashboard', setActivePage, setIsSidebarOpen, isDark, setIsDark }) => {
  return (
    <header className={`h-20 flex items-center justify-between px-6 md:px-12 relative z-[140] shrink-0 border-b lg:border-none transition-all duration-300 ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
    }`}>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className={`lg:hidden p-2 rounded-xl border transition-colors ${
            isDark ? 'text-slate-300 bg-slate-800 border-slate-700' : 'text-slate-600 bg-slate-50 border-slate-200'
          }`}
        >
          <Menu size={20} />
        </button>
        
        <img 
          src={LogoName} 
          alt="TechC" 
          className={`h-20 object-contain pr-20 transition-all duration-500 ${isDark ? 'brightness-200 contrast-125' : ''}`} 
        />
      </div>

      <style>{`
        @media (max-width: 1024px) {
          header {
            border-bottom-left-radius: 24px;
            border-bottom-right-radius: 0px;
          }
          header::after {
            content: '';
            position: absolute;
            bottom: -24px;
            right: 0;
            height: 24px;
            width: 24px;
            background-color: transparent;
            border-top-right-radius: 24px;
            box-shadow: 10px -10px 0 0 ${isDark ? '#0f172a' : '#fff'};
            pointer-events: none;
            transition: box-shadow 0.3s ease;
          }
        }
      `}</style>

      <div className="flex items-center gap-6 md:gap-10">
        <nav className="flex items-center gap-4 md:gap-10 h-full">
          <HeaderLink 
            label="Dashboard" 
            active={activePage === 'dashboard'} 
            isDark={isDark}
            icon={<LayoutDashboard size={18}/>} 
            onClick={() => setActivePage('dashboard')}
          />
          <HeaderLink 
            label="Schedule" 
            active={activePage === 'schedule'} 
            isDark={isDark}
            icon={<CalendarDays size={18}/>} 
            onClick={() => setActivePage('schedule')}
          />
          <HeaderLink 
            label="Brands" 
            active={activePage === 'brands'} 
            isDark={isDark}
            icon={<Briefcase size={18}/>} 
            onClick={() => setActivePage('brands')}
          />
          <HeaderLink 
            label="Team" 
            active={activePage === 'users'} 
            isDark={isDark}
            icon={<Users size={18}/>} 
            onClick={() => setActivePage('users')}
          />
        </nav>

        <div className={`flex items-center gap-3 md:gap-4 pl-4 border-l transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-slate-50 text-slate-400'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={() => setActivePage('schedule')}
            className={`hidden xl:flex items-center gap-2 px-4 py-2 rounded-xl transition-all group border ${
                activePage === 'schedule' 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : isDark 
                  ? 'bg-indigo-900/20 text-indigo-400 border-indigo-800 hover:bg-indigo-900/40' 
                  : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'
            }`}
          >
              <PlusCircle size={16} className={activePage !== 'schedule' ? "group-hover:rotate-90 transition-transform duration-300" : ""}/>
              <span className="text-[10px] font-black uppercase tracking-widest">Create Task</span>
          </button>
          
          <div className={`relative cursor-pointer p-2 rounded-xl transition-all hidden sm:block ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
            <Bell size={20} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
            <div className={`absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 ${isDark ? 'border-slate-900' : 'border-white'}`}></div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className={`text-[10px] font-black uppercase leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Admin</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Stack Lead</div>
            </div>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shadow-lg transition-colors ${
              isDark ? 'bg-indigo-600 text-white shadow-none' : 'bg-slate-900 text-white shadow-slate-200'
            }`}>
              AD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;