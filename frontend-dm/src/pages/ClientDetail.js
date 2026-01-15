import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import enquiryService from "../api/enquiryService";
import brandService from "../api/brandService"; 
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "../components/ui/table";
import { 
  ArrowLeft, Calendar, User, Building2, Mail, Phone, Lock, Unlock, 
  Save, Plus, MessageSquare, Clock, ChevronDown, ChevronUp, Pencil, Trash2,
  Briefcase, GraduationCap, Wallet, Globe, Tag, X, Activity, Landmark, Award
} from "lucide-react";
import Button from "../components/ui/button/Button";

export default function ClientDetail({ isDark }) {
  const { id: clientId } = useParams();
  const navigate = useNavigate();
  const isNewClient = clientId === 'new';
  
  // UI States
  const [isEditing, setIsEditing] = useState(isNewClient);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(!isNewClient);
  const [showConvForm, setShowConvForm] = useState(false);
  
  // Data States
  const [brands, setBrands] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [editingConvId, setEditingConvId] = useState(null);
  const [newConv, setNewConv] = useState({ c_title: "", interaction_date: "", c_desc: "" });

  const [profile, setProfile] = useState({
    enquirer_name: "", enq_email: "", enq_number: "", enquirer_company: "",
    college_name: "", course_taken: "", passing_grade: "", job_title: "",
    job_company_location: "", job_field: "", brand_id: "", service_id: "",
    enquiry_status: "just connected", budget_range: "", next_follow_up: ""
  });

  // Theme-based colors (Slate 300 for Dark, Slate 600 for Light)
  const secondaryText = isDark ? 'text-slate-300' : 'text-slate-600';

  useEffect(() => {
    fetchMetadata();
    if (!isNewClient) loadClientData();
  }, [clientId]);

  // Synchronize Services when Brand changes
  useEffect(() => {
    const fetchServices = async () => {
      if (profile.brand_id) {
        try {
          const brandDetails = await brandService.getBrandDetail(profile.brand_id);
          setFilteredServices(brandDetails.services || []);
        } catch (e) { console.error("Service fetch failed", e); }
      } else {
        setFilteredServices([]);
      }
    };
    fetchServices();
  }, [profile.brand_id]);

  const fetchMetadata = async () => {
    try {
      const b = await brandService.getAllBrands();
      setBrands(b || []);
    } catch (e) { console.error("Metadata fetch failed", e); }
  };

  const loadClientData = async () => {
    try {
      setLoading(true);
      const data = await enquiryService.getEnquiryDetail(clientId);
      if (data) {
        setProfile(data.profile || data); 
        setConversations(data.conversations || []);
      }
    } catch (error) { toast.error("Error loading data"); }
    finally { setLoading(false); }
  };

  const handleSaveProfile = async () => {
    const loadingToast = toast.loading('Saving Profile...');
    try {
      if (isNewClient) {
        await enquiryService.createEnquiry(profile);
        toast.success('Created!', { id: loadingToast });
        navigate('/enquiry');
      } else {
        await enquiryService.updateEnquiry(clientId, profile);
        toast.success('Updated!', { id: loadingToast });
        setIsEditing(false);
        loadClientData();
      }
    } catch (error) { toast.error("Save failed", { id: loadingToast }); }
  };

  const handleSaveConversation = async () => {
    try {
      if (editingConvId) {
        await enquiryService.updateConversation(clientId, editingConvId, newConv);
      } else {
        await enquiryService.addConversation({ ...newConv, enquiry_id: clientId, logged_by: 'Admin' });
      }
      setShowConvForm(false);
      setEditingConvId(null);
      loadClientData();
      toast.success("Interaction Logged");
    } catch (e) { toast.error("Failed to save entry"); }
  };

  const openEditConv = (conv) => {
    setEditingConvId(conv.c_id);
    setNewConv({ c_title: conv.c_title, interaction_date: conv.interaction_date, c_desc: conv.c_desc });
    setShowConvForm(true);
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-indigo-500 font-brand-heading uppercase tracking-widest">Initialising Client Dossier...</div>;

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
      <Toaster position="top-right" />

      {/* Hero Header */}
      <div className="relative flex flex-col items-center justify-center min-h-[140px] max-w-7xl mx-auto w-full">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <button onClick={() => navigate('/enquiry')} className={`flex items-center gap-2 font-brand-heading uppercase text-[12px] tracking-widest ${secondaryText} hover:text-indigo-500 transition-colors`}>
            <ArrowLeft size={16} /> Dashboard
          </button>
        </div>

        <div className="text-center space-y-1">
          <h2 className={`text-4xl font-brand-heading uppercase tracking-tighter ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            {profile.enquirer_name || "New Lead"}
          </h2>
          <div className={`flex items-center justify-center gap-2 text-[13px] font-brand-body-bold uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
            <Building2 size={14} /> {profile.enquirer_company || "Company Unassigned"}
          </div>
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-3">
          {!isNewClient && (
            <button onClick={() => setIsEditing(!isEditing)} className={`p-3.5 rounded-2xl border transition-all ${isEditing ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
              {isEditing ? <Unlock size={18} /> : <Lock size={18} className={secondaryText} />}
            </button>
          )}
          {isEditing && (
            <Button onClick={handleSaveProfile} className="rounded-2xl px-6 shadow-lg uppercase text-[10px] tracking-[0.2em] font-brand-heading">
              <Save size={16} className="mr-2" /> Commit Changes
            </Button>
          )}
        </div>
      </div>

      {/* Main Profile Info Block */}
      <div className={`max-w-7xl mx-auto rounded-[32px] border transition-all duration-500 shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="p-10">
          {isEditing ? (
            /* ALL FIELDS IN EDIT MODE */
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DetailInput label="Full Name" icon={User} isDark={isDark} value={profile.enquirer_name} onChange={(v) => setProfile({...profile, enquirer_name: v})} />
                <DetailInput label="Email" icon={Mail} isDark={isDark} value={profile.enq_email} onChange={(v) => setProfile({...profile, enq_email: v})} />
                <DetailInput label="Phone" icon={Phone} isDark={isDark} value={profile.enq_number} onChange={(v) => setProfile({...profile, enq_number: v})} />
                <DetailInput label="Company" icon={Building2} isDark={isDark} value={profile.enquirer_company} onChange={(v) => setProfile({...profile, enquirer_company: v})} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
                <DetailInput label="College" icon={GraduationCap} isDark={isDark} value={profile.college_name} onChange={(v) => setProfile({...profile, college_name: v})} />
                <DetailInput label="Course" icon={Tag} isDark={isDark} value={profile.course_taken} onChange={(v) => setProfile({...profile, course_taken: v})} />
                <DetailInput label="Passing Grade" icon={Award} isDark={isDark} value={profile.passing_grade} onChange={(v) => setProfile({...profile, passing_grade: v})} />
                <DetailInput label="Job Title" icon={Briefcase} isDark={isDark} value={profile.job_title} onChange={(v) => setProfile({...profile, job_title: v})} />
                <DetailInput label="Job Field" icon={Activity} isDark={isDark} value={profile.job_field} onChange={(v) => setProfile({...profile, job_field: v})} />
                <DetailInput label="Job Location" icon={Globe} isDark={isDark} value={profile.job_company_location} onChange={(v) => setProfile({...profile, job_company_location: v})} />
                <DetailInput label="Budget Range" icon={Wallet} isDark={isDark} value={profile.budget_range} onChange={(v) => setProfile({...profile, budget_range: v})} />
                <DetailInput label="Follow Up" type="date" icon={Calendar} isDark={isDark} value={profile.next_follow_up} onChange={(v) => setProfile({...profile, next_follow_up: v})} />
              </div>

              {/* BRAND & SERVICE SYNC IN EDIT MODE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-brand-heading uppercase tracking-widest ml-1 ${secondaryText}`}>Brand Association</label>
                  <select 
                    value={profile.brand_id} 
                    onChange={(e) => setProfile({...profile, brand_id: e.target.value, service_id: ""})}
                    className={`w-full rounded-2xl px-4 py-3 text-[12px] font-brand-body-bold outline-none border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <option value="">Select Brand</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.brand_name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-brand-heading uppercase tracking-widest ml-1 ${secondaryText}`}>Target Service</label>
                  <select 
                    value={profile.service_id} 
                    disabled={!profile.brand_id}
                    onChange={(e) => setProfile({...profile, service_id: e.target.value})}
                    className={`w-full rounded-2xl px-4 py-3 text-[12px] font-brand-body-bold outline-none border disabled:opacity-30 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <option value="">Select Service</option>
                    {filteredServices.map(s => <option key={s.id} value={s.id}>{s.service_name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* LOCKED STATE WITH EXPAND/COLLAPSE */
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-12">
                <InfoItem label="Email Address" value={profile.enq_email} icon={Mail} secondaryText={secondaryText} isDark={isDark} />
                <InfoItem label="Phone Number" value={profile.enq_number} icon={Phone} secondaryText={secondaryText} isDark={isDark} />
                <InfoItem label="Status" value={profile.enquiry_status} icon={Activity} secondaryText={secondaryText} isDark={isDark} isStatus />
                <InfoItem label="Next Follow Up" value={profile.next_follow_up} icon={Calendar} secondaryText={secondaryText} isDark={isDark} />
              </div>

              {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-12 pt-10 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-4">
                  <InfoItem label="College" value={profile.college_name} icon={GraduationCap} secondaryText={secondaryText} isDark={isDark} />
                  <InfoItem label="Course" value={profile.course_taken} icon={Tag} secondaryText={secondaryText} isDark={isDark} />
                  <InfoItem label="Passing Grade" value={profile.passing_grade} icon={Award} secondaryText={secondaryText} isDark={isDark} />
                  <InfoItem label="Job Title" value={profile.job_title} icon={Briefcase} secondaryText={secondaryText} isDark={isDark} />
                  <InfoItem label="Job Field" value={profile.job_field} icon={Activity} secondaryText={secondaryText} isDark={isDark} />
                  <InfoItem label="Location" value={profile.job_company_location} icon={Globe} secondaryText={secondaryText} isDark={isDark} />
                  <InfoItem label="Budget" value={profile.budget_range} icon={Wallet} secondaryText={secondaryText} isDark={isDark} />
                  <InfoItem label="Assigned Brand" value={brands.find(b => b.id == profile.brand_id)?.brand_name} icon={Landmark} secondaryText={secondaryText} isDark={isDark} />
                </div>
              )}

              <div className="flex justify-center pt-4">
                <button onClick={() => setIsExpanded(!isExpanded)} className={`flex items-center gap-2 text-[10px] font-brand-heading uppercase tracking-[0.25em] ${secondaryText} hover:text-indigo-500 transition-all`}>
                  {isExpanded ? <><ChevronUp size={16}/> Condense Dossier</> : <><ChevronDown size={16}/> Expand Full Profile</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conversations Section */}
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between px-4">
            <h3 className={`font-brand-heading uppercase text-[11px] tracking-[0.2em] ${secondaryText}`}>Interaction Timeline</h3>
            <Button onClick={() => { setEditingConvId(null); setNewConv({c_title: "", interaction_date: "", c_desc: ""}); setShowConvForm(true); }} className="rounded-xl py-2 px-6 text-[10px] uppercase tracking-widest font-brand-heading shadow-md shadow-indigo-500/10">
              <Plus size={16} className="mr-2" /> Log Interaction
            </Button>
        </div>

        {showConvForm && (
          <div className={`p-8 rounded-[32px] border shadow-2xl animate-in zoom-in-95 duration-200 ${isDark ? 'bg-slate-900 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailInput isDark={isDark} label="Subject" icon={MessageSquare} value={newConv.c_title} onChange={(v) => setNewConv({...newConv, c_title: v})} />
              <DetailInput isDark={isDark} label="Interaction Date" icon={Calendar} type="date" value={newConv.interaction_date} onChange={(v) => setNewConv({...newConv, interaction_date: v})} />
              <div className="md:col-span-2">
                 <textarea value={newConv.c_desc} onChange={(e) => setNewConv({...newConv, c_desc: e.target.value})} placeholder="Detailed summary of the conversation..." className={`w-full rounded-2xl p-4 text-[13px] border outline-none min-h-[140px] font-brand-body transition-all focus:border-indigo-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
              </div>
              <div className="md:col-span-2 flex justify-between items-center">
                  {editingConvId ? (
                    <button className="text-red-500 text-[10px] font-brand-heading uppercase flex items-center gap-1 hover:opacity-70"><Trash2 size={14}/> Purge Record</button>
                  ) : <div/>}
                  <div className="flex gap-3">
                    <Button variant="ghost" className="text-[10px] uppercase font-brand-heading tracking-widest" onClick={() => setShowConvForm(false)}>Cancel</Button>
                    <Button onClick={handleSaveConversation} className="text-[10px] uppercase font-brand-heading tracking-widest px-8">Save Record</Button>
                  </div>
              </div>
            </div>
          </div>
        )}

        <div className={`rounded-[32px] border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
          <Table>
            <TableHeader className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
              <TableRow>
                <TableCell isHeader className="px-10 py-5 text-[11px] font-brand-heading uppercase tracking-widest text-indigo-500">Context</TableCell>
                <TableCell isHeader className="px-10 py-5 text-[11px] font-brand-heading uppercase tracking-widest text-indigo-500">Summary</TableCell>
                <TableCell isHeader className="px-10 py-5 text-right text-[11px] font-brand-heading uppercase tracking-widest text-indigo-500">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversations.length > 0 ? conversations.map((conv) => (
                <TableRow key={conv.c_id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <TableCell className="px-10 py-6">
                    <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">{conv.interaction_date}</div>
                    <div className={`font-brand-body-bold text-[13px] uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{conv.c_title}</div>
                  </TableCell>
                  <TableCell className={`px-10 py-6 text-[12px] leading-relaxed max-w-md ${secondaryText}`}>{conv.c_desc}</TableCell>
                  <TableCell className="px-10 py-6 text-right">
                    <button onClick={() => openEditConv(conv)} className="p-2.5 hover:bg-indigo-500/10 rounded-xl text-indigo-500 transition-all">
                      <Pencil size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={3} className="py-24 text-center opacity-30 text-[10px] uppercase tracking-[0.3em] font-brand-heading">Zero Interactions Logged</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// --- SHARED COMPONENTS ---

function InfoItem({ label, value, icon: Icon, secondaryText, isDark, isStatus }) {
  return (
    <div className="flex gap-4 group">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${isDark ? 'bg-slate-800 text-indigo-400 group-hover:bg-indigo-500/10' : 'bg-indigo-50 text-indigo-600'}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className={`text-[10px] font-brand-heading uppercase tracking-widest opacity-60 mb-1 ${secondaryText}`}>{label}</div>
        <div className={`text-[14px] font-brand-body-bold ${isDark ? 'text-slate-100' : 'text-slate-900'} ${isStatus ? 'text-indigo-500' : ''}`}>
          {value || <span className="opacity-20 italic">---</span>}
        </div>
      </div>
    </div>
  );
}

function DetailInput({ label, icon: Icon, isDark, onChange, ...props }) {
  const secondaryText = isDark ? 'text-slate-300' : 'text-slate-600';
  return (
    <div className="text-left w-full space-y-1.5">
      <label className={`text-[10px] font-brand-heading uppercase block ml-1 tracking-widest ${secondaryText}`}>{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500/60" />
        <input 
          {...props} 
          onChange={(e) => onChange?.(e.target.value)} 
          className={`w-full rounded-2xl pl-11 pr-4 py-3.5 text-[13px] font-brand-body-bold outline-none border transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'}`} 
        />
      </div>
    </div>
  );
}