import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { 
  ArrowLeft, User, Mail, ShieldCheck, 
  Lock, UserPlus, Eye, EyeOff, Loader2, Edit3, X
} from "lucide-react";
import Button from "../components/ui/button/Button";
import axiosClient from "../api/axiosClient";

export default function UserDetail({ isCreateMode = false }) {
  // PROFESSIONAL ROUTER HOOKS
  const { id } = useParams(); // Gets ID from URL /users/:id
  const navigate = useNavigate();
  const { isDark } = useOutletContext(); // Inherit theme from Dashboard Outlet

  const [isEditing, setIsEditing] = useState(isCreateMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    full_name: "",
    role: "staff",
    email: "",
    password: "",
    is_active: 1
  });

  const roles = [
    { label: "Administrator", value: "admin" },
    { label: "Regular Staff", value: "staff" }
  ];

  // Colors based on your specific requirements
  const secondaryTextColor = isDark ? 'text-slate-300' : 'text-slate-600';

  useEffect(() => {
    // Only fetch if we have an ID and aren't in 'Create' mode
    if (!isCreateMode && id) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const res = await axiosClient.get(`/users.php?id=${id}`);
          const userData = Array.isArray(res.data) ? res.data[0] : res.data;
          setProfile({ ...userData, password: "" });
        } catch (err) {
          console.error("Fetch Error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [id, isCreateMode]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isCreateMode) {
        await axiosClient.post('/users.php', profile);
      } else {
        await axiosClient.put(`/users.php?id=${id}`, profile);
      }
      setIsEditing(false);
      navigate('/users'); // Go back to list after professional save
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isCreateMode) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div className={`w-full transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto flex flex-col">
        
        {/* Top Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <button 
            onClick={() => navigate('/users')} 
            className={`group flex items-center gap-2 transition-colors font-brand-heading uppercase text-[14px] tracking-widest ${
              isDark ? 'text-slate-300 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Staff
          </button>

          {!isCreateMode && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                isEditing 
                ? 'bg-red-500/10 border-red-500/50 text-red-500' 
                : 'bg-indigo-500/10 border-indigo-500/50 text-indigo-500'
              } text-[10px] font-bold uppercase tracking-widest`}
            >
              {isEditing ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit Profile</>}
            </button>
          )}
        </div>

        <div className={`w-full border rounded-[40px] overflow-hidden flex flex-col md:flex-row transition-all duration-500 shadow-xl ${
          isDark ? 'bg-slate-900 border-slate-700 shadow-black/40' : 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(79,70,229,0.15)]'
        }`}>
          
          {/* Left Side Visual */}
          <div className={`w-full md:w-1/3 p-12 flex flex-col items-center justify-center transition-colors ${
            isDark ? 'bg-gradient-to-b from-slate-800 to-slate-900 text-slate-200' : 'bg-gradient-to-b from-indigo-50 to-indigo-100 text-slate-700'
          }`}>
            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 border shadow-xl backdrop-blur-md transition-all ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/40'
            }`}>
              {isCreateMode ? <UserPlus size={40} className="text-indigo-400" /> : <User size={40} className="text-indigo-400" />}
            </div>
            <div className="text-center">
              <h2 className={`text-2xl font-brand-heading uppercase tracking-tight ${isDark ? 'text-white' : 'text-indigo-900'}`}>
                {isCreateMode ? "New Member" : isEditing ? "Modify Staff" : "Staff Profile"}
              </h2>
              <p className={`text-[12px] font-brand-heading uppercase tracking-[0.3em] mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-indigo-700/60'}`}>
                {isCreateMode ? "System Access" : profile.full_name}
              </p>
            </div>
          </div>

          {/* Right Side Form */}
          <div className={`w-full md:w-2/3 p-8 lg:p-12 transition-colors ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <DetailInput 
                isDark={isDark}
                label="Full Name" 
                icon={User} 
                value={profile.full_name} 
                disabled={!isEditing} 
                onChange={(e) => setProfile({...profile, full_name: e.target.value})} 
              />

              <DetailInput 
                isDark={isDark}
                label="Email Address" 
                icon={Mail} 
                value={profile.email} 
                disabled={!isEditing} 
                onChange={(e) => setProfile({...profile, email: e.target.value})} 
              />
              
              <DropdownInput 
                isDark={isDark}
                label="System Role" 
                icon={ShieldCheck} 
                value={profile.role} 
                options={roles} 
                disabled={!isEditing} 
                onChange={(v) => setProfile({...profile, role: v})} 
              />

              <div className="relative">
                <DetailInput 
                  isDark={isDark}
                  label={isCreateMode ? "Set Password" : "Change Password"}
                  icon={Lock} 
                  type={showPassword ? "text" : "password"}
                  value={profile.password} 
                  disabled={!isEditing} 
                  placeholder={isEditing ? (isCreateMode ? "Required" : "Leave blank to keep same") : "••••••••"}
                  onChange={(e) => setProfile({...profile, password: e.target.value})} 
                />
                {isEditing && (
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 bottom-4 text-slate-400 hover:text-indigo-500"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
              {isEditing && (
                <Button 
                  onClick={handleSave} 
                  disabled={loading}
                  className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-brand-body-bold shadow-xl shadow-indigo-500/20 uppercase tracking-widest flex items-center gap-2"
                >
                  {loading ? "Saving..." : (isCreateMode ? "Create Member" : "Update Profile")}
                </Button>
              )}
              
              {!isCreateMode && (
                <button className={`text-[11px] font-brand-heading uppercase tracking-widest hover:text-red-500 transition-colors ml-auto ${secondaryTextColor}`}>
                  Deactivate Account
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SHARED COMPONENTS (Inherit isDark from Props)
function DetailInput({ label, icon: Icon, isDark, disabled, ...props }) {
  return (
    <div className="text-left w-full">
      <label className={`text-[11px] font-brand-heading uppercase mb-2 ml-1 block tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{label}</label>
      <div className="relative">
        <Icon size={14} className={`absolute left-4 top-1/2 -translate-y-1/2 ${disabled ? 'text-slate-500' : 'text-indigo-500'}`} />
        <input 
          {...props} 
          disabled={disabled}
          className={`w-full rounded-xl pl-11 pr-4 py-4 text-[12px] font-brand-body-bold transition-all outline-none border ${
            isDark 
            ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-950 focus:border-indigo-900' 
            : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-100'
          } ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'opacity-100'}`} 
        />
      </div>
    </div>
  );
}

function DropdownInput({ label, icon: Icon, options, value, onChange, disabled, isDark }) {
  return (
    <div className="text-left w-full">
      <label className={`text-[11px] font-brand-heading uppercase mb-2 ml-1 block tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{label}</label>
      <div className="relative">
        <Icon size={14} className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 ${disabled ? 'text-slate-500' : 'text-indigo-500'}`} />
        <select 
          disabled={disabled} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className={`w-full rounded-xl pl-11 pr-4 py-4 text-[12px] font-brand-body-bold appearance-none outline-none transition-all border ${
            isDark 
            ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-950 focus:border-indigo-900' 
            : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-100'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
        >
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
    </div>
  );
}