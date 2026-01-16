import React, { useState, useEffect } from 'react';
import { 
  X, ExternalLink, User, Link as LinkIcon,
  Save, Clock, UserPlus, Tag, MinusCircle
} from 'lucide-react';

const RightSidebar = ({ isOpen, onClose, post, currentUser, onSave, isDark }) => {
  const [draft, setDraft] = useState(null);

  // --- Theme Styles (Slate 300 Dark / Slate 600 Light) ---
  const btnSlateStyle = isDark 
    ? 'bg-slate-300 text-slate-900 border-slate-300 hover:bg-white' 
    : 'bg-slate-600 text-white border-slate-600 hover:bg-slate-800';
    
  const secondaryText = isDark ? 'text-slate-300' : 'text-slate-600';

  useEffect(() => {
    if (post) {
      setDraft({
        ...post,
        asset_link: post.asset_link || "", 
        ready_by_id: post.ready_by_id || null,
        ready_by_name: post.ready_by_name || null,
        confirmed_by_id: post.confirmed_by_id || null,
        posted_by_id: post.posted_by_id || null,
        readied_at: post.readied_at || null,
        confirmed_at: post.confirmed_at || null,
        posted_at: post.posted_at || null,
        is_ready: !!post.readied_at 
      });
    }
  }, [post]);

  if (!post || !draft) return null;

  const currentUserId = currentUser?.id || currentUser?.id_user || currentUser?.user_id || null;
  const currentUserName = currentUser?.name || currentUser?.full_name || "User";
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superuser' || currentUser?.role === 'manager';
  
  const getNow = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

  // 1. CLAIM LOGIC
  const handleClaim = () => {
    if (!currentUserId) return;
    setDraft(prev => ({ 
      ...prev, 
      ready_by_id: currentUserId,
      ready_by_name: currentUserName 
    }));
  };

  const handleUnclaim = () => {
    setDraft(prev => ({ 
      ...prev, 
      ready_by_id: null,
      ready_by_name: null 
    }));
  };

  // 2. READY LOGIC
  const handleToggleReady = () => {
    setDraft(prev => {
      const nextReadyState = !prev.is_ready;
      return {
        ...prev,
        is_ready: nextReadyState,
        readied_at: nextReadyState ? getNow() : null
      };
    });
  };

  // 3. CONFIRM LOGIC
  const handleConfirm = () => {
    if (!isAdmin) return;
    setDraft(prev => ({
      ...prev,
      confirmed_by_id: currentUserId,
      confirmed_at: getNow()
    }));
  };

  const handleUnconfirm = () => {
    if (!isAdmin) return;
    setDraft(prev => ({ ...prev, confirmed_by_id: null, confirmed_at: null }));
  };

  // 4. POSTED LOGIC
  const handlePosted = () => {
    setDraft(prev => ({
      ...prev,
      posted_by_id: currentUserId,
      posted_at: getNow()
    }));
  };

  const handleUnposted = () => {
    setDraft(prev => ({ ...prev, posted_by_id: null, posted_at: null }));
  };

  const handleSaveInternal = () => {
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
          
          {/* BRAND HEADER */}
          <div className="flex justify-between items-center mb-8 pt-20">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
              }`}>
                <span className={`text-xl font-black italic ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{draft.brand_name?.[0]}</span>
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

          {/* INFO GRID */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`h-[56px] px-4 rounded-2xl flex items-center gap-3 border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                <Tag size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Category</span>
                  <span className={`text-xs font-black uppercase tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{draft.type_name || draft.post_type}</span>
                </div>
            </div>
            <div className={`h-[56px] px-4 rounded-2xl flex items-center gap-3 border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                <Clock size={18} className="text-rose-500" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Due Date</span>
                  <span className={`text-xs font-black uppercase tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {new Date(draft.task_due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
            </div>
          </div>

          {/* TASK TITLE */}
          <div className="mb-8 px-1">
            <h3 className={`text-lg font-bold leading-tight italic border-l-4 border-slate-400 pl-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              "{draft.post_title || "Untitled Task"}"
            </h3>
          </div>

          {/* ACTION SECTION */}
          <div className="flex flex-col gap-3 mb-8">
            
            {/* CLAIM ROW (Now structured like Confirm/Posted) */}
            <div className={`grid grid-cols-[140px_1fr_120px] items-center gap-4 p-4 rounded-2xl border ${
              isDark ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <button 
                onClick={draft.ready_by_id ? handleUnclaim : handleClaim} 
                className={`h-[44px] flex items-center justify-center gap-2 text-[10px] font-black uppercase px-4 rounded-xl border transition-all shadow-sm ${btnSlateStyle}`}
              >
                {draft.ready_by_id ? "Unclaim" : "Claim"}
              </button>

              <div className="flex justify-center">
                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                  draft.ready_by_id 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                }`}>
                  {draft.ready_by_id ? "Claimed" : "Pending"}
                </span>
              </div>

              <div className="text-right flex flex-col overflow-hidden">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Claimed By</span>
                <span className={`text-[10px] font-black truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {draft.ready_by_name || "—"}
                </span>
              </div>
            </div>

            {/* INTERNAL STATUS (READY) ROW */}
            <div className={`grid grid-cols-[140px_1fr_120px] items-center gap-4 p-4 rounded-2xl border ${
              isDark ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <button onClick={handleToggleReady} className={`h-[44px] flex items-center justify-center gap-2 text-[10px] font-black uppercase px-4 rounded-xl border transition-all shadow-sm ${btnSlateStyle}`}>
                {draft.is_ready ? "Unmark Ready" : "Mark Ready"}
              </button>

              <div className="flex justify-center">
                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                  draft.is_ready 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                }`}>
                  {draft.is_ready ? "Ready" : "Process"}
                </span>
              </div>

              <div className="text-right flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Timestamp</span>
                <span className={`text-[10px] font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {draft.readied_at?.split(' ')[0] || "—"}
                </span>
              </div>
            </div>

            {/* CONFIRMATION ROW */}
            <div className={`grid grid-cols-[140px_1fr_120px] items-center gap-4 p-4 rounded-2xl border ${
              isDark ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {isAdmin ? (
                <button onClick={handleConfirm} className={`h-[44px] flex items-center justify-center gap-2 text-[10px] font-black uppercase px-4 rounded-xl border transition-all shadow-sm ${btnSlateStyle}`}>
                  Confirm
                </button>
              ) : <div className={`text-[10px] font-black uppercase pl-2 text-slate-400`}>Admin Only</div>}
              
              <div className="flex justify-center group relative">
                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                  draft.confirmed_at 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                }`}>
                  {draft.confirmed_at ? "Confirmed" : "Pending"}
                </span>
                {isAdmin && draft.confirmed_at && (
                  <button onClick={handleUnconfirm} className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MinusCircle size={18} className="text-rose-500 bg-white dark:bg-slate-900 rounded-full" />
                  </button>
                )}
              </div>
              
              <div className="text-right flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Timestamp</span>
                <span className={`text-[10px] font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{draft.confirmed_at?.split(' ')[0] || "—"}</span>
              </div>
            </div>

            {/* POSTED ROW */}
            <div className={`grid grid-cols-[140px_1fr_120px] items-center gap-4 p-4 rounded-2xl border ${
              isDark ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <button onClick={handlePosted} className={`h-[44px] flex items-center justify-center gap-2 text-[10px] font-black uppercase px-4 rounded-xl border transition-all shadow-sm ${btnSlateStyle}`}>
                Mark Posted
              </button>

              <div className="flex justify-center group relative">
                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                  draft.posted_at 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                }`}>
                  {draft.posted_at ? "Posted" : "Pending"}
                </span>
                {draft.posted_at && (
                  <button onClick={handleUnposted} className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MinusCircle size={18} className="text-rose-500 bg-white dark:bg-slate-900 rounded-full" />
                  </button>
                )}
              </div>

              <div className="text-right flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Timestamp</span>
                <span className={`text-[10px] font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{draft.posted_at?.split(' ')[0] || "—"}</span>
              </div>
            </div>
          </div>

          {/* ASSETS LINK */}
          <div className={`mb-8 p-5 rounded-2xl border ${isDark ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
            <span className={`text-[9px] font-black uppercase tracking-widest mb-3 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Assets & Design URL</span>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input 
                        type="text" 
                        value={draft.asset_link}
                        onChange={(e) => setDraft(p => ({...p, asset_link: e.target.value}))}
                        placeholder="Paste link here..."
                        className={`w-full h-[44px] pl-9 pr-4 border rounded-xl text-xs font-medium focus:outline-none transition-all ${
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
                        : 'opacity-20 pointer-events-none'
                    }`}
                >
                    <ExternalLink size={16}/>
                </a>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className={`mt-auto pt-6 border-t flex justify-center ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <button 
                onClick={handleSaveInternal} 
                className={`h-[48px] w-full sm:w-fit flex items-center justify-center gap-3 px-16 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg ${btnSlateStyle}`}
            >
                <Save size={16}/> 
                Submit Changes
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default RightSidebar;