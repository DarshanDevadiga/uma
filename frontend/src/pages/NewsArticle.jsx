import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, Eye, Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, 
  ChevronLeft, Newspaper, Send, Check, Mail, User, X
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import api, { BASE_URL } from '../services/api';

const NewsArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewsCount, setViewsCount] = useState(142);
  const [toastMessage, setToastMessage] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Default mock fallback articles
  const defaultNews = [
    {
      id: 1,
      title: 'UMA Partners with MAHE for Regional Incubation',
      content: 'Udupi Management Association has signed a Memorandum of Understanding (MoU) with Manipal Academy of Higher Education to expand research funding for startup models in coastal Karnataka. The incubator will offer co-working office shares at Poornaprajna Campus, providing early-stage business mentorship, legal incorporation advice, and cloud computing grants. The program aims to bridge the gap between academic research and commercial entrepreneurship in Udupi, creating over 200 opportunities for young management graduates.',
      type: 'news',
      created_at: '2026-06-01T10:00:00.000Z',
      image_url: null
    },
    {
      id: 2,
      title: 'Official Statement on Annual Commerce Workshop Outcomes',
      content: 'The executive council of the Udupi Management Association has released a comprehensive summary of the 2-day lecturers workshop on taxation. Over 120 pre-university and undergraduate teachers from around coastal Karnataka attended, finalizing standard classroom spreadsheets and digital teaching frameworks. Experts from leading audit firms shared insights on direct tax reforms, digital bookkeeping integrations, and interactive simulation templates for accounting students.',
      type: 'press_release',
      created_at: '2026-05-24T10:00:00.000Z',
      image_url: null
    },
    {
      id: 3,
      title: 'Outstanding Manager Nominations Extended for 2026 Cycle',
      content: 'Due to a high volume of inquiries from corporate sectors and cooperative banking boards in Udupi, Mangalore, and Kundapura, the executive board of Udupi Management Association has officially extended the deadline for the Outstanding Manager Award 2026 nominations. Corporate entities and public sector organizations can now submit profiles of eligible executives until June 30th. Selected managers will be evaluated by an independent jury panel comprising senior academic advisors and past award recipients.',
      type: 'news',
      created_at: '2026-06-08T09:30:00.000Z',
      image_url: null
    },
    {
      id: 4,
      title: 'Coastal Karnataka Business Conclave Announced',
      content: 'The Udupi Management Association has announced the dates for the upcoming Coastal Karnataka Business Conclave 2026. Scheduled for August 15th at the Poornaprajna Auditorium, the conclave will bring together over 300 business delegates, policymakers, and industry pioneers to discuss logistics, sea trade routes, and infrastructure growth. This year\'s focus is on sustainable commercial ecosystem models for rural and semi-urban coastal hubs.',
      type: 'news',
      created_at: '2026-05-18T14:20:00.000Z',
      image_url: null
    }
  ];

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch article data on ID change
  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      setViewsCount(Math.floor(Math.random() * 80) + 120);
      
      try {
        // Fetch specific article
        const articleRes = await api.get(`/news/${id}`);
        setArticle(articleRes.data);
        
        // Fetch all news for recommendations
        const listRes = await api.get('/news');
        setNewsList(listRes.data.data);
      } catch (err) {
        console.warn('API error fetching article, loading static fallbacks.');
        
        const fallbackArticle = defaultNews.find(item => item.id === parseInt(id));
        if (fallbackArticle) {
          setArticle(fallbackArticle);
        } else {
          // fallback if ID not found, use first item
          setArticle(defaultNews[0]);
        }
        setNewsList(defaultNews);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [id]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        triggerToast('Article link copied to clipboard!');
      })
      .catch(() => {
        triggerToast('Could not copy link.');
      });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    triggerToast('Thank you for subscribing to UMA Insights!');
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubscribed(false);
    }, 4000);
  };

  const getReadTime = (art) => {
    if (!art) return '2 min read';
    const text = (art.paragraph1 || '') + ' ' + (art.paragraph2 || '') + ' ' + (art.paragraph3 || '') + ' ' + (art.content || '');
    const words = text ? text.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const getCategoryBadgeColor = (type) => {
    return type === 'press_release' 
      ? 'border-brand-accent/30 bg-brand-accent/10 text-brand-accent' 
      : 'border-brand-secondary/30 bg-brand-secondary/10 text-brand-secondary';
  };

  const getNewsImage = (item) => {
    if (!item) return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60';
    if (item.image_url) {
      return `${BASE_URL}${item.image_url}`;
    }
    
    const title = (item.title || '').toLowerCase();
    if (title.includes('incubation') || title.includes('mahe') || title.includes('startup') || title.includes('mou')) {
      return 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60';
    }
    if (title.includes('workshop') || title.includes('teachers') || title.includes('seminar') || title.includes('lecturers')) {
      return 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60';
    }
    if (title.includes('nomination') || title.includes('award') || title.includes('ceremony') || title.includes('jury')) {
      return 'https://images.unsplash.com/photo-1531844251246-9a1bfaae09a6?w=800&auto=format&fit=crop&q=60';
    }
    if (title.includes('conclave') || title.includes('summit') || title.includes('conference') || title.includes('annual')) {
      return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60';
    }
    
    const sum = item.id ? item.id : item.title.charCodeAt(0) || 0;
    const fallbacks = [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=60'
    ];
    return fallbacks[sum % fallbacks.length];
  };

  const getRelatedArticles = () => {
    if (!article) return [];
    return newsList.filter(item => item.id !== article.id).slice(0, 3);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 flex flex-col relative pt-20 pb-32">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <div className="h-full bg-brand-primary shadow-[0_0_8px_#ff2a5f]" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[999] px-5 py-3 rounded-2xl bg-dark-card border border-white/10 shadow-2xl backdrop-blur-md flex items-center gap-3 text-sm text-white"
          >
            <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
              <Check size={14} />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Media Button */}
      <div className="mb-12">
        <Link 
          to="/media?tab=news" 
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-250 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Media Centre
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="w-10 h-10 rounded-full border-t-2 border-brand-primary animate-spin" />
        </div>
      ) : article ? (
        <div className="w-full flex flex-col gap-10">
          
          {/* Main Content */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              {/* Category, Date, read time */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono tracking-wider">
                <span className={`px-3 py-1 rounded-full border text-xxs font-extrabold uppercase tracking-wider ${getCategoryBadgeColor(article.type)}`}>
                  {(article.type || '').replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {new Date(article.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {getReadTime(article)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight font-sans tracking-tight">
                {article.title}
              </h1>
              <div className="w-24 h-2 bg-brand-primary rounded-full shadow-[0_0_8px_#ff2a5f]" />
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 relative bg-black/40 shadow-2xl shadow-brand-primary/5"
            >
              <img 
                src={getNewsImage(article)} 
                alt={article.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/75 via-transparent to-transparent" />
            </motion.div>

            {/* Article Content */}
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-8 w-full mt-4"
            >
              <div className="text-gray-200/90 text-lg md:text-xl leading-relaxed font-normal space-y-6 tracking-wide flex flex-col gap-6">
                {article.paragraph1 ? (
                  <p className="whitespace-pre-line">{article.paragraph1}</p>
                ) : (
                  (article.content || '').split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                )}

                {/* Additional Images Grid */}
                {article.images && article.images.length > 0 && (
                  <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {article.images.map((imgUrl, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedImage(`${BASE_URL}${imgUrl}`)}
                        className="group relative aspect-video sm:aspect-square rounded-2xl overflow-hidden border border-white/10 cursor-pointer shadow-lg shadow-black/30 backdrop-blur-md"
                      >
                        <img 
                          src={`${BASE_URL}${imgUrl}`} 
                          alt={`Gallery image ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white backdrop-blur-sm shadow-lg">View Full Image</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {article.paragraph2 && (
                  <p className="whitespace-pre-line">{article.paragraph2}</p>
                )}

                {article.paragraph3 && (
                  <p className="whitespace-pre-line">{article.paragraph3}</p>
                )}
              </div>

              {/* Share section */}
              <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 size={13} />
                  Share this Article
                </span>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => triggerToast('Shared to Twitter!')}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-brand-primary/10 hover:border-brand-primary/20 transition-all"
                  >
                    <Twitter size={14} />
                  </button>
                  <button 
                    onClick={() => triggerToast('Shared to LinkedIn!')}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-brand-primary/10 hover:border-brand-primary/20 transition-all"
                  >
                    <Linkedin size={14} />
                  </button>
                  <button 
                    onClick={() => triggerToast('Shared to Facebook!')}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-brand-primary/10 hover:border-brand-primary/20 transition-all"
                  >
                    <Facebook size={14} />
                  </button>
                  <button 
                    onClick={handleCopyLink}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-brand-primary/10 hover:border-brand-primary/20 transition-all flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <LinkIcon size={14} />
                    Copy Link
                  </button>
                </div>
              </div>
            </motion.article>
          </div>

          {/* Read Next Section (Full Width) */}
          {getRelatedArticles().length > 0 && (
            <div className="mt-8 pt-10 border-t border-white/5 w-full">
              <h4 className="text-white font-bold text-lg uppercase tracking-wider font-mono mb-6 flex items-center gap-2">
                <Newspaper size={18} className="text-brand-primary" />
                Read Next
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {getRelatedArticles().map((rel) => (
                  <Link 
                    key={rel.id} 
                    to={`/news/${rel.slug || rel.id}`}
                    className="flex flex-col p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/5 mb-3">
                      <img src={getNewsImage(rel)} alt={rel.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-350" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(rel.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-white text-sm font-bold line-clamp-2 group-hover:text-brand-primary transition-colors">
                        {rel.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 font-sans">
          News article not found.
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center overflow-hidden rounded-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImage} alt="Expanded view" className="max-w-full max-h-[80vh] object-contain" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/80 transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsArticle;
