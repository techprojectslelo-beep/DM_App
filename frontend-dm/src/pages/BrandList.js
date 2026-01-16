import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import Button from "../components/ui/button/Button";
import { Plus, Building2, ChevronRight, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import brandService from "../api/brandService"; 

export default function InternalEntitiesList({ isDark, activeFilters, onDataLoaded }) {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Ref to prevent double-firing in StrictMode/Development
  const hasFetched = useRef(false);

  // Consistent theme colors based on your preferences
  const secondaryTextColor = isDark ? 'text-slate-300' : 'text-slate-600';

  const fetchBrands = async (isManualRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await brandService.getAllBrands(); 
      if (Array.isArray(res)) {
        setCompanies(res);
        if (onDataLoaded) onDataLoaded(res);
      } else {
        setCompanies([]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch entities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we haven't already fetched during this mount cycle
    if (!hasFetched.current) {
      fetchBrands();
      hasFetched.current = true;
    }
  }, []); // Empty dependency array is safe with the useRef guard

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      // Sidebar Searchable Brand Name Filter
      const sidebarBrandNames = activeFilters?.brand_name || [];
      const matchesSidebarName = sidebarBrandNames.length === 0 || sidebarBrandNames.includes(c.brand_name);

      // Sidebar Entity Status Filter (Active/Inactive)
      const statusFilters = activeFilters?.brand_status || [];
      let matchesStatus = true;
      if (statusFilters.length > 0) {
        const itemStatus = c.is_active == 1 ? "Active" : "Inactive";
        matchesStatus = statusFilters.includes(itemStatus);
      }

      return matchesSidebarName && matchesStatus;
    });
  }, [companies, activeFilters]);

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
      
      {/* Header Container */}
      <div className="relative flex items-center justify-center min-h-[100px] -mt-8 max-w-7xl mx-auto w-full">
        <div className="text-center">
          <h2 className={`text-2xl font-brand-heading uppercase tracking-tight font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Brands
          </h2>
          <p className={`text-[13px] font-brand-body-bold transition-colors uppercase ${secondaryTextColor}`}>
            Management of corporate branches and services.
          </p>
        </div>
        
        {/* Actions Area */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <button 
            onClick={() => fetchBrands(true)}
            disabled={loading}
            className={`p-2.5 rounded-xl border transition-all duration-200 ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700' 
                : 'bg-white border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-100'
            }`}
            title="Refresh Registry"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          <Button 
             onClick={() => navigate('/brands/new')} 
             className={`flex items-center gap-2 shadow-lg font-brand-body-bold uppercase tracking-widest text-xs transition-all duration-300
               ${isDark ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' : 'bg-slate-900 hover:bg-black shadow-slate-200'}`}
          >
             <Plus size={18} /> New Brand
          </Button>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto w-full p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} /> Error: {error}
        </div>
      )}

      {/* Table Container */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden max-w-7xl mx-auto w-full transition-all ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto w-full">
          {loading && companies.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <span className={`uppercase tracking-[0.2em] text-[10px] font-brand-heading font-bold ${secondaryTextColor}`}>Initialising Registry...</span>
            </div>
          ) : (
            <Table className="min-w-[800px] w-full text-left">
              <TableHeader className={isDark ? 'bg-slate-950/50' : 'bg-slate-50/50'}>
                <TableRow className={isDark ? 'border-slate-800' : 'border-slate-100'}>
                  <TableCell isHeader className={`px-6 py-4 text-[11px] font-black uppercase tracking-widest ${secondaryTextColor}`}>Entity Identity</TableCell>
                  <TableCell isHeader className={`px-6 py-4 text-[11px] font-black uppercase tracking-widest ${secondaryTextColor}`}>Operational Status</TableCell>
                  <TableCell isHeader className={`px-6 py-4 text-right text-[11px] font-black uppercase tracking-widest ${secondaryTextColor}`}>Details</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((company) => (
                    <TableRow 
                      key={company.id} 
                      className={`cursor-pointer transition-all group border-b last:border-none ${
                        isDark ? 'hover:bg-slate-800/50 border-slate-800' : 'hover:bg-blue-50/30 border-slate-50'
                      }`}
                      onClick={() => navigate(`/brands/${company.id}`)}
                    >
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                            isDark ? 'bg-slate-800 border-slate-700 text-slate-400 group-hover:border-blue-500/50' : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:border-blue-200'
                          }`}>
                            <Building2 size={20} className="group-hover:text-blue-500 transition-colors" />
                          </div>
                          <div>
                            <div className={`font-brand-body-bold uppercase tracking-tight text-sm ${isDark ? 'text-slate-100 group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'}`}>
                              {company.brand_name}
                            </div>
                            <div className={`text-[10px] font-black uppercase tracking-widest opacity-50 ${secondaryTextColor}`}>
                              ID: #{String(company.id).padStart(3, '0')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className={`px-3 py-1.5 text-[10px] font-black uppercase border rounded-lg inline-flex items-center gap-1.5 ${
                          company.is_active == 1 
                            ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' 
                            : 'text-slate-400 border-slate-500/20 bg-slate-500/5'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${company.is_active == 1 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          {company.is_active == 1 ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-5 text-right">
                        <div className={`flex justify-end items-center group-hover:translate-x-1 transition-all ${isDark ? 'text-slate-700 group-hover:text-blue-400' : 'text-slate-300 group-hover:text-blue-500'}`}>
                          <ChevronRight size={20} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                         <Building2 size={40} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                         <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${secondaryTextColor}`}>Registry Empty</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}