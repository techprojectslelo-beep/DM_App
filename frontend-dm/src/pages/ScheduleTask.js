import React, { useState, useMemo, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import InputField from "../components/form/input/InputField";
import TextArea from "../components/form/input/TextArea";
import Button from "../components/ui/button/Button";
import { toast, Toaster } from "react-hot-toast";
import { Layers, UserCheck, Globe, Layout, Loader2 } from "lucide-react";

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
  const isInitialMount = useRef(true);

  // Design tokens: Slate 300 (Dark) | Slate 600 (Light)
  const secondaryTextColor = isDark ? 'text-slate-300' : 'text-slate-600';

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

  const currentStatusIdx = STATUS_OPTIONS.indexOf(formData.status);

  const currentUser = useMemo(() => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch { return null; }
  }, []);

  /**
   * DATA FETCHING LOGIC
   * Handles API response nesting (data.data)
   */
  useEffect(() => {
    const fetchData = async () => {
      if (isInitialMount.current) {
        setLoading(true);
      } else {
        setLoadingPreview(true);
      }

      try {
        if (isInitialMount.current) {
          // Fetch all required resources
          const [brandsRes, postTypesRes, usersRes, tasksRes] = await Promise.all([
            brandService.getAllBrands(),
            postTypeService.getActiveTypes(),
            userService.getMinimalUsers(),
            taskService.getTasksByDate(formData.task_due_date)
          ]);

          // Handle nested "data" property from PHP responses
          const brands = Array.isArray(brandsRes?.data) ? brandsRes.data : (Array.isArray(brandsRes) ? brandsRes : []);
          const postTypes = Array.isArray(postTypesRes?.data) ? postTypesRes.data : (Array.isArray(postTypesRes) ? postTypesRes : []);
          const users = Array.isArray(usersRes?.data) ? usersRes.data : (Array.isArray(usersRes) ? usersRes : []);
          const tasks = Array.isArray(tasksRes?.data) ? tasksRes.data : (Array.isArray(tasksRes) ? tasksRes : []);

          setBrandOptions(brands.map(b => ({ value: b.id.toString(), label: b.brand_name })));
          setPostTypeOptions(postTypes.map(pt => ({ value: pt.id.toString(), label: pt.type_name })));
          
          const allUsers = users.map(u => ({ value: u.id.toString(), label: u.full_name, role: u.role }));
          setUserOptions(allUsers);
          setManagerOptions(allUsers.filter(u => u.role === 'admin' || u.role === 'manager'));
          setExistingTasks(tasks);
          
          isInitialMount.current = false;
        } else {
          // Refresh preview list only
          const tasksRes = await taskService.getTasksByDate(formData.task_due_date);
          const tasks = Array.isArray(tasksRes?.data) ? tasksRes.data : (Array.isArray(tasksRes) ? tasksRes : []);
          setExistingTasks(tasks);
        }
      } catch (err) {
        toast.error("Error syncing with server");
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
        setLoadingPreview(false);
      }
    };

    const debounceTimer = setTimeout(fetchData, isInitialMount.current ? 0 : 300);
    return () => clearTimeout(debounceTimer);
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
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const payload = {
      brand_id: parseInt(formData.brand_id),
      post_type_id: parseInt(formData.post_type_id),
      post_title: formData.post_title,
      task_due_date: formData.task_due_date,
      description: formData.description || null,
      asset_link: formData.link || null,
      status: formData.status,
      claimed_by_id: currentUser?.id ? parseInt(currentUser.id) : null,
      created_at: now,
      ready_by_id: formData.ready_by_id ? parseInt(formData.ready_by_id) : null,
      confirmed_by_id: formData.confirmed_by_id ? parseInt(formData.confirmed_by_id) : null,
      posted_by_id: formData.posted_by_id ? parseInt(formData.posted_by_id) : null,
      readied_at: formData.status !== "Pending" ? now : null,
      confirmed_at: (formData.status === "Confirmed" || formData.status === "Posted") ? now : null,
      posted_at: formData.status === "Posted" ? now : null,
      warning_sent: 0
    };

    try {
      await taskService.createTask(payload);
      toast.success("Task Created Successfully!");
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      toast.error("Failed to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 transition-colors duration-300">
      <Toaster position="top-center" />
      
      <div className="relative flex items-center justify-center min-h-[100px] -mt-8">
        <div className="text-center">
          <h2 className={`text-2xl font-brand-heading font-bold uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Create Content Task
          </h2>
          <p className={`text-[13px] font-brand-body-bold transition-colors uppercase ${secondaryTextColor}`}>
            Schedule and assign a single content task for your partner brands.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start max-w-7xl mx-auto mt-6">
        <div className="lg:col-span-8">
          <div className={`rounded-2xl border p-6 sm:p-8 shadow-sm space-y-8 transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            {/* Section: Brand Identity */}
            <div className="space-y-4">
              <div className={`flex items-center border-b pb-2 transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}><Globe size={16} /></div>
                  <h3 className={`text-[10px] font-black uppercase tracking-widest ${secondaryTextColor}`}>Brand Identity</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="flex flex-col justify-end text-left">
                  <Label className={`${secondaryTextColor} font-black mb-2 uppercase text-[10px] tracking-widest`}>Target Brand *</Label>
                  <Select options={brandOptions} isDark={isDark} placeholder="Select Partner..." value={formData.brand_id} onChange={(val) => handleInputChange("brand_id", val)} />
                </div>
                <div className="flex flex-col justify-end text-left">
                  <Label className={`${secondaryTextColor} font-black mb-2 uppercase text-[10px] tracking-widest`}>Post Heading *</Label>
                  <InputField isDark={isDark} placeholder="e.g. New Seasonal Collection" value={formData.post_title} onChange={(e) => handleInputChange("post_title", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Section: Specifications */}
            <div className={`space-y-4 pt-4 border-t transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}><Layers size={16} /></div>
                <h3 className={`text-[10px] font-black uppercase tracking-widest ${secondaryTextColor}`}>Content Specifications</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="flex flex-col justify-end text-left">
                  <Label className={`${secondaryTextColor} font-black mb-2 uppercase text-[10px] tracking-widest`}>Post Format *</Label>
                  <Select options={postTypeOptions} isDark={isDark} placeholder="Format..." value={formData.post_type_id} onChange={(val) => handleInputChange("post_type_id", val)} />
                </div>
                <div className="flex flex-col justify-end text-left" onClick={() => dateRef.current?.showPicker()}>
                  <Label className={`${secondaryTextColor} font-black mb-2 uppercase text-[10px] tracking-widest`}>Due Date *</Label>
                  <InputField isDark={isDark} ref={dateRef} type="date" value={formData.task_due_date} onChange={(e) => handleInputChange("task_due_date", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Section: Workflow */}
            <div className={`space-y-4 pt-4 border-t transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}><UserCheck size={16} /></div>
                <h3 className={`text-[10px] font-black uppercase tracking-widest ${secondaryTextColor}`}>Workflow Progress</h3>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
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

            {/* Section: Assets */}
            <div className={`space-y-4 pt-4 border-t transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="space-y-2 text-left">
                <Label className={`${secondaryTextColor} font-black text-[10px] uppercase tracking-widest`}>Asset Link</Label>
                <InputField isDark={isDark} placeholder="Paste drive link..." value={formData.link} onChange={(e) => handleInputChange("link", e.target.value)} />
              </div>
              <div className="space-y-2 text-left">
                <Label className={`${secondaryTextColor} font-black text-[10px] uppercase tracking-widest`}>Creative Brief</Label>
                <TextArea isDark={isDark} rows={3} placeholder="Add requirements..." value={formData.description} onChange={(v) => handleInputChange("description", v)} />
              </div>
            </div>

            <Button 
              disabled={submitting}
              onClick={handleSubmit} 
              className={`w-full py-3 px-8 font-black uppercase tracking-widest shadow-lg transition-all rounded-xl flex items-center justify-center gap-2 ${
                  isDark ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/20' : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
              } ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : null}
              {submitting ? "Saving..." : "Save Content Task"}
            </Button>
          </div>
        </div>

        {/* PREVIEW PANEL */}
        <div className="lg:col-span-4 lg:sticky lg:top-6">
          <div className={`rounded-2xl border p-6 shadow-sm space-y-4 transition-all ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-[10px] font-black uppercase tracking-widest transition-colors ${secondaryTextColor}`}>
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
                        <p className={`text-[9px] font-bold truncate ${secondaryTextColor}`}>{t.post_title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-30">
                  <Layout size={32} className="mx-auto mb-2 text-slate-400" />
                  <p className={`text-[9px] font-black uppercase tracking-widest ${secondaryTextColor}`}>No other tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}