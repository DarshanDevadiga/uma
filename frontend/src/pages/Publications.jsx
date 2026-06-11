import React, { useState, useEffect } from 'react';
import { BookOpen, Library, Landmark, Scale, Cpu, TreePine, Lightbulb, UserCheck, ArrowUpRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import api from '../services/api';

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mappings for icons based on title keywords
  const getIcon = (type) => {
    switch (type) {
      case 'journal': return BookOpen;
      case 'digital_library': return Library;
      case 'publication_portal': return Landmark;
      case 'consultancy': return Scale;
      case 'science_tech': return Cpu;
      case 'environmental': return TreePine;
      case 'incubator': return Lightbulb;
      case 'career': return UserCheck;
      default: return BookOpen;
    }
  };

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await api.get('/publications');
        setPublications(res.data);
      } catch (err) {
        console.warn('Could not fetch publications, using static fallback.');
        setPublications([
          {
            id: 1,
            title: 'Poornaprajna Journals',
            type: 'journal',
            description: 'Double-blind peer-reviewed journal publishing quarterly research papers in accounting, corporate governance, and regional commerce developments.',
            link_url: '#'
          },
          {
            id: 2,
            title: 'UMA Digital Library',
            type: 'digital_library',
            description: 'Online archive containing reference materials, previous lecture slides, AGM reports, and student thesis digests.',
            link_url: '#'
          },
          {
            id: 3,
            title: 'SME Consultancy Services',
            type: 'consultancy',
            description: 'Advisory panel comprising retired managers and academic professors providing free structural audits and market consultancies to Udupi start-ups.',
            link_url: '#'
          },
          {
            id: 4,
            title: 'Incubation Center',
            type: 'incubator',
            description: 'Fostering local student entrepreneurship through prototyping grants, co-working office shares, and mentorship matching panels.',
            link_url: '#'
          },
          {
            id: 5,
            title: 'Science & Technology Centre',
            type: 'science_tech',
            description: 'Facilitating business analytics training, digital spreadsheet workshops, and software engineering basics for commerce educators.',
            link_url: '#'
          },
          {
            id: 6,
            title: 'Environmental Awareness Center',
            type: 'environmental',
            description: 'Anchor for local CSR events, waste auditing workshops, and promoting green auditing benchmarks for coastal business setups.',
            link_url: '#'
          },
          {
            id: 7,
            title: 'Career Counselling Centre',
            type: 'career',
            description: 'Offering mock interview panels, CV audits, resume templates, and corporate internship listings for commerce and MBA students.',
            link_url: '#'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-4 pt-10">
        <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Academic outreach</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white font-sans">Publications & Centres</h1>
        <div className="w-20 h-1 bg-brand-primary rounded mx-auto mt-1" />
        <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
          Access our research publications, enter the digital library, or explore our consulting, incubator, and career mentoring centers.
        </p>
      </section>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 rounded-full border-t-2 border-brand-primary animate-spin" />
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {publications.map((pub, idx) => {
            const IconComponent = getIcon(pub.type);
            return (
              <GlassCard 
                key={pub.id || idx}
                hoverEffect={true}
                className="p-6 flex flex-col justify-between h-full hover:-translate-y-2 duration-300"
              >
                <div className="flex flex-col gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/25">
                    <IconComponent size={18} />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white font-bold text-lg leading-snug font-sans">{pub.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{pub.description}</p>
                  </div>
                </div>

                {/* Bottom link */}
                <div className="mt-8 pt-4 border-t border-white/5 flex justify-end">
                  <a 
                    href={pub.link_url} 
                    className="flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:text-white transition-colors group"
                  >
                    Open Portal
                    <ArrowUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </GlassCard>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default Publications;
