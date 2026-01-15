import React from 'react';

const TextArea = ({ isDark, className = "", ...props }) => {
  return (
    <textarea
      className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm resize-none ${
        isDark 
          ? 'bg-slate-950 border-slate-800 text-slate-300 placeholder:text-slate-600 focus:border-indigo-500/50' 
          : 'bg-white border-gray-300 text-gray-900'
      } ${className}`}
      {...props}
    />
  );
};

export default TextArea;