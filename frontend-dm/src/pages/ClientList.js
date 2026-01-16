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
  Plus, Building2, LockKeyhole, CheckCircle2, 
  DollarSign, ChevronRight, UserCircle, Briefcase, Activity, GraduationCap, ArrowUp
} from "lucide-react";
import enquiryService from "../api/enquiryService";

export default function ClientList({ isDark, activeFilters, onDataLoaded }) {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Use slate 300 for dark theme and slate 600 for light theme as requested
  const secondaryTextColor = isDark ? 'text-slate-300' : 'text-slate-600';

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const data = await enquiryService.getAllEnquiries();
        setClients(data);
        // Sync with App.js for Sidebar visibility
        if (onDataLoaded) onDataLoaded(data);
      } catch (error) {
        console.error("Failed to fetch enquiries:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    fetchEnquiries();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onDataLoaded]);

  // FILTER LOGIC
// FILTER LOGIC
// FILTER LOGIC
  const filteredData = useMemo(() => {
    return clients.filter(item => {
      // 1. UNIVERSAL GLOBAL SEARCH
      // This looks through EVERY field you listed: id, name, email, grade, location, etc.
      const globalSearchValue = activeFilters?.global_search?.[0]?.toLowerCase() || "";
      
      const matchesGlobal = !globalSearchValue || [
        item.id,
        item.enquirer_name,
        item.enq_email,
        item.enq_number,
        item.enquirer_company,
        item.college_name,
        item.course_taken,
        item.passing_grade,
        item.job_title,
        item.job_company_location,
        item.job_field,
        item.enquiry_status,
        item.budget_range,
        item.brand_name, // Search by the name instead of just ID for better UX
        item.service_name
      ].some(val => 
        String(val || "").toLowerCase().includes(globalSearchValue)
      );

      // 2. CATEGORICAL FILTERS (Sidebar Checkboxes)
      // These remain specific so users can "Drill Down" after searching
      const matchesBrand = !activeFilters?.brand_name?.length || 
                           activeFilters.brand_name.includes(item.brand_name);
      
      const matchesService = !activeFilters?.service_name?.length || 
                             activeFilters.service_name.includes(item.service_name);
      
      const matchesStatus = !activeFilters?.enquiry_status?.length || 
                            activeFilters.enquiry_status.includes(item.enquiry_status);
      
      const matchesBudget = !activeFilters?.budget_range?.length || 
                            activeFilters.budget_range.includes(item.budget_range);

      return matchesGlobal && matchesBrand && matchesService && matchesStatus && matchesBudget;
    });
  }, [clients, activeFilters]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusConfig = (status) => {
    const tagBase = "px-3 py-1.5 rounded-lg text-[10px] font-brand-heading uppercase border flex items-center gap-1.5 transition-colors";
    switch (status?.toLowerCase()) {
      case 'closed':
        return { label: 'Closed', icon: <LockKeyhole size={12} />, classes: `${tagBase} ${isDark ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-400 border-slate-200'}` };
      case 'completed':
        return { label: 'Completed', icon: <CheckCircle2 size={12} />, classes: `${tagBase} ${isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'}` };
      case 'inprogress':
        return { label: 'In Progress', icon: <Activity size={12} />, classes: `${tagBase} ${isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'}` };
      case 'advancedpayment':
        return { label: 'Adv. Payment', icon: <DollarSign size={12} />, classes: `${tagBase} ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}` };
      case 'justconnected':
        return { label: 'Just Connected', icon: null, classes: `${tagBase} ${isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}` };
      default:
        return { label: status, icon: null, classes: tagBase };
    }
  };

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
      
      {/* Header Container */}
      <div className="relative flex items-center justify-center min-h-[100px]">
        {/* Centered Title */}
        <div className="text-center">
          <h2 className={`text-2xl font-brand-heading uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Client Enquiry
          </h2>
          <p className={`text-[13px] font-brand-body-bold transition-colors ${secondaryTextColor}`}>
            MANAGE INCOMING REQUESTS AND ACTIVE PIPELINE.
          </p>
        </div>
        
        {/* Sticky Button Trigger Area */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-full flex items-center">
           <div className="sticky top-6 z-40">
              <Button 
                onClick={() => navigate('/enquiry/new')} 
                className={`flex items-center gap-2 shadow-lg font-brand-body-bold uppercase tracking-widest text-xs transition-all duration-300
                  ${isDark ? 'bg-blue-600/80 backdrop-blur-md border border-blue-500/20 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <Plus size={18} /> New Client
              </Button>
           </div>
        </div>
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
                <TableCell isHeader className={`px-6 py-4 text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>Brand & Service</TableCell>
                <TableCell isHeader className={`px-6 py-4 text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>Enquiry Status</TableCell>
                <TableCell isHeader className={`px-6 py-4 text-right text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>View</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow><TableCell colSpan={4} className="py-20 text-center uppercase text-[10px] tracking-widest opacity-50">Loading Enquiries...</TableCell></TableRow>
              ) : filteredData.length > 0 ? filteredData.map((client) => {
                const statusConfig = getStatusConfig(client.enquiry_status);
                return (
                  <TableRow 
                    key={client.id} 
                    className={`cursor-pointer transition-all group border-b last:border-none ${
                      isDark ? 'hover:bg-slate-800 border-slate-800' : 'hover:bg-blue-50/30 border-gray-50'
                    }`}
                    onClick={() => navigate(`/enquiry/${client.id}`)}
                  >
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border font-brand-heading text-xs shrink-0 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                          {client.enquirer_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className={`font-brand-body-bold uppercase tracking-tight text-sm ${isDark ? 'text-slate-100 group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}`}>
                            {client.enquirer_name}
                          </div>
                          <div className={`flex items-center gap-1.5 text-[10px] font-brand-heading uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                            {client.enquirer_company ? (
                              <><Building2 size={10}/> {client.enquirer_company}</>
                            ) : client.college_name ? (
                              <><GraduationCap size={10}/> {client.college_name}</>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                        <div className={`text-[11px] font-brand-heading uppercase tracking-widest ${secondaryTextColor} opacity-60 mb-0.5`}>
                           {client.brand_name}
                        </div>
                        <div className={`text-[12px] flex items-center gap-1.5 font-brand-body-bold uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                           <Briefcase size={13} className="text-blue-500 opacity-70"/> {client.service_name}
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
                    <TableCell colSpan={4} className="py-20 text-center">
                       <div className="flex flex-col items-center gap-2 opacity-40">
                          <UserCircle size={40} className={isDark ? 'text-slate-500' : 'text-gray-400'} />
                          <p className={`text-[10px] font-brand-heading uppercase tracking-widest ${secondaryTextColor}`}>No records matching filters</p>
                       </div>
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-3 rounded-full shadow-2xl z-50 transition-all animate-in fade-in slide-in-from-bottom-5 ${
            isDark ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
          }`}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}