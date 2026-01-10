import React from 'react';

const PageBreadcrumb = ({ pageTitle }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          <li>Dashboard /</li>
          <li className="text-indigo-600">{pageTitle}</li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;