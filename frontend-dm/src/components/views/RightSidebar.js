import React, { useState, useEffect } from 'react';
import { 
  X, ExternalLink, User, Link as LinkIcon,
  Save, Clock, UserPlus, Tag
} from 'lucide-react';

const RightSidebar = ({ isOpen, onClose, post, currentUser, onSave }) => {
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (post) {
      setDraft({
        ...post,
        work_by: post.work_by || "",
        confirmed_at: post.confirmed_at || null,
        posted_at: post.posted_at || null,
        link: post.link || "",
        is_ready: post.status === "Created" || post.status === "Confirmed" || post.status === "Posted"
      });
    }
  }, [post]);

  if (!post || !draft) return null;

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superuser';

  const handleAddMyName = () => setDraft(prev => ({ ...prev, work_by: currentUser.name }));

  const handleToggleReady = () => {
    const newReadyState = !draft.is_ready;
    setDraft(prev => ({ 
      ...prev, 
      is_ready: newReadyState,
      status: newReadyState ? "Created" : "Pending",
      work_completed_on: newReadyState ? new Date().toISOString() : null
    }));
  };

  const handleConfirm = () => {
    if (!isAdmin) return;
    setDraft(prev => ({
      ...prev,
      status: "Confirmed",
      confirmed_by: currentUser.name,
      confirmed_at: new Date().toLocaleString()
    }));
  };

  const handlePosted = () => {
    setDraft(prev => ({
      ...prev,
      status: "Posted",
      posted_by: currentUser.name,
      posted_at: new Date().toLocaleString()
    }));
  };

  const handleLinkChange = (e) => {
    setDraft(prev => ({ ...prev, link: e.target.value }));
  };

  return (
    <>
      {isOpen && (
        <div className="absolute inset-0 bg-slate-900/5 z-[60]" onClick={onClose} />
      )}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[550px] bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out z-[70] flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        <div className="h-full flex flex-col p-6 md:p-8 overflow-y-auto custom-scrollbar pt-6">
          
          {/* TOP BAR: BRAND & CLOSE */}
          <div className="flex justify-between items-center mb-8 pt-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                {draft.brand_logo ? (
                    <img src={draft.brand_logo} alt="logo" className="w-8 h-8 object-contain" />
                ) : (
                    <span className="text-slate-800 text-xl font-black italic">{draft.brand_name?.[0]}</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">{draft.brand_name}</h2>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {draft.id}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* GRID SECTION 1: POST TYPE & DATE */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-indigo-600 p-4 rounded-2xl flex flex-col justify-center shadow-lg shadow-indigo-100">
                <span className="text-[9px] font-black text-indigo-100 uppercase tracking-widest mb-1">Post Category</span>
                <div className="flex items-center gap-3 text-white">
                    <Tag size={20} />
                    <span className="text-xl font-black uppercase tracking-tight">{draft.post_type}</span>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Due Date</span>
                <div className="flex items-center justify-center gap-2 text-slate-700 font-bold text-sm">
                    <Clock size={14} className="text-rose-500" />
                    {new Date(draft.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
            </div>
          </div>

          {/* ROW 3: TITLE */}
          <div className="mb-8 px-1">
            <h3 className="text-lg font-bold text-slate-800 leading-tight italic border-l-4 border-indigo-500 pl-4">
              "{draft.post_name || "Untitled Task"}"
            </h3>
          </div>

          {/* ROW 4: WORKER & READY */}
          <div className="mb-6 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Assigned Worker</span>
              {draft.work_by ? (
                <div className="flex items-center gap-2 text-sm font-black text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-100">
                  <User size={14} className="text-indigo-500" /> {draft.work_by}
                </div>
              ) : (
                <button onClick={handleAddMyName} className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100">
                  <UserPlus size={14} /> Add My Name
                </button>
              )}
            </div>

            <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Status</span>
                <button 
                    onClick={handleToggleReady}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all border-2
                    ${draft.is_ready 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' 
                        : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'}`}
                >
                    {draft.is_ready ? "✓ Task Ready" : "Mark as Ready"}
                </button>
            </div>
          </div>

          {/* ACTION SECTION (Admin & Posting) */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {/* ROW 5: CONFIRMATION */}
            <div className="grid grid-cols-[140px_1fr_120px] items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              {isAdmin ? (
                <button onClick={handleConfirm} className="py-3 px-4 border-2 border-blue-500 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">
                  Confirm
                </button>
              ) : <div className="text-[10px] font-black text-slate-300 uppercase pl-2">Admin Only</div>}
              <div className="flex justify-center">
                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  draft.status === "Confirmed" || draft.status === "Posted" 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                  : "bg-orange-50 text-orange-600 border-orange-200"
                }`}>
                  {draft.status === "Confirmed" || draft.status === "Posted" ? "Confirmed" : "Pending"}
                </span>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Timestamp</span>
                <span className="text-[10px] font-black text-slate-700">{draft.confirmed_at?.split(',')[0] || "—"}</span>
              </div>
            </div>

            {/* ROW 6: POSTED */}
            <div className="grid grid-cols-[140px_1fr_120px] items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <button onClick={handlePosted} className="py-3 px-4 border-2 border-emerald-500 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">
                Mark Posted
              </button>
              <div className="flex justify-center">
                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  draft.status === "Posted" 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                  : "bg-slate-50 text-slate-400 border-slate-200"
                }`}>
                  {draft.status === "Posted" ? "Live" : "Not Live"}
                </span>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Timestamp</span>
                <span className="text-[10px] font-black text-slate-700">{draft.posted_at?.split(',')[0] || "—"}</span>
              </div>
            </div>
          </div>

          {/* DESIGN LINK INPUT SECTION */}
          <div className="mb-8 p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3 block">Assets & Design URL</span>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                        type="text" 
                        value={draft.link}
                        onChange={handleLinkChange}
                        placeholder="Paste Figma/Canva link here..."
                        className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>
                <a 
                    href={draft.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`flex items-center justify-center px-4 rounded-xl transition-all ${
                        draft.link 
                        ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50' 
                        : 'bg-slate-50 text-slate-300 pointer-events-none'
                    }`}
                >
                    <ExternalLink size={16}/>
                </a>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="mt-auto pt-4 border-t border-slate-100 flex justify-center">
<button 
    onClick={() => onSave(draft)} 
    className="w-fit flex items-center justify-center gap-2 px-10 py-2.5 bg-blue-500/10 border-2 border-blue-500/80 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
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