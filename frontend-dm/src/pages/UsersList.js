import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Button from "../components/ui/button/Button";
import { 
  Plus, ChevronRight, User, ShieldCheck, Mail, CheckCircle2, XCircle, UserCircle
} from "lucide-react";
import axiosClient from "../api/axiosClient";

export default function UsersList({ isDark, activeFilters, onDataLoaded }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Design tokens using Slate 300 (Dark) and Slate 600 (Light) as requested
  const secondaryTextColor = isDark ? 'text-slate-300' : 'text-slate-600';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/users.php');
      const formattedData = response.data.map(u => ({
        ...u,
        name: u.full_name,
        status_label: u.is_active == 1 ? "Active" : "Inactive"
      }));
      setUsers(formattedData);
      
      if (onDataLoaded) onDataLoaded(formattedData);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  // FILTER & SORT LOGIC (Local execution - no 500 connection risk)
  const filteredUsers = useMemo(() => {
    const filtered = users.filter(user => {
      // 1. GLOBAL SEARCH
      const globalSearchValue = activeFilters?.global_search?.[0]?.toLowerCase() || "";
      const matchesGlobal = !globalSearchValue || [
        user.full_name,
        user.email,
        user.role,
        user.status_label
      ].some(val => String(val || "").toLowerCase().includes(globalSearchValue));

      // 2. SIDEBAR STATUS FILTER
      const matchesStatus = !activeFilters?.status_label?.length || 
                           activeFilters.status_label.includes(user.status_label);

      return matchesGlobal && matchesStatus;
    });

    // SORT: Active First, then Alphabetical A-Z
    return [...filtered].sort((a, b) => {
      if (a.is_active !== b.is_active) {
        return b.is_active - a.is_active; 
      }
      return a.full_name.localeCompare(b.full_name);
    });
  }, [users, activeFilters]);

  const getStatusConfig = (isActive) => {
    // Added 'w-fit' to constrain tag to text size
    const tagBase = "px-3 py-1.5 rounded-lg text-[10px] font-brand-heading uppercase border flex items-center gap-1.5 transition-colors w-fit";
    if (isActive == 1) {
      return {
        label: "Active",
        icon: <CheckCircle2 size={12} />,
        classes: `${tagBase} ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`
      };
    }
    return {
      label: "Inactive",
      icon: <XCircle size={12} />,
      classes: `${tagBase} ${isDark ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-400 border-slate-200'}`
    };
  };

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300`}>
      
      {/* HEADER CONTAINER - -mt-8 and Centered structure */}
      <div className="relative flex items-center justify-center min-h-[100px] -mt-8">
        <div className="text-center">
          <h2 className={`text-2xl font-brand-heading uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Staff Directory
          </h2>
          <p className={`text-[13px] font-brand-body-bold transition-colors ${secondaryTextColor}`}>
            MANAGE TEAM MEMBERS AND SYSTEM PERMISSIONS.
          </p>
        </div>
        
        {/* Top-Right Action Button */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <Button 
              onClick={() => navigate('/users/new')} 
              className={`flex items-center gap-2 shadow-lg font-brand-body-bold uppercase tracking-widest text-xs transition-all duration-300
                ${isDark ? 'bg-indigo-600/80 backdrop-blur-md border border-indigo-500/20 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              <Plus size={18} /> Add Staff Member
            </Button>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
      }`}>
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[800px] w-full text-left">
            <TableHeader className={isDark ? 'bg-slate-800/50' : 'bg-gray-50/50'}>
              <TableRow className={isDark ? 'border-slate-800' : 'border-gray-100'}>
                <TableCell isHeader className={`px-6 py-4 text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>Member Identity</TableCell>
                <TableCell isHeader className={`px-6 py-4 text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>Access Level</TableCell>
                <TableCell isHeader className={`px-6 py-4 text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>Status</TableCell>
                <TableCell isHeader className={`px-6 py-4 text-right text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>View</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-20 text-center uppercase text-[10px] tracking-widest opacity-50">
                    Loading Database...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? filteredUsers.map((user) => {
                const status = getStatusConfig(user.is_active);
                return (
                  <TableRow 
                    key={user.id} 
                    className={`cursor-pointer transition-all group border-b last:border-none ${
                      isDark ? 'hover:bg-slate-800 border-slate-800' : 'hover:bg-indigo-50/30 border-gray-50'
                    }`}
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border font-brand-heading text-xs shrink-0 ${
                          isDark ? 'bg-slate-800 border-slate-700 text-indigo-400' : 'bg-gray-50 border-gray-200 text-indigo-600'
                        }`}>
                          <User size={18} />
                        </div>
                        <div>
                          <div className={`font-brand-body-bold uppercase tracking-tight text-sm ${
                            isDark ? 'text-slate-100 group-hover:text-indigo-400' : 'text-gray-900 group-hover:text-indigo-600'
                          }`}>
                            {user.full_name}
                          </div>
                          <div className={`text-[10px] font-brand-heading uppercase tracking-widest flex items-center gap-1 ${secondaryTextColor}`}>
                            <Mail size={10}/> {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-brand-heading uppercase border flex items-center gap-1.5 transition-colors w-fit ${
                          isDark 
                          ? 'bg-slate-800 text-slate-300 border-slate-700' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          <ShieldCheck size={12} className="text-indigo-500" /> {user.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className={status.classes}>
                        {status.icon} {status.label}
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
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <UserCircle size={40} className={isDark ? 'text-slate-500' : 'text-gray-400'} />
                      <p className={`text-[10px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>No staff members found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}