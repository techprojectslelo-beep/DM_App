import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Users, Bell, Menu, CalendarDays,
  Sun, Moon, UserCheck, CheckCircle2, Clock, 
  ChevronRight, Video, Image as ImageIcon, 
  PlaySquare, PenIcon, LogOut, User, Settings, Shield
} from 'lucide-react';

// Modified HeaderLink to use NavLink for automatic active state styling
const HeaderLink = ({ label, icon, to, isDark }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `flex items-center gap-2 cursor-pointer transition-all relative py-7 px-1 ${
      isActive 
        ? 'text-indigo-400 dark:text-indigo-300' 
        : isDark ? 'text-slate-300 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900'
    }`}
  >
    {({ isActive }) => (
      <>
        {icon}
        <span className="text-[11px] font-black uppercase tracking-[0.15em] hidden sm:inline">{label}</span>
        {isActive && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full shadow-[0_-4px_12px_rgba(79,70,229,0.4)]"></div>
        )}
      </>
    )}
  </NavLink>
);

const Header = ({ setIsSidebarOpen, isDark, setIsDark, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // --- ROLE & USER LOGIC ---
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const displayName = storedUser.full_name || storedUser.name || storedUser.email || "System User";
  const displayRole = storedUser.role || "Staff";
  
  // Security Check: Only show Team to Admins
  const isAdmin = displayRole.toLowerCase() === 'admin';

  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    onLogout(); 
    navigate('/login');
  };

  const slateText = isDark ? 'text-slate-300' : 'text-slate-600';

  const getPostIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'reel': return <Video size={18} />;
      case 'static': return <ImageIcon size={18} />;
      default: return <PlaySquare size={18} />;
    }
  };

  const notifications = [
    { id: '1', title: "Asking for Confirmation", post_name: "Nike Jordan air Posting...", brand_name: "Apple", post_type: "Reel", status: "Ready", created_by: "Sarah J.", time: "2m ago", category: "confirmation" },
    { id: '2', title: "Post Pending", post_name: "Winter Collection 2026", brand_name: "Nike", post_type: "Static", status: "Scheduled", created_by: "Admin", time: "48h remaining", category: "pending" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      </div>

      <style>{`
        @media (max-width: 1024px) {
          header { border-bottom-left-radius: 24px; border-bottom-right-radius: 0px; }
          header::after {
            content: ''; position: absolute; bottom: -24px; right: 0; height: 24px; width: 24px;
            background-color: transparent; border-top-right-radius: 24px;
            box-shadow: 10px -10px 0 0 ${isDark ? '#0f172a' : '#fff'};
            pointer-events: none; transition: box-shadow 0.3s ease;
          }
        }
      `}</style>

      <div className="flex items-center gap-6 md:gap-10">
        <nav className="flex items-center gap-4 md:gap-10 h-full">
          <HeaderLink label="Schedule" to="/" isDark={isDark} icon={<CalendarDays size={18}/>} />
          <HeaderLink label="Create" to="/create-task" isDark={isDark} icon={<PenIcon size={18}/>} />
          <HeaderLink label="Brands" to="/brands" isDark={isDark} icon={<Briefcase size={18}/>} />
          <HeaderLink label="Clients" to="/enquiry" isDark={isDark} icon={<UserCheck size={18}/>} />
          
          {/* TEAM LINK: Role-based Visibility */}
          {isAdmin && (
            <HeaderLink label="Team" to="/users" isDark={isDark} icon={<Users size={18}/>} />
          )}
        </nav>

        <div className={`flex items-center gap-3 md:gap-4 pl-4 border-l transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-slate-50 text-slate-400'}`}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* NOTIFICATIONS DROPDOWN */}
          <div className="relative" ref={notificationRef}>
            <div onClick={() => setShowNotifications(!showNotifications)} className={`relative cursor-pointer p-2 rounded-xl transition-all hidden sm:block ${showNotifications ? (isDark ? 'bg-slate-800' : 'bg-slate-100') : (isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50')}`}>
              <Bell size={20} className={slateText} />
              <div className={`absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 ${isDark ? 'border-slate-900' : 'border-white'}`}></div>
            </div>

            {showNotifications && (
              <div className={`absolute right-0 mt-4 w-80 md:w-96 rounded-[24px] border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${isDark ? 'bg-slate-900 border-slate-800 shadow-black/50' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
                <div className="p-5 border-b border-inherit flex items-center justify-between">
                  <h4 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</h4>
                  <span className="text-[9px] font-black bg-indigo-500 text-white px-2 py-0.5 rounded-full">Feed</span>
                </div>
                <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-4 border-b border-inherit last:border-none flex gap-4 cursor-pointer transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                      <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border-2 relative ${n.category === 'confirmation' ? (isDark ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-orange-50 border-orange-100 text-orange-600') : (isDark ? 'bg-sky-500/10 border-sky-500/30 text-sky-500' : 'bg-sky-50 border-sky-100 text-sky-600')}`}>
                        {getPostIcon(n.post_type)}
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${isDark ? 'border-slate-900' : 'border-white'} ${n.category === 'confirmation' ? 'bg-amber-400 text-black' : 'bg-sky-500 text-white'}`}>
                          {n.category === 'confirmation' ? <CheckCircle2 size={10} strokeWidth={3} /> : <Clock size={10} strokeWidth={3} />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className={`text-[10px] font-black uppercase tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{n.title}</p>
                          <span className={`text-[9px] font-bold whitespace-nowrap ml-2 ${n.category === 'pending' ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>{n.time}</span>
                        </div>
                        <div className="mt-1">
                          <p className={`text-[11px] font-bold truncate ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>{n.brand_name} • <span className={slateText}>{n.post_name}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PROFILE SECTION */}
          <div className="relative" ref={profileRef}>
            <div onClick={() => setShowProfileMenu(!showProfileMenu)} className={`flex items-center gap-3 cursor-pointer p-1 rounded-2xl transition-all ${showProfileMenu ? (isDark ? 'bg-slate-800' : 'bg-slate-50') : 'hover:opacity-80'}`}>
              <div className="text-right hidden sm:block pl-2">
                <div className={`text-[10px] font-black uppercase leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{displayName}</div>
                <div className={`text-[9px] font-bold uppercase tracking-tighter ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{displayRole}</div>
              </div>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black shadow-lg transition-all relative ${isDark ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-slate-900 text-white shadow-slate-200'}`}>{initials}</div>
            </div>

            {showProfileMenu && (
              <div className={`absolute right-0 mt-4 w-64 rounded-[28px] border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 ${isDark ? 'bg-slate-900 border-slate-800 shadow-black/60' : 'bg-white border-slate-100 shadow-slate-200/60'}`}>
                <div className="p-3">
                  <div className={`px-4 py-4 mb-2 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Account</p>
                    <p className={`text-[12px] font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{displayName}</p>
                    <p className={`text-[10px] font-medium truncate opacity-60 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{storedUser.email || ""}</p>
                  </div>

                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <User size={16} className="text-indigo-500" /> My Profile
                  </button>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <Shield size={16} className="text-indigo-500" /> Security
                  </button>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <Settings size={16} className="text-indigo-500" /> System Settings
                  </button>
                  <div className={`my-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}></div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all active:scale-95">
                    <LogOut size={16} /> Logout System
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;