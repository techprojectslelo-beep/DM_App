import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import { ArrowLeft, Building2, Briefcase, Plus, X, Trash2, Save, Mail, Edit3, AlignLeft } from "lucide-react";
import Button from "../components/ui/button/Button";

export default function EntityServiceDetail({ brandId, onBack, isDark }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [services, setServices] = useState([
    { id: 's1', name: 'Web Development Training', description: 'Comprehensive 3-month bootcamp covering React, Node.js, and modern frontend architecture.Comprehensive 3-month bootcamp covering React, Node.js, and modern frontend architecture.' },
    { id: 's2', name: 'Custom CRM Development', description: 'Tailored enterprise solutions for sales pipeline management and automated reporting.' },
  ]);

  const [serviceForm, setServiceForm] = useState({ name: "", description: "" });

  const handleSaveService = () => {
    if (editingId) {
      setServices(services.map(s => s.id === editingId ? { ...serviceForm, id: editingId } : s));
    } else {
      setServices([...services, { ...serviceForm, id: Date.now().toString() }]);
    }
    resetForm();
  };

  const handleEdit = (service) => {
    setServiceForm({ name: service.name, description: service.description });
    setEditingId(service.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setServiceForm({ name: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className={`p-4 md:p-6 space-y-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
      
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <button 
          onClick={onBack} 
          className={`group flex items-center gap-2 transition-colors font-brand-heading uppercase text-[14px] tracking-widest ${
            isDark ? 'text-brand-darkText hover:text-indigo-400' : 'text-brand-lightText hover:text-indigo-600'
          }`}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return to Entities
        </button>

        <Button 
          onClick={() => (showForm ? resetForm() : setShowForm(true))} 
          variant="primary" 
          className="rounded-2xl shadow-lg uppercase font-brand-body-bold text-xs px-6 py-3"
        >
          {showForm ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />} 
          {showForm ? "Cancel" : "Add New Service"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
        
        {/* LEFT COLUMN: ENTITY INFO */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <div className={`border rounded-2xl p-6 shadow-sm space-y-6 transition-all ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-[12px] font-brand-heading uppercase tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>
              Entity Profile
            </h3>
            
            <div className="space-y-4">
              <DetailInput isDark={isDark} label="Entity Name" icon={Building2} value="Techcryptors" readOnly />
              <DetailInput isDark={isDark} label="Primary Contact" icon={Mail} value="ops@techcryptors.com" readOnly />
              <Button className="w-full py-4 rounded-2xl mt-4 font-brand-body-bold"><Save size={16} className="mr-2"/> Update Profile</Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SERVICES */}
        <div className="lg:col-span-8 space-y-6">
          {showForm ? (
            <div className={`border rounded-2xl p-8 shadow-sm animate-in fade-in zoom-in-95 ${
              isDark ? 'bg-slate-900 border-slate-800 text-brand-darkText' : 'bg-white border-gray-100'
            }`}>
              <h3 className="text-lg font-brand-heading uppercase mb-6 flex items-center gap-2">
                <Briefcase className="text-indigo-500" /> {editingId ? "Edit Service" : "Register Service"}
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="w-full">
                  <DetailInput 
                    isDark={isDark} label="Service Name" icon={Briefcase} 
                    value={serviceForm.name} onChange={(v) => setServiceForm({...serviceForm, name: v})}
                    placeholder="e.g. Corporate Training"
                  />
                </div>
                <div className="w-full">
                    <label className={`text-[12px] font-brand-heading uppercase block mb-1.5 ml-1 tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>Service Description</label>
                    <div className="relative">
                        <AlignLeft size={14} className="absolute left-4 top-4 text-indigo-500" />
                        <textarea 
                            value={serviceForm.description}
                            onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                            className={`w-full rounded-2xl pl-11 pr-4 py-3 text-[12px] font-brand-body-bold outline-none border min-h-[120px] transition-all ${
                                isDark ? 'bg-slate-950 border-slate-800 text-brand-darkText focus:border-indigo-500' : 'bg-white border-indigo-100 text-gray-900 focus:border-indigo-500'
                            }`} 
                            placeholder="Provide a detailed description of what this service entails..." 
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveService} className="px-10 py-4 rounded-2xl font-brand-body-bold">
                    {editingId ? "Update Service" : "Save Service"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className={`text-2xl font-brand-heading uppercase tracking-tight px-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Offered Services</h2>

              <div className={`rounded-2xl border overflow-hidden shadow-sm transition-all ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
              }`}>
                <Table className="w-full text-left">
                  <TableHeader className={isDark ? 'bg-slate-800/50' : 'bg-gray-50/50'}>
                    <TableRow className={isDark ? 'border-slate-800' : 'border-slate-200'}>
                      <TableCell isHeader className={`px-6 py-5 text-[13px] font-brand-table-head uppercase tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>Service Details</TableCell>
                      <TableCell isHeader className={`px-6 py-5 text-right text-[13px] font-brand-table-head uppercase tracking-widest ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>Actions</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.length > 0 ? (
                      services.map((s) => (
                        <TableRow key={s.id} className={`group transition-colors border-b last:border-none ${
                          isDark ? 'hover:bg-slate-800 border-slate-800' : 'hover:bg-indigo-50/30 border-gray-50'
                        }`}>
                          <TableCell className="px-6 py-6">
                            <div className={`font-brand-body-bold uppercase text-sm ${isDark ? 'text-slate-100 group-hover:text-indigo-400' : 'text-gray-900 group-hover:text-indigo-600'}`}>{s.name}</div>
                            {s.description && (
                              <p className={`text-[12px] mt-2 line-clamp-3 max-w-2xl font-brand-body leading-relaxed ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>
                                  {s.description}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-6 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <button onClick={() => handleEdit(s)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`}>
                                  <Edit3 size={18} />
                              </button>
                              <button onClick={() => setServices(services.filter(item => item.id !== s.id))} className="text-red-400 hover:text-red-600 transition-all active:scale-90 p-2">
                                  <Trash2 size={18} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="py-20 text-center">
                          <p className={`text-[12px] font-brand-heading uppercase tracking-widest opacity-40 ${isDark ? 'text-brand-darkText' : 'text-brand-lightText'}`}>No services registered</p>
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

// SHARED COMPONENT
function DetailInput({ label, icon: Icon, isDark, onChange, ...props }) {
  return (
    <div className="text-left w-full">
      <label className={`text-[12px] font-brand-heading uppercase block mb-1.5 ml-1 tracking-widest transition-colors ${
        isDark ? 'text-brand-darkText' : 'text-brand-lightText'
      }`}>
        {label}
      </label>
      <div className="relative">
        <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
        <input 
          {...props} 
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full rounded-2xl pl-11 pr-4 py-3 text-[12px] font-brand-body-bold transition-all outline-none border ${
            isDark 
            ? 'bg-slate-950 border-slate-800 text-brand-darkText focus:border-indigo-500 disabled:bg-slate-900/50 disabled:text-slate-500' 
            : 'bg-white border-indigo-100 text-gray-900 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-400'
          }`} 
        />
      </div>
    </div>
  );
}