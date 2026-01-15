import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { 
  ArrowLeft, Calendar, User, Building2, Mail, Phone, Lock, Unlock, 
  Save, Plus, X, MessageSquare, Clock, Filter, Activity, RotateCcw, Briefcase
} from "lucide-react";
import Button from "../components/ui/button/Button";

// DUMMY DATA FOR SYNCED DROPDOWNS
const companyData = {
  "TechFlow": ["Custom CRM Development", "Cloud Infrastructure", "API Integration"],
  "Creative Co": ["Mobile App UI/UX", "Brand Identity", "Web Design"],
  "Wilson Group": ["Cloud Migration", "Security Audit", "IT Consulting"],
  "Nova Labs": ["SEO Strategy", "Data Analytics", "Content Marketing"],
  "Zenith Retail": ["Shopify Integration", "Inventory System", "POS Setup"]
};

const clientStatuses = [
  { value: "JustConnected", label: "Just Connected" },
  { value: "InProgress", label: "In Progress" },
  { value: "AdvancedPayment", label: "Adv. Payment" },
  { value: "Completed", label: "Completed" },
  { value: "Closed", label: "Closed" }
];

export default function ClientDetail({ clientId, onBack, isDark }) {
  const isNewClient = clientId === 'new';
  
  const [isEditing, setIsEditing] = useState(isNewClient);
  const [showConvForm, setShowConvForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [profile, setProfile] = useState({
    name: isNewClient ? "" : "Alex Thompson",
    company: isNewClient ? "TechFlow" : "TechFlow",
    service: isNewClient ? "Custom CRM Development" : "Custom CRM Development",
    email: isNewClient ? "" : "alex.t@techflow.com",
    phone: isNewClient ? "" : "+1 (234) 567-8900",
    status: isNewClient ? "JustConnected" : "InProgress"
  });

  const [conversations, setConversations] = useState(isNewClient ? [] : [
    { 
      id: 'c1', 
      title: 'Initial Discovery Call', 
      date: '2026-01-05', 
      description: 'Discussed Q1 goals and potential budget for the digital transformation project.',
      owner: 'Admin'
    }
  ]);

  const [newConv, setNewConv] = useState({ title: "", date: "", description: "" });

  const handleCompanyChange = (newCompany) => {
    const availableServices = companyData[newCompany] || [];
    setProfile({
      ...profile,
      company: newCompany,
      service: availableServices[0] || "" 
    });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredConversations = useMemo(() => {
    return conversations
      .filter(c => {
        const cDate = new Date(c.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start && cDate < start) return false;
        if (end && cDate > end) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [conversations, startDate, endDate]);

  const handleSaveConversation = () => {
    if (!newConv.title || !newConv.date) return;
    const record = {
      ...newConv,
      id: Date.now().toString(),
      owner: "Admin"
    };
    setConversations([record, ...conversations]);
    setNewConv({ title: "", date: "", description: "" });
    setShowConvForm(false);
  };

  return (
    <div className={`p-4 md:p-6 space-y-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <button onClick={onBack} className={`group flex items-center gap-2 transition-colors font-brand-heading uppercase text-[14px] tracking-widest ${isDark ? 'text-brand-darkText hover:text-indigo-400' : 'text-brand-lightText hover:text-indigo-600'}`}>
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return to clients
        </button>

        {!isNewClient && (
          <div className="flex gap-2">
              {showConvForm && (
                  <Button variant="ghost" onClick={() => setShowConvForm(false)} className={isDark ? 'text-brand-darkText hover:bg-slate-800' : ''}>
                      <X size={16} className="mr-2" /> Cancel
                  </Button>
              )}
              <Button onClick={() => setShowConvForm(true)} variant="primary" className="rounded-2xl shadow-lg font-brand-body-bold">
                  <Plus size={16} className="mr-2" /> Add New Conversation
              </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <div className={`border rounded-2xl p-6 shadow-sm space-y-6 transition-all ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h3 className={`text-[12px] font-brand-heading uppercase tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>
                {isNewClient ? "Create New Profile" : "Client Profile"}
              </h3>
              {!isNewClient && (
                <button onClick={() => setIsEditing(!isEditing)} className="transition-transform active:scale-90">
                  {isEditing ? <Unlock size={16} className="text-green-500 animate-pulse" /> : <Lock size={16} className={isDark ? 'text-brand-darkText' : 'text-brand-lightText'} />}
                </button>
              )}
            </div>

            <div className="space-y-4">
              <DropdownInput 
                isDark={isDark} 
                label="Enquiry Status" 
                icon={Activity} 
                options={clientStatuses} 
                value={profile.status}
                disabled={!isEditing}
                onChange={(v) => setProfile({...profile, status: v})}
              />
              
              <hr className={isDark ? 'border-slate-800' : 'border-gray-50'} />
              
              <DetailInput isDark={isDark} label="Full Name" icon={User} value={profile.name} disabled={!isEditing} onChange={(v) => setProfile({...profile, name: v})} placeholder="Enter name..." />
              
              <DropdownInput 
                isDark={isDark} 
                label="Company Name" 
                icon={Building2} 
                disabled={!isEditing}
                options={Object.keys(companyData).map(c => ({ value: c, label: c }))} 
                value={profile.company}
                onChange={handleCompanyChange}
              />

              <DropdownInput 
                isDark={isDark} 
                label="Requested Service" 
                icon={Briefcase} 
                disabled={!isEditing}
                options={(companyData[profile.company] || []).map(s => ({ value: s, label: s }))} 
                value={profile.service}
                onChange={(v) => setProfile({...profile, service: v})}
              />

              <DetailInput isDark={isDark} label="Email Address" icon={Mail} value={profile.email} disabled={!isEditing} onChange={(v) => setProfile({...profile, email: v})} placeholder="email@example.com" />
              <DetailInput isDark={isDark} label="Phone Number" icon={Phone} value={profile.phone} disabled={!isEditing} onChange={(v) => setProfile({...profile, phone: v})} placeholder="+1..." />
            </div>

            {isEditing && (
              <Button onClick={() => setIsEditing(false)} className="w-full py-4 rounded-2xl font-brand-body-bold">
                <Save size={16} className="mr-2" /> {isNewClient ? "Save New Client" : "Update Profile"}
              </Button>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {isNewClient ? (
            <div className={`border-2 border-dashed rounded-3xl p-20 text-center ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex flex-col items-center gap-4 opacity-40">
                    <User size={48} className={isDark ? 'text-slate-500' : 'text-gray-300'} />
                    <p className={`text-[12px] font-brand-heading uppercase tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>Save profile to begin logging conversations</p>
                </div>
            </div>
          ) : (
            <>
              {showConvForm && (
                <div className={`border rounded-2xl p-8 shadow-sm animate-in fade-in zoom-in-95 ${isDark ? 'bg-slate-900 border-slate-800 text-brand-darkText' : 'bg-white border-gray-100'}`}>
                  <h3 className="text-lg font-brand-heading uppercase mb-6 flex items-center gap-2">
                    <MessageSquare className="text-indigo-500" /> Log Conversation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="md:col-span-2">
                       <DetailInput 
                        isDark={isDark} 
                        label="Discussion Title" 
                        icon={MessageSquare} 
                        placeholder="e.g. Weekly Update" 
                        value={newConv.title}
                        onChange={(v) => setNewConv({...newConv, title: v})}
                       />
                     </div>
                     <DetailInput 
                      isDark={isDark} 
                      label="Date" 
                      icon={Calendar} 
                      type="date" 
                      value={newConv.date}
                      onChange={(v) => setNewConv({...newConv, date: v})}
                     />
                     <div className="md:col-span-2">
                        <label className={`text-[11px] font-brand-heading uppercase block mb-1.5 ml-1 tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Discussion Details</label>
                        <textarea 
                          value={newConv.description}
                          onChange={(e) => setNewConv({...newConv, description: e.target.value})}
                          className={`w-full rounded-2xl p-4 text-[12px] font-brand-body-bold border outline-none min-h-[100px] ${isDark ? 'bg-slate-950 border-slate-800 text-brand-darkText' : 'bg-white border-indigo-100 text-gray-900'}`} 
                          placeholder="What was discussed?" 
                        />
                     </div>
                     <div className="md:col-span-2 flex justify-end mt-4">
                       <Button onClick={handleSaveConversation} className="px-10 font-brand-body-bold">Save Record</Button>
                     </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center justify-between px-2 relative">
                    <h2 className={`text-2xl font-brand-heading uppercase tracking-tight transition-colors ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                        Conversation Log
                    </h2>

                    <div className="flex items-center gap-3" ref={filterRef}>
                        {(startDate || endDate) && (
                            <div className={`text-[12px] font-brand-body-bold px-2 py-1 rounded-md ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                Filtered
                            </div>
                        )}
                        
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-xl border transition-all ${
                                showFilters 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                                : (isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50')
                            }`}
                        >
                            <Filter size={18} />
                        </button>

                        {showFilters && (
                            <div className={`absolute top-full right-0 mt-2 z-50 w-72 p-5 rounded-2xl border shadow-2xl animate-in fade-in slide-in-from-top-2 ${
                                isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
                            }`}>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[12px] font-brand-heading uppercase tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>Date Filters</span>
                                        <button onClick={() => {setStartDate(""); setEndDate("");}} className="text-indigo-500 hover:text-indigo-400 p-1 transition-colors">
                                            <RotateCcw size={14} />
                                        </button>
                                    </div>
                                    <DetailInput isDark={isDark} label="From" icon={Calendar} type="date" value={startDate} onChange={(v) => setStartDate(v)} />
                                    <DetailInput isDark={isDark} label="To" icon={Calendar} type="date" value={endDate} onChange={(v) => setEndDate(v)} />
                                    <Button onClick={() => setShowFilters(false)} className="w-full mt-2 text-[12px] font-brand-heading uppercase">Apply Filter</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`rounded-2xl border overflow-hidden shadow-sm transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                  <Table className="w-full text-left">
                    <TableHeader className={isDark ? 'bg-slate-800/50' : 'bg-gray-50/50'}>
                      <TableRow className={isDark ? 'border-slate-800' : 'border-slate-600'}>
                        <TableCell isHeader className={`px-6 py-5 text-[13px] font-brand-table-head uppercase tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>Date & Title</TableCell>
                        <TableCell isHeader className={`px-6 py-5 text-[13px] font-brand-table-head uppercase tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>Description</TableCell>
                        <TableCell isHeader className={`px-6 py-5 text-[13px] text-right font-brand-table-head uppercase tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>Logged By</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConversations.length > 0 ? (
                        filteredConversations.map((conv) => (
                          <TableRow key={conv.id} className={`group transition-colors ${isDark ? 'hover:bg-slate-800 border-slate-800' : 'hover:bg-indigo-50/30 border-gray-50'}`}>
                            <TableCell className="px-6 py-6 whitespace-nowrap">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock size={12} className="text-indigo-500" />
                                <span className={`text-[12px] font-brand-heading uppercase tracking-tighter ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>{conv.date}</span>
                              </div>
                              <div className={`font-brand-body-bold uppercase text-sm ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{conv.title}</div>
                            </TableCell>
                            <TableCell className="px-6 py-6">
                              <p className={`text-[12px] line-clamp-2 max-w-md ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>
                                {conv.description}
                              </p>
                            </TableCell>
                            <TableCell className="px-6 py-6 text-right">
                              <span className={`px-3 py-1 rounded-lg text-[11px] font-brand-heading uppercase border ${isDark ? 'bg-slate-950 text-indigo-400 border-slate-800' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                @{conv.owner}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="py-20 text-center">
                            <p className={`text-[12px] font-brand-heading uppercase tracking-widest opacity-40 ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>No history found</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// SHARED COMPONENTS
function DetailInput({ label, icon: Icon, isDark, onChange, ...props }) {
  return (
    <div className="text-left w-full">
      <label className={`text-[12px] font-brand-heading uppercase block mb-1.5 ml-1 tracking-widest transition-colors ${
        isDark ? 'text-brand-darkText' : 'text-brand-lightText'
      }`}>
        {label}
      </label>
      <div className="relative">
        <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
        <input 
          {...props} 
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full rounded-2xl pl-11 pr-4 py-3 text-[12px] font-brand-body-bold transition-all outline-none border ${
            isDark 
            ? 'bg-slate-950 border-slate-800 text-brand-darkText focus:border-indigo-500 disabled:bg-slate-900/50 disabled:text-slate-500' 
            : 'bg-white border-indigo-100 text-gray-900 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-400'
          }`} 
        />
      </div>
    </div>
  );
}

function DropdownInput({ label, icon: Icon, options, value, onChange, isDark, disabled }) {
  return (
    <div className={`text-left w-full ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <label className={`text-[11px] font-brand-heading uppercase block mb-1.5 ml-1 tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>{label}</label>
      <div className="relative">
        <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 z-10" />
        <select 
          value={value} 
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)} 
          className={`w-full rounded-2xl pl-11 pr-10 py-3 text-[12px] font-brand-body-bold appearance-none outline-none border transition-all cursor-pointer ${
            isDark 
            ? 'bg-slate-950 border-slate-800 text-brand-darkText focus:border-indigo-500 disabled:bg-slate-900/50' 
            : 'bg-white border-indigo-100 text-gray-900 focus:border-indigo-500 disabled:bg-gray-50'
          }`}
        >
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Clock size={12} className="text-gray-400 rotate-90" />
        </div>
      </div>
    </div>
  );
}