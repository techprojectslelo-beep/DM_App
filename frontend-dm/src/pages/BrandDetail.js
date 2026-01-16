import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import { ArrowLeft, Building2, Briefcase, Plus, X, Trash2, Save, Mail, Edit3, Loader2, Globe } from "lucide-react";
import Button from "../components/ui/button/Button";
import brandService from "../api/brandService";

export default function EntityServiceDetail({ isDark }) {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Guard to prevent double-firing on mount
  const hasFetched = useRef(false);

  // Text Colors: Slate 300 for dark, Slate 600 for light
  const secondaryText = isDark ? 'text-slate-300' : 'text-slate-600';

  const [brandForm, setBrandForm] = useState({
    brand_name: "",
    email: "", 
    website: "" 
  });

  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({ 
    service_name: ""
  });

  const fetchBrandData = async () => {
    try {
      const res = await brandService.getBrandDetail(id);
      if (res) {
        setBrandForm({
          brand_name: res.brand_name || "",
          email: res.email || "",
          website: res.website || ""
        });
        setServices(res.services || []);
      }
    } catch (err) {
      console.error("Error loading brand", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if not a "new" brand and hasn't fetched yet
    if (!isNew && !hasFetched.current) {
      fetchBrandData();
      hasFetched.current = true;
    }
  }, [id, isNew]);

  const handleSaveProfile = async () => {
    try {
      if (isNew) {
        const res = await brandService.createBrand(brandForm);
        if (res && res.id) {
          alert("Brand created successfully");
          navigate(`/brands/${res.id}`, { replace: true });
        }
      } else {
        await brandService.updateBrand(id, brandForm);
        alert("Profile updated successfully");
      }
    } catch (err) {
      console.error("Save Profile Error:", err);
      alert("Error saving profile.");
    }
  };

  const handleSaveService = async () => {
    try {
      if (editingId) {
        alert("Update service logic pending backend update");
      } else {
        await brandService.addService(id, {
            service_name: serviceForm.service_name
        });
      }
      // Re-fetch data after adding/updating service
      fetchBrandData(); 
      resetForm();
    } catch (err) {
      alert("Error saving service");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await brandService.deleteService(serviceId);
      fetchBrandData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleEdit = (service) => {
    setServiceForm({ service_name: service.service_name });
    setEditingId(service.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setServiceForm({ service_name: "" });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return (
    <div className={`h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
      <Loader2 className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  return (
    <div className={`p-4 md:p-6 space-y-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
      
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <button 
          onClick={() => navigate('/brands')} 
          className={`group flex items-center gap-2 transition-colors font-brand-heading uppercase text-[14px] tracking-widest font-bold ${
            isDark ? 'text-slate-300 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'
          }`}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return to Entities
        </button>

        {!isNew && (
          <Button 
            onClick={() => (showForm ? resetForm() : setShowForm(true))} 
            className="rounded-2xl shadow-lg uppercase font-brand-body-bold text-xs px-6 py-3"
          >
            {showForm ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />} 
            {showForm ? "Cancel" : "Add New Service"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
        
        {/* LEFT COLUMN: ENTITY INFO */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <div className={`border rounded-[32px] p-8 shadow-sm space-y-6 transition-all ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-[12px] font-brand-heading font-bold uppercase tracking-widest ${secondaryText}`}>
              Entity Profile
            </h3>
            
            <div className="space-y-4">
              <DetailInput 
                isDark={isDark} label="Entity Name" icon={Building2} 
                value={brandForm.brand_name} onChange={(v) => setBrandForm({...brandForm, brand_name: v})}
              />
              <DetailInput 
                isDark={isDark} label="Primary Contact" icon={Mail} 
                value={brandForm.email} onChange={(v) => setBrandForm({...brandForm, email: v})}
              />
               <DetailInput 
                isDark={isDark} label="Website URL" icon={Globe} 
                value={brandForm.website} onChange={(v) => setBrandForm({...brandForm, website: v})}
                placeholder="https://..."
              />
              <Button onClick={handleSaveProfile} className="w-full py-4 rounded-2xl mt-4 font-brand-body-bold uppercase tracking-widest text-[11px]">
                <Save size={16} className="mr-2"/> {isNew ? "Create Brand" : "Update Profile"}
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SERVICES */}
        <div className="lg:col-span-8 space-y-6">
          {isNew ? (
            <div className={`border rounded-[32px] p-20 text-center border-dashed ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
               <Building2 className="mx-auto text-slate-500 mb-4 opacity-20" size={48} />
               <p className={`font-brand-heading uppercase tracking-[0.2em] text-xs font-bold ${secondaryText}`}>
                 Save the brand profile first to manage services
               </p>
            </div>
          ) : showForm ? (
            <div className={`border rounded-[32px] p-8 shadow-sm animate-in fade-in zoom-in-95 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-gray-100'
            }`}>
              <h3 className={`text-lg font-brand-heading uppercase font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                <Briefcase className="text-indigo-500" /> {editingId ? "Edit Service" : "Register Service"}
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <DetailInput 
                  isDark={isDark} label="Service Name" icon={Briefcase} 
                  value={serviceForm.service_name} onChange={(v) => setServiceForm({...serviceForm, service_name: v})}
                  placeholder="e.g. Corporate Training"
                />
                <div className="flex justify-end">
                  <Button onClick={handleSaveService} className="px-10 py-4 rounded-2xl font-brand-body-bold uppercase text-xs tracking-widest">
                    {editingId ? "Update Service" : "Save Service"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className={`text-2xl font-brand-heading uppercase font-bold tracking-tight px-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Offered Services</h2>

              <div className={`rounded-[32px] border overflow-hidden shadow-sm transition-all ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
              }`}>
                <Table className="w-full text-left">
                  <TableHeader className={isDark ? 'bg-slate-800/50' : 'bg-gray-50/50'}>
                    <TableRow className={isDark ? 'border-slate-800' : 'border-slate-200'}>
                      <TableCell isHeader className={`px-6 py-5 text-[11px] font-bold uppercase tracking-widest ${secondaryText}`}>Service Name</TableCell>
                      <TableCell isHeader className={`px-6 py-5 text-right text-[11px] font-bold uppercase tracking-widest ${secondaryText}`}>Actions</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.length > 0 ? (
                      services.map((s) => (
                        <TableRow key={s.id} className={`group transition-colors border-b last:border-none ${
                          isDark ? 'hover:bg-slate-800 border-slate-800' : 'hover:bg-indigo-50/30 border-gray-50'
                        }`}>
                          <TableCell className="px-6 py-6">
                            <div className={`font-brand-body-bold uppercase text-sm ${isDark ? 'text-slate-100 group-hover:text-indigo-400' : 'text-gray-900 group-hover:text-indigo-600'}`}>{s.service_name}</div>
                          </TableCell>
                          <TableCell className="px-6 py-6 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <button onClick={() => handleEdit(s)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`}>
                                  <Edit3 size={18} />
                              </button>
                              <button onClick={() => handleDeleteService(s.id)} className="text-red-400 hover:text-red-600 transition-all active:scale-90 p-2">
                                  <Trash2 size={18} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="py-20 text-center">
                          <p className={`text-[10px] font-brand-heading uppercase font-bold tracking-[0.3em] opacity-40 ${secondaryText}`}>No services registered</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailInput({ label, icon: Icon, isDark, onChange, ...props }) {
  const secondaryText = isDark ? 'text-slate-300' : 'text-slate-600';
  return (
    <div className="text-left w-full">
      <label className={`text-[11px] font-brand-heading font-bold uppercase block mb-1.5 ml-1 tracking-widest transition-colors ${secondaryText}`}>
        {label}
      </label>
      <div className="relative">
        <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
        <input 
          {...props} 
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full rounded-2xl pl-11 pr-4 py-3 text-[12px] font-brand-body-bold transition-all outline-none border ${
            isDark 
            ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500 disabled:bg-slate-900/50' 
            : 'bg-slate-50 border-slate-200 text-gray-900 focus:border-indigo-500 disabled:bg-gray-50'
          }`} 
        />
      </div>
    </div>
  );
}