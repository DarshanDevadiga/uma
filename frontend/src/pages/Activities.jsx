import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, BookOpen, GraduationCap, Flame, Presentation, Target, Trophy } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Activities = () => {
  const activities = [
    {
      title: 'National Management Day',
      subtitle: 'Annual Observance',
      description: 'Celebrating leadership frameworks, hosting executive keynotes, and holding regional panels on corporate sustainability.',
      icon: Flame,
      color: 'text-amber-400'
    },
    {
      title: 'Annual National Conference',
      subtitle: 'Flagship Colloquium',
      description: 'Bringing together research scholars, directors, and managers from across India to present papers on modern business development.',
      icon: Presentation,
      color: 'text-indigo-400'
    },
    {
      title: 'Lecture Series',
      subtitle: 'Monthly Executive Talks',
      description: 'Inviting regional entrepreneurs, bank directors, and corporate specialists to address commerce educators on industry trends.',
      icon: BookOpen,
      color: 'text-sky-400'
    },
    {
      title: 'Management & Technology Talks',
      subtitle: 'Digital Transformation Forums',
      description: 'Seminars targeting modern tech topics (Fintech, Blockchain, AI governance) and their applications in regional trading.',
      icon: Target,
      color: 'text-emerald-400'
    },
    {
      title: 'Special Lectures',
      subtitle: 'Guest Speaker Audits',
      description: 'Short panels conducted inside university campuses addressing MBA, MCom, and BBA student cohorts on career preparation.',
      icon: GraduationCap,
      color: 'text-purple-400'
    },
    {
      title: 'Business Quiz',
      subtitle: 'Inter-Collegiate Tournament',
      description: 'Siginature annual quiz competition for undergraduate business students, offering trophy accolades and monetary sponsorships.',
      icon: Trophy,
      color: 'text-brand-gold'
    },
    {
      title: 'Outstanding Manager Award',
      subtitle: 'Executive Honors',
      description: 'Recognizing regional business stalwarts demonstrating impressive leadership, financial growth, and CSR initiatives.',
      icon: Award,
      color: 'text-rose-400'
    },
    {
      title: 'Student Paper Presentation Competition',
      subtitle: 'Young Scholars Panel',
      description: 'Annual contest giving students a forum to present research papers on local entrepreneurship, trade networks, and digital marketing.',
      icon: Calendar,
      color: 'text-teal-400'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-4 pt-10 pb-4">
        <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Our Calendar</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white font-sans">Activities Timeline</h1>
        <div className="w-20 h-1 bg-brand-primary rounded mx-auto mt-1" />
        <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
          Review the annual schedule of conferences, lectures, quizzes, and award ceremonies conducted by UMA.
        </p>
      </section>

      {/* Timeline Layout */}
      <section className="relative max-w-4xl mx-auto w-full mb-10 py-8 border-t border-white/5">
        {/* Center line for larger screens */}
        <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-primary via-brand-secondary to-brand-accent opacity-25" />

        <div className="flex flex-col gap-12 relative">
          {activities.map((activity, idx) => {
            const Icon = activity.icon;
            const isLeft = idx % 2 === 0;
            // Modulo delay to prevent compounding delays deep down the page
            const staggerDelay = (idx % 3) * 0.12;

            return (
              <div 
                key={idx} 
                className={`flex flex-col md:flex-row relative items-start md:items-center ${
                  isLeft ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Node Icon */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: staggerDelay }}
                  className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 z-10 w-9 h-9 rounded-full bg-dark-card border-2 border-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/10"
                >
                  <Icon size={14} className={activity.color} />
                </motion.div>

                {/* Timeline Panel Card */}
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -35 : 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: staggerDelay }}
                  className={`w-full md:w-[45%] pl-10 md:pl-0 ${
                    isLeft ? 'md:text-right' : 'md:text-left'
                  }`}
                >
                  <GlassCard hoverEffect={true} className="p-6">
                    <span className="text-brand-secondary text-xxs font-bold uppercase tracking-widest font-mono">
                      {activity.subtitle}
                    </span>
                    <h3 className="text-white font-extrabold text-lg mt-1 mb-2 font-sans">{activity.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{activity.description}</p>
                  </GlassCard>
                </motion.div>
                
                {/* Spacer for large screens layout aligning */}
                <div className="hidden md:block w-[10%]" />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Activities;
