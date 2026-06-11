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
    advisor: 'Advisors'
  };

  const categoryOrder = [
    'honorary_president',
    'working_president',
    'secretary',
    'treasurer',
    'joint_secretary',
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

  // Filter bearers by category helper
  const getBearersByCategory = (category) => {
    return bearers.filter(bearer => bearer.category === category);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
      {/* Header */}
      <motion.section 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto flex flex-col gap-4 pt-10"
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
        <div className="flex flex-col gap-14">
          {categoryOrder.map((category) => {
            const list = getBearersByCategory(category);
            if (list.length === 0) return null;

            return (
              <div key={category} className="flex flex-col gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider font-sans">
                    {categoryLabels[category]}
                  </h3>
                  <div className="flex-grow h-px bg-white/5" />
                </motion.div>

                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-80px' }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {list.map((bearer, idx) => (
                    <motion.div key={bearer.id || idx} variants={revealItem}>
                      <GlassCard 
                        className="p-5 flex items-center gap-4"
                        hoverEffect={true}
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-white/5 border border-white/10 flex items-center justify-center">
                          <img 
                            src={bearer.image_url.startsWith('http') 
                              ? bearer.image_url 
                              : bearer.image_url.startsWith('/uploads')
                                ? `${BASE_URL}${bearer.image_url}`
                                : bearer.image_url
                            } 
                            alt={bearer.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%2327272a"><circle cx="50" cy="35" r="20" fill="%2352525b"/><path d="M20 80c0-15 15-20 30-20s30 5 30 20z" fill="%2352525b"/></svg>';
                            }}
                          />
                        </div>
                        
                        <div className="flex flex-col truncate">
                          <h4 className="text-white font-bold text-base truncate">{bearer.name}</h4>
                          <span className="text-brand-secondary text-xs font-medium truncate mt-0.5">{bearer.designation}</span>
                          <span className="text-gray-500 text-xs truncate flex items-center gap-1 mt-1">
                            <Landmark size={12} className="shrink-0" />
                            {bearer.organization}
                          </span>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bearers;
