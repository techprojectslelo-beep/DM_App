import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, Clock, Layout, 
  Calendar as CalendarIcon, List, Eye, ExternalLink, X,
  Video, Image, Mail, Mic, Pencil, Loader2
} from 'lucide-react';
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import RightSidebar from './RightSidebar'; 
import taskService from '../../api/taskService'; 

const DailyStackView = ({ isSidebarOpen, isDark }) => {
  const [viewMode, setViewMode] = useState('weekly'); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState(null);
  const [isSidebarDetailOpen, setIsSidebarDetailOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef(null);

  const currentUser = { name: "Sarah J.", role: "staff" };
  
  // Custom theme colors based on your preferences
  const slateText = isDark ? 'text-slate-300' : 'text-slate-600';

  const getDerivedStatus = (post) => {
    if (post.posted_at) return "Posted";
    if (post.confirmed_at) return "Confirmed";
    if (post.readied_at) return "Ready";
    return "Pending";
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const data = await taskService.getTasksByMonth(month, year);
      
      const mappedPosts = data.map(task => {
        // Essential: Extract clean YYYY-MM-DD for FullCalendar's monthly grid mapping
        const dateOnly = task.task_due_date.split('T')[0];
        
        return {
          id: task.id.toString(),
          title: task.brand_name || "Untitled", 
          start: dateOnly, // Force placement on the correct day cell
          allDay: true,    // Required for month-view visibility
          extendedProps: {
            ...task,
            actual_time: task.task_due_date,
            status: getDerivedStatus(task),
            post_type: task.type_name,
            post_name: task.post_title,
          }
        };
      });
      
      setPosts(mappedPosts);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate.getMonth(), selectedDate.getFullYear()]);

  // Handle resizing when switching modes or opening sidebar
  useEffect(() => {
    const timer = setTimeout(() => {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) calendarApi.updateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [viewMode, isSidebarOpen]);

  const handlePostClick = (postData) => {
    setSelectedPost(postData);
    setIsSidebarDetailOpen(true);
  };

  const handleSaveChanges = async (updatedPost) => {
    try {
        await taskService.updateTask(updatedPost.id, updatedPost);
        fetchTasks();
        setIsSidebarDetailOpen(false);
    } catch (err) {
        alert("Failed to save changes");
    }
  };

  const formatTitle = (text = "", maxLength = 45) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getStatusStyles = (post) => {
    const status = post.status || getDerivedStatus(post);
    if (status === "Posted") {
      return { 
        bg: isDark ? "bg-emerald-950/20" : "bg-emerald-50/30", 
        border: isDark ? "border-emerald-800/50" : "border-emerald-200", 
        accent: "bg-emerald-500",
        calendar: "bg-emerald-500 text-white" 
      };
    }
    if (status === "Pending") {
      return { 
        bg: isDark ? "bg-amber-950/20" : "bg-amber-50/30", 
        border: isDark ? "border-amber-800/50" : "border-amber-200", 
        accent: "bg-amber-500",
        calendar: "bg-amber-500 text-white"
      };
    }
    if (post.confirmed_at || status === "Confirmed" || status === "Ready") {
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

  const getPostTypeIcon = (type = "") => {
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
    if (viewMode === 'monthly') {
        next.setMonth(selectedDate.getMonth() + offset);
    } else {
        const jump = viewMode === 'weekly' ? 7 * offset : offset;
        next.setDate(selectedDate.getDate() + jump);
    }
    setSelectedDate(next);
    if (calendarRef.current) calendarRef.current.getApi().gotoDate(next);
  };

  const getWeekDates = (startDate) => {
    const monday = new Date(startDate);
    const day = monday.getDay();
    const diff = monday.getDate() - day + (day === 0 ? -6 : 1); 
    monday.setDate(diff);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
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
        
        {/* Header Section */}
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
                    : viewMode === 'monthly'
                    ? selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                </h1>
              </div>
              <div className={`flex items-center rounded-xl p-1 border transition-colors ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}>
                <button onClick={() => changeDate(-1)} className={`p-2.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-white text-slate-600'}`}><ChevronLeft size={18}/></button>
                <button onClick={() => {
                  const today = new Date();
                  setSelectedDate(today);
                  if (calendarRef.current) calendarRef.current.getApi().gotoDate(today);
                }} className={`px-3 text-[10px] font-black uppercase transition-colors ${slateText}`}>Today</button>
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

        {/* View Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
               <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
          ) : viewMode !== 'monthly' ? (
            <div className="flex-1 overflow-y-auto pr-8 pt-0 custom-scrollbar ">
              <div className="space-y-8 w-full max-w-[1600px] mx-auto">
                {(viewMode === 'today' ? [selectedDate] : weekDates).map((date) => {
                  // Using extendedProps here as the data is mapped into that object now
                  const dayPosts = posts.filter(p => new Date(p.extendedProps.actual_time).toDateString() === date.toDateString());
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
                            const p = post.extendedProps;
                            const styles = getStatusStyles(p);
                            return (
                              <div 
                                key={post.id} 
                                onClick={() => handlePostClick(p)} 
                                className={`group relative cursor-pointer py-5 px-8 rounded-2xl border-2 transition-all flex items-center shadow-sm hover:shadow-md active:scale-[0.99] overflow-hidden ${styles.bg} ${styles.border}`}
                              >
                                <div className={`absolute left-0 top-0 bottom-0 w-2 ${styles.accent} group-hover:w-3 transition-all duration-300`} />
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border overflow-hidden shrink-0 mr-8 relative z-10 transition-colors ${
                                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                                }`}>
                                  <div className={`text-xs font-black ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {p.brand_name?.charAt(0)}
                                  </div>
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1fr_1fr] gap-4 items-center min-w-0 relative z-10">
                                  <div className="flex flex-col gap-1.5 min-w-0">
                                    <div className={`text-[15px] font-black uppercase tracking-tight truncate transition-colors ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                                      {p.brand_name}: <span className={`${slateText} font-bold`}>{formatTitle(p.post_name)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                                        <Pencil size={11} className="opacity-60" />
                                        <span className={`text-[13px] font-black tracking-wide truncate ${slateText}`}>{p.created_by_name || "System"}</span>
                                      </div>
                                      <StatusTag label={p.readied_at ? 'Ready' : 'Not Ready'} color={p.readied_at ? 'green' : 'orange'} isActive={true} />
                                    </div>
                                  </div>
                                  <div className={`flex items-center gap-3 px-6 border-l transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <div className={`p-2 rounded-lg shrink-0 transition-colors ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-700'}`}>{getPostTypeIcon(p.post_type)}</div>
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${slateText}`}>{p.post_type}</span>
                                  </div>
                                  <div className={`flex justify-center border-l transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}><StatusTag label={p.confirmed_at ? "Confirmed" : "Not Confirmed"} color="green" isActive={!!p.confirmed_at} /></div>
                                  <div className={`flex justify-center border-l transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}><StatusTag label={p.posted_at ? "Posted" : "Not Posted"} color="green" isActive={!!p.posted_at} /></div>
                                </div>
                                <div className={`ml-10 flex items-center gap-2 font-bold text-[11px] shrink-0 relative z-10 ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>
                                  <Clock size={12}/><span>{new Date(p.actual_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
            /* MONTHLY VIEW - Now using unique key for forced re-render */
            <div className={`flex-1 overflow-y-auto p-4 transition-colors custom-scrollbar ${
              isDark ? 'bg-slate-900/40' : 'bg-slate-100'
            }`}>
              <style>{`
                .fc { --fc-border-color: ${isDark ? '#334155' : '#e2e8f0'}; }
                .fc-theme-standard .fc-scrollgrid { border: 1px solid ${isDark ? '#334155' : '#e2e8f0'} !important; border-radius: 24px; overflow: hidden; }
                .fc .fc-daygrid-day-number { font-size: 11px; font-weight: 900; padding: 12px; color: ${isDark ? '#94a3b8' : '#64748b'}; }
                .fc .fc-col-header-cell-cushion { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; padding: 15px 0; color: ${isDark ? '#64748b' : '#94a3b8'}; }
                .fc-daygrid-day-events { min-height: 3em !important; padding: 4px !important; }
                .fc-day-today { background: ${isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.04)'} !important; }
                .fc-event { cursor: pointer !important; background: transparent !important; border: none !important; margin-bottom: 2px !important; }
              `}</style>

              <div className="w-full max-w-[1600px] mx-auto bg-white dark:bg-slate-800/50 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <FullCalendar
                  key={`calendar-${viewMode}-${posts.length}`} // Key forces remount when data or view changes
                  ref={calendarRef}
                  plugins={[daygridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  initialDate={selectedDate}
                  events={posts}
                  height="720px" 
                  dayMaxEvents={3}
                  headerToolbar={false}
                  eventDisplay="block"
                  eventContent={(info) => <CalendarEvent info={info} getStatusStyles={getStatusStyles} />}
                  eventClick={(info) => handlePostClick(info.event.extendedProps)}
                />
              </div>
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
  const styles = getStatusStyles(p);
  
  return (
    <div className="w-full group px-0.5">
      <div className={`
        relative p-1.5 rounded-lg border-l-4 shadow-sm transition-all duration-200 
        hover:scale-[1.02] active:scale-[0.98] truncate
        ${styles.calendar}
      `}>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-[10px] font-black uppercase tracking-tight truncate">
            {p.brand_name}
          </span>
          <span className="text-[8px] font-bold truncate opacity-90">
            {p.post_type}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DailyStackView;