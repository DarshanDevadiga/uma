import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, Briefcase, Calendar, Clock, BookOpen } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import api from '../services/api';

const Pd = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const fetchPrograms = async () => {
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
    fetchPrograms();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-4 pt-10">
        <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Upskilling portals</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white font-sans">Professional Development</h1>
        <div className="w-20 h-1 bg-brand-primary rounded mx-auto mt-1" />
        <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
          Enroll in UMA-certified training courses, technical workshops, and seminars coordinated by leading management mentors.
        </p>
      </section>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 rounded-full border-t-2 border-brand-primary animate-spin" />
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {programs.map((prog, idx) => {
            const Icon = getTypeIcon(prog.type);
            return (
              <GlassCard 
                key={prog.id || idx}
                hoverEffect={true}
                className="p-8 flex flex-col justify-between h-full border border-white/5 relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/25">
                      <Icon size={20} />
                    </div>
                    {/* Type Tag */}
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xxs font-bold uppercase tracking-wider text-gray-400">
                      {prog.type}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2 font-sans">{prog.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{prog.description}</p>
                </div>

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
              </GlassCard>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default Pd;
