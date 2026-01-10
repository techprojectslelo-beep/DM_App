import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { 
  ArrowLeft, Calendar, User, Video, Image, 
  Layout, Building2, Mail, Phone, Lock, Unlock, 
  Save, Plus, X, Link as LinkIcon, Eye, Trash2, CheckCircle, Clock
} from "lucide-react";
import Button from "../components/ui/button/Button";

export default function BrandDetail({ brandId, onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // State for viewing/editing a post
  
  const [profile, setProfile] = useState({
    name: "Apple Inc.",
    industry: "Technology Sector",
    email: "partnership@apple.com",
    phone: "+1 (555) 0123-456"
  });

  // Mock Data following your schema
  const [history, setHistory] = useState([
    { 
      id: 'p1', title: 'Summer Collection Launch', type: 'Reel', status: 'Posted', 
      link: 'https://social.com/p1', views: '12.5k', owner: 'Admin', 
      createdBy: 'Sarah J.', confirmedBy: 'Alex P.', postedBy: 'Sarah J.',
      createdDate: '2025-12-20', publishedDate: '2026-01-05'
    },
    { 
      id: 'p2', title: 'Product Deep Dive', type: 'Video', status: 'Pending', 
      link: 'https://social.com/p2', views: '0', owner: 'Admin', 
      createdBy: 'Mike R.', confirmedBy: '-', postedBy: '-',
      createdDate: '2026-01-08', publishedDate: '-'
    },
  ]);

  const postTypes = ["Reel", "Email", "Real Image", "Info", "Canva Post"];
  const statusTypes = ["Pending", "Created", "Confirmed", "Posted"];

  const getIcon = (type) => {
    if (type?.includes('Reel') || type?.includes('Video')) return <Video size={12} />;
    if (type?.includes('Canva') || type?.includes('Post') || type?.includes('Image')) return <Image size={12} />;
    return <Layout size={12} />;
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this post?")) {
        setHistory(history.filter(p => p.id !== id));
        setSelectedPost(null);
    }
  };

  const handleStatusUpdate = (postId, newStatus) => {
    setHistory(history.map(p => p.id === postId ? { ...p, status: newStatus } : p));
    if(selectedPost) setSelectedPost({...selectedPost, status: newStatus});
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button onClick={onBack} className="group flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors font-black uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return to brands
        </button>

        <div className="flex gap-2">
            {(showPostForm || selectedPost) && (
                <Button variant="ghost" onClick={() => { setShowPostForm(false); setSelectedPost(null); }}>
                    <X size={16} className="mr-2" /> Back to List
                </Button>
            )}
            <Button onClick={() => { setShowPostForm(true); setSelectedPost(null); }} variant="primary" className="rounded-2xl shadow-lg">
                <Plus size={16} className="mr-2" /> Add New Post
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: BRAND PROFILE */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <div className="bg-white border border-gray-100 rounded-[35px] p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Brand Profile</h3>
              <button onClick={() => setIsEditing(!isEditing)} className="transition-transform active:scale-90">
                {isEditing ? <Unlock size={16} className="text-green-500 animate-pulse" /> : <Lock size={16} className="text-gray-300" />}
              </button>
            </div>

            <div className="space-y-4">
              <DetailInput label="Company Name" icon={Building2} value={profile.name} disabled={!isEditing} onChange={(v) => setProfile({...profile, name: v})} />
              <DetailInput label="Industry" icon={Layout} value={profile.industry} disabled={!isEditing} onChange={(v) => setProfile({...profile, industry: v})} />
              <DetailInput label="Contact Email" icon={Mail} value={profile.email} disabled={!isEditing} onChange={(v) => setProfile({...profile, email: v})} />
              <DetailInput label="Phone Number" icon={Phone} value={profile.phone} disabled={!isEditing} onChange={(v) => setProfile({...profile, phone: v})} />
            </div>

            {isEditing && (
              <Button onClick={() => setIsEditing(false)} className="w-full py-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                <Save size={16} className="mr-2" /> Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC CONTENT */}
        <div className="lg:col-span-8">
          {showPostForm ? (
            /* CREATE POST FORM */
            <div className="bg-white border border-gray-100 rounded-[35px] p-8 shadow-sm animate-in fade-in zoom-in-95">
              <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                <Plus className="text-indigo-500" /> Create New Post
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2"><DetailInput label="Post Title" icon={Layout} placeholder="Enter title..." /></div>
                 <DropdownInput label="Post Type" icon={Video} options={postTypes} />
                 <DropdownInput label="Initial Status" icon={CheckCircle} options={statusTypes} />
                 <DetailInput label="Post Link / Design URL" icon={LinkIcon} placeholder="https://..." />
                 <DetailInput label="Publish Date" icon={Calendar} type="date" />
                 <div className="md:col-span-2 flex justify-end mt-4"><Button className="px-10">Schedule Post</Button></div>
              </div>
            </div>
          ) : selectedPost ? (
            /* DETAILED POST VIEW & EDIT */
            <div className="bg-white border border-gray-100 rounded-[35px] p-8 shadow-sm animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">{getIcon(selectedPost.type)}</div>
                        <div>
                            <h3 className="text-xl font-black uppercase leading-tight">{selectedPost.title}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Post ID: {selectedPost.id}</p>
                        </div>
                    </div>
                    <button onClick={() => handleDelete(selectedPost.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-6 md:col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                            <DropdownInput label="Change Status" icon={CheckCircle} value={selectedPost.status} options={statusTypes} onChange={(v) => handleStatusUpdate(selectedPost.id, v)} />
                            <DetailInput label="View Count" icon={Eye} value={selectedPost.views} disabled />
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Assignment Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div><p className="text-gray-400 font-bold mb-1">Created By</p><p className="font-black uppercase">{selectedPost.createdBy}</p></div>
                                <div><p className="text-gray-400 font-bold mb-1">Task Owner</p><p className="font-black uppercase">{selectedPost.owner}</p></div>
                                <div><p className="text-gray-400 font-bold mb-1">Confirmed By</p><p className="font-black uppercase">{selectedPost.confirmedBy}</p></div>
                                <div><p className="text-gray-400 font-bold mb-1">Posted By</p><p className="font-black uppercase">{selectedPost.postedBy}</p></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="p-5 border border-gray-100 rounded-3xl">
                            <p className="text-[9px] font-black text-gray-400 uppercase mb-3">Timeline</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[11px] font-bold uppercase"><Clock size={14} className="text-indigo-500" /> Created: {selectedPost.createdDate}</div>
                                <div className="flex items-center gap-2 text-[11px] font-bold uppercase"><Calendar size={14} className="text-green-500" /> Published: {selectedPost.publishedDate}</div>
                            </div>
                        </div>
                        <a href={selectedPost.link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
                            <LinkIcon size={14} /> Open Live Post
                        </a>
                    </div>
                </div>
            </div>
          ) : (
            /* HISTORY LIST */
            <div className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">Content Records</h3>
                 <div className="flex-1 h-[1px] bg-gray-100"></div>
              </div>
              <div className="rounded-[35px] border border-gray-100 bg-white overflow-hidden shadow-sm">
                <Table className="w-full text-left">
                  <TableHeader className="bg-gray-50/50">
                    <TableRow>
                      <TableCell isHeader className="px-6 py-5">Post Detail</TableCell>
                      <TableCell isHeader className="px-6 py-5">Owner</TableCell>
                      <TableCell isHeader className="px-6 py-5 text-right">Status</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((post) => (
                      <TableRow key={post.id} onClick={() => setSelectedPost(post)} className="cursor-pointer hover:bg-indigo-50/30 transition-colors group">
                        <TableCell className="px-6 py-6">
                          <div className="font-bold text-gray-900 uppercase text-xs mb-1 group-hover:text-indigo-600">{post.title}</div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">{getIcon(post.type)} {post.type}</div>
                        </TableCell>
                        <TableCell className="px-6 py-6 text-[11px] font-bold text-gray-600 uppercase italic">@{post.owner}</TableCell>
                        <TableCell className="px-6 py-6 text-right">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${
                              post.status === 'Posted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                              post.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {post.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
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

// HELPER COMPONENTS
function DetailInput({ label, icon: Icon, ...props }) {
  return (
    <div className="text-left w-full">
      <label className="text-[9px] font-black uppercase text-gray-400 block mb-1.5 ml-1 tracking-widest">{label}</label>
      <div className="relative">
        <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
        <input {...props} className="w-full rounded-2xl pl-11 pr-4 py-3 text-xs font-bold transition-all outline-none border border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 disabled:bg-gray-50 disabled:border-transparent disabled:text-gray-400" />
      </div>
    </div>
  );
}

function DropdownInput({ label, icon: Icon, options, value, onChange }) {
  return (
    <div className="text-left w-full">
      <label className="text-[9px] font-black uppercase text-gray-400 block mb-1.5 ml-1 tracking-widest">{label}</label>
      <div className="relative">
        <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 z-10" />
        <select value={value} onChange={(e) => onChange?.(e.target.value)} className="w-full rounded-2xl pl-11 pr-4 py-3 text-xs font-bold appearance-none outline-none border border-indigo-100 focus:border-indigo-500 bg-white">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
  );
}