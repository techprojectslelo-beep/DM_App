import React, { useState, useMemo, useEffect, useRef } from "react";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import InputField from "../components/form/input/InputField";
import TextArea from "../components/form/input/TextArea";
import Checkbox from "../components/form/input/Checkbox";
import Button from "../components/ui/button/Button";
import { toast, Toaster } from "react-hot-toast";
import { Calendar, Layers, UserCheck, Globe, Clock, Zap, Layout } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sun" }, { value: 1, label: "Mon" }, { value: 2, label: "Tue" },
  { value: 3, label: "Wed" }, { value: 4, label: "Thu" }, { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

const STATUS_OPTIONS = ["Pending", "Ready", "Confirmed", "Posted"];

export default function CreateTaskPage() {
  const [loading, setLoading] = useState(true);
  const [isBulk, setIsBulk] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [bulkUntilDate, setBulkUntilDate] = useState("");
  const [brandOptions, setBrandOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [postTypeOptions, setPostTypeOptions] = useState([]);

  const dateRef = useRef(null);
  const bulkRef = useRef(null);

  const loggedInUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } 
    catch (e) { return { full_name: "Admin" }; }
  }, []);

  const [formData, setFormData] = useState({
    brand_id: "", post_title: "", post_type_id: "", task_due_date: "",
    status: "Pending", ready_by_id: "", confirmed_by_id: "", posted_by_id: "",
    description: "", link: ""
  });

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        setLoading(false); // Set to false for immediate visibility
        setBrandOptions([{ value: "1", label: "Apple" }, { value: "2", label: "Nike" }]);
        setUserOptions([{ value: "101", label: "John Creator" }]);
        setPostTypeOptions([{ value: "1", label: "Reel" }, { value: "2", label: "Carousel" }]);
      } catch (err) { toast.error("Load failed"); }
    };
    fetchWorkspaceData();
  }, []);

  const handleInputChange = (field, value) => {
    let cleanValue = value?.target ? (value.target.type === 'checkbox' ? value.target.checked : value.target.value) : value;
    setFormData((prev) => ({ ...prev, [field]: cleanValue }));
  };

  const calculateBulkTasks = () => {
    if (!isBulk || !formData.task_due_date || !bulkUntilDate || selectedDays.length === 0) return [];
    let tasks = [];
    let current = new Date(formData.task_due_date);
    const endLimit = new Date(bulkUntilDate);
    while (current <= endLimit) {
      if (selectedDays.includes(current.getDay())) tasks.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return tasks;
  };

  // UI Helpers
  const selectedBrand = brandOptions.find(b => String(b.value) === String(formData.brand_id));
  const currentStatusIdx = STATUS_OPTIONS.indexOf(formData.status);

  return (
    <div className="p-6 text-left min-h-screen bg-gray-50/50"> 
      <Toaster position="top-center" />
      
      {/* HEADER: TIGHT SPACING */}
      <div className="mb-4">
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Create Content Task</h2>
        <p className="text-sm text-gray-600 font-bold">Schedule and assign tasks for your partner brands.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-gray-300 bg-white p-6 sm:p-8 shadow-sm space-y-8">
            
            {/* SECTION 1: IDENTITY */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg"><Globe size={16} /></div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Brand Identity</h3>
                </div>
                {/* BULK MODE INSIDE FORM */}
                <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
                  <Zap size={14} className={isBulk ? "text-blue-600 fill-blue-600" : "text-gray-400"} />
                  <span className="text-[10px] font-black text-gray-600 uppercase">Bulk Mode</span>
                  <Checkbox checked={isBulk} onChange={(val) => setIsBulk(val)} />
                </div>
              </div>

              {/* ALIGNMENT FIX: justify-end ensures input boxes line up perfectly */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="flex flex-col justify-end min-h-[80px]">
                  <Label className="text-gray-900 font-black mb-2 uppercase text-[11px]">Target Brand</Label>
                  <Select options={brandOptions} placeholder="Select Partner..." value={formData.brand_id} onChange={(val) => handleInputChange("brand_id", val)} />
                </div>
                <div className="flex flex-col justify-end min-h-[80px]">
                  <Label className="text-gray-900 font-black mb-2 uppercase text-[11px]">Post Heading / Title</Label>
                  <InputField placeholder="e.g. New Seasonal Collection" value={formData.post_title} onChange={(e) => handleInputChange("post_title", e.target.value)} />
                </div>
              </div>
            </div>

            {/* SECTION 2: SPECIFICATIONS */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg"><Layers size={16} /></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Content Specifications</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="flex flex-col justify-end min-h-[80px]">
                  <Label className="text-gray-900 font-black mb-2 uppercase text-[11px]">Post Format</Label>
                  <Select options={postTypeOptions} placeholder="Format..." value={formData.post_type_id} onChange={(val) => handleInputChange("post_type_id", val)} />
                </div>
                <div className="flex flex-col justify-end min-h-[80px]" onClick={() => dateRef.current?.showPicker()}>
                  <Label className="text-gray-900 font-black mb-2 uppercase text-[11px]">Due Date</Label>
                  <InputField ref={dateRef} type="date" value={formData.task_due_date} onChange={(e) => handleInputChange("task_due_date", e.target.value)} />
                </div>
              </div>
            </div>

            {/* SECTION 3: WORKFLOW */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg"><UserCheck size={16} /></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Workflow Progress</h3>
              </div>
              <div className="flex p-1 bg-gray-100 rounded-xl gap-1 border border-gray-300 shadow-inner">
                {STATUS_OPTIONS.map(opt => (
                  <button key={opt} type="button" onClick={() => handleInputChange("status", opt)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
                      formData.status === opt ? "bg-white shadow-md text-blue-700 border border-gray-200" : "text-gray-500"
                    }`}>{opt}</button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStatusIdx >= 1 && <div className="space-y-2"><Label className="text-blue-700 font-black text-[10px] uppercase">Ready By</Label><Select options={userOptions} value={formData.ready_by_id} onChange={(v)=>handleInputChange("ready_by_id", v)} /></div>}
                {currentStatusIdx >= 2 && <div className="space-y-2"><Label className="text-emerald-700 font-black text-[10px] uppercase">Confirmed By</Label><Select options={userOptions} value={formData.confirmed_by_id} onChange={(v)=>handleInputChange("confirmed_by_id", v)} /></div>}
                {currentStatusIdx >= 3 && <div className="space-y-2"><Label className="text-orange-700 font-black text-[10px] uppercase">Posted By</Label><Select options={userOptions} value={formData.posted_by_id} onChange={(v)=>handleInputChange("posted_by_id", v)} /></div>}
              </div>
            </div>

            {/* BULK PANEL */}
            {isBulk && (
              <div className="p-6 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="flex flex-col justify-end min-h-[70px]" onClick={() => bulkRef.current?.showPicker()}>
                    <Label className="text-blue-900 font-black text-[10px] uppercase mb-2">Repeat Until</Label>
                    <InputField ref={bulkRef} type="date" value={bulkUntilDate} onChange={(e) => setBulkUntilDate(e.target.value)} />
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {DAYS_OF_WEEK.map((day) => (
                      <button key={day.value} type="button" onClick={() => setSelectedDays(prev => prev.includes(day.value) ? prev.filter(d => d !== day.value) : [...prev, day.value])} 
                        className={`px-3 py-2 rounded-lg text-[10px] font-black border transition-all ${
                          selectedDays.includes(day.value) ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-gray-300 text-gray-600"
                        }`}>{day.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <Label className="text-gray-900 font-black text-[11px] uppercase">Asset Link</Label>
                <InputField placeholder="Paste link..." value={formData.link} onChange={(e) => handleInputChange("link", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 font-black text-[11px] uppercase">Creative Brief</Label>
                <TextArea rows={3} placeholder="Requirements..." value={formData.description} onChange={(v) => handleInputChange("description", v)} />
              </div>
            </div>

            <Button onClick={() => toast.success("Task Created")} className="w-full py-4 font-black uppercase tracking-widest shadow-xl shadow-blue-500/10 border-2 border-blue-700">
              {isBulk ? `Generate ${calculateBulkTasks().length} Tasks` : `Save Single Task`}
            </Button>
          </div>
        </div>

        {/* SIDEBAR PREVIEW */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Task Preview</h3>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 min-h-[300px] flex flex-col items-center justify-center text-center">
              {formData.post_title ? (
                <div className="w-full space-y-4 animate-in fade-in">
                   <div className="p-4 rounded-xl border-2 border-dashed border-blue-400 bg-white shadow-sm">
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-tighter">{selectedBrand?.label || "BRAND"}</span>
                      <h4 className="font-bold text-gray-900 mt-2">{formData.post_title}</h4>
                   </div>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                     <Clock size={12}/> {formData.task_due_date || "No Date"}
                   </div>
                </div>
              ) : (
                <>
                  <Layout size={32} className="text-gray-200 mb-2" />
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Live Preview Area</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}