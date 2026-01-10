import React from 'react';

export const Table = ({ children, className = "" }) => (
  <table className={`w-full border-collapse ${className}`}>{children}</table>
);

export const TableHeader = ({ children, className = "" }) => (
  <thead className={`bg-gray-50/50 border-b border-gray-100 ${className}`}>{children}</thead>
);

export const TableBody = ({ children, className = "" }) => (
  <tbody className={className}>{children}</tbody>
);

export const TableRow = ({ children, onClick, className = "" }) => (
  <tr 
    onClick={onClick} 
    className={`transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, isHeader = false, className = "" }) => {
  const Tag = isHeader ? 'th' : 'td';
  return (
    <Tag className={`px-6 py-4 text-sm ${isHeader ? 'text-[10px] font-black uppercase text-gray-400 tracking-widest' : 'text-gray-600'} ${className}`}>
      {children}
    </Tag>
  );
};