import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Layout, Image, Mic, Mail, Video, X, Clock, CheckCircle2, 
  Send, FileText, Ban, UserCheck, UserMinus, Filter, 
  ShieldCheck, ShieldAlert
} from 'lucide-react';

import LogoEagle from '../../assets/TechC-Eagle.png'; 
import { PAGE_FILTERS } from '../../config/filterConfig';

const Sidebar = ({ isOpen, setIsOpen, isDark, rawData = [], onFilterChange }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Initialize open state for possible filter sections
  const [openSections, setOpenSections] = useState({
    status: true,
    is_active: true,
    brand_name: true,
    service_name: true,
    enquiry_status: true,
    budget_range: true,
    type_name: false,
    ready_by_name: false
  });

  const [selectedFilters, setSelectedFilters] = useState({});

  // Theme-specific text colors (Slate 300 for Dark, Slate 600 for Light)
  const textColor = isDark ? 'text-slate-300' : 'text-slate-600';
  
  // --- BLOCK 1: EFFECTIVE PATH EXCEPTION ---
  const currentPath = location.pathname;
  const getEffectivePath = () => {
    if (currentPath.startsWith('/enquiry')) return '/enquiry';
    if (currentPath.startsWith('/brands')) return '/brands';
    if (currentPath.startsWith('/users')) return '/users';
    return currentPath;
  };

  // --- BLOCK 2: UPDATED ACTIVECONFIG MAPPING ---
  const activeConfig = PAGE_FILTERS[getEffectivePath()] || (currentPath === '/' ? PAGE_FILTERS['/'] : []);

  // Logic to clear all filters
  const handleClearAll = () => {
    setSelectedFilters({});
    if (onFilterChange) onFilterChange({});
  };

  // Logic to clear a specific section
  const handleClearSection = (e, sectionId) => {
    e.stopPropagation();
    const newFilters = { ...selectedFilters, [sectionId]: [] };
    setSelectedFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  // Helper to see if any filters are active anywhere
  const hasAnyFilters = Object.values(selectedFilters).some(arr => arr && arr.length > 0);

  // Logic to map labels to specific Lucide icons
  const getIcon = (label) => {
    const l = String(label).toLowerCase();
    
    // Brand Page Specifics
    if (l === 'active' || l === '1') return <ShieldCheck size={12} className="text-emerald-500" />;
    if (l === 'inactive' || l === '0') return <ShieldAlert size={12} className="text-rose-500" />;

    // Status Logic
    if (l.includes('pending')) return <Clock size={12} />;
    if (l === 'ready') return <FileText size={12} />;
    if (l === 'not ready') return <Ban size={12} className="text-rose-500" />;
    if (l === 'confirmed') return <CheckCircle2 size={12} />;
    if (l === 'not confirmed') return <Ban size={12} className="text-rose-500" />;
    if (l === 'posted') return <Send size={12} />;
    if (l === 'not posted') return <Ban size={12} className="text-rose-500" />;
    if (l === 'claimed') return <UserCheck size={12} />;
    if (l === 'not claimed') return <UserMinus size={12} />;

    // Content/Post Types
    if (l.includes('reel') || l.includes('video')) return <Video size={12} />;
    if (l.includes('canva') || l.includes('image')) return <Image size={12} />;
    if (l.includes('mail')) return <Mail size={12} />;
    if (l.includes('engagement')) return <Mic size={12} />;
    if (l.includes('story') || l.includes('thread')) return <Layout size={12} />;
    return null;
  };

  // Logic to determine unique options from the database data (rawData)
  const filterOptions = useMemo(() => {
    const options = {};
    if (!activeConfig || activeConfig.length === 0) return options;

    activeConfig.forEach(config => {
      // If it's the global search, we don't need to extract options from rawData
      if (config.id === 'global_search') {
        options[config.id] = [];
        return;
      }

      if (config.id === 'status') {
        options[config.id] = [
          "Pending", "Claimed", "Not Claimed", "Ready", 
          "Not Ready", "Confirmed", "Not Confirmed", "Posted", "Not Posted"
        ];
      } else if (config.dataKey === 'is_active') {
        options[config.id] = ["Active", "Inactive"];
      } else {
        const uniqueValues = [...new Set(rawData.map(item => {
          const val = item.extendedProps ? item.extendedProps[config.dataKey] : item[config.dataKey];
          return val;
        }))].filter(Boolean).sort();
        
        options[config.id] = uniqueValues;
      }
    });
    return options;
  }, [rawData, activeConfig]);

  const handleCheckboxChange = (sectionId, value) => {
    const currentSectionFilters = selectedFilters[sectionId] || [];
    let newSectionFilters = currentSectionFilters.includes(value)
      ? currentSectionFilters.filter(v => v !== value)
      : [...currentSectionFilters, value];

    const newFilters = { ...selectedFilters, [sectionId]: newSectionFilters };
    setSelectedFilters(newFilters);
    
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleGlobalSearchChange = (sectionId, value) => {
    const newFilters = { ...selectedFilters, [sectionId]: value ? [value] : [] };
    setSelectedFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderLogo = () => {
    const logoClass = `object-contain transition-all duration-500 ${
        isDark ? 'brightness-200' : ''
    } ${isOpen ? 'w-40 h-40' : 'w-16 h-16'}`;

    return (
      <img src={LogoEagle} alt="TechC Eagle Logo" className={logoClass} />
    );
  };

  return (
    <>
      <style>{`
        .custom-sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .custom-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb {
          background: ${isDark ? '#334155' : '#e2e8f0'};
          border-radius: 10px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#475569' : '#cbd5e1'};
        }
      `}</style>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[145] lg:hidden transition-all"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 lg:relative z-[150] h-screen transition-all duration-300 ease-in-out shrink-0 
          ${isOpen ? 'w-72 translate-x-0' : 'w-24 -translate-x-full lg:translate-x-0'} 
          flex flex-col border-r lg:border-none ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        
        <div 
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 items-center z-[160] cursor-pointer group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={`w-7 h-20 border border-l-0 rounded-r-2xl flex items-center justify-center shadow-md transition-all pl-0.5 ${
              isDark ? 'bg-slate-800 border-slate-700 group-hover:bg-slate-700' : 'bg-white border-slate-200 group-hover:bg-slate-50'
          }`}>
            {isOpen ? <ChevronLeft size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" /> : <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />}
          </div>
        </div>

        <button onClick={() => setIsOpen(false)} className="lg:hidden absolute right-4 top-6 p-2 text-slate-400 hover:text-rose-500 transition-colors">
          <X size={20} />
        </button>

        <div className="p-4 flex items-center justify-center h-24 shrink-0 relative">
          {renderLogo()}
        </div>

        <div className="flex-1 overflow-hidden py-4 px-4 flex flex-col relative">
          {isOpen ? (
            <div className="flex-1 overflow-y-auto custom-sidebar-scroll pr-2 flex flex-col gap-8">
              {activeConfig.length > 0 ? (
                activeConfig.map((section) => {
                  const sectionActive = selectedFilters[section.id]?.length > 0;
                  
                  return (
                    <div key={section.id} className="flex flex-col shrink-0">
                      <div 
                        className="flex items-center gap-3 mb-4 cursor-pointer group"
                        onClick={() => toggleSection(section.id)}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-sm shrink-0 transition-colors uppercase relative ${
                            isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {section.label.charAt(0)}
                          {sectionActive && (
                             <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black uppercase tracking-widest transition-colors ${textColor}`}>
                                {section.label}
                            </span>
                            {sectionActive && (
                              <button 
                                onClick={(e) => handleClearSection(e, section.id)}
                                className="relative flex items-center justify-center w-5 h-5 group/clear transition-all"
                              >
                                <Filter size={12} className="text-indigo-500 absolute group-hover/clear:opacity-0 transition-opacity" />
                                <Ban size={14} className="text-rose-500 opacity-0 group-hover/clear:opacity-100 transition-opacity absolute" />
                              </button>
                            )}
                          </div>
                          <div className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                            {openSections[section.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>
                        </div>
                      </div>

                      {openSections[section.id] && (
                        <div className={`flex flex-col ml-4 pl-4 border-l-2 transition-colors animate-in fade-in duration-300 space-y-3 ${
                            isDark ? 'border-slate-800' : 'border-indigo-50'
                        }`}>
                          {section.type === 'searchable' && (
                            <div className="relative mb-4 shrink-0">
                              <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                              <input 
                                type="text" 
                                placeholder={section.placeholder || `Search ${section.label.toLowerCase()}...`} 
                                className={`w-full pl-9 pr-4 py-2 border-none rounded-xl text-xs outline-none transition-colors ${
                                    isDark ? 'bg-slate-800 text-white placeholder:text-slate-500' : 'bg-slate-50 text-slate-900 placeholder:text-slate-400'
                                }`}
                                onChange={(e) => {
                                  if (section.id === 'global_search') {
                                    handleGlobalSearchChange(section.id, e.target.value);
                                  } else {
                                    setSearchQuery(e.target.value);
                                  }
                                }}
                              />
                            </div>
                          )}
                          
                          {/* Only show options list if it's NOT the global search bar */}
                          {section.id !== 'global_search' && (
                            <div className="space-y-3 max-h-60 overflow-y-auto custom-sidebar-scroll pr-1">
                              {filterOptions[section.id]
                                ?.filter(opt => String(opt).toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((option) => (
                                  <FilterOption 
                                    key={option} 
                                    label={option} 
                                    icon={getIcon(option)} 
                                    isDark={isDark}
                                    checked={selectedFilters[section.id]?.includes(option)}
                                    onChange={() => handleCheckboxChange(section.id, option)}
                                  />
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                   <div className={`p-4 rounded-full mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <Filter size={24} className="text-slate-400 opacity-50" />
                   </div>
                   <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                     No Filters for this page
                   </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-4 transition-opacity duration-300 relative">
              <div className="flex flex-col items-center h-full gap-4 relative">
                <div className={`w-0.5 flex-1 border-l-2 border-dashed transition-colors ${isDark ? 'border-slate-800' : 'border-slate-200'}`}></div>
                <div className="relative group/collapsedClear">
                  <span className={`text-[12px] font-black uppercase tracking-[0.3em] [writing-mode:vertical-lr] rotate-180 transition-all duration-300 ${
                    hasAnyFilters ? 'opacity-20 blur-[1px]' : (isDark ? 'text-slate-600' : 'text-slate-400')
                  }`}>
                    — FILTERS —
                  </span>
                  {hasAnyFilters && (
                    <button 
                      onClick={handleClearAll}
                      className="absolute inset-0 flex items-center justify-center bg-transparent z-10 group/clearBtn"
                    >
                      <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/10 transition-transform group-hover/clearBtn:scale-110">
                        <Filter size={16} className="text-indigo-500 absolute group-hover/clearBtn:opacity-0 transition-opacity" />
                        <Ban size={20} className="text-rose-500 opacity-0 group-hover/clearBtn:opacity-100 transition-opacity absolute" />
                      </div>
                    </button>
                  )}
                </div>
                <div className={`w-0.5 flex-1 border-l-2 border-dashed transition-colors ${isDark ? 'border-slate-800' : 'border-slate-200'}`}></div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

const FilterOption = ({ label, icon, isDark, checked, onChange }) => (
  <label className="flex items-center gap-3 group cursor-pointer">
    <div className="relative flex items-center justify-center">
        <input 
          type="checkbox" 
          checked={checked || false}
          onChange={onChange}
          className={`h-4 w-4 rounded transition-colors cursor-pointer shrink-0 appearance-none border-2 ${
              isDark 
              ? 'bg-slate-800 border-slate-700 checked:bg-indigo-600 checked:border-indigo-600' 
              : 'bg-white border-slate-200 checked:bg-indigo-600 checked:border-indigo-600'
          }`} 
        />
    </div>
    <div className="flex items-center gap-2 overflow-hidden">
      {icon && (
        <span className={`transition-colors shrink-0 ${isDark ? 'text-slate-500 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500'}`}>
          {icon}
        </span>
      )}
      <span className={`text-[11px] font-bold uppercase tracking-tight truncate transition-colors ${
          isDark ? 'text-slate-400 group-hover:text-indigo-400' : 'text-slate-500 group-hover:text-indigo-600'
      }`}>
        {label}
      </span>
    </div>
  </label>
);

export default Sidebar;