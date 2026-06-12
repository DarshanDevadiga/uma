import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Tag, X, FileText, CheckCircle, ShieldAlert } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import api, { BASE_URL } from '../services/api';

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

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Registration Form state
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: ''
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState('');

  // Filters
  const [filterType, setFilterType] = useState('all'); // all, event, conference
  const [timeFilter, setTimeFilter] = useState('upcoming'); // upcoming, past

  useEffect(() => {
    fetchEvents();
  }, [timeFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/events?timeFilter=${timeFilter}`);
      setEvents(res.data.data);
    } catch (err) {
      console.warn('Could not fetch events, using fallback seed data.');
      // Static Fallback data
      const sampleEvents = [
        {
          id: 1,
          title: 'Annual National Management Conference 2026',
          description: 'A national panel discussion highlighting AI governance and startup development structures in coastal Karnataka.',
          content: 'The Annual National Management Conference focuses on building resilient business frameworks under the shift of automated intelligence. Keynote speakers include directors of leading technological firms, bank administrators, and startup founders. Register to lock in your certification.',
          date: '2026-07-15',
          time: '10:00:00',
          location: 'Poornaprajna Auditorium, Udupi',
          image_url: null,
          type: 'conference'
        },
        {
          id: 2,
          title: 'Outstanding Manager Award Ceremony 2026',
          description: 'Honoring regional business executives showing exemplary corporate stewardship and ethical administration.',
          content: 'Join the Udupi Management Association as we honor regional executive directors and supervisors showing significant success in their organizations. High-tea networking will follow the ceremony.',
          date: '2026-08-01',
          time: '17:30:00',
          location: 'MGM College Hall, Udupi',
          image_url: null,
          type: 'event'
        },
        {
          id: 3,
          title: 'Management Lectures on Coastal Trade History',
          description: 'A historical audit of the trade networks, port logistics, and banking structures of coastal Karnataka.',
          content: 'Conducted by the PG Commerce Teachers Committee, this session outlines the historical developments of commerce in Udupi and Mangalore, analyzing how cooperative banking evolved.',
          date: '2026-05-10',
          time: '14:00:00',
          location: 'Vaikunta Baliga Auditorium, Udupi',
          image_url: null,
          type: 'event'
        }
      ];

      // Client-side time filtering for static list
      const today = new Date().toISOString().split('T')[0];
      const filtered = sampleEvents.filter(evt => {
        if (timeFilter === 'upcoming') {
          return evt.date >= today;
        } else {
          return evt.date < today;
        }
      });
      setEvents(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRegister = (event) => {
    setSelectedEvent(event);
    setRegError('');
    setRegSuccess(false);
    setRegForm({
      name: '',
      email: '',
      phone: '',
      organization: ''
    });
  };

  const handleRegChange = (e) => {
    setRegForm({
      ...regForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');
    setRegSuccess(false);

    if (!regForm.name || !regForm.email || !regForm.phone) {
      setRegError('Name, Email, and Phone number are required.');
      setRegLoading(false);
      return;
    }

    try {
      await api.post('/events/register', {
        event_id: selectedEvent.id,
        ...regForm
      });
      setRegSuccess(true);
    } catch (err) {
      setRegError(err.response?.data?.message || 'Failed to submit registration. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  // Filter events list
  const filteredEvents = events.filter(evt => {
    if (filterType === 'all') return true;
    return evt.type === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-4 pt-10 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4"
        >
          <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Forums & Schedules</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white font-sans">Events & Conferences</h1>
          <div className="w-20 h-1 bg-brand-primary rounded mx-auto mt-1" />
          <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
            Register to participate in our upcoming workshops, regional business lectures, and annual conferences.
          </p>
        </motion.div>
      </section>

      {/* Filters Control Toolbar */}
      <section className="flex flex-col md:flex-row md:justify-between items-center gap-6 border-b border-white/5 py-4">
        {/* Time filters tabs */}
        <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl shrink-0">
          <button 
            onClick={() => setTimeFilter('upcoming')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              timeFilter === 'upcoming' 
                ? 'bg-brand-primary text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setTimeFilter('past')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              timeFilter === 'past' 
                ? 'bg-brand-primary text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Past Events
          </button>
        </div>

        {/* Type filters */}
        <div className="flex gap-3">
          {['all', 'event', 'conference'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-colors ${
                filterType === type
                  ? 'bg-brand-primary/10 border-brand-primary text-white'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </section>

      {/* Events Grid */}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 py-8"
        >
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500 text-sm">
              No events found matching the criteria.
            </div>
          ) : (
            filteredEvents.map((event, idx) => (
              <motion.div key={event.id || idx} variants={revealItem}>
                <GlassCard 
                  hoverEffect={true}
                  className="flex flex-col justify-between h-full p-6"
                >
                  <div>
                    {/* Banner image if present, otherwise category tag */}
                    {event.image_url ? (
                      <div className="w-full h-40 rounded-xl overflow-hidden mb-4 border border-white/5">
                        <img 
                          src={`${BASE_URL}${event.image_url}`} 
                          alt={event.title}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-brand-secondary text-xs font-bold uppercase tracking-wider mb-3.5">
                        <Tag size={12} />
                        {event.type}
                      </div>
                    )}

                    <h3 className="text-white font-bold text-lg leading-snug line-clamp-1 mb-2">{event.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">{event.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex flex-col gap-2 text-xs text-gray-500 font-medium font-mono">
                    <span className="flex items-center gap-2">
                      <Calendar size={13} className="text-brand-primary" />
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={13} className="text-brand-primary" />
                      {event.time.slice(0, 5)}
                    </span>
                    <span className="flex items-start gap-2 truncate">
                      <MapPin size={13} className="text-brand-primary shrink-0 mt-0.5" />
                      <span className="truncate">{event.location}</span>
                    </span>

                    {timeFilter === 'upcoming' && (
                      <motion.button 
                        onClick={() => handleOpenRegister(event)}
                        whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary w-full py-2.5 rounded-xl text-center text-xs font-semibold mt-4 text-white uppercase tracking-wider"
                      >
                        Register Now
                      </motion.button>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </motion.section>
      )}

      {/* Event Registration Overlay Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            {/* Click outer to close */}
            <div className="absolute inset-0" onClick={() => setSelectedEvent(null)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="glass-card max-w-lg w-full p-8 rounded-3xl relative z-10 border border-white/10"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
                <div className="flex flex-col">
                  <span className="text-brand-secondary text-xxs font-bold uppercase tracking-widest font-mono">Event Attendance</span>
                  <h3 className="text-white font-bold text-lg leading-tight truncate max-w-[320px]">{selectedEvent.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {regSuccess ? (
                <div className="flex flex-col items-center gap-4 text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle size={28} />
                  </div>
                  <h4 className="text-white font-bold text-lg">Registration Successful!</h4>
                  <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                    We have successfully registered your seat. A verification email containing program schedules has been dispatched.
                  </p>
                  <motion.button 
                    onClick={() => setSelectedEvent(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary px-6 py-2.5 rounded-xl text-sm font-medium mt-4 text-white border-white/10"
                  >
                    Close Portal
                  </motion.button>
                </div>
              ) : (
                <form onSubmit={handleRegSubmit} className="flex flex-col gap-4">
                  {regError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                      <ShieldAlert size={14} className="shrink-0" />
                      {regError}
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={regForm.name} 
                      onChange={handleRegChange}
                      placeholder="Enter name"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={regForm.email} 
                      onChange={handleRegChange}
                      placeholder="john@example.com"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={regForm.phone} 
                      onChange={handleRegChange}
                      placeholder="e.g. +91 9876543210"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Organization/College</label>
                    <input 
                      type="text" 
                      name="organization" 
                      value={regForm.organization} 
                      onChange={handleRegChange}
                      placeholder="e.g. ABC Corporate, PPC Udupi"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                    />
                  </div>

                  <motion.button 
                    type="submit" 
                    disabled={regLoading}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(212, 175, 55, 0.35)' }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold mt-2 shadow-lg text-white"
                  >
                    {regLoading ? 'Processing Ticket...' : 'Confirm Registration'}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
