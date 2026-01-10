import React from 'react';

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex cursor-pointer items-center gap-2 group">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="h-5 w-5 rounded-md border-2 border-slate-200 bg-white transition-all peer-checked:border-indigo-600 peer-checked:bg-indigo-600 group-hover:border-indigo-400"></div>
        <svg
          className="absolute left-1 top-1 h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      {label && <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{label}</span>}
    </label>
  );
};

export default Checkbox;