import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ options, value, onChange, placeholder, isDark, className = "" }) => {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none px-4 py-2.5 rounded-xl border transition-all outline-none text-sm cursor-pointer ${
          isDark 
            ? 'bg-slate-950 border-slate-800 text-slate-300 focus:border-indigo-500/50' 
            : 'bg-white border-gray-300 text-gray-900'
        } ${className}`}
      >
        <option value="" disabled className={isDark ? "bg-slate-900" : ""}>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className={isDark ? "bg-slate-900 text-slate-300" : ""}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
        <ChevronDown size={14} />
      </div>
    </div>
  );
};

export default Select;