import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import Button from "../components/ui/button/Button";
import { Plus, Search, Building2, ChevronRight } from "lucide-react";

export default function InternalEntitiesList({ onBrandClick, isDark }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [companies] = useState([
    { id: '1', name: 'Techcryptors Training', sector: 'Education', location: 'Mumbai' },
    { id: '2', name: 'Techcryptors IT Services', sector: 'Software', location: 'Remote' },
  ]);

  const filtered = useMemo(() => {
    return companies.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [companies, searchTerm]);

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div className="text-left">
          <h2 className={`text-2xl font-brand-heading uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Internal Entities
          </h2>
          <p className={`text-[13px] font-brand-body-bold ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>
            Management of our corporate branches and services.
          </p>
        </div>
        <Button onClick={() => {}} className="flex items-center gap-2 shadow-lg shadow-blue-500/20 uppercase font-brand-body-bold text-xs">
          <Plus size={18} /> New Entity
        </Button>
      </div>

      {/* Search Bar Container */}
      <div className={`p-4 rounded-2xl border shadow-sm transition-all max-w-7xl mx-auto w-full ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
      }`}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Search company..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-brand-body-bold outline-none transition-all ${
              isDark ? 'bg-slate-800 text-slate-100 placeholder:text-slate-500' : 'bg-gray-50 text-gray-900'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden transition-all max-w-7xl mx-auto w-full ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
      }`}>
        <div className="overflow-x-auto w-full">
          <Table className="w-full">
            <TableHeader className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
              <TableRow className={`border-b ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                <TableCell isHeader className={`px-6 py-4 text-[13px] font-brand-table-head uppercase tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>
                  Company Identity
                </TableCell>
                <TableCell isHeader className={`px-6 py-4 text-[13px] font-brand-table-head uppercase tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>
                  Sector
                </TableCell>
                <TableCell isHeader className={`px-6 py-4 text-right text-[13px] font-brand-table-head uppercase tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>
                  Details
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((company) => (
                <TableRow 
                  key={company.id} 
                  className={`cursor-pointer transition-all group border-b last:border-none ${
                    isDark ? 'hover:bg-slate-800 border-slate-800' : 'hover:bg-blue-50/30 border-gray-50'
                  }`}
                  onClick={() => onBrandClick(company.id)}
                >
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-colors ${
                        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                      }`}>
                        <Building2 size={20} className="text-blue-500" />
                      </div>
                      <div className={`font-brand-body-bold uppercase tracking-tight text-sm ${isDark ? 'text-slate-100 group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}`}>
                        {company.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-lg text-[11px] font-brand-heading uppercase border transition-colors ${
                      isDark ? 'bg-slate-800 text-brand-darkText border-slate-700' : 'bg-slate-50 text-brand-lightText border-slate-200'
                    }`}>
                      {company.sector}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <span className={`text-[12px] font-brand-body-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                         Manage
                      </span>
                      <div className={`transition-all ${isDark ? 'text-slate-700 group-hover:text-blue-400' : 'text-gray-300 group-hover:text-blue-500'}`}>
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}