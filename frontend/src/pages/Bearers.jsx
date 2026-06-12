import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Landmark } from 'lucide-react';
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

const Bearers = () => {
  const [bearers, setBearers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Group mappings
  const categoryLabels = {
    honorary_president: 'Honorary President',
    working_president: 'Working President',
    secretary: 'Secretary',
    joint_secretary: 'Joint Secretaries',
    treasurer: 'Treasurer',
    executive_committee: 'Executive Committee',
    advisor: 'Advisors'
  };

  const categoryOrder = [
    'honorary_president',
    'working_president',
    'secretary',
    'treasurer',
    'joint_secretary',
    'executive_committee',
    'advisor'
  ];

  useEffect(() => {
    const fetchBearers = async () => {
      try {
        const res = await api.get('/office-bearers');
        setBearers(res.data);
      } catch (err) {
        console.warn('Could not fetch office bearers, using static fallback.');
        setBearers([
          {
            id: 1,
            name: 'Dr. H. Bhaskar Shetty',
            designation: 'Honorary President',
            organization: 'Poornaprajna Institutions',
            image_url: '/uploads/bearers/default_bearer.png',
            category: 'honorary_president'
          },
          {
            id: 2,
            name: 'Sri. K. Devaraj',
            designation: 'Working President',
            organization: 'Vaikunta Baliga College of Law',
            image_url: '/uploads/bearers/default_bearer.png',
            category: 'working_president'
          },
          {
            id: 3,
            name: 'Prof. Ronald J. Moras',
            designation: 'Secretary',
            organization: 'Department of Commerce, PPC',
            image_url: '/uploads/bearers/default_bearer.png',
            category: 'secretary'
          },
          {
            id: 4,
            name: 'Dr. Radhakrishna S.',
            designation: 'Treasurer',
            organization: 'Manipal Institute of Management',
            image_url: '/uploads/bearers/default_bearer.png',
            category: 'treasurer'
          },
          {
            id: 5,
            name: 'Mrs. Mamatha Kamath',
            designation: 'Joint Secretary',
            organization: 'Mahatma Gandhi Memorial College',
            image_url: '/uploads/bearers/default_bearer.png',
            category: 'joint_secretary'
          },
          {
            id: 6,
            name: 'Dr. Sandeep Shenoy',
            designation: 'Advisor',
            organization: 'Manipal Academy of Higher Education',
            image_url: '/uploads/bearers/default_bearer.png',
            category: 'advisor'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBearers();
  }, []);

  // Sort bearers by categoryOrder priority
  const sortedBearers = [...bearers].sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.category);
    const bIndex = categoryOrder.indexOf(b.category);
    const valA = aIndex === -1 ? 999 : aIndex;
    const valB = bIndex === -1 ? 999 : bIndex;
    return valA - valB;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col">
      {/* Header */}
      <motion.section 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto flex flex-col gap-4 pt-10 pb-4"
      >
        <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Our Leadership</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white font-sans">Office Bearers</h1>
        <div className="w-20 h-1 bg-brand-primary rounded mx-auto mt-1" />
        <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
          Meet the executive committee directing the programs, academic committees, and corporate relationships of Udupi Management Association.
        </p>
      </motion.section>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 rounded-full border-t-2 border-brand-primary animate-spin" />
        </div>
      ) : (
        <div className="py-8 border-t border-white/5 mb-6">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedBearers.map((bearer, idx) => (
              <motion.div key={bearer.id || idx} variants={revealItem}>
                <GlassCard 
                  className="p-4 flex flex-col gap-4 group cursor-pointer border border-white/5 relative overflow-hidden"
                  hoverEffect={true}
                >
                  {/* Decorative Background Glows inside the Card */}
                  <div className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full bg-brand-primary/5 blur-2xl pointer-events-none group-hover:bg-brand-primary/10 transition-colors duration-500" />
                  <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-brand-secondary/5 blur-2xl pointer-events-none group-hover:bg-brand-secondary/10 transition-colors duration-500" />
                  
                  {/* Glass Photo Frame Container */}
                  <div className="w-full aspect-square rounded-2xl p-2 bg-white/[0.02] border border-white/10 flex items-center justify-center relative shadow-lg shadow-black/40 backdrop-blur-md overflow-hidden">
                    {/* Floating Category Badge Overlay on Image */}
                    <div className="absolute top-4 left-4 z-30 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md text-[10px] uppercase tracking-wider font-semibold text-brand-primary shadow-lg shadow-black/20">
                      {categoryLabels[bearer.category] || bearer.category}
                    </div>

                    <div className="w-full h-full rounded-xl overflow-hidden relative border border-white/5 bg-dark-card">
                      <img 
                        src={bearer.image_url.startsWith('http') 
                          ? bearer.image_url 
                          : bearer.image_url.startsWith('/uploads')
                            ? `${BASE_URL}${bearer.image_url}`
                            : bearer.image_url
                        } 
                        alt={bearer.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%2327272a"><circle cx="50" cy="35" r="20" fill="%2352525b"/><path d="M20 80c0-15 15-20 30-20s30 5 30 20z" fill="%2352525b"/></svg>';
                        }}
                      />
                      {/* Glass reflections overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.08] to-white/0 pointer-events-none z-10" />
                      {/* Glass sheen sweep overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-20" />
                    </div>
                    {/* Inner glass frame border */}
                    <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
                  </div>
                  
                  <div className="flex flex-col pt-1 px-1 gap-1 z-10">
                    <h4 className="text-white font-bold text-base md:text-lg group-hover:text-brand-primary transition-colors duration-300 truncate">
                      {bearer.name}
                    </h4>
                    <div className="flex items-center mt-0.5">
                      <span className="text-brand-secondary text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 backdrop-blur-sm truncate">
                        {bearer.designation}
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs flex items-center gap-1.5 mt-2.5 truncate">
                      <Landmark size={12} className="shrink-0 text-brand-secondary/70" />
                      <span className="truncate">{bearer.organization}</span>
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Bearers;
