import React, { useState, useMemo, useEffect } from "react"; // Added useEffect
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
  User, ShieldCheck, Mail
} from "lucide-react";
import axiosClient from "../api/axiosClient"; // Import our axios client

export default function UsersList({ onUserClick, onAddStaff, isDark }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // Now starts empty

  // 1. Fetch data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/users.php');
      // Note: Map backend 'full_name' to your 'name' field if they differ
      const formattedData = response.data.map(u => ({
        id: u.id,
        name: u.full_name, // PHP returns full_name
        email: u.email,
        role: u.role,
        is_active: u.is_active
      }));
      setUsers(formattedData);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const secondaryTextColor = isDark ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h2 className={`text-2xl font-brand-heading uppercase tracking-tight transition-colors ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Staff Directory
          </h2>
          <p className={`text-[13px] font-brand-body-bold transition-colors ${secondaryTextColor}`}>
            Manage team members and system permissions.
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={fetchUsers} // Manually refresh
             className={`p-2.5 border rounded-xl transition-all ${
               isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-gray-200 hover:bg-gray-100'
             }`}
           >
             <RefreshCw size={20} className={loading ? "animate-spin text-indigo-500" : (isDark ? "text-slate-500" : "text-gray-400")} />
           </button>
           <Button onClick={onAddStaff} className="flex items-center gap-2 shadow-lg shadow-indigo-500/20 bg-indigo-600 border-none font-brand-body-bold uppercase tracking-widest text-xs">
             <Plus size={18} /> Add Staff Member
           </Button>
        </div>
      </div>

      {/* SEARCH BAR CONTAINER */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl border shadow-sm transition-all ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
      }`}>
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-brand-body outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              isDark ? 'bg-slate-800 border-none text-slate-100 placeholder:text-slate-500' : 'bg-gray-50 border-none text-gray-900'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
      }`}>
        <div className="overflow-x-auto w-full">
          {loading && users.length === 0 ? (
            <div className="p-20 text-center uppercase tracking-widest font-black text-xs text-indigo-500">Loading Database...</div>
          ) : (
            <Table className="min-w-[600px] w-full text-left">
              <TableHeader className={isDark ? 'bg-slate-800/50' : 'bg-gray-50/50'}>
                <TableRow className={isDark ? 'border-slate-800' : 'border-gray-100'}>
                  <TableCell isHeader className={`px-6 py-4 text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>Member Identity</TableCell>
                  <TableCell isHeader className={`px-6 py-4 text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>Access Level</TableCell>
                  <TableCell isHeader className={`px-6 py-4 text-right text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>Navigation</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className={`cursor-pointer transition-all group border-b last:border-none ${
                      isDark ? 'hover:bg-slate-800 border-slate-800' : 'hover:bg-indigo-50/30 border-gray-50'
                    }`}
                    onClick={() => onUserClick(user.id)}
                  >
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl shadow-sm flex items-center justify-center border shrink-0 transition-colors ${
                          isDark ? 'bg-slate-800 border-slate-700' : 'bg-indigo-100 border-indigo-50'
                        }`}>
                          <User size={20} className={isDark ? "text-indigo-400" : "text-indigo-600"} />
                        </div>
                        <div className="text-left">
                          <div className={`font-brand-body-bold transition-colors uppercase tracking-tight text-sm ${
                            isDark ? 'text-slate-100 group-hover:text-indigo-400' : 'text-gray-900 group-hover:text-indigo-600'
                          }`}>{user.name}</div>
                          <div className={`text-[10px] font-brand-heading uppercase tracking-widest flex items-center gap-1 ${secondaryTextColor}`}>
                            <Mail size={10}/> {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-brand-heading uppercase border flex items-center gap-1.5 transition-colors ${
                          isDark 
                          ? 'bg-slate-800 text-slate-300 border-slate-700' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          <ShieldCheck size={12} className="text-indigo-500" /> {user.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-right">
                      <div className={`flex justify-end items-center group-hover:translate-x-1 transition-all ${
                        isDark ? 'text-slate-700 group-hover:text-indigo-400' : 'text-gray-300 group-hover:text-indigo-500'
                      }`}>
                        <ChevronRight size={20} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}