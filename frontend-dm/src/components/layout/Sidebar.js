import React, { useState } from 'react';
import { 
  Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Layout, Image, Mic, Mail, Video, X, Clock, CheckCircle2, Send, FileText
} from 'lucide-react';

import LogoEagle from '../../assets/TechC-Eagle.png'; 

const Sidebar = ({ isOpen, setIsOpen, isDark }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Set all filter sections to false by default
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // Apply requested color palette
  const textColor = isDark ? 'text-slate-300' : 'text-slate-600';

  const brands = ["Apple", "Google", "MOTOROLA", "vivo", "OPPO", "Infinix", "Samsung", "Xiaomi", "Realme", "Nokia"];
  
  const postTypes = [
    { label: "Canva Post", icon: <Image size={12} /> },
    { label: "Reel", icon: <Video size={12} /> },
    { label: "Image", icon: <Image size={12} /> },
    { label: "Engagement", icon: <Mic size={12} /> },
    { label: "Mail", icon: <Mail size={12} /> },
    { label: "Story", icon: <Layout size={12} /> },
    { label: "Thread", icon: <Layout size={12} /> }
  ];

  const statusTypes = [
    { label: "Pending", icon: <Clock size={12} /> },
    { label: "Ready", icon: <FileText size={12} /> },
    { label: "Confirmed", icon: <CheckCircle2 size={12} /> },
    { label: "Posted", icon: <Send size={12} /> }
  ];

  const renderLogo = () => {
    const logoClass = `object-contain transition-all duration-500 ${
        isDark ? 'brightness-200' : ''
    } ${isOpen ? 'w-40 h-40' : 'w-16 h-16'}`;

    return (
      <img 
        src={LogoEagle} 
        alt="TechC Logo" 
        className={logoClass} 
      />
    );
  };

  return (
    <>
      {/* SCROLLBAR FIX FOR DARK MODE */}
      <style>{`
        .custom-sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb {
          background: ${isDark ? '#334155' : '#e2e8f0'};
          border-radius: 10px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#475569' : '#cbd5e1'};
        }
      `}</style>

      {/* MOBILE OVERLAY BACKDROP */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[145] lg:hidden transition-all"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 lg:relative z-[150] h-screen transition-all duration-300 ease-in-out shrink-0 
          ${isOpen ? 'w-72 translate-x-0' : 'w-24 -translate-x-full lg:translate-x-0'} 
          flex flex-col border-r lg:border-none ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
          }`}
      >
        {/* MEDIUM TOGGLE BUTTON (Laptop Only) */}
        <div 
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 items-center z-[160] cursor-pointer group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={`w-7 h-20 border border-l-0 rounded-r-2xl flex items-center justify-center shadow-md transition-all pl-0.5 ${
              isDark 
              ? 'bg-slate-800 border-slate-700 group-hover:bg-slate-700' 
              : 'bg-white border-slate-200 group-hover:bg-slate-50'
          }`}>
            {isOpen ? (
              <ChevronLeft size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
            ) : (
              <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
            )}
          </div>
        </div>

        {/* MOBILE CLOSE BUTTON */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute right-4 top-6 p-2 text-slate-400 hover:text-rose-500 transition-colors"
        >
          <X size={20} />
        </button>

        {/* LOGO AREA */}
        <div className="p-4 flex items-center justify-center h-24 shrink-0">
          {renderLogo()}
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-hidden py-4 px-4 flex flex-col gap-4">
          
          {isOpen ? (
            <div className="flex-1 overflow-y-auto custom-sidebar-scroll pr-2 flex flex-col gap-8">
              
              {/* STATUS FILTER SECTION */}
              <div className={`flex flex-col transition-all duration-300 ${isStatusOpen ? 'shrink-0' : 'shrink-0'}`}>
                <div 
                  className="flex items-center gap-3 mb-4 cursor-pointer group"
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-sm shrink-0 transition-colors ${
                      isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'
                  }`}>S</div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className={`text-xs font-black uppercase tracking-widest transition-colors ${textColor}`}>Status</span>
                    <div className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                        {isStatusOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>
                </div>

                {isStatusOpen && (
                  <div className={`flex flex-col ml-4 pl-4 border-l-2 transition-colors animate-in fade-in duration-300 space-y-3 ${
                      isDark ? 'border-slate-800' : 'border-amber-50'
                  }`}>
                    {statusTypes.map((status) => (
                      <FilterOption key={status.label} label={status.label} icon={status.icon} isDark={isDark} />
                    ))}
                  </div>
                )}
              </div>

              {/* BRAND FILTER SECTION */}
              <div className={`flex flex-col transition-all duration-300 ${isBrandOpen ? 'shrink-0' : 'shrink-0'}`}>
                <div 
                  className="flex items-center gap-3 mb-4 cursor-pointer group"
                  onClick={() => setIsBrandOpen(!isBrandOpen)}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-sm shrink-0 transition-colors ${
                      isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  }`}>B</div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className={`text-xs font-black uppercase tracking-widest transition-colors ${textColor}`}>Brand</span>
                    <div className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                        {isBrandOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>
                </div>

                {isBrandOpen && (
                  <div className={`flex flex-col ml-4 pl-4 border-l-2 transition-colors animate-in fade-in duration-300 ${
                      isDark ? 'border-slate-800' : 'border-indigo-50'
                  }`}>
                    <div className="relative mb-4 shrink-0">
                      <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                      <input 
                        type="text" 
                        placeholder="Search brands..." 
                        className={`w-full pl-9 pr-4 py-2 border-none rounded-xl text-xs outline-none transition-colors ${
                            isDark ? 'bg-slate-800 text-white placeholder:text-slate-500' : 'bg-slate-50 text-slate-900 placeholder:text-slate-400'
                        }`}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      {brands.filter(b => b.toLowerCase().includes(searchQuery.toLowerCase())).map((brand) => (
                        <FilterOption key={brand} label={brand} isDark={isDark} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* POST TYPE FILTER SECTION */}
              <div className={`flex flex-col transition-all duration-300 ${isTypeOpen ? 'shrink-0' : 'shrink-0'}`}>
                <div 
                  className="flex items-center gap-3 mb-4 cursor-pointer group"
                  onClick={() => setIsTypeOpen(!isTypeOpen)}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-sm shrink-0 transition-colors ${
                      isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                  }`}>T</div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className={`text-xs font-black uppercase tracking-widest transition-colors ${textColor}`}>Post Type</span>
                    <div className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                        {isTypeOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>
                </div>

                {isTypeOpen && (
                  <div className={`ml-4 pl-4 border-l-2 transition-colors animate-in fade-in duration-300 pr-2 space-y-3 ${
                      isDark ? 'border-slate-800' : 'border-emerald-50'
                  }`}>
                    {postTypes.map((type) => (
                      <FilterOption 
                        key={type.label} 
                        label={type.label} 
                        icon={type.icon} 
                        isDark={isDark}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* CLOSED STATE */
            <div className="flex-1 flex flex-col items-center justify-center py-4 transition-opacity duration-300">
                <div className="flex flex-col items-center h-full gap-4">
                  <div className={`w-0.5 flex-1 border-l-2 border-dashed transition-colors ${isDark ? 'border-slate-800' : 'border-slate-200'}`}></div>
                  <span className={`text-[12px] font-black uppercase tracking-[0.3em] [writing-mode:vertical-lr] rotate-180 transition-colors ${
                      isDark ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    — FILTERS —
                  </span>
                  <div className={`w-0.5 flex-1 border-l-2 border-dashed transition-colors ${isDark ? 'border-slate-800' : 'border-slate-200'}`}></div>
                </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

const FilterOption = ({ label, icon, isDark }) => (
  <label className="flex items-center gap-3 group cursor-pointer">
    <div className="relative flex items-center justify-center">
        <input 
          type="checkbox" 
          className={`h-4 w-4 rounded transition-colors cursor-pointer shrink-0 appearance-none border-2 ${
              isDark 
              ? 'bg-slate-800 border-slate-700 checked:bg-indigo-600 checked:border-indigo-600' 
              : 'bg-white border-slate-200 checked:bg-indigo-600 checked:border-indigo-600'
          }`} 
        />
    </div>
    <div className="flex items-center gap-2 overflow-hidden">
      {icon && (
        <span className={`transition-colors shrink-0 ${
            isDark ? 'text-slate-500 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500'
        }`}>
          {icon}
        </span>
      )}
      <span className={`text-[11px] font-bold uppercase tracking-tight truncate transition-colors ${
          isDark 
          ? 'text-slate-400 group-hover:text-indigo-400' 
          : 'text-slate-500 group-hover:text-indigo-600'
      }`}>
        {label}
      </span>
    </div>
  </label>
);

export default Sidebar;