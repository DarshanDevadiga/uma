import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, ShieldAlert } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import api from '../services/api';

const Membership = () => {
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    membershipTypeId: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembershipTypes = async () => {
      try {
        const res = await api.get('/memberships/types');
        setTypes(res.data);
      } catch (err) {
        console.warn('Could not fetch membership types, using fallback.');
        setTypes([
          { id: 1, name: 'Executive Member', fee: 5000.00, description: 'Access to governance meetings and executive board voting privileges.' },
          { id: 2, name: 'Life Member', fee: 10000.00, description: 'Lifetime association membership status and all general meeting benefits.' },
          { id: 3, name: 'Industry Member', fee: 15000.00, description: 'Tailored for corporate representatives and corporate collaborations.' },
          { id: 4, name: 'Academic Member', fee: 2000.00, description: 'Specially designed for educators, professors, and academic leaders.' },
          { id: 5, name: 'Student Member', fee: 500.00, description: 'For students seeking career mentorship and management networking.' }
        ]);
      }
    };
    fetchMembershipTypes();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.occupation || !formData.membershipTypeId) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/memberships/register', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        occupation: '',
        membershipTypeId: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-4 pt-10">
        <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Join UMA Portal</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white font-sans">Association Membership</h1>
        <div className="w-20 h-1 bg-brand-primary rounded mx-auto mt-1" />
        <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
          Review membership tiers and submit your registration details. Your application will be reviewed by the board.
        </p>
      </section>

      {/* Main Grid: Info on Left, Form on Right */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-10">
        {/* Left Tiers Overview */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <Users className="text-brand-primary" size={20} />
            Membership Categories
          </h3>
          
          <div className="flex flex-col gap-4">
            {types.map((type) => (
              <GlassCard key={type.id} hoverEffect={false} className="p-4">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white text-base font-sans">{type.name}</span>
                  <span className="text-brand-secondary text-sm font-semibold font-mono">
                    ₹{parseInt(type.fee).toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{type.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7">
          <GlassCard className="p-8 relative overflow-hidden" hoverEffect={false}>
            <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-6">
              <FileText className="text-brand-primary" size={22} />
              <h3 className="text-lg font-bold text-white font-sans">Registration Form</h3>
            </div>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 text-center py-10"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                  <CheckCircle size={32} />
                </div>
                <h4 className="text-white font-bold text-lg mt-2">Application Submitted!</h4>
                <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                  Thank you for applying. A confirmation email has been dispatched. Our administrative panel will review your application soon.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="btn-secondary px-6 py-2.5 rounded-xl text-sm font-medium mt-4 border-white/10 text-white"
                >
                  Apply for Another Tier
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <ShieldAlert size={14} className="shrink-0" />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      placeholder="e.g. john@example.com"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="e.g. +91 9876543210"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Occupation *</label>
                    <input 
                      type="text" 
                      name="occupation" 
                      value={formData.occupation} 
                      onChange={handleChange}
                      placeholder="e.g. Professor, Manager"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Membership Category *</label>
                  <select 
                    name="membershipTypeId" 
                    value={formData.membershipTypeId} 
                    onChange={handleChange}
                    className="glass-input px-4 py-3 rounded-xl text-sm text-white bg-dark-card" 
                    required
                  >
                    <option value="" disabled className="bg-dark-card text-gray-500">Select membership type...</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.id} className="bg-dark-card text-white">
                        {type.name} (₹{parseInt(type.fee).toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Residential/Official Address *</label>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange}
                    placeholder="Enter complete postal address details..."
                    rows={3}
                    className="glass-input px-4 py-3 rounded-xl text-sm text-white resize-none" 
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary w-full py-4.5 rounded-xl text-sm font-bold mt-2 shadow-lg"
                >
                  {loading ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default Membership;
