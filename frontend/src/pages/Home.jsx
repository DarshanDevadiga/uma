import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Calendar, Users, Briefcase, ChevronRight, Eye, ShieldCheck, Zap } from 'lucide-react';
import ThreeGlobe from '../components/ThreeGlobe';
import GlassCard from '../components/GlassCard';
import api from '../services/api';

const MotionLink = motion(Link);

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
  hidden: { opacity: 0, y: 35 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
  }
};

const scrollRevealItem = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const Counter = ({ target, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}</span>;
};

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [newsList, setNewsList] = useState([
    {
      id: 1,
      title: 'UMA Partners with MAHE for Regional Incubation',
      content: 'Udupi Management Association has signed an MoU with Manipal Academy of Higher Education to expand research funding for startup models in coastal Karnataka. The incubator will offer co-working office shares at Poornaprajna Campus.',
      type: 'news',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Official Statement on Annual Commerce Workshop Outcomes',
      content: 'The executive council has released summaries of the 2-day lecturers workshop on taxation. Over 120 pre-university teachers attended, finalizing standard classroom spreadsheets.',
      type: 'press_release',
      created_at: new Date().toISOString()
    }
  ]);

  useEffect(() => {
    const fetchHomeEvents = async () => {
      try {
        const res = await api.get('/events?timeFilter=upcoming&limit=3');
        setUpcomingEvents(res.data.data);
      } catch (err) {
        console.warn('Could not fetch upcoming events, using static seed fallback.');
        setUpcomingEvents([
          {
            id: 1,
            title: 'Annual Management Conference 2026',
            date: '2026-07-15',
            location: 'Poornaprajna Auditorium, Udupi',
            description: 'A national panel discussion highlighting AI governance and startup development structures in coastal Karnataka.',
            image_url: null,
            type: 'conference'
          },
          {
            id: 2,
            title: 'Outstanding Manager Award Ceremony',
            date: '2026-08-01',
            location: 'MGM College Hall, Udupi',
            description: 'Honoring regional business executives showing exemplary corporate stewardship and ethical administration.',
            image_url: null,
            type: 'event'
          }
        ]);
      }
    };

    const fetchHomeNews = async () => {
      try {
        const res = await api.get('/news?limit=3');
        if (res.data && res.data.data && res.data.data.length > 0) {
          setNewsList(res.data.data);
        } else {
          throw new Error('Empty news items returned');
        }
      } catch (err) {
        console.warn('Could not fetch news, using fallback.');
      }
    };

    fetchHomeEvents();
    fetchHomeNews();
  }, []);

  return (
    <div className="flex flex-col relative overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center bg-[#0a0a0c] pt-20 pb-10 lg:pb-0">
        {/* Layer 1 (Background): Animated Globe */}
        <div 
          className="absolute z-[1] pointer-events-none lg:pointer-events-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:translate-x-0 lg:-translate-y-1/2 lg:left-auto lg:right-[-15%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] md:left-[55%] lg:w-[1000px] lg:h-[1000px] opacity-35 md:opacity-45 lg:opacity-100"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="w-full h-full flex justify-center items-center"
          >
            <ThreeGlobe />
          </motion.div>
        </div>

        {/* Layer 2 (Foreground): Hero Content */}
        <div className="max-w-7xl mx-auto w-full relative z-[20] px-6 md:px-12 flex items-center justify-center lg:justify-start">
          {/* Left Column: Text Content (max-w-[650px], ml-[8%] on desktop, centered on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col gap-6 w-full max-w-[650px] text-center lg:text-left items-center lg:items-start relative z-[20] lg:ml-[8%]"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold tracking-wider uppercase w-fit">
              <Zap size={12} className="animate-pulse" />
              Fostering Excellence in Management
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
              Shaping Tomorrow's{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent">
                Leaders & Educators
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl font-light">
              Udupi Management Association (UMA) merges academic scholarship with industrial expertise, creating professional platforms across coastal Karnataka.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <MotionLink 
                to="/membership" 
                whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="btn-primary px-8 py-4 rounded-2xl font-semibold text-white flex items-center gap-2 group shadow-xl"
              >
                Join Membership
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </MotionLink>
              
              <MotionLink 
                to="/events" 
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="btn-secondary px-8 py-4 rounded-2xl font-semibold text-gray-300 hover:text-white flex items-center gap-2"
              >
                Explore Events
              </MotionLink>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATISTICS SECTION */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full relative border-t border-white/5">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center"
        >
          {[
            { value: '500', suffix: '+', label: 'Total Members', icon: Users },
            { value: '150', suffix: '+', label: 'Events Conducted', icon: Calendar },
            { value: '12', suffix: '+', label: 'Annual Awards', icon: Award },
            { value: '25', suffix: '+', label: 'Collaborations', icon: Briefcase }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div key={idx} variants={revealItem}>
                <GlassCard hoverEffect={true} className="p-6 md:p-8 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-3">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                    <Counter target={stat.value} />
                    {stat.suffix}
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 3. ABOUT PREVIEW */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full relative border-t border-white/5">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          <motion.div variants={revealItem} className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Overview</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-sans">
              Originating from the Educational Capital
            </h2>
            <div className="w-16 h-1 bg-brand-primary rounded" />
            <p className="text-gray-400 mt-2 leading-relaxed">
              Established and headquartered within the prestigious Poornaprajna College Campus, UMA has spent years guiding executive management development and fostering standard guidelines for commerce education in coastal Karnataka.
            </p>
            <MotionLink 
              to="/about" 
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 350, damping: 12 }}
              className="text-brand-secondary hover:text-white flex items-center gap-1.5 mt-2 font-medium text-sm transition-colors group w-fit"
            >
              Read More About UMA
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </MotionLink>
          </motion.div>
          
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={revealItem}>
              <GlassCard hoverEffect={false}>
                <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  <ShieldCheck className="text-brand-primary" size={20} />
                  Affiliation
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Affiliated with state-level federations and working closely with local universities (Mangalore University, MAHE) to accredit seminars and professional programs.
                </p>
              </GlassCard>
            </motion.div>
            <motion.div variants={revealItem}>
              <GlassCard hoverEffect={false}>
                <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  <Users className="text-brand-secondary" size={20} />
                  Community
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Unifying six major sub-committees coordinating pre-university, undergraduate, and post-graduate business teachers alongside corporate executives and students.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 4. VISION & MISSION */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full relative border-t border-white/5">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div variants={revealItem}>
            <GlassCard className="p-8 md:p-12 relative overflow-hidden h-full" hoverEffect={true}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-bl-full pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6">
                <Eye size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed text-base">
                To be the premier catalyst in regional transformation, developing a network of socially conscious, technologically proficient, and ethically sound administrators who drive sustainable economic and corporate growth.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div variants={revealItem}>
            <GlassCard className="p-8 md:p-12 relative overflow-hidden h-full" hoverEffect={true}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/10 rounded-bl-full pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed text-base">
                To conduct state-of-the-art training initiatives, foster deep industry-academic research partnerships, provide career mentorship portals, and establish benchmarks for business education excellence.
              </p>
            </GlassCard>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. UPCOMING EVENTS */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full relative border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10"
        >
          <div className="flex flex-col gap-2">
            <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Join Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Upcoming Events & Conferences</h2>
            <div className="w-16 h-1 bg-brand-primary rounded mt-1" />
          </div>
          <Link to="/events" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
            See All Events
            <ChevronRight size={16} />
          </Link>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {upcomingEvents.map((event, idx) => (
            <motion.div key={idx} variants={revealItem}>
              <GlassCard className="flex flex-col justify-between h-full p-6" hoverEffect={true}>
                <div>
                  <span className="text-brand-secondary text-xs font-semibold tracking-wider uppercase">{event.type}</span>
                  <h4 className="text-white font-bold text-lg mt-1.5 mb-2 line-clamp-1">{event.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">{event.description}</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex flex-col gap-1.5 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-brand-primary" />
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="truncate">{event.location}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5.5 NEWS & UPDATES SECTION */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full relative border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10"
        >
          <div className="flex flex-col gap-2">
            <span className="text-brand-secondary font-bold text-xs uppercase tracking-widest font-mono">Bulletin</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Latest News & Press Releases</h2>
            <div className="w-16 h-1 bg-brand-secondary rounded mt-1" />
          </div>
          <Link to="/media" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
            Go to Media Centre
            <ChevronRight size={16} />
          </Link>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {newsList.map((item, idx) => (
            <motion.div key={idx} variants={revealItem}>
              <Link to={`/news/${item.slug || item.id}`} className="block h-full">
                <GlassCard className="flex flex-col justify-between h-full p-6 relative overflow-hidden group" hoverEffect={true}>
                  <div>
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                      item.type === 'news' 
                        ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
                        : 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20'
                    }`}>
                      {item.type === 'news' ? 'News' : 'Press Release'}
                    </span>
                    <h4 className="text-white font-bold text-lg mt-3.5 mb-2 group-hover:text-brand-primary transition-colors line-clamp-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">{item.content}</p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500 font-medium">
                    <span>
                      {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-brand-primary group-hover:underline inline-flex items-center gap-0.5">
                      Read Article <ArrowRight size={12} />
                    </span>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 6. AWARDS BRIEF */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full relative border-t border-white/5">
        <motion.div 
          variants={scrollRevealItem}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="p-8 md:p-12 rounded-3xl bg-luxury-gradient border border-white/5 relative overflow-hidden flex flex-col lg:flex-row gap-12 justify-between items-center"
        >
          <div className="absolute inset-0 bg-glow-gradient pointer-events-none" />
          <div className="relative z-10 max-w-xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
              <Award size={24} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white">Outstanding Manager Award</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              UMA’s signature award recognizes executive managers who have made outstanding contributions to commercial development, local job creation, and professional training in Udupi. Nominations are open for the current cycle.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <MotionLink 
              to="/awards" 
              whileHover={{ scale: 1.04, boxShadow: '0 10px 25px -5px rgba(234, 179, 8, 0.3)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="btn-primary bg-none bg-brand-gold text-dark px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-gold/15"
            >
              Submit Nomination
              <ArrowRight size={18} />
            </MotionLink>
          </div>
        </motion.div>
      </section>

      {/* 7. CONTACT CTA */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full text-center relative border-t border-white/5">
        <motion.div 
          variants={scrollRevealItem}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col items-center gap-6"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Ready to Accelerate Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Management Journey?</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
            Get in touch with our administrators to consult on affiliations, request student lectures, or coordinate collaborative seminars.
          </p>
          <MotionLink 
            to="/contact" 
            whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="btn-primary px-8 py-4 rounded-2xl font-bold text-white shadow-xl shadow-brand-primary/20"
          >
            Contact UMA Office
          </MotionLink>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
