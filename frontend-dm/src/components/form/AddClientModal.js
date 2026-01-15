import React, { useState } from "react";
import { X, User, Building2, Briefcase, Mail, Calendar } from "lucide-react";
import Button from "../ui/button/Button"; // Adjust path if needed

export default function AddClientModal({ isOpen, onClose, isDark, onSubmit }) {
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    inquiryFor: "",
    email: "",
    status: "JustConnected",
    inquiryDate: getCurrentDateTime(),
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  // CLEAN STYLING - Matching your UsersList aesthetic
  const inputClass = `w-full pl-10 pr-4 py-3 rounded-xl text-sm font-bold outline-none transition-all border ${
    isDark 
      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500" 
      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500"
  }`;

  const labelClass = `text-[10px] font-black uppercase tracking-widest mb-2 block ${
    isDark ? "text-slate-400" : "text-gray-500"
  }`;

  return (
    /* THE FIX: 
       1. No 'bg-black/60' or 'backdrop-blur'. 
       2. 'pointer-events-none' on wrapper allows clicking behind the modal.
       3. 'pointer-events-auto' on the card itself allows typing in the form.
    */
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      <div className={`w-full max-w-lg rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transition-all pointer-events-auto ${
        isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-gray-100"
      }`}>
        
        {/* Header */}
        <div className={`px-8 py-6 flex justify-between items-center border-b ${
          isDark ? "border-slate-800" : "border-gray-50"
        }`}>
          <div>
            <h3 className={`text-xl font-black uppercase tracking-tight ${isDark ? "text-slate-100" : "text-slate-800"}`}>
              New Inquiry
            </h3>
            <p className="text-xs font-medium text-blue-500">Log client details and timing</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Client Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input name="name" required placeholder="John Doe" className={inputClass} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Inquiry Date & Time</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  name="inquiryDate" 
                  type="datetime-local" 
                  required 
                  className={inputClass} 
                  value={formData.inquiryDate}
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input name="company" required placeholder="Acme Corp" className={inputClass} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input name="email" type="email" required placeholder="john@example.com" className={inputClass} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Inquiry For</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input name="inquiryFor" required placeholder="What are they looking for?" className={inputClass} onChange={handleChange} />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className={`flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <Button type="submit" className="flex-1 font-black uppercase text-[10px] py-4 shadow-lg shadow-blue-500/30">
              Save Inquiry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}