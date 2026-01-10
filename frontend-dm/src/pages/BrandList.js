import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Button from "../components/ui/button/Button";
import { 
  Plus, Search, RefreshCw, ChevronRight, 
  Building2 
} from "lucide-react";

export default function BrandsList({ onBrandClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading] = useState(false);

  const [brands] = useState([
    { id: '1', name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', industry: 'Technology', totalPosts: 124, status: 'Active' },
    { id: '2', name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', industry: 'Apparel', totalPosts: 89, status: 'Active' },
    { id: '3', name: 'Coca Cola', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg', industry: 'Beverage', totalPosts: 45, status: 'On-Hold' },
  ]);

  const filteredBrands = useMemo(() => {
    return brands.filter((b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [brands, searchTerm]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Partner Brands</h2>
          <p className="text-sm text-gray-500 font-medium">Overview of active brand partnerships.</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all">
             <RefreshCw size={20} className={loading ? "animate-spin text-blue-500" : "text-gray-500"} />
           </button>
           <Button onClick={() => {}} className="flex items-center gap-2 shadow-lg shadow-blue-500/20">
             <Plus size={18} /> New Brand
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by brand name..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[600px] w-full">
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableCell isHeader className="px-6 py-4 text-left">Brand Identity</TableCell>
                <TableCell isHeader className="px-6 py-4 text-left">Activity Level</TableCell>
                <TableCell isHeader className="px-6 py-4 text-right">Navigation</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.map((brand) => (
                <TableRow 
                  key={brand.id} 
                  className="cursor-pointer hover:bg-blue-50/30 transition-all group border-b border-gray-50 last:border-none"
                  onClick={() => onBrandClick(brand.id)}
                >
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100 p-2 shrink-0">
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{brand.name}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <Building2 size={10}/> {brand.industry}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200">
                        {brand.totalPosts} Posts
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
                        brand.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {brand.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right">
                    <div className="flex justify-end items-center text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                      <ChevronRight size={20} />
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