import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Check, X, Search, FileText, 
  Upload, Download, ShieldCheck, Mail, MapPin, Eye, ExternalLink, Users, Settings,
  Calendar, Award, BookOpen, GraduationCap, Flame, Presentation, Target, Trophy,
  Activity, Anchor, Bell, Book, Briefcase, ChevronRight, Clock, Compass, Cpu, Database, 
  Gift, Globe, Heart, Home, Image, Info, Lightbulb, Link, Map, MessageSquare, Music, 
  Rocket, Send, Shield, Sparkles, Star, TrendingUp, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import api, { BASE_URL } from '../services/api';
import GlassCard from '../components/GlassCard';

// ==========================================
// 1. MANAGE MEMBERS
// ==========================================
export const AdminMembers = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editMember, setEditMember] = useState(null);
  const [types, setTypes] = useState([
    { id: 1, name: 'Executive Member', fee: 5000.00, description: 'Access to governance meetings and executive board voting privileges.' },
    { id: 2, name: 'Life Member', fee: 10000.00, description: 'Lifetime association membership status and all general meeting benefits.' },
    { id: 3, name: 'Industry Member', fee: 15000.00, description: 'Tailored for corporate representatives and corporate collaborations.' },
    { id: 4, name: 'Academic Member', fee: 2000.00, description: 'Specially designed for educators, professors, and academic leaders.' },
    { id: 5, name: 'Student Member', fee: 500.00, description: 'For students seeking career mentorship and management networking.' }
  ]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    membership_type_id: ''
  });

  useEffect(() => {
    fetchMembers();
    fetchTypes();
  }, [search, statusFilter, page]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/memberships?search=${search}&status=${statusFilter}&page=${page}&limit=10`);
      setMemberships(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await api.get('/memberships/types');
      if (res.data && res.data.length > 0) {
        setTypes(res.data);
      } else {
        throw new Error('No membership types returned');
      }
    } catch (err) {
      console.warn('Could not fetch membership types, using fallback.', err);
      setTypes([
        { id: 1, name: 'Executive Member', fee: 5000.00, description: 'Access to governance meetings and executive board voting privileges.' },
        { id: 2, name: 'Life Member', fee: 10000.00, description: 'Lifetime association membership status and all general meeting benefits.' },
        { id: 3, name: 'Industry Member', fee: 15000.00, description: 'Tailored for corporate representatives and corporate collaborations.' },
        { id: 4, name: 'Academic Member', fee: 2000.00, description: 'Specially designed for educators, professors, and academic leaders.' },
        { id: 5, name: 'Student Member', fee: 500.00, description: 'For students seeking career mentorship and management networking.' }
      ]);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    if (!window.confirm(`Are you sure you want to set this application to ${status}?`)) return;
    try {
      await api.patch(`/memberships/${id}/status`, { status });
      alert(`Membership status updated to ${status}`);
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this membership record?')) return;
    try {
      await api.delete(`/memberships/${id}`);
      fetchMembers();
    } catch (err) {
      alert('Error deleting membership');
    }
  };

  const handleOpenEdit = (member) => {
    setEditMember(member);
    setEditFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      occupation: member.occupation,
      membership_type_id: member.membership_type_id
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/memberships/${editMember.id}`, editFormData);
      alert('Membership details updated successfully');
      setEditModalOpen(false);
      setEditMember(null);
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating membership details');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search by name, email, phone..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="glass-input w-full pl-11 pr-4 py-2.5 rounded-xl text-sm text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="glass-input px-4 py-2.5 rounded-xl text-sm text-white bg-dark-card"
        >
          <option value="" className="bg-dark-card">All Statuses</option>
          <option value="pending" className="bg-dark-card">Pending</option>
          <option value="approved" className="bg-dark-card">Approved</option>
          <option value="rejected" className="bg-dark-card">Rejected</option>
        </select>
      </div>

      {/* Table grid */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" /></div>
        ) : memberships.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No membership applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Phone / Address</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {memberships.map((member) => (
                  <tr key={member.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 flex flex-col">
                      <span className="font-bold text-white">{member.name}</span>
                      <span className="text-gray-500 text-xs mt-0.5">{member.email}</span>
                      <span className="text-gray-600 text-xxs mt-0.5 uppercase tracking-wider">{member.occupation}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs text-gray-400">
                        <span>{member.phone}</span>
                        <span className="text-gray-500 truncate max-w-[200px] mt-0.5">{member.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-brand-primary/10 text-brand-primary text-xxs font-semibold uppercase">
                        {member.membership_type_name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xxs font-bold uppercase ${
                        member.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        member.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2.5">
                      {member.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(member.id, 'approved')}
                            className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <Check size={15} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(member.id, 'rejected')}
                            className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleOpenEdit(member)}
                        className="p-1.5 bg-white/5 text-gray-400 hover:bg-brand-primary/20 hover:text-brand-primary rounded-lg transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        onClick={() => handleDelete(member.id)}
                        className="p-1.5 bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="btn-secondary px-3 py-1.5 rounded-lg text-xs disabled:opacity-50">Prev</button>
          <span className="text-gray-500 text-xs px-3 py-1.5 font-mono">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="btn-secondary px-3 py-1.5 rounded-lg text-xs disabled:opacity-50">Next</button>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && editMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => { setEditModalOpen(false); setEditMember(null); }} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl p-6 relative z-10">
            <button 
              onClick={() => { setEditModalOpen(false); setEditMember(null); }} 
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              <X size={18} />
            </button>
            <h3 className="text-white font-extrabold text-lg mb-4 font-sans">
              Edit Membership Details
            </h3>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 text-sm text-gray-400">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Full Name</label>
                  <input 
                    type="text" 
                    value={editFormData.name} 
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="glass-input px-3 py-2 rounded-xl text-xs text-white" 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email Address</label>
                  <input 
                    type="email" 
                    value={editFormData.email} 
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="glass-input px-3 py-2 rounded-xl text-xs text-white" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Phone Number</label>
                  <input 
                    type="text" 
                    value={editFormData.phone} 
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="glass-input px-3 py-2 rounded-xl text-xs text-white" 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Occupation</label>
                  <input 
                    type="text" 
                    value={editFormData.occupation} 
                    onChange={(e) => setEditFormData({ ...editFormData, occupation: e.target.value })}
                    className="glass-input px-3 py-2 rounded-xl text-xs text-white" 
                    required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Membership Category</label>
                <select 
                  value={editFormData.membership_type_id} 
                  onChange={(e) => setEditFormData({ ...editFormData, membership_type_id: parseInt(e.target.value) })}
                  className="glass-input px-3 py-2.5 rounded-xl text-xs text-white bg-dark-card" 
                  required
                >
                  {types.map((type) => (
                    <option key={type.id} value={type.id} className="bg-dark-card text-white">
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Address</label>
                <textarea 
                  value={editFormData.address} 
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  rows={3}
                  className="glass-input px-3 py-2 rounded-xl text-xs text-white resize-none" 
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-brand-primary hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-xl mt-2 flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/10 transition-all duration-200"
              >
                Save Changes
                <Check size={14} />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 2. MANAGE EVENTS & CONFERENCES
// ==========================================
export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    date: '',
    time: '',
    location: '',
    type: 'event'
  });
  const [imageFile, setImageFile] = useState(null);

  // Registrations state variables
  const [registrationsModalOpen, setRegistrationsModalOpen] = useState(false);
  const [activeEventForRegistrations, setActiveEventForRegistrations] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);

  const handleOpenRegistrations = (event) => {
    setActiveEventForRegistrations(event);
    setRegistrationsModalOpen(true);
    fetchRegistrations(event.id);
  };

  const fetchRegistrations = async (eventId) => {
    setRegistrationsLoading(true);
    try {
      const res = await api.get(`/events/admin/registrations?eventId=${eventId}`);
      setRegistrations(res.data.data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const handleDeleteRegistration = async (regId) => {
    if (!window.confirm('Remove this registration booking?')) return;
    try {
      await api.delete(`/events/admin/registrations/${regId}`);
      if (activeEventForRegistrations) {
        fetchRegistrations(activeEventForRegistrations.id);
      }
    } catch (err) {
      alert('Failed to delete registration');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      setEvents(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({ title: '', description: '', content: '', date: '', time: '', location: '', type: 'event' });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      content: event.content || '',
      date: event.date ? event.date.split('T')[0] : '',
      time: event.time,
      location: event.location,
      type: event.type
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event? All registrations will be removed.')) return;
    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      alert('Error deleting event');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/events', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      alert('Failed to save event details');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-xs font-mono">Create and modify events schedules</span>
        <button onClick={handleOpenCreate} className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-white">
          <Plus size={15} />
          Create Event
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" /></div>
        ) : events.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No events found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Event Details</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-400">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-bold text-white max-w-xs truncate">{event.title}</td>
                    <td className="px-6 py-4">
                      {new Date(event.date).toLocaleDateString('en-IN')} | {event.time.slice(0, 5)}
                    </td>
                    <td className="px-6 py-4 truncate max-w-[150px]">{event.location}</td>
                    <td className="px-6 py-4 capitalize font-semibold">{event.type}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenRegistrations(event)} 
                        className="p-1.5 bg-white/5 text-gray-400 hover:text-brand-primary hover:bg-white/10 rounded-lg"
                        title="View Registrations"
                      >
                        <Users size={14} />
                      </button>
                      <button onClick={() => handleOpenEdit(event)} className="p-1.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="p-1.5 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-lg w-full rounded-2xl border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative z-10">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
              <X size={18} />
            </button>
            <h3 className="text-white font-extrabold text-lg mb-4 font-sans">
              {editingEvent ? 'Edit Event Details' : 'Create New Event'}
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Event Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white" required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Date *</label>
                  <input 
                    type="date" 
                    value={formData.date} 
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white bg-dark-card" required 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Time *</label>
                  <input 
                    type="time" 
                    value={formData.time} 
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white bg-dark-card" required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Location *</label>
                  <input 
                    type="text" 
                    value={formData.location} 
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white" required 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Type</label>
                  <select 
                    value={formData.type} 
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white bg-dark-card"
                  >
                    <option value="event" className="bg-dark-card">Event</option>
                    <option value="conference" className="bg-dark-card">Conference</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Brief Description *</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  rows={2} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white resize-none" required 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Rich Text Content (Optional)</label>
                <textarea 
                  value={formData.content} 
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                  rows={3} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white resize-none" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Cover Image Upload</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])} 
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10" 
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold mt-2 text-white">Save Event</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Event registrations modal */}
      {registrationsModalOpen && activeEventForRegistrations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setRegistrationsModalOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-3xl w-full rounded-2xl border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative z-10">
            <button onClick={() => setRegistrationsModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
              <X size={18} />
            </button>
            <div className="mb-4">
              <span className="text-brand-primary font-bold text-xxs font-mono uppercase tracking-widest block mb-0.5">Event Registrations</span>
              <h3 className="text-white font-extrabold text-base truncate max-w-xl">{activeEventForRegistrations.title}</h3>
            </div>

            {registrationsLoading ? (
              <div className="py-12 flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" /></div>
            ) : registrations.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">No users registered yet for this event.</div>
            ) : (
              <div className="overflow-x-auto border border-white/5 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-gray-400 font-mono text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Registrant</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Organization</th>
                      <th className="px-4 py-3 font-mono">Date</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-400">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">{reg.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span>{reg.email}</span>
                            <span className="text-gray-500 text-[10px] mt-0.5">{reg.phone}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 truncate max-w-[150px]">{reg.organization || 'N/A'}</td>
                        <td className="px-4 py-3 font-mono">{new Date(reg.created_at).toLocaleDateString('en-IN')}</td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => handleDeleteRegistration(reg.id)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                            title="Remove registration"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 3. MANAGE OFFICE BEARERS
// ==========================================
export const AdminBearers = () => {
  const [bearers, setBearers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBearer, setEditingBearer] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    organization: '',
    display_order: 0,
    category: 'advisor'
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchBearers();
  }, []);

  const fetchBearers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/office-bearers');
      setBearers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingBearer(null);
    setFormData({ name: '', designation: '', organization: '', display_order: 0, category: 'advisor' });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (bearer) => {
    setEditingBearer(bearer);
    setFormData({
      name: bearer.name,
      designation: bearer.designation,
      organization: bearer.organization,
      display_order: bearer.display_order,
      category: bearer.category
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this office bearer record?')) return;
    try {
      await api.delete(`/office-bearers/${id}`);
      fetchBearers();
    } catch (err) {
      alert('Error deleting bearer');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingBearer) {
        await api.put(`/office-bearers/${editingBearer.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/office-bearers', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setModalOpen(false);
      fetchBearers();
    } catch (err) {
      alert('Error saving bearer');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-xs font-mono">Executive Leadership positions</span>
        <button onClick={handleOpenCreate} className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-white">
          <Plus size={15} /> Add Bearer
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" /></div>
        ) : bearers.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No office bearers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Bearer Profile</th>
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4">Sort Order</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-400">
                {bearers.map((bearer) => (
                  <tr key={bearer.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white/5 border border-white/10 flex items-center justify-center">
                        <img 
                          src={bearer.image_url.startsWith('http') ? bearer.image_url : `${BASE_URL}${bearer.image_url}`} 
                          alt={bearer.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%2327272a"><circle cx="50" cy="35" r="20" fill="%2352525b"/><path d="M20 80c0-15 15-20 30-20s30 5 30 20z" fill="%2352525b"/></svg>';
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{bearer.name}</span>
                        <span className="text-gray-500 text-xxs mt-0.5">{bearer.designation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 truncate max-w-[150px]">{bearer.organization}</td>
                    <td className="px-6 py-4 font-mono">{bearer.display_order}</td>
                    <td className="px-6 py-4 uppercase font-semibold text-xxs text-brand-secondary">{bearer.category.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleOpenEdit(bearer)} className="p-1.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(bearer.id)} className="p-1.5 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-md w-full rounded-2xl border border-white/10 shadow-2xl p-6 relative z-10">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
              <X size={18} />
            </button>
            <h3 className="text-white font-extrabold text-lg mb-4 font-sans">
              {editingBearer ? 'Edit Bearer' : 'Add Bearer'}
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white" required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Designation *</label>
                  <input 
                    type="text" 
                    value={formData.designation} 
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white" required 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Category *</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white bg-dark-card"
                    required
                  >
                    <option value="honorary_president" className="bg-dark-card">Honorary President</option>
                    <option value="working_president" className="bg-dark-card">Working President</option>
                    <option value="secretary" className="bg-dark-card">Secretary</option>
                    <option value="joint_secretary" className="bg-dark-card">Joint Secretary</option>
                    <option value="treasurer" className="bg-dark-card">Treasurer</option>
                    <option value="advisor" className="bg-dark-card">Advisor</option>
                    <option value="executive_committee" className="bg-dark-card">Executive Committee</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Organization *</label>
                  <input 
                    type="text" 
                    value={formData.organization} 
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white" required 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Display Sort Order *</label>
                  <input 
                    type="number" 
                    value={formData.display_order} 
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white" required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Profile Photo File</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])} 
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10" 
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold mt-2 text-white">Save Bearer</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 4. MANAGE COMMITTEES
// ==========================================
export const AdminCommittees = () => {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'BookOpen',
    display_order: 0
  });

  useEffect(() => {
    fetchCommittees();
  }, []);

  const fetchCommittees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/committees');
      setCommittees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCommittee(null);
    setFormData({ name: '', description: '', icon: 'BookOpen', display_order: 0 });
    setModalOpen(true);
  };

  const handleOpenEdit = (committee) => {
    setEditingCommittee(committee);
    setFormData({
      name: committee.name,
      description: committee.description,
      icon: committee.icon || 'BookOpen',
      display_order: committee.display_order
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this committee record?')) return;
    try {
      await api.delete(`/committees/${id}`);
      fetchCommittees();
    } catch (err) {
      alert('Error deleting committee');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCommittee) {
        await api.put(`/committees/${editingCommittee.id}`, formData);
      } else {
        await api.post('/committees', formData);
      }
      setModalOpen(false);
      fetchCommittees();
    } catch (err) {
      alert('Error saving committee details');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-xs font-mono">Create and modify committees categories</span>
        <button onClick={handleOpenCreate} className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-white">
          <Plus size={15} /> Create Committee
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" /></div>
        ) : committees.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No committees found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Committee Name</th>
                  <th className="px-6 py-4">Lucide Icon</th>
                  <th className="px-6 py-4">Sort Order</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-400">
                {committees.map((committee) => (
                  <tr key={committee.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-bold text-white max-w-sm truncate">{committee.name}</td>
                    <td className="px-6 py-4 font-mono">{committee.icon}</td>
                    <td className="px-6 py-4 font-mono">{committee.display_order}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleOpenEdit(committee)} className="p-1.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(committee.id)} className="p-1.5 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-md w-full rounded-2xl border border-white/10 shadow-2xl p-6 relative z-10">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
              <X size={18} />
            </button>
            <h3 className="text-white font-extrabold text-lg mb-4 font-sans">
              {editingCommittee ? 'Edit Committee' : 'Create Committee'}
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Committee Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white" required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Lucide Icon name *</label>
                  <input 
                    type="text" 
                    value={formData.icon} 
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white" required 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Sort Order *</label>
                  <input 
                    type="number" 
                    value={formData.display_order} 
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white" required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Description *</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  rows={4} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white resize-none" required 
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold mt-2 text-white">Save Committee</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 5. MANAGE AWARDS & NOMINATIONS
// ==========================================
export const AdminAwards = () => {
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNominations();
  }, [search, page]);

  const fetchNominations = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/awards/admin/nominations?search=${search}&page=${page}&limit=10`);
      setNominations(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/awards/admin/nominations/${id}/status`, { status });
      alert(`Nomination status marked as ${status}`);
      fetchNominations();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this nomination entry?')) return;
    try {
      await api.delete(`/awards/admin/nominations/${id}`);
      fetchNominations();
    } catch (err) {
      alert('Error deleting nomination');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search nominees by name, email..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="glass-input w-full pl-11 pr-4 py-2.5 rounded-xl text-sm text-white"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" /></div>
        ) : nominations.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No nominations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nominee Details</th>
                  <th className="px-6 py-4">Award Category</th>
                  <th className="px-6 py-4">Document Link</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-400">
                {nominations.map((nom) => (
                  <tr key={nom.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 flex flex-col">
                      <span className="font-bold text-white">{nom.nominee_name}</span>
                      <span className="text-gray-500 text-xxs mt-0.5">{nom.organization}</span>
                      <span className="text-gray-600 text-xxs mt-0.5">{nom.email} | {nom.phone}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white truncate max-w-[200px]">{nom.award_name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <a 
                        href={`${BASE_URL}${nom.document_url}`} 
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-brand-secondary hover:text-white"
                      >
                        <Download size={14} /> Download CV
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xxs font-bold uppercase ${
                        nom.status === 'reviewed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {nom.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      {nom.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusUpdate(nom.id, 'reviewed')}
                          className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg"
                          title="Mark Reviewed"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(nom.id)} className="p-1.5 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="btn-secondary px-3 py-1.5 rounded-lg text-xs disabled:opacity-50">Prev</button>
          <span className="text-gray-500 text-xs px-3 py-1.5 font-mono">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="btn-secondary px-3 py-1.5 rounded-lg text-xs disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 6. MANAGE PUBLICATIONS & OUTREACH
// ==========================================
export const AdminPublications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPub, setEditingPub] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'journal',
    description: '',
    link_url: ''
  });

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/publications');
      setPublications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPub(null);
    setFormData({ title: '', type: 'journal', description: '', link_url: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (pub) => {
    setEditingPub(pub);
    setFormData({
      title: pub.title,
      type: pub.type,
      description: pub.description,
      link_url: pub.link_url
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this publication/centre entry?')) return;
    try {
      await api.delete(`/publications/${id}`);
      fetchPublications();
    } catch (err) {
      alert('Error deleting publication');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPub) {
        await api.put(`/publications/${editingPub.id}`, formData);
      } else {
        await api.post('/publications', formData);
      }
      setModalOpen(false);
      fetchPublications();
    } catch (err) {
      alert('Failed to save publication');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-xs font-mono">Outreach services and digital library links</span>
        <button onClick={handleOpenCreate} className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-white">
          <Plus size={15} /> Create Link
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" /></div>
        ) : publications.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No publications/centres defined.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Portal Link</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-400">
                {publications.map((pub) => (
                  <tr key={pub.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-bold text-white max-w-sm truncate">{pub.title}</td>
                    <td className="px-6 py-4 capitalize font-semibold text-xxs text-brand-secondary">{pub.type.replace('_', ' ')}</td>
                    <td className="px-6 py-4 truncate max-w-xs font-mono text-xxs">{pub.link_url}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleOpenEdit(pub)} className="p-1.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(pub.id)} className="p-1.5 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-md w-full rounded-2xl border border-white/10 shadow-2xl p-6 relative z-10">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
              <X size={18} />
            </button>
            <h3 className="text-white font-extrabold text-lg mb-4 font-sans">
              {editingPub ? 'Edit Publication Portal' : 'Create Portal Link'}
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white" required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Category Type *</label>
                  <select 
                    value={formData.type} 
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white bg-dark-card"
                    required
                  >
                    <option value="journal" className="bg-dark-card">Journal</option>
                    <option value="digital_library" className="bg-dark-card">Digital Library</option>
                    <option value="publication_portal" className="bg-dark-card">Publication Portal</option>
                    <option value="consultancy" className="bg-dark-card">Consultancy Services</option>
                    <option value="science_tech" className="bg-dark-card">Science & Tech Centre</option>
                    <option value="environmental" className="bg-dark-card">Environmental Centre</option>
                    <option value="incubator" className="bg-dark-card">Incubator</option>
                    <option value="career" className="bg-dark-card">Career Centre</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Portal Link URL *</label>
                  <input 
                    type="text" 
                    value={formData.link_url} 
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white" placeholder="e.g. https://..." required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Description *</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  rows={4} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white resize-none" required 
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold mt-2 text-white">Save Portal Link</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 7. MANAGE MEDIA GALLERY
// ==========================================
export const AdminGallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'photo',
    video_url: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery');
      setGalleryItems(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({ title: '', type: 'photo', video_url: '' });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this media asset?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      fetchGallery();
    } catch (err) {
      alert('Error deleting gallery item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('type', formData.type);
    if (formData.type === 'video') {
      data.append('video_url', formData.video_url);
    } else if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      await api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setModalOpen(false);
      fetchGallery();
    } catch (err) {
      alert('Error uploading media');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-xs font-mono">Manage photos and video streaming links</span>
        <button onClick={handleOpenCreate} className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-white">
          <Plus size={15} /> Add Media
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" /></div>
        ) : galleryItems.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No media gallery items found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Media Link / File</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-400">
                {galleryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-bold text-white max-w-sm truncate">{item.title}</td>
                    <td className="px-6 py-4 uppercase font-semibold text-xxs text-brand-secondary">{item.type}</td>
                    <td className="px-6 py-4 truncate max-w-xs font-mono text-xxs">{item.media_url}</td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-md w-full rounded-2xl border border-white/10 shadow-2xl p-6 relative z-10">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
              <X size={18} />
            </button>
            <h3 className="text-white font-extrabold text-lg mb-4 font-sans">
              Add Media Asset
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Media Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white" required 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Type *</label>
                <select 
                  value={formData.type} 
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white bg-dark-card"
                  required
                >
                  <option value="photo" className="bg-dark-card">Photo Asset</option>
                  <option value="video" className="bg-dark-card">Video Link</option>
                </select>
              </div>

              {formData.type === 'video' ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Video Stream URL *</label>
                  <input 
                    type="text" 
                    value={formData.video_url} 
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white" placeholder="e.g. YouTube Link" required 
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Upload Image *</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])} 
                    className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10" 
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold mt-2 text-white">Save Media Asset</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 8. MANAGE NEWS & PRESS
// ==========================================
export const AdminNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    paragraph1: '',
    paragraph2: '',
    paragraph3: '',
    type: 'news'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // Array for N additional images

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/news');
      setNewsList(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingNews(null);
    setFormData({ 
      title: '', 
      content: '', 
      paragraph1: '', 
      paragraph2: '', 
      paragraph3: '', 
      type: 'news',
      custom_slug: '',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      canonical_url: '',
      og_title: '',
      og_description: '',
      twitter_title: '',
      twitter_description: ''
    });
    setImageFile(null);
    setImageFiles([]);
    setModalOpen(true);
  };

  const handleOpenEdit = async (news) => {
    try {
      const res = await api.get(`/news/${news.id}`);
      const fullNews = res.data;
      setEditingNews(fullNews);
      setFormData({
        title: fullNews.title,
        content: fullNews.content,
        paragraph1: fullNews.paragraph1 || '',
        paragraph2: fullNews.paragraph2 || '',
        paragraph3: fullNews.paragraph3 || '',
        type: fullNews.type,
        custom_slug: fullNews.slug || '',
        seo_title: fullNews.seo?.seo_title || '',
        seo_description: fullNews.seo?.seo_description || '',
        seo_keywords: fullNews.seo?.seo_keywords || '',
        canonical_url: fullNews.seo?.canonical_url || '',
        og_title: fullNews.seo?.og_title || '',
        og_description: fullNews.seo?.og_description || '',
        twitter_title: fullNews.seo?.twitter_title || '',
        twitter_description: fullNews.seo?.twitter_description || ''
      });
      setImageFile(null);
      setImageFiles([]);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      alert('Failed to load news details');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news feed item?')) return;
    try {
      await api.delete(`/news/${id}`);
      fetchNews();
    } catch (err) {
      alert('Error deleting news');
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Delete this gallery image permanently?')) return;
    try {
      await api.delete(`/news/images/${imageId}`);
      const res = await api.get(`/news/${editingNews.id}`);
      setEditingNews(res.data);
      fetchNews();
    } catch (err) {
      console.error(err);
      alert('Failed to delete image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) {
      data.append('image', imageFile);
    }
    // Append additional images
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        data.append('images', file);
      });
    }

    try {
      if (editingNews) {
        await api.put(`/news/${editingNews.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/news', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setModalOpen(false);
      fetchNews();
    } catch (err) {
      alert('Failed to save news details');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-xs font-mono">Publish press releases and news feeds</span>
        <button onClick={handleOpenCreate} className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-white">
          <Plus size={15} /> Add News
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" /></div>
        ) : newsList.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No news updates.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-400">
                {newsList.map((item) => (
                  <tr key={item.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-bold text-white max-w-md truncate">{item.title}</td>
                    <td className="px-6 py-4 font-mono">{new Date(item.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4 uppercase font-semibold text-xxs text-brand-secondary">{item.type.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleOpenEdit(item)} className="p-1.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-2xl w-full rounded-2xl border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative z-10">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
              <X size={18} />
            </button>
            <h3 className="text-white font-extrabold text-lg mb-4 font-sans">
              {editingNews ? 'Edit News Update' : 'Publish News Feed'}
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                  <label className="text-gray-400 text-xs">Title *</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white" required 
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                  <label className="text-gray-400 text-xs">News Type *</label>
                  <select 
                    value={formData.type} 
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white bg-dark-card"
                    required
                  >
                    <option value="news" className="bg-dark-card">General News</option>
                    <option value="press_release" className="bg-dark-card">Press Release</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Brief Excerpt / Summary *</label>
                <textarea 
                  value={formData.content} 
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                  rows={2} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white resize-none" required 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Content Paragraph 1 *</label>
                <textarea 
                  value={formData.paragraph1} 
                  onChange={(e) => setFormData({ ...formData, paragraph1: e.target.value })} 
                  rows={3} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white resize-none" required 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Content Paragraph 2</label>
                <textarea 
                  value={formData.paragraph2} 
                  onChange={(e) => setFormData({ ...formData, paragraph2: e.target.value })} 
                  rows={3} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white resize-none" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Content Paragraph 3</label>
                <textarea 
                  value={formData.paragraph3} 
                  onChange={(e) => setFormData({ ...formData, paragraph3: e.target.value })} 
                  rows={3} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white resize-none" 
                />
              </div>

              {/* Existing Uploaded Images Preview */}
              {editingNews && (editingNews.image_url || (editingNews.galleryImages && editingNews.galleryImages.length > 0)) && (
                <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/2 border border-white/5">
                  <span className="text-xs font-mono text-gray-400">Currently Uploaded Media</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cover image */}
                    {editingNews.image_url && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-gray-500 text-xxs uppercase tracking-wider">Cover Image</label>
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/5 bg-black/40">
                          <img 
                            src={`${BASE_URL}${editingNews.image_url}`} 
                            alt="Cover" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>
                    )}
                    {/* Gallery images */}
                    {editingNews.galleryImages && editingNews.galleryImages.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-gray-500 text-xxs uppercase tracking-wider">Gallery Photos ({editingNews.galleryImages.length})</label>
                        <div className="grid grid-cols-3 gap-2 max-h-[140px] overflow-y-auto no-scrollbar">
                          {editingNews.galleryImages.map((imgObj) => (
                            <div key={imgObj.id} className="relative aspect-video rounded-lg overflow-hidden border border-white/5 bg-black/30 group">
                              <img 
                                src={`${BASE_URL}${imgObj.image_url}`} 
                                alt="Gallery Item" 
                                className="w-full h-full object-cover" 
                              />
                              {/* Delete Button Overlay */}
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(imgObj.id)}
                                className="absolute top-1.5 right-1.5 p-1 bg-red-500/80 hover:bg-red-600 rounded-md text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                title="Delete Image"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SEO Configurations Expansion Section */}
              <div className="border border-white/5 rounded-2xl p-4 bg-white/2 flex flex-col gap-3">
                <h4 className="text-white text-xs font-bold font-mono">Article SEO & Metadata Overrides</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-gray-400 text-xs">Custom URL Slug (URL path friendly, e.g. 'my-custom-title')</label>
                    <input 
                      type="text" 
                      value={formData.custom_slug || ''} 
                      onChange={(e) => setFormData({ ...formData, custom_slug: e.target.value })} 
                      placeholder="Leave blank to auto-generate from Title"
                      className="glass-input px-4 py-2.5 rounded-xl text-white" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-gray-400 text-xs">SEO Title Tag Override</label>
                    <input 
                      type="text" 
                      value={formData.seo_title || ''} 
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })} 
                      placeholder="Leave blank to use base Title"
                      className="glass-input px-4 py-2.5 rounded-xl text-white" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-gray-400 text-xs">SEO Meta Description Override</label>
                    <textarea 
                      value={formData.seo_description || ''} 
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })} 
                      placeholder="Summarize the article for search results (recommended length: 150-160 chars)"
                      rows={2}
                      className="glass-input px-4 py-2.5 rounded-xl text-white resize-none" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                    <label className="text-gray-400 text-xs">SEO Keywords</label>
                    <input 
                      type="text" 
                      value={formData.seo_keywords || ''} 
                      onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })} 
                      placeholder="e.g. news, events, incubation"
                      className="glass-input px-4 py-2.5 rounded-xl text-white" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                    <label className="text-gray-400 text-xs">Canonical URL</label>
                    <input 
                      type="text" 
                      value={formData.canonical_url || ''} 
                      onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })} 
                      placeholder="Only set if referencing external source"
                      className="glass-input px-4 py-2.5 rounded-xl text-white" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                    <label className="text-gray-400 text-xs">Social Open Graph Title</label>
                    <input 
                      type="text" 
                      value={formData.og_title || ''} 
                      onChange={(e) => setFormData({ ...formData, og_title: e.target.value })} 
                      placeholder="Facebook/LinkedIn share title"
                      className="glass-input px-4 py-2.5 rounded-xl text-white" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                    <label className="text-gray-400 text-xs">Social Open Graph Description</label>
                    <input 
                      type="text" 
                      value={formData.og_description || ''} 
                      onChange={(e) => setFormData({ ...formData, og_description: e.target.value })} 
                      placeholder="Facebook/LinkedIn share snippet"
                      className="glass-input px-4 py-2.5 rounded-xl text-white" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Cover Image Upload</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])} 
                    className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Additional Gallery Images (Upload N Images)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={(e) => setImageFiles(Array.from(e.target.files))} 
                    className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10" 
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold mt-2 text-white">Save News Item</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 9. MANAGE CONTACT MESSAGES INBOX
// ==========================================
export const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedMsg, setSelectedMsg] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, [search, page]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/contacts?search=${search}&page=${page}&limit=10`);
      setMessages(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message from inbox?')) return;
    try {
      await api.delete(`/contacts/${id}`);
      fetchMessages();
      setSelectedMsg(null);
    } catch (err) {
      alert('Error deleting message');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search by name, email, subject..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="glass-input w-full pl-11 pr-4 py-2.5 rounded-xl text-sm text-white"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" /></div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">Inbox is empty.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Received Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-400">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 flex flex-col">
                      <span className="font-bold text-white">{msg.name}</span>
                      <span className="text-gray-500 text-xxs mt-0.5">{msg.email} | {msg.phone || 'No Phone'}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white max-w-sm truncate">{msg.subject}</td>
                    <td className="px-6 py-4 font-mono">{new Date(msg.created_at).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => setSelectedMsg(msg)} className="p-1.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleDelete(msg.id)} className="p-1.5 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="btn-secondary px-3 py-1.5 rounded-lg text-xs disabled:opacity-50">Prev</button>
          <span className="text-gray-500 text-xs px-3 py-1.5 font-mono">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="btn-secondary px-3 py-1.5 rounded-lg text-xs disabled:opacity-50">Next</button>
        </div>
      )}

      {/* View message detail modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setSelectedMsg(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-md w-full rounded-2xl border border-white/10 shadow-2xl p-6 relative z-10">
            <button onClick={() => setSelectedMsg(null)} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
              <X size={18} />
            </button>
            <div className="mb-4">
              <span className="text-brand-secondary text-xxs font-mono uppercase">Contact Form Query</span>
              <span className="text-white font-bold text-sm truncate max-w-[280px] mt-0.5 block">{selectedMsg.subject}</span>
            </div>
            
            <div className="flex flex-col gap-4 text-xs text-gray-400">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-white/5">
                <div>
                  <span className="text-gray-500 uppercase text-xxs block font-mono">Sender Name</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{selectedMsg.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase text-xxs block font-mono">Phone</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{selectedMsg.phone || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 uppercase text-xxs block font-mono">Email Address</span>
                  <span className="text-white font-bold text-xs mt-0.5 block break-all">{selectedMsg.email}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 uppercase text-xxs block font-mono mb-1">Message Description</span>
                <p className="text-gray-300 leading-relaxed text-sm bg-white/2 p-3 rounded-xl border border-white/5 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedMsg.message}
                </p>
              </div>

              <div className="pt-2 flex justify-between gap-3 items-center">
                <button 
                  onClick={() => handleDelete(selectedMsg.id)} 
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold"
                >
                  Delete Message
                </button>
                <a 
                  href={`mailto:${selectedMsg.email}`} 
                  className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1"
                >
                  <Mail size={12} /> Reply Email
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 10. MANAGE TRAINING PROGRAMS
// ==========================================
export const AdminTraining = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'training',
    content: '',
    date: '',
    duration: ''
  });

  // Booking seat registrations states
  const [registrationsModalOpen, setRegistrationsModalOpen] = useState(false);
  const [activeProgramForRegistrations, setActiveProgramForRegistrations] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/training');
      setPrograms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProg(null);
    setFormData({ title: '', description: '', type: 'training', content: '', date: '', duration: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (prog) => {
    setEditingProg(prog);
    setFormData({
      title: prog.title,
      description: prog.description,
      type: prog.type,
      content: prog.content || '',
      date: prog.date ? prog.date.split('T')[0] : '',
      duration: prog.duration || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this training program?')) return;
    try {
      await api.delete(`/training/${id}`);
      fetchPrograms();
    } catch (err) {
      alert('Error deleting program');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProg) {
        await api.put(`/training/${editingProg.id}`, formData);
      } else {
        await api.post('/training', formData);
      }
      setModalOpen(false);
      fetchPrograms();
    } catch (err) {
      alert('Failed to save program details');
    }
  };

  const handleOpenRegistrations = (prog) => {
    setActiveProgramForRegistrations(prog);
    setRegistrationsModalOpen(true);
    fetchRegistrations(prog.id);
  };

  const fetchRegistrations = async (programId) => {
    setRegistrationsLoading(true);
    try {
      const res = await api.get(`/training/registrations?programId=${programId}`);
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const handleDeleteRegistration = async (regId) => {
    if (!window.confirm('Delete this booking registration?')) return;
    try {
      await api.delete(`/training/registrations/${regId}`);
      if (activeProgramForRegistrations) {
        fetchRegistrations(activeProgramForRegistrations.id);
      }
    } catch (err) {
      alert('Error deleting registration');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-xs font-mono">Certification courses and seminars catalog</span>
        <button onClick={handleOpenCreate} className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-white">
          <Plus size={15} /> Create Program
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" /></div>
        ) : programs.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No programs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-400">
                {programs.map((prog) => (
                  <tr key={prog.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-bold text-white max-w-sm truncate">{prog.title}</td>
                    <td className="px-6 py-4 capitalize font-semibold text-xxs text-brand-secondary">{prog.type.replace('_', ' ')}</td>
                    <td className="px-6 py-4 font-mono">{prog.duration || 'N/A'}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenRegistrations(prog)} 
                        className="p-1.5 bg-white/5 text-gray-400 hover:text-brand-primary hover:bg-white/10 rounded-lg"
                        title="View Bookings"
                      >
                        <Users size={14} />
                      </button>
                      <button onClick={() => handleOpenEdit(prog)} className="p-1.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(prog.id)} className="p-1.5 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bookings registrations modal */}
      {registrationsModalOpen && activeProgramForRegistrations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setRegistrationsModalOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-3xl w-full rounded-2xl border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative z-10">
            <button onClick={() => setRegistrationsModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
              <X size={18} />
            </button>
            <div className="mb-4">
              <span className="text-brand-primary font-bold text-xxs font-mono uppercase tracking-widest block mb-0.5">Seat Enrollments</span>
              <h3 className="text-white font-extrabold text-base truncate max-w-xl">{activeProgramForRegistrations.title}</h3>
            </div>

            {registrationsLoading ? (
              <div className="py-12 flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" /></div>
            ) : registrations.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">No seat bookings registered yet for this program.</div>
            ) : (
              <div className="overflow-x-auto border border-white/5 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-gray-400 font-mono text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Enrollee</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Organization</th>
                      <th className="px-4 py-3 font-mono">Date</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-400">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">{reg.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span>{reg.email}</span>
                            <span className="text-gray-500 text-[10px] mt-0.5">{reg.phone}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 truncate max-w-[150px]">{reg.organization || 'N/A'}</td>
                        <td className="px-4 py-3 font-mono">{new Date(reg.created_at).toLocaleDateString('en-IN')}</td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => handleDeleteRegistration(reg.id)}
                            className="p-1.5 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                            title="Remove Booking"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-lg w-full rounded-2xl border border-white/10 shadow-2xl p-6 relative z-10">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
              <X size={18} />
            </button>
            <h3 className="text-white font-extrabold text-lg mb-4 font-sans">
              {editingProg ? 'Edit Program' : 'Create Program'}
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Program Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white" required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Upskilling Type *</label>
                  <select 
                    value={formData.type} 
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white bg-dark-card"
                    required
                  >
                    <option value="training" className="bg-dark-card">Training Program</option>
                    <option value="certification" className="bg-dark-card">Certification</option>
                    <option value="workshop" className="bg-dark-card">Workshop</option>
                    <option value="seminar" className="bg-dark-card">Seminar</option>
                    <option value="industry_session" className="bg-dark-card">Industry Session</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs">Duration *</label>
                  <input 
                    type="text" 
                    value={formData.duration} 
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })} 
                    className="glass-input px-4 py-2.5 rounded-xl text-white" placeholder="e.g. 6 Weeks" required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Start Date</label>
                <input 
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white bg-dark-card" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Brief Description *</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  rows={2} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white resize-none" required 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs">Detailed Syllabus Content (Optional)</label>
                <textarea 
                  value={formData.content} 
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                  rows={3} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white resize-none" 
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold mt-2 text-white">Save Program</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 11. MANAGE SITE SETTINGS
// ==========================================
export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    address: '',
    phone: '',
    email: '',
    google_map: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      setSettings({
        address: res.data.address || '',
        phone: res.data.phone || '',
        email: res.data.email || '',
        google_map: res.data.google_map || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/settings', settings);
      alert('Global settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings configurations');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl w-full">
      <GlassCard className="p-8 border border-white/5" hoverEffect={false}>
        <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-6">
          <Settings className="text-brand-primary" size={20} />
          <h3 className="text-white font-bold text-base">Metadata Configurations</h3>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs">Official Address *</label>
            <textarea 
              value={settings.address} 
              onChange={(e) => setSettings({ ...settings, address: e.target.value })} 
              rows={3} 
              className="glass-input px-4 py-2.5 rounded-xl text-white resize-none" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 text-xs">Phone Contact *</label>
              <input 
                type="text" 
                value={settings.phone} 
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })} 
                className="glass-input px-4 py-2.5 rounded-xl text-white" 
                required 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 text-xs">Email Address *</label>
              <input 
                type="email" 
                value={settings.email} 
                onChange={(e) => setSettings({ ...settings, email: e.target.value })} 
                className="glass-input px-4 py-2.5 rounded-xl text-white" 
                required 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs">Google Maps Embed URL *</label>
            <input 
              type="text" 
              value={settings.google_map} 
              onChange={(e) => setSettings({ ...settings, google_map: e.target.value })} 
              className="glass-input px-4 py-2.5 rounded-xl text-white font-mono text-xs" 
              placeholder="e.g. https://www.google.com/maps/embed?..."
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="btn-primary w-full py-3.5 rounded-xl font-bold mt-4 text-white"
          >
            {saving ? 'Saving Configurations...' : 'Save Global Settings'}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

// ==========================================
// 12. MANAGE EVENT REGISTRATIONS
// ==========================================
export const AdminEventRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [search, selectedEventId, page]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      let url = `/events/admin/registrations?page=${page}&limit=20`;
      if (selectedEventId) {
        url += `&eventId=${selectedEventId}`;
      }
      const res = await api.get(url);
      
      // Let's filter client-side for search to avoid adding backend search queries
      let data = res.data.data || [];
      if (search.trim() !== '') {
        const queryStr = search.toLowerCase();
        data = data.filter(reg => 
          reg.name.toLowerCase().includes(queryStr) || 
          reg.email.toLowerCase().includes(queryStr) ||
          reg.phone.toLowerCase().includes(queryStr) ||
          (reg.organization && reg.organization.toLowerCase().includes(queryStr)) ||
          reg.event_title.toLowerCase().includes(queryStr)
        );
      }
      
      setRegistrations(data);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration booking?')) return;
    try {
      await api.delete(`/events/admin/registrations/${id}`);
      fetchRegistrations();
    } catch (err) {
      alert('Failed to delete registration');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-gray-500 text-xs font-mono">List of users registered for events</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Event Filter */}
          <select 
            value={selectedEventId} 
            onChange={(e) => { setSelectedEventId(e.target.value); setPage(1); }} 
            className="glass-input px-4 py-2 rounded-xl text-xs text-white bg-dark-card border-white/10"
          >
            <option value="">All Events & Conferences</option>
            {events.map((e) => (
              <option key={e.id} value={e.id} className="bg-dark-card">{e.title}</option>
            ))}
          </select>

          {/* Search bar */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search registrant or event..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="glass-input pl-10 pr-4 py-2 rounded-xl text-xs text-white w-full sm:w-64"
            />
            <Search className="absolute left-3.5 top-2.5 text-gray-500" size={14} />
          </div>
        </div>
      </div>

      {/* Main Grid table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No registrations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Registrant</th>
                  <th className="px-6 py-4">Event Details</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4 font-mono">Registered Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-400">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{reg.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white max-w-xs truncate">{reg.event_title}</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">
                          {new Date(reg.event_date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{reg.email}</span>
                        <span className="text-gray-500 text-[10px] mt-0.5">{reg.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 truncate max-w-[150px]">{reg.organization || 'N/A'}</td>
                    <td className="px-6 py-4 font-mono">
                      {new Date(reg.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      <button 
                        onClick={() => handleDelete(reg.id)} 
                        className="p-1.5 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                        title="Remove booking"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 text-xs font-semibold hover:bg-white/10 disabled:opacity-50 text-white"
          >
            Prev
          </button>
          <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 text-xs font-semibold hover:bg-white/10 disabled:opacity-50 text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 12. MANAGE ACTIVITIES TIMELINE
// ==========================================
export const AdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    icon: 'Calendar',
    color: 'text-brand-primary',
    display_order: '0'
  });

  const availableIcons = [
    'Calendar', 'Award', 'BookOpen', 'GraduationCap', 'Flame', 'Presentation', 'Target', 'Trophy',
    'Activity', 'Anchor', 'Bell', 'Book', 'Briefcase', 'ChevronRight', 'Clock', 'Compass', 'Cpu', 'Database', 
    'Gift', 'Globe', 'Heart', 'Home', 'Image', 'Info', 'Lightbulb', 'Link', 'Map', 'MessageSquare', 'Music', 
    'Rocket', 'Send', 'Shield', 'Sparkles', 'Star', 'TrendingUp', 'Zap'
  ];
  const iconMap = { 
    Calendar, Award, BookOpen, GraduationCap, Flame, Presentation, Target, Trophy,
    Activity, Anchor, Bell, Book, Briefcase, ChevronRight, Clock, Compass, Cpu, Database, 
    Gift, Globe, Heart, Home, Image, Info, Lightbulb, Link, Map, MessageSquare, Music, 
    Rocket, Send, Shield, Sparkles, Star, TrendingUp, Zap
  };

  const availableColors = [
    { value: 'text-brand-primary', label: 'Default Primary' },
    { value: 'text-amber-400', label: 'Amber Yellow' },
    { value: 'text-indigo-400', label: 'Indigo Blue' },
    { value: 'text-sky-400', label: 'Sky Blue' },
    { value: 'text-emerald-400', label: 'Emerald Green' },
    { value: 'text-purple-400', label: 'Purple Orchid' },
    { value: 'text-brand-gold', label: 'Luxury Gold' },
    { value: 'text-rose-400', label: 'Rose Pink' },
    { value: 'text-teal-400', label: 'Teal' },
    // 30 More Colors:
    { value: 'text-red-400', label: 'Vibrant Red' },
    { value: 'text-red-500', label: 'Crimson Red' },
    { value: 'text-orange-400', label: 'Tangerine Orange' },
    { value: 'text-orange-500', label: 'Deep Orange' },
    { value: 'text-yellow-300', label: 'Light Yellow' },
    { value: 'text-yellow-500', label: 'Gold Yellow' },
    { value: 'text-lime-400', label: 'Bright Lime' },
    { value: 'text-lime-500', label: 'Lime Green' },
    { value: 'text-green-400', label: 'Mint Green' },
    { value: 'text-green-500', label: 'Forest Green' },
    { value: 'text-emerald-500', label: 'Deep Emerald' },
    { value: 'text-teal-500', label: 'Dark Teal' },
    { value: 'text-cyan-400', label: 'Cyan Aqua' },
    { value: 'text-cyan-500', label: 'Ocean Cyan' },
    { value: 'text-sky-500', label: 'Deep Sky' },
    { value: 'text-blue-400', label: 'Soft Blue' },
    { value: 'text-blue-500', label: 'Royal Blue' },
    { value: 'text-indigo-500', label: 'Deep Indigo' },
    { value: 'text-violet-500', label: 'Deep Violet' },
    { value: 'text-purple-500', label: 'Royal Purple' },
    { value: 'text-fuchsia-400', label: 'Magenta Fuchsia' },
    { value: 'text-fuchsia-500', label: 'Deep Fuchsia' },
    { value: 'text-pink-400', label: 'Light Pink' },
    { value: 'text-pink-500', label: 'Hot Pink' },
    { value: 'text-rose-500', label: 'Ruby Rose' },
    { value: 'text-slate-300', label: 'Light Slate' },
    { value: 'text-slate-400', label: 'Slate Gray' },
    { value: 'text-zinc-400', label: 'Zinc Gray' },
    { value: 'text-neutral-400', label: 'Neutral Gray' },
    { value: 'text-stone-400', label: 'Stone Gray' }
  ];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/activities');
      setActivities(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingActivity(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      icon: 'Calendar',
      color: 'text-brand-primary',
      display_order: '0'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (act) => {
    setEditingActivity(act);
    setFormData({
      title: act.title,
      subtitle: act.subtitle,
      description: act.description,
      icon: act.icon || 'Calendar',
      color: act.color || 'text-brand-primary',
      display_order: String(act.display_order || 0)
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity timeline item?')) return;
    try {
      await api.delete(`/activities/${id}`);
      fetchActivities();
    } catch (err) {
      alert('Error deleting activity');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        display_order: parseInt(formData.display_order) || 0
      };

      if (editingActivity) {
        await api.put(`/activities/${editingActivity.id}`, payload);
      } else {
        await api.post('/activities', payload);
      }
      setModalOpen(false);
      fetchActivities();
    } catch (err) {
      console.error('Save activity error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to save activity details';
      alert(`Failed to save activity: ${errMsg}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-xs font-mono">Dynamic activities timeline planner</span>
        <button onClick={handleOpenCreate} className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-white">
          <Plus size={15} /> Create Activity
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" /></div>
        ) : error ? (
          <div className="py-12 text-center text-red-400 text-sm">Error loading activities: {error}</div>
        ) : activities.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No activities found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Icon</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Subtitle</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activities.map((act) => {
                  const IconComp = iconMap[act.icon] || Calendar;
                  return (
                    <tr key={act.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">{act.display_order}</td>
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                          <IconComp size={16} className={act.color || 'text-brand-primary'} />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">{act.title}</td>
                      <td className="px-6 py-4 text-gray-400 text-xs">{act.subtitle}</td>
                      <td className="px-6 py-4 text-gray-400 text-xs max-w-xs truncate">{act.description}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenEdit(act)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-brand-primary hover:bg-white/10 transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(act.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl p-6 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
              <X size={18} />
            </button>
            <h3 className="text-white font-extrabold text-lg mb-4 font-sans">
              {editingActivity ? 'Edit Activity Details' : 'Create New Activity'}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xxs font-mono text-gray-400 uppercase">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="glass-input px-4 py-2.5 rounded-xl text-sm text-white w-full" placeholder="Enter activity name" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xxs font-mono text-gray-400 uppercase">Subtitle / Caption</label>
                <input required type="text" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} className="glass-input px-4 py-2.5 rounded-xl text-sm text-white w-full" placeholder="e.g. Annual Observance, Monthly Talks" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xxs font-mono text-gray-400 uppercase">Description</label>
                <textarea required rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="glass-input px-4 py-2.5 rounded-xl text-sm text-white w-full resize-none" placeholder="Provide details about the activity" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xxs font-mono text-gray-400 uppercase">Lucide Icon</label>
                  <select value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="glass-input px-4 py-2.5 rounded-xl text-sm text-white w-full bg-dark">
                    {availableIcons.map(ic => (
                      <option key={ic} value={ic} className="bg-dark text-white">{ic}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xxs font-mono text-gray-400 uppercase">Display Color</label>
                  <select value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="glass-input px-4 py-2.5 rounded-xl text-sm text-white w-full bg-dark">
                    {availableColors.map(col => (
                      <option key={col.value} value={col.value} className="bg-dark text-white">{col.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xxs font-mono text-gray-400 uppercase">Sort Order Index</label>
                <input type="number" min="0" value={formData.display_order} onChange={e => setFormData({ ...formData, display_order: e.target.value })} className="glass-input px-4 py-2.5 rounded-xl text-sm text-white w-full" placeholder="0" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-semibold text-white">
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 14. ADMIN SEO MANAGER
// ==========================================
export const AdminSeo = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Settings state
  const [settings, setSettings] = useState({
    website_title: '',
    website_description: '',
    website_keywords: '',
    canonical_domain: '',
    org_name: '',
    logo: '/logo.png',
    tracking_analytics: '',
    tracking_pixel: ''
  });

  // 2. Robots state
  const [robotsText, setRobotsText] = useState('');

  // 3. Redirects state
  const [redirects, setRedirects] = useState([]);
  const [newRedirect, setNewRedirect] = useState({ source_url: '', target_url: '' });

  // 4. Audits state
  const [audits, setAudits] = useState([]);
  const [auditSummary, setAuditSummary] = useState({ total: 0, issues: 0 });

  // 5. CWV state
  const [vitals, setVitals] = useState([]);

  // Clear feedback after 4 seconds
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg('');
        setErrorMsg('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  // Load active tab data
  useEffect(() => {
    fetchTabData();
  }, [activeTab]);

  const fetchTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'settings') {
        const res = await api.get('/seo/settings');
        setSettings({
          website_title: res.data.website_title || '',
          website_description: res.data.website_description || '',
          website_keywords: res.data.website_keywords || '',
          canonical_domain: res.data.canonical_domain || '',
          org_name: res.data.org_name || '',
          logo: res.data.logo || '/logo.png',
          tracking_analytics: res.data.tracking_analytics || '',
          tracking_pixel: res.data.tracking_pixel || ''
        });
      } else if (activeTab === 'robots') {
        const res = await api.get('/seo/robots');
        setRobotsText(res.data.robots_txt || '');
      } else if (activeTab === 'redirects') {
        const res = await api.get('/seo/redirects');
        setRedirects(res.data || []);
      } else if (activeTab === 'audits') {
        const res = await api.get('/seo/audits');
        setAudits(res.data || []);
        const total = res.data.length;
        const issues = res.data.filter(a => a.missing_title || a.missing_description || a.missing_canonical || a.missing_alt_tags || a.status_code === 404).length;
        setAuditSummary({ total, issues });
      } else if (activeTab === 'performance') {
        const res = await api.get('/seo/performance-logs');
        setVitals(res.data || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load tab data');
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/seo/settings', settings);
      setSuccessMsg('Global SEO Settings updated successfully');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRobots = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/seo/robots', { robots_txt: robotsText });
      setSuccessMsg('Robots.txt rules saved successfully');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update robots.txt');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRedirect = async (e) => {
    e.preventDefault();
    if (!newRedirect.source_url || !newRedirect.target_url) return;
    setLoading(true);
    try {
      await api.post('/seo/redirects', newRedirect);
      setNewRedirect({ source_url: '', target_url: '' });
      setSuccessMsg('Redirect rule created successfully');
      fetchTabData();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to create redirect. Ensure URL is unique.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRedirect = async (id) => {
    if (!window.confirm('Delete this redirect rule?')) return;
    setLoading(true);
    try {
      await api.delete(`/seo/redirects/${id}`);
      setSuccessMsg('Redirect rule deleted');
      fetchTabData();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to delete redirect');
      setLoading(false);
    }
  };

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await api.post('/seo/audits/run');
      setSuccessMsg('Diagnostic scan complete');
      setAudits(res.data.data || []);
      const total = res.data.data.length;
      const issues = res.data.data.filter(a => a.missing_title || a.missing_description || a.missing_canonical || a.missing_alt_tags || a.status_code === 404).length;
      setAuditSummary({ total, issues });
    } catch (err) {
      console.error(err);
      setErrorMsg('SEO Auditor failed to execute');
    } finally {
      setLoading(false);
    }
  };

  const handleRebuildSitemaps = async () => {
    setLoading(true);
    try {
      await api.post('/seo/sitemaps/rebuild');
      setSuccessMsg('XML and Google News Sitemaps rebuilt successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg('Sitemap rebuild failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-gray-500 text-xs font-mono">Manage site search appearances, redirects, crawlers, and performance index.</span>
        </div>
        <button 
          onClick={handleRebuildSitemaps}
          disabled={loading}
          className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 text-white shadow-md shadow-brand-primary/10"
        >
          <Database size={15} /> Rebuild XML Sitemaps
        </button>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-xs font-semibold">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-3 text-xs font-bold font-mono tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'settings' 
              ? 'border-brand-primary text-white bg-brand-primary/5' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Global SEO
        </button>
        <button
          onClick={() => setActiveTab('redirects')}
          className={`px-5 py-3 text-xs font-bold font-mono tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'redirects' 
              ? 'border-brand-primary text-white bg-brand-primary/5' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Redirects (301)
        </button>
        <button
          onClick={() => setActiveTab('robots')}
          className={`px-5 py-3 text-xs font-bold font-mono tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'robots' 
              ? 'border-brand-primary text-white bg-brand-primary/5' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Robots.txt
        </button>
        <button
          onClick={() => setActiveTab('audits')}
          className={`px-5 py-3 text-xs font-bold font-mono tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'audits' 
              ? 'border-brand-primary text-white bg-brand-primary/5' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          SEO Auditor
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-5 py-3 text-xs font-bold font-mono tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'performance' 
              ? 'border-brand-primary text-white bg-brand-primary/5' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Core Web Vitals
        </button>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" />
        </div>
      )}

      {/* Render tab screen */}
      {!loading && activeTab === 'settings' && (
        <form onSubmit={handleUpdateSettings} className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col gap-5">
          <h3 className="text-white text-sm font-extrabold uppercase font-sans tracking-wide font-bold">Global Site Metadata Configurations</h3>
          
          <div className="grid grid-cols-2 gap-5 text-sm">
            <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
              <label className="text-gray-400 text-xs">Default Website Title *</label>
              <input
                type="text"
                value={settings.website_title}
                onChange={(e) => setSettings({ ...settings, website_title: e.target.value })}
                className="glass-input px-4 py-2.5 rounded-xl text-white"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
              <label className="text-gray-400 text-xs">Canonical Domain *</label>
              <input
                type="url"
                value={settings.canonical_domain}
                onChange={(e) => setSettings({ ...settings, canonical_domain: e.target.value })}
                placeholder="https://udupimanagement.org"
                className="glass-input px-4 py-2.5 rounded-xl text-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-gray-400 text-xs">Default Website Description *</label>
              <textarea
                value={settings.website_description}
                onChange={(e) => setSettings({ ...settings, website_description: e.target.value })}
                rows={3}
                className="glass-input px-4 py-2.5 rounded-xl text-white resize-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
              <label className="text-gray-400 text-xs">Global Keywords</label>
              <input
                type="text"
                value={settings.website_keywords}
                onChange={(e) => setSettings({ ...settings, website_keywords: e.target.value })}
                placeholder="UMA, management, Udupi leadership"
                className="glass-input px-4 py-2.5 rounded-xl text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
              <label className="text-gray-400 text-xs">Organization Schema Name</label>
              <input
                type="text"
                value={settings.org_name}
                onChange={(e) => setSettings({ ...settings, org_name: e.target.value })}
                className="glass-input px-4 py-2.5 rounded-xl text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <h4 className="text-white text-xs font-bold font-mono mt-3">Tracking & Pixel Identifiers</h4>
            </div>

            <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
              <label className="text-gray-400 text-xs">Google Analytics Tag ID (e.g. G-XXXXXXX)</label>
              <input
                type="text"
                value={settings.tracking_analytics}
                onChange={(e) => setSettings({ ...settings, tracking_analytics: e.target.value })}
                className="glass-input px-4 py-2.5 rounded-xl text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
              <label className="text-gray-400 text-xs">Facebook Pixel Tag ID</label>
              <input
                type="text"
                value={settings.tracking_pixel}
                onChange={(e) => setSettings({ ...settings, tracking_pixel: e.target.value })}
                className="glass-input px-4 py-2.5 rounded-xl text-white"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold mt-4 text-white">
            Save SEO Settings
          </button>
        </form>
      )}

      {!loading && activeTab === 'redirects' && (
        <div className="flex flex-col gap-6">
          <form onSubmit={handleCreateRedirect} className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col gap-4">
            <h3 className="text-white text-sm font-extrabold uppercase font-sans tracking-wide">Add 301 Permanent Redirect</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                <label className="text-gray-400 text-xs">Source Path *</label>
                <input
                  type="text"
                  value={newRedirect.source_url}
                  onChange={(e) => setNewRedirect({ ...newRedirect, source_url: e.target.value })}
                  placeholder="/old-news-link"
                  className="glass-input px-4 py-2.5 rounded-xl text-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                <label className="text-gray-400 text-xs">Target Destination *</label>
                <input
                  type="text"
                  value={newRedirect.target_url}
                  onChange={(e) => setNewRedirect({ ...newRedirect, target_url: e.target.value })}
                  placeholder="/news/new-slug-url"
                  className="glass-input px-4 py-2.5 rounded-xl text-white"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3 rounded-xl font-bold text-white">
              Create Redirect Rule
            </button>
          </form>

          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            <h3 className="text-white text-sm font-extrabold uppercase font-sans tracking-wide p-6 border-b border-white/5">Active Redirect List</h3>
            {redirects.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">No redirects active. Add one above.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Source URL</th>
                      <th className="px-6 py-4">Target URL</th>
                      <th className="px-6 py-4">Hits</th>
                      <th className="px-6 py-4">Last Hit</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-gray-400">
                    {redirects.map((red) => (
                      <tr key={red.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4 font-mono">{red.source_url}</td>
                        <td className="px-6 py-4 font-mono">{red.target_url}</td>
                        <td className="px-6 py-4">{red.hit_count}</td>
                        <td className="px-6 py-4">{red.last_accessed ? new Date(red.last_accessed).toLocaleString() : 'Never'}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteRedirect(red.id)}
                            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && activeTab === 'robots' && (
        <form onSubmit={handleUpdateRobots} className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col gap-4">
          <h3 className="text-white text-sm font-extrabold uppercase font-sans tracking-wide">Configure Robots.txt Guidelines</h3>
          <span className="text-gray-500 text-xs">Define crawler directories permissions here. Disallowing /admin/ is strongly suggested.</span>
          
          <textarea
            value={robotsText}
            onChange={(e) => setRobotsText(e.target.value)}
            rows={10}
            className="font-mono text-sm glass-input p-4 rounded-xl text-white w-full resize-y"
            required
          />

          <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold text-white">
            Save Robots.txt
          </button>
        </form>
      )}

      {!loading && activeTab === 'audits' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-1">
              <span className="text-gray-500 text-xxs uppercase tracking-wider font-mono">Pages Audited</span>
              <span className="text-white text-2xl font-bold font-sans">{auditSummary.total} Pages</span>
            </div>
            
            <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-1">
              <span className="text-gray-500 text-xxs uppercase tracking-wider font-mono">SEO Warning Items</span>
              <span className={`text-2xl font-bold font-sans ${auditSummary.issues > 0 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                {auditSummary.issues} Errors
              </span>
            </div>

            <button
              onClick={handleRunAudit}
              className="glass-card p-5 rounded-2xl border border-white/5 bg-brand-primary/5 hover:bg-brand-primary/10 flex items-center justify-center gap-2.5 text-brand-primary font-bold text-sm transition-all"
            >
              <Search size={18} /> Trigger Crawler Scan
            </button>
          </div>

          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            <h3 className="text-white text-sm font-extrabold uppercase font-sans tracking-wide p-6 border-b border-white/5">Audit Logs & 404 Reports</h3>
            {audits.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">No scans performed yet. Click the crawler button to check SEO status.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 font-mono text-xxs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Target URL</th>
                      <th className="px-6 py-4">Warnings</th>
                      <th className="px-6 py-4">Broken Alt Tags</th>
                      <th className="px-6 py-4">Response</th>
                      <th className="px-6 py-4 font-mono">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-gray-400">
                    {audits.map((a) => {
                      const warningList = [];
                      if (a.missing_title) warningList.push('Missing Title');
                      if (a.missing_description) warningList.push('Missing Description');
                      if (a.missing_canonical) warningList.push('Missing Canonical');

                      return (
                        <tr key={a.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-6 py-4 font-mono font-semibold text-white">{a.url}</td>
                          <td className="px-6 py-4">
                            {warningList.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {warningList.map((w, idx) => (
                                  <span key={idx} className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-xxs font-medium font-mono uppercase">{w}</span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-emerald-400 font-semibold font-mono text-xxs uppercase">None</span>
                            )}
                          </td>
                          <td className="px-6 py-4">{a.missing_alt_tags || 0}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded font-mono text-xxs uppercase font-semibold ${
                              a.status_code === 200 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {a.status_code || 200}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xxs">{new Date(a.created_at).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && activeTab === 'performance' && (
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col gap-4">
            <h3 className="text-white text-sm font-extrabold uppercase font-sans tracking-wide">Core Web Vitals Telemetry</h3>
            <span className="text-gray-500 text-xs">Averages calculated from visitors device browser performance reports.</span>
            
            {vitals.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">No visitor web metrics collected yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-3">
                {vitals.map((m, idx) => {
                  let threshold = 'text-emerald-400';
                  let status = 'Good';
                  const type = m.metric_type;
                  const val = m.avg_value;

                  if (type === 'TTFB') {
                    if (val > 800) { threshold = 'text-red-400'; status = 'Poor'; }
                    else if (val > 200) { threshold = 'text-amber-400'; status = 'Needs Imp.'; }
                  } else if (type === 'LCP') {
                    if (val > 4000) { threshold = 'text-red-400'; status = 'Poor'; }
                    else if (val > 2500) { threshold = 'text-amber-400'; status = 'Needs Imp.'; }
                  } else if (type === 'CLS') {
                    if (val > 0.25) { threshold = 'text-red-400'; status = 'Poor'; }
                    else if (val > 0.1) { threshold = 'text-amber-400'; status = 'Needs Imp.'; }
                  } else if (type === 'INP') {
                    if (val > 500) { threshold = 'text-red-400'; status = 'Poor'; }
                    else if (val > 200) { threshold = 'text-amber-400'; status = 'Needs Imp.'; }
                  }

                  return (
                    <div key={idx} className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-1.5">
                      <span className="text-white font-extrabold text-sm font-sans tracking-wider">{type}</span>
                      <span className={`text-2xl font-black font-mono ${threshold}`}>
                        {type === 'CLS' ? val.toFixed(3) : `${val.toFixed(0)} ms`}
                      </span>
                      <span className="text-gray-500 text-xxs font-mono uppercase tracking-widest">{status} (Hits: {m.count})</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
