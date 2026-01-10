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
  User, ShieldCheck, Mail
} from "lucide-react";

export default function UsersList({ onUserClick, onAddStaff }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [users] = useState([
    { id: '1', name: 'Sarah Jenkins', avatar: null, role: 'Admin', email: 'sarah.j@agency.com', status: 'Active', joinedDate: '2025-05-12' },
    { id: '2', name: 'Mike Ross', avatar: null, role: 'Creator', email: 'mike.r@agency.com', status: 'Active', joinedDate: '2025-08-20' },
    { id: '3', name: 'Alex Parker', avatar: null, role: 'Manager', email: 'alex.p@agency.com', status: 'On-Leave', joinedDate: '2025-01-15' },
  ]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Staff Directory</h2>
          <p className="text-sm text-gray-500 font-medium">Manage team members and system permissions.</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all">
             <RefreshCw size={20} className={loading ? "animate-spin text-blue-500" : "text-gray-500"} />
           </button>
           <Button onClick={onAddStaff} className="flex items-center gap-2 shadow-lg shadow-indigo-500/20 bg-indigo-600">
             <Plus size={18} /> Add Staff Member
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                <TableCell isHeader className="px-6 py-4 text-left">Member Identity</TableCell>
                <TableCell isHeader className="px-6 py-4 text-left">Access Level</TableCell>
                <TableCell isHeader className="px-6 py-4 text-right">Navigation</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="cursor-pointer hover:bg-indigo-50/30 transition-all group border-b border-gray-50 last:border-none"
                  onClick={() => onUserClick(user.id)}
                >
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl shadow-sm flex items-center justify-center border border-indigo-50 shrink-0">
                        <User size={20} className="text-indigo-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{user.name}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <Mail size={10}/> {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-left">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                        <ShieldCheck size={10} /> {user.role}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
                        user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right">
                    <div className="flex justify-end items-center text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all">
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