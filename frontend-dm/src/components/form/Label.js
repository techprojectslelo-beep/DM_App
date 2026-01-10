import React from 'react';

const Label = ({ children, className = "" }) => {
  return (
    <label className={`mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500 ${className}`}>
      {children}
    </label>
  );
};

export default Label;