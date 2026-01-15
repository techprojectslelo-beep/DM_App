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
  Plus, Search, Building2, LockKeyhole, CheckCircle2, 
  DollarSign, ChevronRight, UserCircle, Briefcase, Activity 
} from "lucide-react";

export default function ClientList({ onClientClick, isDark }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mainFilter, setMainFilter] = useState("all");
  const [ongoingType, setOngoingType] = useState("all");

  // Your saved slate tokens
  const secondaryTextColor = isDark ? 'text-slate-300' : 'text-slate-600';

  // Mock Data
  const [clients] = useState([
    { 
      id: '1', 
      name: 'Alex Thompson', 
      clientCompany: 'TechFlow Systems', 
      assignedPartner: 'Main Agency',   
      service: 'Custom CRM Development', 
      status: 'InProgress', 
      avatar: 'https://i.pravatar.cc/150?u=1' 
    },
    { 
      id: '2', 
      name: 'Sarah Miller', 
      clientCompany: 'Creative Co', 
      assignedPartner: 'Design Studio', 
      service: 'Mobile App UI/UX', 
      status: 'AdvancedPayment', 
      avatar: 'https://i.pravatar.cc/150?u=2' 
    },
    { 
      id: '3', 
      name: 'James Wilson', 
      clientCompany: 'Wilson Group', 
      assignedPartner: 'Main Agency', 
      service: 'Cloud Migration', 
      status: 'Closed', 
      avatar: 'https://i.pravatar.cc/150?u=3' 
    },
    { 
      id: '4', 
      name: 'Elena Kostic', 
      clientCompany: 'Nova Labs', 
      assignedPartner: 'Design Studio', 
      service: 'SEO Strategy', 
      status: 'JustConnected', 
      avatar: 'https://i.pravatar.cc/150?u=4' 
    },
    { 
      id: '5', 
      name: 'Marcus Chen', 
      clientCompany: 'Zenith Retail', 
      assignedPartner: 'Main Agency', 
      service: 'Shopify Integration', 
      status: 'Completed', 
      avatar: 'https://i.pravatar.cc/150?u=5' 
    },
  ]);

  const getStatusConfig = (status) => {
    // Standardizing the tag classes to match the UsersList "Access Level" style
    const tagBase = "px-3 py-1.5 rounded-lg text-[10px] font-brand-heading uppercase border flex items-center gap-1.5 transition-colors";
    
    switch (status) {
      case 'Closed':
        return {
          label: 'Closed',
          icon: <LockKeyhole size={12} />,
          classes: `${tagBase} ${isDark ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-400 border-slate-200'}`
        };
      case 'Completed':
        return {
          label: 'Completed',
          icon: <CheckCircle2 size={12} />,
          classes: `${tagBase} ${isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'}`
        };
      case 'InProgress':
        return {
          label: 'In Progress',
          icon: <Activity size={12} />,
          classes: `${tagBase} ${isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`
        };
      case 'AdvancedPayment':
        return {
          label: 'Adv. Payment',
          icon: <DollarSign size={12} />,
          classes: `${tagBase} ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`
        };
      case 'JustConnected':
        return {
          label: 'Just Connected',
          icon: null,
          classes: `${tagBase} ${isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`
        };
      default:
        return { label: status, icon: null, classes: tagBase };
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        c.name.toLowerCase().includes(searchLower) || 
        c.clientCompany.toLowerCase().includes(searchLower) ||
        c.assignedPartner.toLowerCase().includes(searchLower) ||
        c.service.toLowerCase().includes(searchLower);
      
      const isOngoing = !['Closed', 'Completed'].includes(c.status);
      const matchesMain = mainFilter === "all" || 
                          (mainFilter === "ongoing" && isOngoing) || 
                          (mainFilter === "closed" && c.status === "Closed") ||
                          (mainFilter === "completed" && c.status === "Completed");
      
      const matchesOngoingType = ongoingType === "all" || c.status === ongoingType;

      return matchesSearch && matchesMain && (mainFilter !== "ongoing" || matchesOngoingType);
    });
  }, [clients, searchTerm, mainFilter, ongoingType]);

  const selectClass = `w-full px-4 py-2.5 border-none rounded-xl text-xs font-brand-body-bold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all uppercase tracking-wider ${
    isDark ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'
  }`;

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h2 className={`text-2xl font-brand-heading uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Client Enquiry
          </h2>
          <p className={`text-[13px] font-brand-body-bold transition-colors ${secondaryTextColor}`}>
            MANAGE INCOMING REQUESTS AND ACTIVE CLIENT PIPELINE.
          </p>
        </div>
        
        <Button onClick={() => onClientClick('new')} className="flex items-center gap-2 shadow-lg shadow-blue-500/20 bg-blue-600 border-none font-brand-body-bold uppercase tracking-widest text-xs">
          <Plus size={18} /> New Client
        </Button>
      </div>

      {/* Filter Bar */}
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl border shadow-sm transition-all ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
      }`}>
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by client, company or service..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-brand-body outline-none transition-all ${
              isDark ? 'bg-slate-800 border-none text-slate-100 placeholder:text-slate-500' : 'bg-gray-50 border-none text-gray-900'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select className={selectClass} value={mainFilter} onChange={(e) => { setMainFilter(e.target.value); setOngoingType("all"); }}>
          <option value="all">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="closed">Closed</option>
        </select>

        <select 
          className={`${selectClass} ${mainFilter !== 'ongoing' ? 'opacity-30 pointer-events-none' : ''}`}
          value={ongoingType} 
          onChange={(e) => setOngoingType(e.target.value)}
          disabled={mainFilter !== 'ongoing'}
        >
          <option value="all">All Types</option>
          <option value="InProgress">In Progress</option>
          <option value="AdvancedPayment">Adv. Payment</option>
          <option value="JustConnected">Just Connected</option>
        </select>
      </div>

      {/* Table Container */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
      }`}>
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[1000px] w-full text-left">
            <TableHeader className={isDark ? 'bg-slate-800/50' : 'bg-gray-50/50'}>
              <TableRow className={isDark ? 'border-slate-800' : 'border-gray-100'}>
                <TableCell isHeader className={`px-6 py-4 text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>Client Identity</TableCell>
                <TableCell isHeader className={`px-6 py-4 text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>Assigned Brand</TableCell>
                <TableCell isHeader className={`px-6 py-4 text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>Project Service</TableCell>
                <TableCell isHeader className={`px-6 py-4 text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>Enquiry Status</TableCell>
                <TableCell isHeader className={`px-6 py-4 text-right text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>Navigation</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? filteredClients.map((client) => {
                const statusConfig = getStatusConfig(client.status);
                return (
                  <TableRow 
                    key={client.id} 
                    className={`cursor-pointer transition-all group border-b last:border-none ${
                      isDark ? 'hover:bg-slate-800 border-slate-800' : 'hover:bg-blue-50/30 border-gray-50'
                    }`}
                    onClick={() => onClientClick(client.id)}
                  >
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl border p-0.5 shrink-0 shadow-sm transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                          <img src={client.avatar} alt={client.name} className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div>
                          <div className={`font-brand-body-bold uppercase tracking-tight text-sm ${isDark ? 'text-slate-100 group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}`}>
                            {client.name}
                          </div>
                          <div className={`text-[10px] font-brand-heading uppercase tracking-widest text-indigo-500`}>
                            {client.clientCompany}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                        <div className={`flex items-center gap-2 text-[12px] font-brand-body-bold uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                           <Building2 size={14} className="text-blue-500 opacity-70"/> {client.assignedPartner}
                        </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <div className={`text-[11px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-brand-body-bold uppercase tracking-tight ${isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-gray-100 text-gray-700'}`}>
                        <Briefcase size={12} className="opacity-50" />
                        {client.service}
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                        <div className={statusConfig.classes}>
                          {statusConfig.icon} {statusConfig.label}
                        </div>
                    </TableCell>

                    <TableCell className="px-6 py-5 text-right">
                      <div className={`flex justify-end items-center group-hover:translate-x-1 transition-all ${isDark ? 'text-slate-700 group-hover:text-blue-400' : 'text-gray-300 group-hover:text-blue-500'}`}>
                        <ChevronRight size={20} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                       <div className="flex flex-col items-center gap-2 opacity-40">
                          <UserCircle size={40} className={isDark ? 'text-slate-500' : 'text-gray-400'} />
                          <p className={`text-[10px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>No client records match your search</p>
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