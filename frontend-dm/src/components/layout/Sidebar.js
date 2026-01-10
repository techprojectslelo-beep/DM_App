import React, { useState } from 'react';
import { 
  Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Layout, Image, Mic, Mail, Video, X
} from 'lucide-react';

// --- LOGO IMPORTS ---
import LogoEagle from '../../assets/TechC-Eagle.png'; 
// Import your other variations here:
// import LogoFullLight from '../../assets/Logo-Full-Light.png';
// import LogoFullDark from '../../assets/Logo-Full-Dark.png';
// import LogoEagleDark from '../../assets/Logo-Eagle-Dark.png';

const Sidebar = ({ isOpen, setIsOpen, isDark }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isTypeOpen, setIsTypeOpen] = useState(true);

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

  // LOGO LOGIC SLOT
  const renderLogo = () => {
    if (isDark) {
      // DARK MODE LOGOS
      return isOpen ? (
        <img src={LogoEagle} alt="Full Dark Logo" className="w-40 h-40 object-contain" /> // SLOT: Dark Mode Opened
      ) : (
        <img src={LogoEagle} alt="Eagle Dark Logo" className="w-40 h-40 object-contain" /> // SLOT: Dark Mode Closed
      );
    } else {
      // LIGHT MODE LOGOS
      return isOpen ? (
        <img src={LogoEagle} alt="Full Light Logo" className="w-40 h-16 object-contain" /> // SLOT: Light Mode Opened
      ) : (
        <img src={LogoEagle} alt="Eagle Light Logo" className="w-40 h-40 object-contain" /> // SLOT: Light Mode Closed
      );
    }
  };

  return (
    <>
      {/* MOBILE OVERLAY BACKDROP */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[145] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 lg:relative z-[150] h-screen bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out shrink-0 
          ${isOpen ? 'w-72 translate-x-0' : 'w-24 -translate-x-full lg:translate-x-0'} 
          flex flex-col border-r border-slate-100 dark:border-slate-800 lg:border-none`}
      >
        {/* MEDIUM TOGGLE BUTTON (Laptop Only) */}
        <div 
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 items-center z-[160] cursor-pointer group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-7 h-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-0 rounded-r-2xl flex items-center justify-center shadow-md group-hover:bg-slate-50 dark:group-hover:bg-slate-700 transition-all pl-0.5">
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
          className="lg:hidden absolute right-4 top-6 p-2 text-slate-400"
        >
          <X size={20} />
        </button>

        {/* LOGO AREA - Updated with slots */}
        <div className={`p-4 flex items-center justify-center h-24 shrink-0 transition-all duration-300`}>
          {renderLogo()}
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-hidden py-4 px-4 flex flex-col gap-4">
          
          {isOpen ? (
            <>
              {/* BRAND FILTER SECTION (Open State) */}
              <div className={`flex flex-col transition-all duration-300 ${isBrandOpen ? 'flex-1 min-h-0' : 'shrink-0'}`}>
                <div 
                  className="flex items-center gap-3 mb-4 cursor-pointer"
                  onClick={() => setIsBrandOpen(!isBrandOpen)}
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black shadow-sm shrink-0">B</div>
                  <div className="flex-1 flex justify-between items-center animate-in slide-in-from-left-2">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Brand</span>
                    {isBrandOpen ? <ChevronUp size={14} className="dark:text-slate-400"/> : <ChevronDown size={14} className="dark:text-slate-400"/>}
                  </div>
                </div>

                {isBrandOpen && (
                  <div className="flex flex-col flex-1 min-h-0 ml-4 pl-4 border-l-2 border-indigo-50 dark:border-slate-800 animate-in fade-in duration-300">
                    <div className="relative mb-4 shrink-0">
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-xl text-xs outline-none"
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="overflow-y-auto custom-scrollbar pr-2 space-y-3">
                      {brands.filter(b => b.toLowerCase().includes(searchQuery.toLowerCase())).map((brand) => (
                        <FilterOption key={brand} label={brand} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* POST TYPE FILTER SECTION (Open State) */}
              <div className={`flex flex-col transition-all duration-300 ${isTypeOpen ? 'flex-1 min-h-0' : 'shrink-0'}`}>
                <div 
                  className="flex items-center gap-3 mb-4 cursor-pointer"
                  onClick={() => setIsTypeOpen(!isTypeOpen)}
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black shadow-sm shrink-0">T</div>
                  <div className="flex-1 flex justify-between items-center animate-in slide-in-from-left-2">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Post Type</span>
                    {isTypeOpen ? <ChevronUp size={14} className="dark:text-slate-400"/> : <ChevronDown size={14} className="dark:text-slate-400"/>}
                  </div>
                </div>

                {isTypeOpen && (
                  <div className="overflow-y-auto custom-scrollbar ml-4 pl-4 border-l-2 border-emerald-50 dark:border-slate-800 animate-in fade-in duration-300 flex-1 min-h-0 pr-2 space-y-3">
                    {postTypes.map((type) => (
                      <FilterOption 
                        key={type.label} 
                        label={type.label} 
                        icon={type.icon} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* CLOSED STATE - REFINED VERTICAL INDICATOR */
            <div className="flex-1 flex flex-col items-center justify-center py-4">
               <div className="flex flex-col items-center h-full gap-4">
                  <div className="w-0.5 flex-1 border-l-2 border-dashed border-slate-200 dark:border-slate-700"></div>
                  <span className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] [writing-mode:vertical-lr] rotate-180">
                    — FILTERS —
                  </span>
                  <div className="w-0.5 flex-1 border-l-2 border-dashed border-slate-200 dark:border-slate-700"></div>
                </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

const FilterOption = ({ label, icon }) => (
  <label className="flex items-center gap-3 group cursor-pointer">
    <input 
      type="checkbox" 
      className="h-4 w-4 rounded border-slate-200 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0 dark:bg-slate-800" 
    />
    <div className="flex items-center gap-2 overflow-hidden">
      {icon && <span className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors shrink-0">{icon}</span>}
      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight truncate">
        {label}
      </span>
    </div>
  </label>
);

export default Sidebar;