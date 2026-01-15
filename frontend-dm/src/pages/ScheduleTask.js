import React, { useState, useMemo, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import InputField from "../components/form/input/InputField";
import TextArea from "../components/form/input/TextArea";
import Button from "../components/ui/button/Button";
import { toast, Toaster } from "react-hot-toast";
import { Layers, UserCheck, Globe, Clock, Layout, Loader2 } from "lucide-react";

// API Services
import taskService from "../api/taskService";
import brandService from "../api/brandService";
import postTypeService from "../api/postTypeService";
import userService from "../api/userService"; 

const STATUS_OPTIONS = ["Pending", "Ready", "Confirmed", "Posted"];

export default function CreateTaskPage() {
  const { isDark } = useOutletContext();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [brandOptions, setBrandOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]); 
  const [postTypeOptions, setPostTypeOptions] = useState([]);

  const [existingTasks, setExistingTasks] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const dateRef = useRef(null);

  // Get logged in user info
  const currentUser = useMemo(() => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch { return null; }
  }, []);

  const [formData, setFormData] = useState({
    brand_id: "",
    post_title: "",
    post_type_id: "",
    task_due_date: new Date().toISOString().split('T')[0],
    status: "Pending",
    ready_by_id: "",
    confirmed_by_id: "",
    posted_by_id: "",
    description: "",
    link: "" 
  });

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      setLoading(true);
      try {
        const [brands, postTypes, users] = await Promise.all([
          brandService.getAllBrands(),
          postTypeService.getActiveTypes(),
          userService.getAllUsers()
        ]);

        setBrandOptions(brands.map(b => ({ value: b.id.toString(), label: b.brand_name })));
        setPostTypeOptions(postTypes.map(pt => ({ value: pt.id.toString(), label: pt.type_name })));
        
        const allUsers = users.map(u => ({ value: u.id.toString(), label: u.full_name, role: u.role }));
        setUserOptions(allUsers);
        setManagerOptions(allUsers.filter(u => u.role === 'admin' || u.role === 'manager'));

      } catch (err) {
        toast.error("Failed to load workspace data");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaceData();
  }, []);

  useEffect(() => {
    const fetchDateTasks = async () => {
      if (!formData.task_due_date) return;
      setLoadingPreview(true);
      try {
        const tasks = await taskService.getTasksByDate(formData.task_due_date);
        setExistingTasks(tasks || []);
      } catch (err) {
        console.error("Preview error:", err);
      } finally {
        setLoadingPreview(false);
      }
    };
    fetchDateTasks();
  }, [formData.task_due_date]);

  const handleInputChange = (field, value) => {
    let cleanValue = value?.target ? value.target.value : value;
    setFormData((prev) => ({ ...prev, [field]: cleanValue }));
  };

  const handleSubmit = async () => {
    if (!formData.brand_id || !formData.post_title || !formData.task_due_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    // CRITICAL: Ensure all IDs are sent as Integers and timestamps are generated
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const payload = {
      // Identity & Specs
      brand_id: parseInt(formData.brand_id),
      post_type_id: parseInt(formData.post_type_id),
      post_title: formData.post_title,
      task_due_date: formData.task_due_date,
      description: formData.description || null,
      asset_link: formData.link || null,
      status: formData.status,
      
      // Audit Trail
      claimed_by_id: currentUser?.id ? parseInt(currentUser.id) : null,
      created_at: now,
      
      // Workflow IDs (Converted to Int or Null)
      ready_by_id: formData.ready_by_id ? parseInt(formData.ready_by_id) : null,
      confirmed_by_id: formData.confirmed_by_id ? parseInt(formData.confirmed_by_id) : null,
      posted_by_id: formData.posted_by_id ? parseInt(formData.posted_by_id) : null,

      // Workflow Timestamps (Logic handled here to ensure DB receives them)
      readied_at: formData.status !== "Pending" ? now : null,
      confirmed_at: (formData.status === "Confirmed" || formData.status === "Posted") ? now : null,
      posted_at: formData.status === "Posted" ? now : null,
      
      warning_sent: 0
    };

    console.log("Submitting Payload:", payload); // Check your console to see if IDs are numbers

    try {
      await taskService.createTask(payload);
      toast.success("Task Created Successfully!");
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      console.error("Submission error details:", err);
      toast.error("Failed to save full record. Check Network tab.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedBrand = brandOptions.find(b => String(b.value) === String(formData.brand_id));
  const currentStatusIdx = STATUS_OPTIONS.indexOf(formData.status);
  const brandTextColor = isDark ? 'text-slate-300' : 'text-slate-600';

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 text-left min-h-full transition-colors duration-300"> 
      <Toaster position="top-center" />
      
      <div className="mb-6">
        <h2 className={`text-2xl font-black uppercase tracking-tight transition-colors ${isDark ? 'text-white': 'text-slate-900'}`}>
            Create Content Task
        </h2>
        <p className={`text-sm font-bold transition-colors ${brandTextColor}`}>
            Schedule and assign a single content task for your partner brands.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8">
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-sm space-y-8 transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            <div className="space-y-4">
              <div className={`flex items-center border-b pb-2 transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}><Globe size={16} /></div>
                  <h3 className={`text-[10px] font-black uppercase tracking-widest ${brandTextColor}`}>Brand Identity</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="flex flex-col justify-end">
                  <Label className={`${brandTextColor} font-black mb-2 uppercase text-[10px] tracking-widest`}>Target Brand *</Label>
                  <Select options={brandOptions} isDark={isDark} placeholder="Select Partner..." value={formData.brand_id} onChange={(val) => handleInputChange("brand_id", val)} />
                </div>
                <div className="flex flex-col justify-end">
                  <Label className={`${brandTextColor} font-black mb-2 uppercase text-[10px] tracking-widest`}>Post Heading *</Label>
                  <InputField isDark={isDark} placeholder="e.g. New Seasonal Collection" value={formData.post_title} onChange={(e) => handleInputChange("post_title", e.target.value)} />
                </div>
              </div>
            </div>

            <div className={`space-y-4 pt-4 border-t transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}><Layers size={16} /></div>
                <h3 className={`text-[10px] font-black uppercase tracking-widest ${brandTextColor}`}>Content Specifications</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="flex flex-col justify-end">
                  <Label className={`${brandTextColor} font-black mb-2 uppercase text-[10px] tracking-widest`}>Post Format *</Label>
                  <Select options={postTypeOptions} isDark={isDark} placeholder="Format..." value={formData.post_type_id} onChange={(val) => handleInputChange("post_type_id", val)} />
                </div>
                <div className="flex flex-col justify-end" onClick={() => dateRef.current?.showPicker()}>
                  <Label className={`${brandTextColor} font-black mb-2 uppercase text-[10px] tracking-widest`}>Due Date *</Label>
                  <InputField isDark={isDark} ref={dateRef} type="date" value={formData.task_due_date} onChange={(e) => handleInputChange("task_due_date", e.target.value)} />
                </div>
              </div>
            </div>

            <div className={`space-y-4 pt-4 border-t transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}><UserCheck size={16} /></div>
                <h3 className={`text-[10px] font-black uppercase tracking-widest ${brandTextColor}`}>Workflow Progress</h3>
              </div>
              
              <div className={`flex p-1 rounded-2xl gap-1 border shadow-inner transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                {STATUS_OPTIONS.map(opt => (
                  <button key={opt} type="button" onClick={() => handleInputChange("status", opt)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${
                      formData.status === opt 
                      ? (isDark ? "bg-slate-800 text-indigo-400 shadow-lg border border-slate-700" : "bg-white shadow-sm text-indigo-600 border border-slate-200") 
                      : (isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600")
                    }`}>{opt}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStatusIdx >= 1 && (
                  <div className="space-y-2">
                    <Label className="text-orange-500 font-black text-[9px] uppercase tracking-widest">Ready By</Label>
                    <Select isDark={isDark} options={userOptions} value={formData.ready_by_id} onChange={(v)=>handleInputChange("ready_by_id", v)} />
                  </div>
                )}
                {currentStatusIdx >= 2 && (
                  <div className="space-y-2">
                    <Label className="text-emerald-500 font-black text-[9px] uppercase tracking-widest">Confirmed By</Label>
                    <Select isDark={isDark} options={managerOptions} value={formData.confirmed_by_id} onChange={(v)=>handleInputChange("confirmed_by_id", v)} />
                  </div>
                )}
                {currentStatusIdx >= 3 && (
                  <div className="space-y-2">
                    <Label className="text-indigo-500 font-black text-[9px] uppercase tracking-widest">Posted By</Label>
                    <Select isDark={isDark} options={userOptions} value={formData.posted_by_id} onChange={(v)=>handleInputChange("posted_by_id", v)} />
                  </div>
                )}
              </div>
            </div>

            <div className={`space-y-4 pt-4 border-t transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="space-y-2">
                <Label className={`${brandTextColor} font-black text-[10px] uppercase tracking-widest`}>Asset Link</Label>
                <InputField isDark={isDark} placeholder="Paste drive link..." value={formData.link} onChange={(e) => handleInputChange("link", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className={`${brandTextColor} font-black text-[10px] uppercase tracking-widest`}>Creative Brief</Label>
                <TextArea isDark={isDark} rows={3} placeholder="Add requirements..." value={formData.description} onChange={(v) => handleInputChange("description", v)} />
              </div>
            </div>

            <Button 
              disabled={submitting}
              onClick={handleSubmit} 
              className={`w-full py-4 font-black uppercase tracking-widest shadow-xl transition-all rounded-2xl flex items-center justify-center gap-2 ${
                  isDark ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/40' : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
              } ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
              {submitting ? "Saving..." : "Save Content Task"}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-6">
          <div className={`rounded-3xl border p-6 shadow-sm space-y-4 transition-all ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-[10px] font-black uppercase tracking-widest transition-colors ${brandTextColor}`}>
              Schedule Preview: {formData.task_due_date}
            </h3>
            
            <div className={`rounded-2xl border p-4 min-h-[350px] space-y-3 transition-all ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}>
              {loadingPreview ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 py-10">
                   <Loader2 className="animate-spin mb-2" size={24} />
                </div>
              ) : existingTasks.length > 0 ? (
                <div className="space-y-3">
                  {existingTasks.map((t, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-[10px] font-black">
                        {t.brand_name?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`text-[11px] font-black uppercase truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.brand_name}</p>
                        <p className={`text-[9px] font-bold truncate ${brandTextColor}`}>{t.post_title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-30">
                  <Layout size={32} className="mx-auto mb-2 text-slate-400" />
                  <p className={`text-[9px] font-black uppercase tracking-widest ${brandTextColor}`}>No other tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}