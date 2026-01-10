import React from 'react';

const Button = ({ children, onClick, className = "", variant = "primary", icon: Icon }) => {
  const baseStyles = "flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
    dark: "bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200"
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default Button;