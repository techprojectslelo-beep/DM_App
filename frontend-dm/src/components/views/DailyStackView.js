import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, Clock, Layout, 
  Calendar as CalendarIcon, List, Eye, ExternalLink, X,
  Video, Image, Mail, Mic, Pencil
} from 'lucide-react';
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import RightSidebar from './RightSidebar'; 

const DailyStackView = ({ isSidebarOpen, isDark }) => {
  const [viewMode, setViewMode] = useState('weekly'); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState(null);
  const [isSidebarDetailOpen, setIsSidebarDetailOpen] = useState(false);
  const calendarRef = useRef(null);

  const currentUser = { name: "Sarah J.", role: "staff" };

  // Color logic for slate 300 / 600
  const slateText = isDark ? 'text-slate-300' : 'text-slate-600';

  const formatTitle = (text, maxLength = 45) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const [posts, setPosts] = useState([
    { 
      id: '1', 
      title: "Apple: Reel",
      post_name: "Nike Jordan air Posting eeeee jkdmdbmshndamnbfsndbmjbsmda",
      brand_name: "Apple", 
      brand_logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      post_type: "Reel", 
      status: "Ready", 
      start: "2026-01-12T10:00:00", 
      link: "https://canvas.com/design1",
      view_count: "1.2k",
      created_by: "Sarah J.",
      confirmed_by: "kk",
      posted_by: "", 
      extendedProps: { status: "Ready", type: "Reel", brand_name: "Apple", created_by: "Sarah J.", confirmed_by: "kk", posted_by: "", view_count: "1.2k" }
    },
    { 
      id: '2', 
      title: "Google: Canva", 
      post_name: "Winter Collection",
      brand_name: "Google", 
      brand_logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_\"G\"_logo.svg",
      post_type: "Canva Post", 
      status: "Posted", 
      start: "2026-01-12T14:30:00", 
      link: "https://instagram.com/p/google123",
      view_count: "45.8k",
      created_by: "Mike R.",
      confirmed_by: "Alex P.",
      posted_by: "Alex P.",
      extendedProps: { status: "Posted", type: "Canva Post", brand_name: "Google", created_by: "Mike R.", confirmed_by: "Alex P.", posted_by: "Alex P.", view_count: "45.8k" }
    },
    { 
        id: '3', 
        title: "Apple: Reel",
        post_name: "Nike Jordan air Posting eeeee jkdmdbmshndamnbfsndbmjbsmda",
        brand_name: "Apple", 
        brand_logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        post_type: "Reel", 
        status: "Pending", 
        start: "2026-01-12T10:00:00", 
        link: "https://canvas.com/design1",
        view_count: "1.2k",
        created_by: "Sarah J.",
        confirmed_by: "",
        posted_by: "", 
        extendedProps: { status: "Pending", type: "Reel", brand_name: "Apple", created_by: "Sarah J.", confirmed_by: "", posted_by: "", view_count: "1.2k" }
      }
  ]);

  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(date.setDate(diff));
  };

  const getWeekDates = (startDate) => {
    const monday = getMonday(startDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi && viewMode === 'monthly') {
      calendarApi.changeView('dayGridMonth');
      setTimeout(() => { calendarApi.updateSize(); }, 300);
    }
  }, [viewMode, isSidebarOpen]);

  const handlePostClick = (postData) => {
    setSelectedPost(postData);
    setIsSidebarDetailOpen(true);
  };

  const handleSaveChanges = (updatedPost) => {
    setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
    setIsSidebarDetailOpen(false);
  };

  const getStatusStyles = (post) => {
    if (post.status === "Posted") {
      return { 
        bg: isDark ? "bg-emerald-950/20" : "bg-emerald-50/30", 
        border: isDark ? "border-emerald-800/50" : "border-emerald-200", 
        accent: "bg-emerald-500",
        calendar: "bg-emerald-500 text-white" 
      };
    }
    if (post.status === "Pending") {
      return { 
        bg: isDark ? "bg-amber-950/20" : "bg-amber-50/30", 
        border: isDark ? "border-amber-800/50" : "border-amber-200", 
        accent: "bg-amber-500",
        calendar: "bg-amber-500 text-white"
      };
    }
    if (post.confirmed_by || post.status === "Confirmed" || post.status === "Ready") {
      return { 
        bg: isDark ? "bg-indigo-950/20" : "bg-indigo-50/20", 
        border: isDark ? "border-indigo-800/50" : "border-indigo-200", 
        accent: "bg-indigo-600",
        calendar: "bg-indigo-600 text-white"
      };
    }
    return { 
      bg: isDark ? "bg-slate-800/40" : "bg-slate-50/50", 
      border: isDark ? "border-slate-700" : "border-slate-200", 
      accent: "bg-slate-400",
      calendar: "bg-slate-400 text-white"
    };
  };

  const getPostTypeIcon = (type) => {
    const t = type.toLowerCase();
    const iconSize = 18; 
    if (t.includes('reel') || t.includes('video')) return <Video size={iconSize} />;
    if (t.includes('canva') || t.includes('image') || t.includes('post')) return <Image size={iconSize} />;
    if (t.includes('mail')) return <Mail size={iconSize} />;
    if (t.includes('engagement')) return <Mic size={iconSize} />;
    return <Layout size={iconSize} />;
  };

  const changeDate = (offset) => {
    const next = new Date(selectedDate);
    const jump = viewMode === 'weekly' ? 7 * offset : offset;
    next.setDate(selectedDate.getDate() + jump);
    setSelectedDate(next);
    if (calendarRef.current) calendarRef.current.getApi().gotoDate(next);
  };

  const weekDates = getWeekDates(selectedDate);

  const StatusTag = ({ label, color, isActive }) => {
    const variants = {
      green: isDark ? "bg-emerald-900/30 border-emerald-700 text-emerald-400" : "bg-emerald-50 border-emerald-500 text-emerald-600",
      orange: isDark ? "bg-orange-900/30 border-orange-700 text-orange-400" : "bg-orange-50 border-orange-500 text-orange-600",
      slate: isDark ? "bg-slate-800 border-slate-700 text-slate-500" : "bg-slate-50 border-slate-300 text-slate-400"
    };
    const style = isActive ? variants[color] : variants.orange;
    return (
      <span className={`px-2 py-1 rounded-md border text-[8px] font-black uppercase tracking-widest whitespace-nowrap ${style}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden p-6 transition-colors duration-300">
      
      <div className={`flex-1 rounded-[32px] border shadow-sm overflow-hidden flex flex-col pt-6 pl-6 transition-all duration-300 ${
        isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-100 border-slate-100'
      }`}>
        
        <div className={`pr-8 pb-4 shrink-0 border-b transition-colors ${isDark ? 'border-slate-800' : 'border-slate-50'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className={`px-5 py-2.5 rounded-xl border min-w-[140px] text-center transition-colors ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}>
                <h1 className={`text-sm md:text-xl font-black uppercase tracking-tighter transition-colors ${
                  isDark ? 'text-slate-100' : 'text-slate-800'
                }`}>
                  {viewMode === 'weekly' 
                    ? `${weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekDates[6].toLocaleDateString('en-US', { day: 'numeric' })}`
                    : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                </h1>
              </div>
              <div className={`flex items-center rounded-xl p-1 border transition-colors ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}>
                <button onClick={() => changeDate(-1)} className={`p-2.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-white text-slate-600'}`}><ChevronLeft size={18}/></button>
                <button onClick={() => setSelectedDate(new Date())} className={`px-3 text-[10px] font-black uppercase transition-colors ${slateText}`}>Today</button>
                <button onClick={() => changeDate(1)} className={`p-2.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-white text-slate-600'}`}><ChevronRight size={18}/></button>
              </div>
            </div>

            <div className={`flex p-1.5 rounded-xl border transition-colors ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              {[
                { id: 'today', label: 'Day', icon: <List size={14}/> }, 
                { id: 'weekly', label: 'Week', icon: <Layout size={14}/> }, 
                { id: 'monthly', label: 'Month', icon: <CalendarIcon size={14}/> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    viewMode === tab.id 
                      ? isDark ? 'bg-slate-700 text-indigo-400 shadow-sm border border-slate-600' : 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                      : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {viewMode !== 'monthly' ? (
            <div className="flex-1 overflow-y-auto pr-8 pt-0 custom-scrollbar ">
              <div className="space-y-8 w-full max-w-[1600px] mx-auto">
                {(viewMode === 'today' ? [selectedDate] : weekDates).map((date) => {
                  const dayPosts = posts.filter(p => new Date(p.start).toDateString() === date.toDateString());
                  const isToday = new Date().toDateString() === date.toDateString();
                  return (
                    <div key={date.toISOString()} className="space-y-4 pt-4">
                      <div className="flex items-center gap-4 px-2">
                        <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] ${isToday ? 'text-indigo-400' : slateText}`}>
                          {date.toLocaleDateString('en-US', { weekday: 'long' })}
                        </h3>
                        <span className={`text-[11px] font-bold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <div className={`flex-1 h-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`}></div>
                      </div>
                      <div className="space-y-3">
                        {dayPosts.length > 0 ? (
                          dayPosts.map((post) => {
                            const styles = getStatusStyles(post);
                            return (
                              <div 
                                key={post.id} 
                                onClick={() => handlePostClick(post)} 
                                className={`group relative cursor-pointer py-5 px-8 rounded-2xl border-2 transition-all flex items-center shadow-sm hover:shadow-md active:scale-[0.99] overflow-hidden ${styles.bg} ${styles.border}`}
                              >
                                <div className={`absolute left-0 top-0 bottom-0 w-2 ${styles.accent} group-hover:w-3 transition-all duration-300`} />
                                
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border overflow-hidden shrink-0 mr-8 relative z-10 transition-colors ${
                                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                                }`}>
                                  <img src={post.brand_logo} alt={post.brand_name} className={`w-6 h-6 object-contain ${isDark && post.brand_name === 'Apple' ? 'invert' : ''}`} />
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1fr_1fr] gap-4 items-center min-w-0 relative z-10">
                                  <div className="flex flex-col gap-1.5 min-w-0">
                                    <div className={`text-[15px] font-black uppercase tracking-tight truncate transition-colors ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                                      {post.brand_name}: <span className={`${slateText} font-bold`}>{formatTitle(post.post_name)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                                        <Pencil size={11} className="opacity-60" />
                                        <span className={`text-[13px] font-black tracking-wide truncate ${slateText}`}>{post.created_by || "System"}</span>
                                      </div>
                                      <StatusTag label={post.status === 'Pending' ? 'Not Ready' : 'Ready'} color={post.status === 'Pending' ? 'orange' : 'green'} isActive={true} />
                                    </div>
                                  </div>
                                  <div className={`flex items-center gap-3 px-6 border-l transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <div className={`p-2 rounded-lg shrink-0 transition-colors ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-700'}`}>{getPostTypeIcon(post.post_type)}</div>
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${slateText}`}>{post.post_type}</span>
                                  </div>
                                  <div className={`flex justify-center border-l transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}><StatusTag label={post.confirmed_by ? "Confirmed" : "Not Confirmed"} color="green" isActive={!!post.confirmed_by} /></div>
                                  <div className={`flex justify-center border-l transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}><StatusTag label={post.status === "Posted" ? "Posted" : "Not Posted"} color="green" isActive={post.status === "Posted"} /></div>
                                </div>
                                <div className={`ml-10 flex items-center gap-2 font-bold text-[11px] shrink-0 relative z-10 ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>
                                  <Clock size={12}/><span>{new Date(post.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                            );
                          })
                        ) : <div className="h-1 opacity-0"></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={`flex-1 calendar-container overflow-hidden p-4 transition-colors ${isDark ? 'bg-slate-900/40' : 'bg-white'}`}>
              <FullCalendar
                ref={calendarRef}
                plugins={[daygridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={posts}
                height="100%"
                dayMaxEvents={3}
                headerToolbar={false}
                eventContent={(info) => <CalendarEvent info={info} getStatusStyles={(s) => getStatusStyles({status: s, confirmed_by: info.event.extendedProps.confirmed_by})} />}
                eventClick={(info) => handlePostClick(info.event.extendedProps)}
              />
            </div>
          )}
        </div>
      </div>

      <RightSidebar 
        isOpen={isSidebarDetailOpen} onClose={() => setIsSidebarDetailOpen(false)} 
        post={selectedPost} currentUser={currentUser} onSave={handleSaveChanges} isDark={isDark}
      />
    </div>
  );
};

const CalendarEvent = ({ info, getStatusStyles }) => {
  const p = info.event.extendedProps;
  const styles = getStatusStyles({ status: p.status, confirmed_by: p.confirmed_by });
  
  return (
    <div className={`mx-0.5 my-0.5 p-1 rounded-md shadow-sm truncate transition-transform hover:scale-[1.02] ${styles.calendar}`}>
      <div className="text-[9px] font-black uppercase leading-tight px-1">
        {p.brand_name}
      </div>
    </div>
  );
};

export default DailyStackView;