import React from 'react';

const InputField = React.forwardRef(({ isDark, className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none text-sm ${
        isDark 
          ? 'bg-slate-950 border-slate-800 text-slate-300 placeholder:text-slate-400 focus:border-indigo-500/50' 
          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
      } ${className}`}
      {...props}
    />
  );
});

export default InputField;