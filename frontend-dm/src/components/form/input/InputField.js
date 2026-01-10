import React, { forwardRef } from 'react';

const InputField = forwardRef(({ type = "text", placeholder, value, onChange, disabled, className = "" }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
    />
  );
});

InputField.displayName = "InputField";
export default InputField;