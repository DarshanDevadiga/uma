import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, Briefcase, Calendar, Clock, BookOpen, X, Check, ArrowRight, User, Mail, Phone, Building } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import api from '../services/api';

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

const Pd = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal control
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'training': return BookOpen;
      case 'certification': return Award;
      case 'workshop': return GraduationCap;
      case 'seminar': return Calendar;
      case 'industry_session': return Briefcase;
      default: return GraduationCap;
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/training');
      setPrograms(res.data);
    } catch (err) {
      console.warn('Could not fetch training programs, using fallback.');
      setPrograms([
        {
          id: 1,
          title: 'Executive Leadership & Strategic Management',
          description: 'Advanced certification course designed for mid-level managers targeting corporate strategy, digital adaptation, and dispute resolution.',
          type: 'certification',
          duration: '6 Weeks (Saturdays)',
          date: '2026-09-05'
        },
        {
          id: 2,
          title: 'Taxation & Modern Financial Audit Workshop',
          description: 'Intense 2-day seminar for university commerce lecturers to align with recent updates in GST filing and international accounting standards.',
          type: 'workshop',
          duration: '2 Days',
          date: '2026-07-20'
        },
        {
          id: 3,
          title: 'Business Analytics & Data-Driven Decision Making',
          description: 'Hands-on training session covering basics of Excel dashboards, PowerBI, and data analytics tools for managerial operations.',
          type: 'training',
          duration: '4 Sessions',
          date: '2026-08-12'
        },
        {
          id: 4,
          title: 'Coastal Karnataka Industrial Growth Summit',
          description: 'Industry-academic roundtable discussing regional export logistics, marine trade channels, and local employment growth models.',
          type: 'industry_session',
          duration: '1 Day',
          date: '2026-08-30'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (program) => {
    setSelectedProgram(program);
    setBookingFormData({ name: '', email: '', phone: '', organization: '' });
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingFormData.name || !bookingFormData.email || !bookingFormData.phone) {
      triggerToast('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/training/${selectedProgram.id}/register`, bookingFormData);
      setBookingSuccess(true);
      triggerToast('Booking confirmed! Check your email.');
      setTimeout(() => {
        setBookingModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      triggerToast('Error submitting booking registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col gap-10">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 bg-[#0c0d14] border border-brand-primary/30 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium"
          >
            <div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Check size={14} />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.section 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto flex flex-col gap-4 py-12 pt-16"
      >
        <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Upskilling portals</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white font-sans">Professional Development</h1>
        <div className="w-20 h-1 bg-brand-primary rounded mx-auto mt-1" />
        <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
          Enroll in UMA-certified training courses, technical workshops, and seminars coordinated by leading management mentors.
        </p>
      </motion.section>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 rounded-full border-t-2 border-brand-primary animate-spin" />
        </div>
      ) : (
        <motion.section 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 py-16 border-t border-white/5"
        >
          {programs.map((prog, idx) => {
            const Icon = getTypeIcon(prog.type);
            return (
              <motion.div key={prog.id || idx} variants={revealItem}>
                <GlassCard 
                  hoverEffect={true}
                  className="p-8 flex flex-col justify-between h-full border border-white/5 relative group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      {/* Icon */}
                      <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/25">
                        <Icon size={20} />
                      </div>
                      {/* Type Tag */}
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xxs font-bold uppercase tracking-wider text-gray-400">
                        {prog.type.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-white font-bold text-lg mb-2 font-sans group-hover:text-brand-primary transition-colors duration-200">
                      {prog.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                      {prog.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="pt-4 border-t border-white/5 flex flex-wrap justify-between items-center gap-4 text-xs text-gray-500 font-mono font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-brand-primary" />
                        DURATION: {prog.duration}
                      </span>
                      
                      {prog.date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-brand-primary" />
                          START: {new Date(prog.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    <motion.button 
                      onClick={() => handleOpenBooking(prog)}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(99, 102, 241, 0.9)', borderColor: 'rgba(99, 102, 241, 0.9)' }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="w-full mt-2 py-3 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-brand-primary/10 transition-all duration-300"
                    >
                      Book Seat
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.section>
      )}

      {/* Booking Form Modal Overlay */}
      <AnimatePresence>
        {bookingModalOpen && selectedProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="absolute inset-0" onClick={() => !submitting && setBookingModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.97 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="glass-card max-w-md w-full p-8 rounded-3xl relative z-10 border border-white/10 overflow-hidden flex flex-col bg-dark-card"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
                <div>
                  <span className="text-brand-primary font-bold text-xxs font-mono uppercase tracking-widest block mb-0.5">Seat Registration</span>
                  <h3 className="text-white font-extrabold text-lg truncate max-w-[280px]">{selectedProgram.title}</h3>
                </div>
                <button 
                  onClick={() => setBookingModalOpen(false)}
                  disabled={submitting}
                  className="p-1.5 bg-white/5 hover:bg-brand-primary text-gray-400 hover:text-white rounded-full transition-colors disabled:opacity-40"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Form Content / Success Screen */}
              {bookingSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Check size={28} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-1">Booking Confirmed!</h4>
                    <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
                      You have successfully registered for the program. A confirmation email has been dispatched to <strong>{bookingFormData.email}</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4 text-sm">
                  {/* Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-medium">Full Name *</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="text" 
                        placeholder="e.g. Rahul Prasad"
                        value={bookingFormData.name} 
                        onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })} 
                        className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-white w-full text-xs" 
                        required 
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-medium">Email Address *</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="email" 
                        placeholder="e.g. rahul@example.com"
                        value={bookingFormData.email} 
                        onChange={(e) => setBookingFormData({ ...bookingFormData, email: e.target.value })} 
                        className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-white w-full text-xs" 
                        required 
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-medium">Mobile Number *</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="tel" 
                        placeholder="e.g. +91 9876543210"
                        value={bookingFormData.phone} 
                        onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })} 
                        className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-white w-full text-xs" 
                        required 
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  {/* Organization Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-medium">Organization / University (Optional)</label>
                    <div className="relative">
                      <Building size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="text" 
                        placeholder="e.g. MAHE Manipal / Company Name"
                        value={bookingFormData.organization} 
                        onChange={(e) => setBookingFormData({ ...bookingFormData, organization: e.target.value })} 
                        className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-white w-full text-xs" 
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-xl mt-2 flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/10 disabled:opacity-50 disabled:hover:bg-brand-primary transition-all duration-200"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                    ) : (
                      <>
                        Confirm Seat Reservation
                        <Check size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pd;
