import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import GlassCard from '../components/GlassCard';
import api from '../services/api';

const Committees = () => {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to dynamically load Lucide icons
  const renderIcon = (iconName, size = 24, className = 'text-brand-primary') => {
    const LucideIcon = Icons[iconName] || Icons.BookOpen;
    return <LucideIcon size={size} className={className} />;
  };

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const res = await api.get('/committees');
        setCommittees(res.data);
      } catch (err) {
        console.warn('Could not fetch committees, using static seed fallback.');
        setCommittees([
          {
            id: 1,
            name: 'PU Commerce & Business Management Teachers Committee',
            description: 'Focuses on curriculum development, teaching methodology, and workshops for pre-university commerce educators.',
            icon: 'BookOpen',
            image_url: null
          },
          {
            id: 2,
            name: 'College Commerce & Business Management Teachers Committee',
            description: 'Brings together undergraduate professors to coordinate seminars, research papers, and career counseling guidelines.',
            icon: 'GraduationCap',
            image_url: null
          },
          {
            id: 3,
            name: 'Post Graduate Commerce & Business Management Teachers Committee',
            description: 'Dedicated to advanced MBA and MCom research collaborations, thesis advisement, and doctoral panels.',
            icon: 'Award',
            image_url: null
          },
          {
            id: 4,
            name: 'Industry Collaboration Committee',
            description: 'Bridging the gap between regional business leaders and academics through internships, guest talks, and consultancies.',
            icon: 'Briefcase',
            image_url: null
          },
          {
            id: 5,
            name: 'Commerce & Business Students Committee',
            description: 'Fostering leadership qualities in students by conducting inter-collegiate quizzes, case studies, and business simulations.',
            icon: 'Users',
            image_url: null
          },
          {
            id: 6,
            name: 'Working Professionals Committee',
            description: 'Creating a platform for young executives, managers, and entrepreneurs to network, share ideas, and attend evening executive lectures.',
            icon: 'TrendingUp',
            image_url: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCommittees();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-4 pt-10">
        <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Specialized Councils</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white font-sans">Committees</h1>
        <div className="w-20 h-1 bg-brand-primary rounded mx-auto mt-1" />
        <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
          Explore UMA's distinct committees directing research papers, commerce curriculum structures, and industry-academic interactions.
        </p>
      </section>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 rounded-full border-t-2 border-brand-primary animate-spin" />
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {committees.map((committee, idx) => (
            <GlassCard 
              key={committee.id || idx}
              hoverEffect={true} 
              className="p-8 flex flex-col justify-between h-full hover:-translate-y-2 duration-300"
            >
              <div className="flex flex-col gap-5">
                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/25 shadow-md shadow-brand-primary/5">
                  {renderIcon(committee.icon, 22)}
                </div>

                <div className="flex flex-col gap-2.5">
                  <h3 className="text-white font-bold text-lg leading-snug font-sans">{committee.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{committee.description}</p>
                </div>
              </div>

              {/* Banner graphic indicator */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-medium font-mono">
                <span>COMMITTEE CODE: UMA-0{committee.id || idx + 1}</span>
                <span className="text-brand-secondary font-bold select-none">&bull; ACTIVE</span>
              </div>
            </GlassCard>
          ))}
        </section>
      )}
    </div>
  );
};

export default Committees;
