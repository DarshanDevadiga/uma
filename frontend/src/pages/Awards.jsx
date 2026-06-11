import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, FileText, Upload, CheckCircle, ShieldAlert } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import api from '../services/api';

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

const revealItem = {
  hidden: { opacity: 0, y: 25 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
  }
};

const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [formData, setFormData] = useState({
    award_id: '',
    nominee_name: '',
    organization: '',
    email: '',
    phone: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await api.get('/awards');
        setAwards(res.data);
      } catch (err) {
        console.warn('Could not fetch awards list, using fallback.');
        setAwards([
          { id: 1, name: 'Outstanding Manager Award', description: 'Honors executives demonstrating exemplary leadership, organizational growth, and ethical management within the Udupi region.' },
          { id: 2, name: 'Business Excellence Award', description: 'Recognizes organizations showing significant commercial growth, digital transformation, and contribution to local trade.' },
          { id: 3, name: 'Young Teacher Award', description: 'Acknowledges business and commerce educators under 40 showing academic excellence and innovative teaching methods.' }
        ]);
      }
    };
    fetchAwards();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!formData.award_id || !formData.nominee_name || !formData.organization || !formData.email || !formData.phone) {
      setError('All form fields are required.');
      setLoading(false);
      return;
    }

    if (!file) {
      setError('Please upload the supporting nomination document (PDF/Word).');
      setLoading(false);
      return;
    }

    // Prepare multipart form data
    const submissionData = new FormData();
    submissionData.append('award_id', formData.award_id);
    submissionData.append('nominee_name', formData.nominee_name);
    submissionData.append('organization', formData.organization);
    submissionData.append('email', formData.email);
    submissionData.append('phone', formData.phone);
    submissionData.append('document', file);

    try {
      await api.post('/awards/nominate', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess(true);
      setFormData({
        award_id: '',
        nominee_name: '',
        organization: '',
        email: '',
        phone: ''
      });
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Nomination submission failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col gap-10">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-4 py-12 pt-16">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4"
        >
          <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Recognitions</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white font-sans">Awards & Accolades</h1>
          <div className="w-20 h-1 bg-brand-primary rounded mx-auto mt-1" />
          <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
            Nominate outstanding business managers, local business enterprises, or university lecturers for the annual UMA achievements awards.
          </p>
        </motion.div>
      </section>

      {/* Grid: Categories info left, form right */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-10 py-16 border-t border-white/5">
        {/* Categories Details */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          <motion.h3 variants={revealItem} className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <Award className="text-brand-primary" size={20} />
            Accolade Categories
          </motion.h3>

          <div className="flex flex-col gap-4">
            {awards.map((award) => (
              <motion.div key={award.id} variants={revealItem}>
                <GlassCard hoverEffect={true} className="p-5 relative border border-white/5 h-full">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-3">
                    <Award size={15} />
                  </div>
                  <h4 className="text-white font-bold text-base font-sans">{award.name}</h4>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">{award.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Nomination Form */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="lg:col-span-7"
        >
          <GlassCard className="p-8" hoverEffect={false}>
            <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-6">
              <FileText className="text-brand-primary" size={22} />
              <h3 className="text-lg font-bold text-white font-sans">Nomination Portal</h3>
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
                <h4 className="text-white font-bold text-lg mt-2">Nomination Submitted!</h4>
                <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                  Thank you for submitting your nomination. The review committee will evaluate the documents. A confirmation receipt has been sent via email.
                </p>
                <motion.button 
                  onClick={() => setSuccess(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary px-6 py-2.5 rounded-xl text-sm font-medium mt-4 text-white border-white/10"
                >
                  Submit Another Nomination
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <ShieldAlert size={14} className="shrink-0" />
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Select Award Category *</label>
                  <select 
                    name="award_id" 
                    value={formData.award_id} 
                    onChange={handleChange}
                    className="glass-input px-4 py-3 rounded-xl text-sm text-white bg-dark-card" 
                    required
                  >
                    <option value="" disabled className="bg-dark-card text-gray-500">Choose category...</option>
                    {awards.map((award) => (
                      <option key={award.id} value={award.id} className="bg-dark-card text-white">
                        {award.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Nominee Name *</label>
                    <input 
                      type="text" 
                      name="nominee_name" 
                      value={formData.nominee_name} 
                      onChange={handleChange}
                      placeholder="e.g. Jane Doe"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Nominee Organization *</label>
                    <input 
                      type="text" 
                      name="organization" 
                      value={formData.organization} 
                      onChange={handleChange}
                      placeholder="e.g. ABC Corporate, PPC Udupi"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      placeholder="nominee@example.com"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                      required
                    />
                  </div>

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
                </div>

                {/* File Upload Area */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Upload Nomination Document (PDF/Word) *</label>
                  <div className="border border-dashed border-white/10 hover:border-brand-primary/40 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors relative bg-white/2">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                    />
                    <Upload className="text-gray-500 mb-2" size={24} />
                    {file ? (
                      <span className="text-sm text-white font-medium truncate max-w-[280px]">
                        {file.name}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 text-center">
                        Drag & Drop or Click to upload CV / Recommendation letter <br/>
                        (PDF, DOC, DOCX up to 10MB)
                      </span>
                    )}
                  </div>
                </div>

                <motion.button 
                  type="submit" 
                  disabled={loading}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(212, 175, 55, 0.35)' }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full py-4 rounded-xl text-sm font-bold mt-2 shadow-lg text-white"
                >
                  {loading ? 'Submitting Nomination...' : 'Submit Nomination Documents'}
                </motion.button>
              </form>
            )}
          </GlassCard>
        </motion.div>
      </section>
    </div>
  );
};

export default Awards;
