import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Calendar, Award, BookOpen, Landmark, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const About = () => {
  const aspects = [
    {
      icon: Shield,
      title: 'Affiliation & Governance',
      description: 'UMA is affiliated with major state federations and functions under an executive body consisting of academic directors and regional corporate leaders.'
    },
    {
      icon: Target,
      title: 'Incubation & Outreach',
      description: 'Collaborating with Poornaprajna institutions to anchor career guidance, local incubation programs, and environmental awareness forums.'
    },
    {
      icon: Calendar,
      title: 'Annual General Meetings (AGM)',
      description: 'Conducted annually to review operational progress, outline fiscal budgets, and plan the regional commerce teacher workshops.'
    },
    {
      icon: Award,
      title: 'Outstanding Manager Award',
      description: 'Our benchmark honor acknowledging regional executive managers showing notable organizational success and ethical corporate citizenship.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col gap-20">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-6 pt-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4"
        >
          <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Who We Are</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight font-sans">
            Udupi Management Association
          </h1>
          <div className="w-24 h-1 bg-brand-primary rounded mx-auto" />
          <p className="text-gray-400 text-base md:text-lg leading-relaxed mt-2 font-light">
            Founded with the goal of bridging academic foundations in business with commercial management, UMA coordinates training programs and educational guidelines across coastal Karnataka.
          </p>
        </motion.div>
      </section>

      {/* Overview & Core History */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col gap-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-sans flex items-center gap-2">
            <Landmark className="text-brand-primary" size={24} />
            Our Legacy & Foundation
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Headquartered in the prestigious educational zone of Udupi at the Poornaprajna College Campus, UMA started as a small committee of commerce teachers looking to coordinate guest lectures.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Over the years, UMA has evolved into a regional management association, incorporating executive board members from leading companies, organizing national-level conferences, and certifying professional training courses.
          </p>
        </div>
        <div className="lg:col-span-6 relative">
          {/* Decorative glass banner */}
          <div className="glass-card p-8 rounded-3xl relative overflow-hidden border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/5 opacity-40 pointer-events-none" />
            <Sparkles className="text-brand-primary mb-4" size={28} />
            <h4 className="text-white font-bold text-lg mb-2">Our Guiding Principle</h4>
            <p className="text-gray-300 text-sm leading-relaxed italic">
              "To combine absolute scientific management methods with a deep ethical framework, guiding coastal Karnataka's commerce curriculum and executive ecosystem towards sustainable global standards."
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Deep-Dive */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="p-8 relative overflow-hidden" hoverEffect={false}>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-brand-primary rounded-full" />
            Vision Statement
          </h3>
          <ul className="flex flex-col gap-3.5 text-gray-400 text-sm leading-relaxed">
            <li>• Serving as the primary interface for industry-academic collaborations in management.</li>
            <li>• Supporting commerce and management research initiatives targeting coastal commerce networks.</li>
            <li>• Fostering continuous educational upskilling for pre-university and degree college lecturers.</li>
            <li>• Building sustainable leadership models that emphasize environmental and community welfare.</li>
          </ul>
        </GlassCard>

        <GlassCard className="p-8 relative overflow-hidden" hoverEffect={false}>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-brand-secondary rounded-full" />
            Mission Statement
          </h3>
          <ul className="flex flex-col gap-3.5 text-gray-400 text-sm leading-relaxed">
            <li>• Conducting executive seminars, lecture series, and national conferences annually.</li>
            <li>• Publishing peer-reviewed commerce research journals (Poornaprajna Journals).</li>
            <li>• Promoting startup incubators and digital literacy workshops for local commerce students.</li>
            <li>• Offering consultancy services to small and medium enterprises (SMEs) in Udupi.</li>
          </ul>
        </GlassCard>
      </section>

      {/* Key Aspects Grid */}
      <section className="flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-sans">Core Aspects of UMA</h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Our operations and programs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aspects.map((aspect, idx) => {
            const Icon = aspect.icon;
            return (
              <GlassCard key={idx} hoverEffect={true} className="flex gap-5 p-6 items-start">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                  <Icon size={18} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-white font-bold text-base">{aspect.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{aspect.description}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default About;
