import React, { useState, useEffect } from 'react';
import { 
  X, ExternalLink, User, Link as LinkIcon,
  Save, Clock, UserPlus, Tag
} from 'lucide-react';

const RightSidebar = ({ isOpen, onClose, post, currentUser, onSave, isDark }) => {
  const [draft, setDraft] = useState(null);

  // Sync state when post prop changes
  useEffect(() => {
    if (post) {
      setDraft({
        ...post,
        asset_link: post.asset_link || "", 
        ready_by_id: post.ready_by_id || null,
        confirmed_by_id: post.confirmed_by_id || null,
        posted_by_id: post.posted_by_id || null,
        readied_at: post.readied_at || null,
        confirmed_at: post.confirmed_at || null,
        posted_at: post.posted_at || null,
        // UI helper state
        is_ready: !!post.readied_at 
      });
    }
  }, [post]);

  if (!post || !draft) return null;

  // Logic Constants
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superuser' || currentUser.role === 'manager';
  
  // Helper to get MySQL compatible timestamp
  const getNow = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

  // 1. CLAIM / ADD MY NAME
  const handleAddMyName = () => {
    setDraft(prev => ({ 
      ...prev, 
      ready_by_id: currentUser.id,
      ready_by_name: currentUser.name || currentUser.full_name 
    }));
  };

  // 2. MARK AS READY (The primary logic fix is here)
  const handleToggleReady = () => {
    setDraft(prev => {
      const nextReadyState = !prev.is_ready;
      return {
        ...prev,
        is_ready: nextReadyState,
        readied_at: nextReadyState ? getNow() : null,
        // If turning ON, ensure we have an ID. If turning OFF, we keep the ID for history 
        // or set to null if your business logic requires it.
        ready_by_id: nextReadyState ? (prev.ready_by_id || currentUser.id) : prev.ready_by_id
      };
    });
  };

  // 3. CONFIRM (Admin Only)
  const handleConfirm = () => {
    if (!isAdmin) return;
    const now = getNow();
    setDraft(prev => ({
      ...prev,
      confirmed_by_id: currentUser.id,
      confirmed_at: now
    }));
  };

  // 4. MARK POSTED
  const handlePosted = () => {
    const now = getNow();
    setDraft(prev => ({
      ...prev,
      posted_by_id: currentUser.id,
      posted_at: now
    }));
  };

  const handleLinkChange = (e) => {
    setDraft(prev => ({ ...prev, asset_link: e.target.value }));
  };

  const handleSaveInternal = () => {
    // DEBUG: Check this console log to see if ready_by_id exists before it leaves React
    console.log("Final payload being sent to PHP:", draft);
    onSave(draft);
  };

  return (
    <>
      {isOpen && (
        <div className={`absolute inset-0 z-[60] ${isDark ? 'bg-black/40' : 'bg-slate-900/5'}`} onClick={onClose} />
      )}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[550px] border-l shadow-2xl transition-transform duration-300 ease-in-out z-[70] flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        
        <div className="h-full flex flex-col p-6 md:p-8 overflow-y-auto custom-scrollbar pt-6">
          
          {/* TOP BAR: BRAND & CLOSE */}
          <div className="flex justify-between items-center mb-8 pt-20">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
              }`}>
                {draft.brand_logo ? (
                    <img src={draft.brand_logo} alt="logo" className="w-8 h-8 object-contain" />
                ) : (
                    <span className={`text-xl font-black italic ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{draft.brand_name?.[0]}</span>
                )}
              </div>
              <div>
                <h2 className={`text-xl font-black uppercase tracking-tighter leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{draft.brand_name}</h2>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>ID: {draft.id}</span>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* GRID SECTION 1: POST TYPE & DATE */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-indigo-600 p-4 rounded-2xl flex flex-col justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-[9px] font-black text-indigo-100 uppercase tracking-widest mb-1">Post Category</span>
                <div className="flex items-center gap-3 text-white">
                    <Tag size={20} />
                    <span className="text-xl font-black uppercase tracking-tight">{draft.type_name || draft.post_type}</span>
                </div>
            </div>

            <div className={`p-4 rounded-2xl flex flex-col justify-center border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
                <span className={`text-[9px] font-black uppercase tracking-widest mb-1 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Due Date</span>
                <div className={`flex items-center justify-center gap-2 font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    <Clock size={14} className="text-rose-500" />
                    {new Date(draft.task_due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
            </div>
          </div>

          {/* ROW 3: TITLE */}
          <div className="mb-8 px-1">
            <h3 className={`text-lg font-bold leading-tight italic border-l-4 border-indigo-500 pl-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              "{draft.post_title || "Untitled Task"}"
            </h3>
          </div>

          {/* ROW 4: WORKER & READY */}
          <div className={`mb-6 p-5 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50/50 border-slate-100'
          }`}>
            <div className="flex flex-col">
              <span className={`text-[9px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Assigned Worker</span>
              {draft.ready_by_id ? (
                <div className={`flex items-center gap-2 text-sm font-black px-3 py-2 rounded-xl border ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-100 text-slate-900'
                }`}>
                  <User size={14} className="text-indigo-500" /> {draft.ready_by_name || currentUser.name || "Assigned"}
                </div>
              ) : (
                <button onClick={handleAddMyName} className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-4 py-2.5 rounded-xl transition-all border ${
                  isDark ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20' : 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100'
                }`}>
                  <UserPlus size={14} /> Add My Name
                </button>
              )}
            </div>

            <div className="flex flex-col items-end">
                <span className={`text-[9px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Internal Status</span>
                <button 
                    onClick={handleToggleReady}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all border-2
                    ${draft.is_ready 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : (isDark ? 'bg-slate-900 border-slate-700 text-slate-500 hover:border-indigo-400' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300')}`}
                >
                    {draft.is_ready ? "✓ Task Ready" : "Mark as Ready"}
                </button>
            </div>
          </div>

          {/* ACTION SECTION (Admin & Posting) */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            <div className={`grid grid-cols-[140px_1fr_120px] items-center gap-4 p-4 rounded-2xl border ${
              isDark ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {isAdmin ? (
                <button onClick={handleConfirm} className="py-3 px-4 border-2 border-blue-500 bg-blue-500/10 text-blue-500 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">
                  Confirm
                </button>
              ) : <div className={`text-[10px] font-black uppercase pl-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>Admin Only</div>}
              <div className="flex justify-center">
                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  draft.confirmed_at 
                  ? (isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200')
                  : (isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-200')
                }`}>
                  {draft.confirmed_at ? "Confirmed" : "Pending"}
                </span>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Timestamp</span>
                <span className={`text-[10px] font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{draft.confirmed_at?.split(' ')[0] || "—"}</span>
              </div>
            </div>

            <div className={`grid grid-cols-[140px_1fr_120px] items-center gap-4 p-4 rounded-2xl border ${
              isDark ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <button onClick={handlePosted} className="py-3 px-4 border-2 border-emerald-500 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">
                Mark Posted
              </button>
              <div className="flex justify-center">
                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  draft.posted_at 
                  ? (isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200')
                  : (isDark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-50 text-slate-400 border-slate-200')
                }`}>
                  {draft.posted_at ? "Live" : "Not Live"}
                </span>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Timestamp</span>
                <span className={`text-[10px] font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{draft.posted_at?.split(' ')[0] || "—"}</span>
              </div>
            </div>
          </div>

          {/* DESIGN LINK INPUT SECTION */}
          <div className={`mb-8 p-5 rounded-2xl border ${
            isDark ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50/30 border-indigo-100/50'
          }`}>
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3 block">Assets & Design URL</span>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input 
                        type="text" 
                        value={draft.asset_link}
                        onChange={handleLinkChange}
                        placeholder="Paste Figma/Canva link here..."
                        className={`w-full pl-9 pr-4 py-3 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                    />
                </div>
                <a 
                    href={draft.asset_link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`flex items-center justify-center px-4 rounded-xl transition-all border ${
                        draft.asset_link 
                        ? (isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')
                        : (isDark ? 'bg-slate-900 border-slate-800 text-slate-700 pointer-events-none' : 'bg-slate-50 text-slate-300 pointer-events-none')
                    }`}
                >
                    <ExternalLink size={16}/>
                </a>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className={`mt-auto pt-4 border-t flex justify-center ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <button 
                onClick={handleSaveInternal} 
                className="w-fit flex items-center justify-center gap-2 px-10 py-2.5 bg-blue-500/10 border-2 border-blue-500/80 text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
            >
                <Save size={14}/> 
                Submit
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default RightSidebar;