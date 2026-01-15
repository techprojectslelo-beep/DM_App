import React, { useState, useMemo, useEffect, useRef } from "react";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import InputField from "../components/form/input/InputField";
import TextArea from "../components/form/input/TextArea";
import Button from "../components/ui/button/Button";
import { toast, Toaster } from "react-hot-toast";
import { Layers, UserCheck, Globe, Clock, Layout } from "lucide-react";

const STATUS_OPTIONS = ["Pending", "Ready", "Confirmed", "Posted"];

export default function CreateTaskPage({ isDark }) {
  const [loading, setLoading] = useState(true);
  const [brandOptions, setBrandOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [postTypeOptions, setPostTypeOptions] = useState([]);

  const dateRef = useRef(null);

  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {
      return { full_name: "Admin" };
    }
  }, []);

  const [formData, setFormData] = useState({
    brand_id: "",
    post_title: "",
    post_type_id: "",
    task_due_date: "",
    status: "Pending",
    ready_by_id: "",
    confirmed_by_id: "",
    posted_by_id: "",
    description: "",
    link: ""
  });

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        setLoading(false);
        setBrandOptions([{ value: "1", label: "Apple" }, { value: "2", label: "Nike" }]);
        setUserOptions([{ value: "101", label: "John Creator" }, { value: "102", label: "Sarah J." }]);
        setPostTypeOptions([{ value: "1", label: "Reel" }, { value: "2", label: "Static Post" }, { value: "3", label: "Carousel" }]);
      } catch (err) {
        toast.error("Load failed");
      }
    };
    fetchWorkspaceData();
  }, []);

  const handleInputChange = (field, value) => {
    let cleanValue = value?.target ? value.target.value : value;
    setFormData((prev) => ({ ...prev, [field]: cleanValue }));
  };

  const selectedBrand = brandOptions.find(b => String(b.value) === String(formData.brand_id));
  const currentStatusIdx = STATUS_OPTIONS.indexOf(formData.status);

  // UPDATED: Now strictly follows Slate 300/600 for headers/labels
  const brandTextColor = isDark ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className={`p-6 text-left min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}> 
      <Toaster position="top-center" />
      
      {/* HEADER */}
      <div className="mb-6">
        <h2 className={`text-2xl font-brand-heading uppercase tracking-brand-tight transition-colors ${isDark ? 'text-slate-100': 'text-slate-800'}`}>
            Create Content Task
        </h2>
        <p className={`text-sm font-brand-body-bold transition-colors ${brandTextColor}`}>
            Schedule and assign a single content task for your partner brands.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* MAIN FORM AREA */}
        <div className="lg:col-span-8">
          <div className={`rounded-2xl border p-6 sm:p-8 shadow-sm space-y-8 transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
          }`}>
            
            {/* SECTION 1: IDENTITY */}
            <div className="space-y-4">
              <div className={`flex items-center border-b pb-2 transition-colors ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}><Globe size={16} /></div>
                  <h3 className={`text-xs font-brand-heading uppercase tracking-brand-tight ${brandTextColor}`}>Brand Identity</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="flex flex-col justify-end min-h-[80px]">
                  <Label className={`${brandTextColor} font-brand-heading mb-2 uppercase text-[11px] tracking-brand-tight`}>Target Brand</Label>
                  <Select options={brandOptions} isDark={isDark} placeholder="Select Partner..." value={formData.brand_id} onChange={(val) => handleInputChange("brand_id", val)} />
                </div>
                <div className="flex flex-col justify-end min-h-[80px]">
                  <Label className={`${brandTextColor} font-brand-heading mb-2 uppercase text-[11px] tracking-brand-tight`}>Post Heading / Title</Label>
                  <InputField isDark={isDark} placeholder="e.g. New Seasonal Collection" value={formData.post_title} onChange={(e) => handleInputChange("post_title", e.target.value)} />
                </div>
              </div>
            </div>

            {/* SECTION 2: SPECIFICATIONS */}
            <div className={`space-y-4 pt-4 border-t transition-colors ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}`}><Layers size={16} /></div>
                <h3 className={`text-xs font-brand-heading uppercase tracking-brand-tight ${brandTextColor}`}>Content Specifications</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="flex flex-col justify-end min-h-[80px]">
                  <Label className={`${brandTextColor} font-brand-heading mb-2 uppercase text-[11px] tracking-brand-tight`}>Post Format</Label>
                  <Select options={postTypeOptions} isDark={isDark} placeholder="Format..." value={formData.post_type_id} onChange={(val) => handleInputChange("post_type_id", val)} />
                </div>
                <div className="flex flex-col justify-end min-h-[80px]" onClick={() => dateRef.current?.showPicker()}>
                  <Label className={`${brandTextColor} font-brand-heading mb-2 uppercase text-[11px] tracking-brand-tight`}>Due Date</Label>
                  <InputField isDark={isDark} ref={dateRef} type="date" value={formData.task_due_date} onChange={(e) => handleInputChange("task_due_date", e.target.value)} />
                </div>
              </div>
            </div>

            {/* SECTION 3: WORKFLOW */}
            <div className={`space-y-4 pt-4 border-t transition-colors ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}><UserCheck size={16} /></div>
                <h3 className={`text-xs font-brand-heading uppercase tracking-brand-tight ${brandTextColor}`}>Workflow Progress</h3>
              </div>
              
              <div className={`flex p-1 rounded-xl gap-1 border shadow-inner transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-gray-100 border-gray-300'
              }`}>
                {STATUS_OPTIONS.map(opt => (
                  <button key={opt} type="button" onClick={() => handleInputChange("status", opt)}
                    className={`flex-1 py-2 text-[10px] font-brand-heading uppercase rounded-lg transition-all ${
                      formData.status === opt 
                      ? (isDark ? "bg-slate-800 text-blue-400 shadow-lg border border-slate-700" : "bg-white shadow-md text-blue-700 border border-gray-200") 
                      : (isDark ? "text-slate-300 hover:text-white" : "text-gray-400 hover:text-gray-600")
                    }`}>{opt}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStatusIdx >= 1 && (
                  <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
                    <Label className="text-blue-500 font-brand-heading text-[10px] uppercase tracking-brand-tight">Ready By</Label>
                    <Select isDark={isDark} options={userOptions} value={formData.ready_by_id} onChange={(v)=>handleInputChange("ready_by_id", v)} />
                  </div>
                )}
                {currentStatusIdx >= 2 && (
                  <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
                    <Label className="text-emerald-500 font-brand-heading text-[10px] uppercase tracking-brand-tight">Confirmed By</Label>
                    <Select isDark={isDark} options={userOptions} value={formData.confirmed_by_id} onChange={(v)=>handleInputChange("confirmed_by_id", v)} />
                  </div>
                )}
                {currentStatusIdx >= 3 && (
                  <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
                    <Label className="text-orange-500 font-brand-heading text-[10px] uppercase tracking-brand-tight">Posted By</Label>
                    <Select isDark={isDark} options={userOptions} value={formData.posted_by_id} onChange={(v)=>handleInputChange("posted_by_id", v)} />
                  </div>
                )}
              </div>
            </div>

            {/* ASSETS & BRIEF */}
            <div className={`space-y-4 pt-4 border-t transition-colors ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
              <div className="space-y-2">
                <Label className={`${brandTextColor} font-brand-heading text-[11px] uppercase tracking-brand-tight`}>Asset Link</Label>
                <InputField isDark={isDark} placeholder="Paste canvas/drive link..." value={formData.link} onChange={(e) => handleInputChange("link", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className={`${brandTextColor} font-brand-heading text-[11px] uppercase tracking-brand-tight`}>Creative Brief</Label>
                <TextArea isDark={isDark} rows={3} placeholder="Add requirements or worker instructions..." value={formData.description} onChange={(v) => handleInputChange("description", v)} />
              </div>
            </div>

            <Button 
              onClick={() => toast.success("Task Created Successfully")} 
              className={`w-full py-4 font-brand-body-bold uppercase tracking-brand-tight shadow-xl border-2 transition-all ${
                  isDark ? 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-indigo-900/20' : 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700'
              }`}
            >
              Save Content Task
            </Button>
          </div>
        </div>

        {/* SIDEBAR PREVIEW */}
        <div className="lg:col-span-4 lg:sticky lg:top-6">
          <div className={`rounded-2xl border p-6 shadow-sm space-y-4 transition-all ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-[10px] font-brand-heading uppercase tracking-brand-tight transition-colors ${brandTextColor}`}>Task Preview</h3>
            <div className={`rounded-2xl border p-4 min-h-[300px] flex flex-col items-center justify-center text-center transition-all ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-gray-50 border-gray-200'
            }`}>
              {formData.post_title ? (
                <div className="w-full space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className={`p-5 rounded-xl border-2 border-dashed transition-all ${
                        isDark ? 'border-indigo-500/50 bg-slate-900' : 'border-blue-400 bg-white shadow-sm'
                    }`}>
                      <span className={`text-[10px] font-brand-heading px-2 py-1 rounded uppercase tracking-brand-tight ${
                          isDark ? 'text-indigo-400 bg-indigo-950/50' : 'text-blue-600 bg-blue-50'
                      }`}>{selectedBrand?.label || "UNASSIGNED BRAND"}</span>
                      <h4 className={`font-brand-body-bold mt-3 text-lg leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{formData.post_title}</h4>
                      <div className={`mt-2 text-[9px] font-brand-heading uppercase px-2 py-0.5 inline-block rounded ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-500'}`}>
                        {postTypeOptions.find(p => String(p.value) === String(formData.post_type_id))?.label || "Format not set"}
                      </div>
                    </div>
                    <div className={`text-[10px] font-brand-body-bold uppercase tracking-brand-tight flex items-center justify-center gap-2 ${brandTextColor}`}>
                      <Clock size={12}/> {formData.task_due_date || "No Deadline Set"}
                    </div>
                </div>
              ) : (
                <div className="space-y-2 opacity-40">
                  <Layout size={32} className={`${isDark ? 'text-slate-700' : 'text-gray-300'} mx-auto`} />
                  <p className={`text-[10px] font-brand-heading uppercase tracking-brand-tight ${brandTextColor}`}>Preview will update as you type</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}