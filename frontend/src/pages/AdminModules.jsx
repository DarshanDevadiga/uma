import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Check, X, Search, FileText, 
  Upload, Download, ShieldCheck, Mail, MapPin, Eye, ExternalLink, Users, Settings
} from 'lucide-react';
import api, { BASE_URL } from '../services/api';

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
  const [types, setTypes] = useState([]);

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
      setTypes(res.data);
    } catch (err) {
      console.error(err);
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
                        {member.membership_type_name}
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
      date: event.date.split('T')[0],
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl relative z-10 border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
              <h3 className="text-white font-bold text-base">{editingEvent ? 'Edit Event Details' : 'Create New Event'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            
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
          </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <div className="glass-card max-w-md w-full p-8 rounded-3xl relative z-10 border border-white/10">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
              <h3 className="text-white font-bold text-base">{editingBearer ? 'Edit Bearer' : 'Add Bearer'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            
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
          </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <div className="glass-card max-w-md w-full p-8 rounded-3xl relative z-10 border border-white/10">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
              <h3 className="text-white font-bold text-base">{editingCommittee ? 'Edit Committee' : 'Create Committee'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            
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
          </div>
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
                    <td className="px-6 py-4 font-semibold text-white truncate max-w-[200px]">{nom.award_name}</td>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <div className="glass-card max-w-md w-full p-8 rounded-3xl relative z-10 border border-white/10">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
              <h3 className="text-white font-bold text-base">{editingPub ? 'Edit Publication Portal' : 'Create Portal Link'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            
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
          </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <div className="glass-card max-w-md w-full p-8 rounded-3xl relative z-10 border border-white/10">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
              <h3 className="text-white font-bold text-base">Add Media Asset</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            
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
          </div>
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
    type: 'news'
  });
  const [imageFile, setImageFile] = useState(null);

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
    setFormData({ title: '', content: '', type: 'news' });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (news) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      content: news.content,
      type: news.type
    });
    setImageFile(null);
    setModalOpen(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) {
      data.append('image', imageFile);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl relative z-10 border border-white/10">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
              <h3 className="text-white font-bold text-base">{editingNews ? 'Edit News Update' : 'Publish News Feed'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            
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
                <label className="text-gray-400 text-xs">Content Text *</label>
                <textarea 
                  value={formData.content} 
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                  rows={5} 
                  className="glass-input px-4 py-2.5 rounded-xl text-white resize-none" required 
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

              <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold mt-2 text-white">Save News Item</button>
            </form>
          </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setSelectedMsg(null)} />
          <div className="glass-card max-w-md w-full p-8 rounded-3xl relative z-10 border border-white/10">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
              <div className="flex flex-col">
                <span className="text-brand-secondary text-xxs font-mono uppercase">Contact Form Query</span>
                <span className="text-white font-bold text-sm truncate max-w-[280px] mt-0.5">{selectedMsg.subject}</span>
              </div>
              <button onClick={() => setSelectedMsg(null)} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
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
          </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setRegistrationsModalOpen(false)} />
          <div className="glass-card max-w-3xl w-full p-8 rounded-3xl relative z-10 border border-white/10 max-h-[90vh] overflow-y-auto bg-dark-card">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
              <div>
                <span className="text-brand-primary font-bold text-xxs font-mono uppercase tracking-widest block mb-0.5">Seat Enrollments</span>
                <h3 className="text-white font-extrabold text-base truncate max-w-xl">{activeProgramForRegistrations.title}</h3>
              </div>
              <button onClick={() => setRegistrationsModalOpen(false)} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
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
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl relative z-10 border border-white/10">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
              <h3 className="text-white font-bold text-base">{editingProg ? 'Edit Program' : 'Create Program'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            
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
          </div>
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
