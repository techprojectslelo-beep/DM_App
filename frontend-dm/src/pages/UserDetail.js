import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, User, Mail, ShieldCheck, 
  Lock, Unlock, UserPlus, Eye, EyeOff 
} from "lucide-react";
import Button from "../components/ui/button/Button";

export default function UserDetail({ userId, onBack, isCreateMode = false }) {
  const [isEditing, setIsEditing] = useState(isCreateMode);
  const [showPassword, setShowPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "",
    role: "Creator",
    email: "",
    password: "",
    status: "Active"
  });

  useEffect(() => {
    if (!isCreateMode && userId) {
      setProfile({
        name: "Sarah Jenkins",
        role: "Admin",
        email: "sarah.j@agency.com",
        password: "••••••••", 
        status: "Active"
      });
    }
  }, [userId, isCreateMode]);

  const roles = ["Admin", "Manager", "Creator", "Staff"];

  return (
    <div className="p-6 md:p-12 min-h-full w-full max-w-5xl mx-auto flex flex-col">
      {/* Top Navigation */}
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em] transition-all">
          <ArrowLeft size={14} /> Back to Directory
        </button>
      </div>

      {/* THE HORIZONTAL CARD WITH FLOATING SHADOW */}
      <div className="w-full bg-white border border-gray-200 rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-shadow duration-500 hover:shadow-[0_30px_60px_rgba(79,70,229,0.2)]">
        
        {/* Left Side: Visual/Profile Summary (Compact) */}
        <div className="w-full md:w-1/3 bg-gradient-to-b from-orange-200 to-indigo-200 p-12 flex flex-col items-center justify-center text-slate-700">
          <div className="w-24 h-24 bg-white/40 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-6 border border-white/40 shadow-xl">
            {isCreateMode ? <UserPlus size={40} className="text-indigo-600" /> : <User size={40} className="text-indigo-600" />}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black uppercase tracking-tight text-indigo-900">
              {isCreateMode ? "New Staff" : "Edit Profile"}
            </h2>
            <p className="text-indigo-700/60 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 leading-relaxed">
              {isCreateMode ? "Fill in the details to grant system access" : `Managing: ${profile.name}`}
            </p>
          </div>
        </div>

        {/* Right Side: The Horizontal Form */}
        <div className="w-full md:w-2/3 p-8 lg:p-12 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Field 1: Name */}
            <DetailInput 
              label="Full Name" 
              icon={User} 
              value={profile.name} 
              disabled={!isEditing} 
              placeholder="e.g. Alex Rivera" 
              onChange={(e) => setProfile({...profile, name: e.target.value})} 
            />

            {/* Field 2: Email */}
            <DetailInput 
              label="Email Address" 
              icon={Mail} 
              value={profile.email} 
              disabled={!isEditing} 
              placeholder="alex@agency.com" 
              onChange={(e) => setProfile({...profile, email: e.target.value})} 
            />
            
            {/* Field 3: Role */}
            <DropdownInput 
              label="System Role" 
              icon={ShieldCheck} 
              value={profile.role} 
              options={roles} 
              disabled={!isEditing} 
              onChange={(v) => setProfile({...profile, role: v})} 
            />

            {/* Field 4: Password */}
            <div className="relative">
              <DetailInput 
                label="Account Password"
                icon={Lock} 
                type={showPassword ? "text" : "password"}
                value={profile.password} 
                disabled={!isEditing} 
                placeholder="••••••••" 
                onChange={(e) => setProfile({...profile, password: e.target.value})} 
              />
              {isEditing && (
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-3.5 text-gray-300 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 text-left">
            {isEditing && (
              <Button onClick={() => onBack()} className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95">
                {isCreateMode ? "Create Member" : "Save Changes"}
              </Button>
            )}
            
            {!isCreateMode && (
              <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors ml-auto">
                Delete User Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// SHARED COMPONENTS
function DetailInput({ label, icon: Icon, ...props }) {
  return (
    <div className="text-left w-full">
      <label className="text-[9px] font-black uppercase text-gray-400 mb-2 ml-1 block tracking-widest">{label}</label>
      <div className="relative">
        <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
        <input 
          {...props} 
          className="w-full rounded-xl pl-11 pr-4 py-4 text-xs font-bold bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/30 outline-none transition-all disabled:opacity-50" 
        />
      </div>
    </div>
  );
}

function DropdownInput({ label, icon: Icon, options, value, onChange, disabled }) {
  return (
    <div className="text-left w-full">
      <label className="text-[9px] font-black uppercase text-gray-400 mb-2 ml-1 block tracking-widest">{label}</label>
      <div className="relative">
        <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 z-10" />
        <select 
          disabled={disabled} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-full rounded-xl pl-11 pr-4 py-4 text-xs font-bold bg-gray-50 border border-transparent appearance-none outline-none focus:bg-white focus:border-indigo-100 transition-all disabled:opacity-50"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
  );
}