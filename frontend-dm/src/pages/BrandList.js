import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import Button from "../components/ui/button/Button";
import { Plus, Search, Building2, ChevronRight, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import brandService from "../api/brandService"; 

export default function InternalEntitiesList({ isDark }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme preference: slate 300 for dark text, slate 600 for light text
  const secondaryTextColor = isDark ? 'text-slate-300' : 'text-slate-600';

const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      // res IS the array because brandService already does "return response.data"
      const res = await brandService.getAllBrands(); 
      
      console.log("Brands Data Received:", res);

      // We use 'res' directly here. 
      // Before, you were doing 'const data = res.data', which resulted in 'undefined'.
      if (Array.isArray(res)) {
        setCompanies(res);
      } else {
        console.error("Payload is not an array:", res);
        setCompanies([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Failed to fetch entities");
    } finally {
      setLoading(false);
    }
};

  useEffect(() => {
    fetchBrands();
  }, []);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const name = c.brand_name || ""; 
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [companies, searchTerm]);

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div className="text-left">
          <h2 className={`text-2xl font-brand-heading uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Internal Entities
          </h2>
          <p className={`text-[13px] font-brand-body-bold ${secondaryTextColor}`}>
            Management of our corporate branches and services.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchBrands} className={`p-2.5 border rounded-xl transition-colors ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'}`}>
            <RefreshCw size={20} className={loading ? "animate-spin text-blue-500" : "text-gray-400"} />
          </button>
          <Button onClick={() => navigate('/brands/new')} className="flex items-center gap-2 uppercase font-brand-body-bold text-xs bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg">
            <Plus size={18} /> New Entity
          </Button>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto w-full p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
          <AlertCircle size={18} /> Error: {error}
        </div>
      )}

      {/* Search Bar */}
      <div className={`p-4 rounded-2xl border max-w-7xl mx-auto w-full ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Search brand name..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-brand-body-bold outline-none transition-all ${isDark ? 'bg-slate-800 text-slate-100 focus:ring-1 focus:ring-slate-700' : 'bg-gray-50 text-gray-900 focus:ring-1 focus:ring-gray-200'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden max-w-7xl mx-auto w-full ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto w-full">
          {loading && companies.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <span className={`uppercase tracking-widest text-[10px] ${secondaryTextColor}`}>Loading Registry...</span>
            </div>
          ) : (
            <Table className="w-full">
              <TableHeader className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                <TableRow className={`border-b ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                  <TableCell isHeader className={`px-6 py-4 text-[11px] font-brand-table-head uppercase tracking-[0.2em] ${secondaryTextColor}`}>Entity Name</TableCell>
                  <TableCell isHeader className={`px-6 py-4 text-[11px] font-brand-table-head uppercase tracking-[0.2em] ${secondaryTextColor}`}>Status</TableCell>
                  <TableCell isHeader className={`px-6 py-4 text-right text-[11px] font-brand-table-head uppercase tracking-[0.2em] ${secondaryTextColor}`}>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((company) => (
                    <TableRow 
                      key={company.id} 
                      className={`cursor-pointer transition-all group border-b last:border-none ${isDark ? 'hover:bg-slate-800/50 border-slate-800' : 'hover:bg-blue-50/30 border-gray-50'}`}
                      onClick={() => navigate(`/brands/${company.id}`)}
                    >
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white shadow-sm'}`}>
                            <Building2 size={20} className="text-blue-500" />
                          </div>
                          <div className={`font-brand-body-bold uppercase tracking-tight text-sm ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                            {company.brand_name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className={`px-3 py-1 text-[10px] font-brand-heading uppercase border rounded-md ${company.is_active == 1 ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>
                          {company.is_active == 1 ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-5 text-right">
                        <div className="flex justify-end items-center gap-3">
                          <span className={`text-[10px] font-brand-body-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Manage</span>
                          <ChevronRight size={18} className={isDark ? 'text-slate-700' : 'text-gray-300'} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="py-20 text-center uppercase text-[10px] tracking-[0.3em] opacity-30">
                      Registry Empty
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