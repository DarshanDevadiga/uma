import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, Image as ImageIcon, Video, Calendar, ArrowRight, Play, Eye, Clock, X, 
  BookOpen, Search, Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Mail, Phone, 
  FileText, Download, Bell, Send, Check
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Lightbox from '../components/Lightbox';
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

const Media = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    tabParam && ['news', 'photos', 'videos'].includes(tabParam) ? tabParam : 'news'
  );

  useEffect(() => {
    if (tabParam && ['news', 'photos', 'videos'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  const [news, setNews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // Search & Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // all, news, press_release

  // Pagination states
  const [newsPage, setNewsPage] = useState(1);
  const [photoPage, setPhotoPage] = useState(1);
  const [videoPage, setVideoPage] = useState(1);

  const NEWS_PER_PAGE = 2;   // Small size to demonstrate pagination with mock data
  const PHOTOS_PER_PAGE = 4; // Small size to demonstrate pagination
  const VIDEOS_PER_PAGE = 3; // Small size to demonstrate pagination

  // Live bulletin list
  const bulletins = [
    { id: 1, text: 'Nominations for UMA Outstanding Manager Award 2026 extended till June 30th.', type: 'urgent' },
    { id: 2, text: 'Executive Committee meeting scheduled for Sunday, June 14th at PPC Boardroom.', type: 'meeting' },
    { id: 3, text: 'Incubation Center co-working seat registrations are now open for student entrepreneurs.', type: 'registry' },
    { id: 4, text: 'Annual General Body Meeting (AGM) dates announced: August 10th, 2026.', type: 'notice' }
  ];

  // Resources list
  const resources = [
    { id: 1, name: 'UMA Annual Report 2025.pdf', size: '2.4 MB' },
    { id: 2, name: 'Coastal Karnataka Commerce Survey 2026.pdf', size: '4.8 MB' },
    { id: 3, name: 'Membership Guidelines Handbook.pdf', size: '1.2 MB' }
  ];

  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Toast message state
  const [toastMessage, setToastMessage] = useState('');

  // Lightbox control
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [lightboxTitle, setLightboxTitle] = useState('');

  // Blog article reader control
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [modalViews, setModalViews] = useState(142);
  const articleContentRef = useRef(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
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

  const handleDownload = (resName) => {
    triggerToast(`Starting download: ${resName}`);
    setTimeout(() => {
      triggerToast(`Downloaded: ${resName} successfully.`);
    }, 1500);
  };

  const handleCopyLink = (article) => {
    const dummyUrl = `${window.location.origin}/media#news-${article.id || 1}`;
    navigator.clipboard.writeText(dummyUrl)
      .then(() => {
        triggerToast('Article link copied to clipboard!');
      })
      .catch(() => {
        triggerToast('Could not copy link.');
      });
  };

  const getReadTime = (text) => {
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

  useEffect(() => {
    fetchMediaData();
  }, [activeTab]);

  // Reset pagination indexes when filters or search queries change
  useEffect(() => {
    setNewsPage(1);
    setPhotoPage(1);
    setVideoPage(1);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (selectedArticle) {
      setScrollProgress(0);
      setModalViews(Math.floor(Math.random() * 80) + 120);
      if (articleContentRef.current) {
        articleContentRef.current.scrollTop = 0;
      }
    }
  }, [selectedArticle]);

  const fetchMediaData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'news') {
        const res = await api.get('/news');
        setNews(res.data.data);
      } else if (activeTab === 'photos') {
        const res = await api.get('/gallery?type=photo');
        setPhotos(res.data.data);
      } else if (activeTab === 'videos') {
        const res = await api.get('/gallery?type=video');
        setVideos(res.data.data);
      }
    } catch (err) {
      console.warn('Could not fetch media list, using static seed fallback.');
      
      // Rich Seed Fallbacks
      if (activeTab === 'news') {
        setNews([
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
        ]);
      } else if (activeTab === 'photos') {
        setPhotos([
          { id: 1, title: 'Inaugural Meeting 2026', media_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60' },
          { id: 2, title: 'Outstanding Manager Jury Panel', media_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60' },
          { id: 3, title: 'Commerce Teachers Seminar', media_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60' },
          { id: 4, title: 'Auditorium Audience Session', media_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=60' },
          { id: 5, title: 'Executive Board Review Panel', media_url: 'https://images.unsplash.com/photo-1542744173-8e0ee26d22dd?w=800&auto=format&fit=crop&q=60' },
          { id: 6, title: 'Regional Startups Incubator', media_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60' },
          { id: 7, title: 'Annual High-Tea Networking', media_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60' },
          { id: 8, title: 'Commerce PU Spreadsheet Training', media_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60' },
          { id: 9, title: 'Coastal Trade History Seminar', media_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=60' },
          { id: 10, title: 'Post-Graduate Board Session', media_url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&auto=format&fit=crop&q=60' }
        ]);
      } else if (activeTab === 'videos') {
        setVideos([
          { id: 1, title: 'UMA Annual Day Highlights', media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60' },
          { id: 2, title: 'Discussion on AI in Coastal Trade', media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60' },
          { id: 3, title: 'Corporate Governance and Ethics Session', media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60' },
          { id: 4, title: 'Excel Dashboards for Managers Tutorial', media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60' },
          { id: 5, title: 'Coastal Logistics and Ports Roundtable', media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60' },
          { id: 6, title: 'Young Manager Award Interview Highlights', media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60' }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLightbox = (url, title) => {
    setLightboxImage(url);
    setLightboxTitle(title);
    setLightboxOpen(true);
  };

  const handleModalScroll = (e) => {
    const target = e.target;
    const totalHeight = target.scrollHeight - target.clientHeight;
    if (totalHeight > 0) {
      const progress = (target.scrollTop / totalHeight) * 100;
      setScrollProgress(progress);
    }
  };

  // 1. News Filtering and Pagination calculations
  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = (newsPage === 1 && filteredNews.length > 0) ? filteredNews[0] : null;

  const gridNews = (() => {
    if (filteredNews.length === 0) return [];
    if (newsPage === 1) {
      // Page 1 skips the featured article (index 0) and gets up to NEWS_PER_PAGE items
      return filteredNews.slice(1, 1 + NEWS_PER_PAGE);
    } else {
      // Subsequent pages skip the first page items
      const start = 1 + (newsPage - 1) * NEWS_PER_PAGE;
      const end = start + NEWS_PER_PAGE;
      return filteredNews.slice(start, end);
    }
  })();

  const totalNewsPages = (() => {
    if (filteredNews.length <= 1) return 1;
    const remainingCount = filteredNews.length - 1 - NEWS_PER_PAGE;
    if (remainingCount <= 0) return 1;
    return 1 + Math.ceil(remainingCount / NEWS_PER_PAGE);
  })();

  // 2. Photos Filtering and Pagination calculations
  const filteredPhotos = photos.filter(photo => 
    photo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const paginatedPhotos = filteredPhotos.slice((photoPage - 1) * PHOTOS_PER_PAGE, photoPage * PHOTOS_PER_PAGE);
  const totalPhotoPages = Math.ceil(filteredPhotos.length / PHOTOS_PER_PAGE);

  // 3. Videos Filtering and Pagination calculations
  const filteredVideos = videos.filter(vid => 
    vid.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedVideos = filteredVideos.slice((videoPage - 1) * VIDEOS_PER_PAGE, videoPage * VIDEOS_PER_PAGE);
  const totalVideoPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);

  // Get related articles for detail view recommendations
  const getRelatedArticles = (article) => {
    if (!article) return [];
    return news.filter(item => item.id !== article.id).slice(0, 2);
  };

  // Reusable Pagination Component
  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/5 bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:bg-white/5 transition-all duration-200"
        >
          Prev
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-250 border ${
              currentPage === page
                ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/25'
                : 'border-white/5 bg-white/2 text-gray-400 hover:text-white'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/5 bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:bg-white/5 transition-all duration-200"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col relative">
      
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

      {/* Header */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-4 pt-10 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4"
        >
          <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Press & Galleries</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white font-sans">Media Centre</h1>
          <div className="w-20 h-1 bg-brand-primary rounded mx-auto mt-1" />
          <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
            Browse our photo archives, stream video highlights, and read recently issued UMA news feeds and press releases.
          </p>
        </motion.div>
      </section>

      {/* Tabs Menu */}
      <section className="flex justify-center border-b border-white/5 py-2">
        <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl">
          {[
            { id: 'news', label: 'News Blog', icon: Newspaper },
            { id: 'photos', label: 'Photo Gallery', icon: ImageIcon },
            { id: 'videos', label: 'Video Stream', icon: Video }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSearchParams({ tab: tab.id });
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Global Search and Filtering Row */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === 'news' ? 'news & statements' : activeTab === 'photos' ? 'photo galleries' : 'videos'}...`}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 focus:border-brand-primary/50 text-white rounded-xl text-sm focus:outline-none transition-all placeholder-gray-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category filters (Specific to News tab) */}
        {activeTab === 'news' && (
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'All Feeds' },
              { id: 'news', label: 'Association News' },
              { id: 'press_release', label: 'Press Releases' }
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedCategory(chip.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                  selectedCategory === chip.id
                    ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm shadow-brand-primary/5'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Mini stats label for Photos/Videos search */}
        {activeTab !== 'news' && (
          <span className="text-xs text-gray-500 font-mono">
            {activeTab === 'photos' ? `${filteredPhotos.length} Photos` : `${filteredVideos.length} Videos`} found
          </span>
        )}
      </section>

      {/* Content Rendering */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 rounded-full border-t-2 border-brand-primary animate-spin" />
        </div>
      ) : (
        <section className="py-8 min-h-[40vh] border-t border-white/5">
          {/* A. NEWS BLOG TAB */}
          {activeTab === 'news' && (
            <div className="flex flex-col gap-8">
              
              {/* News Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column (News feed) */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                  {filteredNews.length === 0 ? (
                    <div className="py-24 text-center text-gray-500 text-sm bg-white/[0.01] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3">
                      <Newspaper size={36} className="text-gray-600" />
                      <div>No news articles found matching current filters.</div>
                      {(searchQuery || selectedCategory !== 'all') && (
                        <button 
                          onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                          className="text-xs text-brand-secondary hover:underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* 1. Featured Article (Hero Layout) - Only visible on Page 1 */}
                      {featuredArticle && (
                        <motion.div
                          initial={{ opacity: 0, y: 25 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-80px' }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <GlassCard 
                            onClick={() => setSelectedArticle(featuredArticle)}
                            className="p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 border border-white/10 group cursor-pointer overflow-hidden relative"
                            hoverEffect={true}
                          >
                          {/* Top-Right Tag Badge */}
                          <div className="absolute top-4 right-4 z-20">
                            <span className={`px-3 py-1 rounded-full border text-xxs font-extrabold uppercase tracking-wider backdrop-blur-md ${getCategoryBadgeColor(featuredArticle.type)}`}>
                              {featuredArticle.type.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            {/* Featured Image */}
                            <div className="lg:col-span-7 w-full h-[240px] md:h-[300px] rounded-xl overflow-hidden border border-white/5 relative bg-black/40">
                              <img 
                                src={getNewsImage(featuredArticle)} 
                                alt={featuredArticle.title} 
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
                              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md bg-brand-primary/25 border-brand-primary/40 text-brand-primary">
                                Featured Story
                              </div>
                            </div>

                            {/* Featured Info */}
                            <div className="lg:col-span-5 flex flex-col justify-between h-full py-1">
                              <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                                  <span className="flex items-center gap-1.5">
                                    <Calendar size={13} />
                                    {new Date(featuredArticle.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </span>
                                  <span>&bull;</span>
                                  <span>{getReadTime(featuredArticle.content)}</span>
                                </div>

                                <h3 className="text-white font-extrabold text-xl md:text-2xl leading-snug font-sans group-hover:text-brand-primary transition-colors duration-200">
                                  {featuredArticle.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-4 font-light">
                                  {featuredArticle.content}
                                </p>
                              </div>

                              <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary text-xxs font-bold">
                                    PO
                                  </div>
                                  <span className="text-xxs text-gray-500 font-mono uppercase tracking-wider">Press Office</span>
                                </div>
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-secondary group-hover:text-white transition-colors duration-200">
                                  Read Article
                                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                                </span>
                              </div>
                            </div>
                          </div>
                          </GlassCard>
                        </motion.div>
                      )}

                      {/* 2. Regular Articles Grid */}
                      {gridNews.length > 0 && (
                        <motion.div 
                          variants={staggerContainer}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: true, margin: '-60px' }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                          {gridNews.map((item, idx) => {
                            const readTime = getReadTime(item.content);
                            const badgeStyle = getCategoryBadgeColor(item.type);
                            
                            return (
                              <motion.div variants={revealItem} key={item.id || idx}>
                                <GlassCard 
                                  onClick={() => setSelectedArticle(item)}
                                  className="flex flex-col justify-between h-full p-5 border border-white/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                                  hoverEffect={true}
                                >
                                  <div className="flex flex-col gap-4">
                                    {/* Article Card Image */}
                                    <div className="w-full h-44 rounded-xl overflow-hidden border border-white/5 relative bg-black/30">
                                      <img 
                                        src={getNewsImage(item)} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                                      />
                                      <div className="absolute top-3 right-3">
                                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${badgeStyle}`}>
                                          {item.type.replace('_', ' ')}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                                      <span className="flex items-center gap-1.5">
                                        <Calendar size={13} />
                                        {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                      </span>
                                      <span>&bull;</span>
                                      <span className="flex items-center gap-1.5">
                                        <Clock size={13} />
                                        {readTime}
                                      </span>
                                    </div>
                                    
                                    <h3 className="text-white font-bold text-base md:text-lg leading-snug font-sans group-hover:text-brand-primary transition-colors line-clamp-2">
                                      {item.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-light">
                                      {item.content}
                                    </p>
                                  </div>

                                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary text-[9px] font-bold">
                                        PO
                                      </div>
                                      <span className="text-[10px] text-gray-500 font-mono uppercase">Press Office</span>
                                    </div>
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-secondary group-hover:text-white transition-colors">
                                      Read More
                                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                  </div>
                                </GlassCard>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}

                      {/* Pagination controls for News Blog */}
                      <PaginationControls 
                        currentPage={newsPage} 
                        totalPages={totalNewsPages} 
                        onPageChange={setNewsPage} 
                      />
                    </>
                  )}
                </div>

                {/* Right Column (Editorial Sidebar) */}
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-60px' }}
                  className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24"
                >
                  
                  {/* Widget 1: Announcements/Live Bulletins */}
                  <motion.div variants={revealItem}>
                    <GlassCard className="p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                        <Bell size={14} className="animate-pulse" />
                      </div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider font-mono">Live Bulletins</h4>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      {bulletins.map((bul) => {
                        let indicatorColor = 'bg-green-500';
                        if (bul.type === 'urgent') indicatorColor = 'bg-brand-accent animate-ping';
                        if (bul.type === 'meeting') indicatorColor = 'bg-blue-400';
                        if (bul.type === 'registry') indicatorColor = 'bg-yellow-400';

                        return (
                          <div key={bul.id} className="flex gap-3 items-start pb-3 border-b border-white/5 last:border-0 last:pb-0">
                            <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${indicatorColor}`} />
                            <p className="text-gray-400 text-xs leading-normal hover:text-white transition-colors duration-200">
                              {bul.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    </GlassCard>
                  </motion.div>

                  {/* Widget 2: Premium Newsletter Form */}
                  <motion.div variants={revealItem}>
                    <GlassCard className="p-5 border border-white/10 relative overflow-hidden bg-luxury-gradient">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary">
                        <Mail size={14} />
                      </div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider font-mono">UMA Newsletter</h4>
                    </div>

                    <p className="text-gray-400 text-xs leading-relaxed mb-4 font-light">
                      Get workshop updates, conference registrations, and regional commerce audits directly in your inbox.
                    </p>

                    <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                      <div className="relative">
                        <input
                          type="email"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          placeholder="Your email address"
                          required
                          className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 focus:border-brand-primary/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={newsletterSubscribed}
                        className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-350 ${
                          newsletterSubscribed
                            ? 'bg-green-600 text-white cursor-default'
                            : 'bg-brand-primary hover:bg-brand-primary-light text-white shadow-lg shadow-brand-primary/10'
                        }`}
                      >
                        {newsletterSubscribed ? (
                          <>
                            <Check size={13} />
                            Subscribed!
                          </>
                        ) : (
                          <>
                            <Send size={12} />
                            Subscribe
                          </>
                        )}
                      </button>
                    </form>
                  </GlassCard>
                  </motion.div>

                  {/* Widget 3: Resources/Downloads */}
                  <motion.div variants={revealItem}>
                    <GlassCard className="p-5 border border-white/5">
                      <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                        <BookOpen size={14} />
                      </div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider font-mono">Media Resources</h4>
                    </div>

                    <div className="flex flex-col gap-3">
                      {resources.map((res) => (
                        <div 
                          key={res.id} 
                          onClick={() => handleDownload(res.name)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <FileText size={15} className="text-gray-500 group-hover:text-brand-secondary transition-colors" />
                            <div className="overflow-hidden">
                              <span className="text-white text-xs block truncate font-medium">{res.name}</span>
                              <span className="text-[10px] text-gray-500 font-mono">{res.size}</span>
                            </div>
                          </div>
                          <Download size={13} className="text-gray-500 group-hover:text-white transition-colors" />
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                  </motion.div>

                  {/* Widget 4: Media Contact details */}
                  <motion.div variants={revealItem}>
                    <GlassCard className="p-5 border border-white/5 text-xs">
                    <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider font-mono">Press Contact</h4>
                    <div className="flex flex-col gap-2 text-gray-400 font-light leading-relaxed">
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-brand-primary shrink-0" />
                        <span className="hover:text-white cursor-pointer select-all">press@udupimanagement.org</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-brand-primary shrink-0" />
                        <span className="select-all">+91 820 2520412</span>
                      </div>
                      <div className="border-t border-white/5 mt-2 pt-2 text-[10px] text-gray-500 leading-normal uppercase">
                        For press credentials, guest relations, and academic media approvals.
                      </div>
                    </div>
                  </GlassCard>
                  </motion.div>

                </motion.div>

              </div>

            </div>
          )}

          {/* B. PHOTO GALLERY */}
          {activeTab === 'photos' && (
            <div className="flex flex-col gap-8">
              {filteredPhotos.length === 0 ? (
                <div className="text-center py-24 text-gray-500 text-sm bg-white/[0.01] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <ImageIcon size={36} className="text-gray-600" />
                  <div>No photo records matching current search.</div>
                </div>
              ) : (
                <>
                  <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
                  >
                    {paginatedPhotos.map((photo, idx) => {
                      const finalUrl = photo.media_url.startsWith('http') 
                        ? photo.media_url 
                        : `${BASE_URL}${photo.media_url}`;

                      return (
                        <motion.div 
                          key={photo.id || idx} 
                          variants={revealItem}
                          className="break-inside-avoid"
                        >
                          <div 
                            className="glass-card rounded-2xl overflow-hidden border border-white/5 cursor-pointer relative group"
                            onClick={() => handleOpenLightbox(photo.media_url, photo.title)}
                          >
                            <img 
                              src={finalUrl} 
                              alt={photo.title}
                              className="w-full h-auto object-cover rounded-2xl group-hover:scale-[1.02] duration-350"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                              <span className="text-white font-bold text-sm truncate">{photo.title}</span>
                              <span className="text-gray-400 text-xxs font-mono mt-1 flex items-center gap-1">
                                <Eye size={12} /> Click to Expand
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Photo Gallery Pagination */}
                  <PaginationControls 
                    currentPage={photoPage} 
                    totalPages={totalPhotoPages} 
                    onPageChange={setPhotoPage} 
                  />
                </>
              )}
            </div>
          )}

          {/* C. VIDEO STREAM TAB */}
          {activeTab === 'videos' && (
            <div className="flex flex-col gap-8">
              {filteredVideos.length === 0 ? (
                <div className="col-span-full py-24 text-center text-gray-500 text-sm bg-white/[0.01] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <Video size={36} className="text-gray-600" />
                  <div>No video streams matching current search.</div>
                </div>
              ) : (
                <>
                  <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {paginatedVideos.map((vid, idx) => (
                      <motion.div key={vid.id || idx} variants={revealItem}>
                        <GlassCard hoverEffect={true} className="p-4 flex flex-col justify-between h-full border border-white/5">
                          <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/5 bg-black/40 flex items-center justify-center group">
                            <img 
                              src={vid.thumbnail_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60'} 
                              alt={vid.title} 
                              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 duration-500" 
                            />
                            <a 
                              href={vid.media_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="relative z-10 w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/30 group-hover:scale-110 duration-200"
                            >
                              <Play size={20} className="fill-white ml-0.5" />
                            </a>
                          </div>
                          
                          <div className="pt-4 px-2">
                            <h4 className="text-white font-bold text-sm truncate">{vid.title}</h4>
                            <span className="text-xxs text-gray-500 font-mono block mt-1 uppercase">Video Link</span>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Video Stream Pagination */}
                  <PaginationControls 
                    currentPage={videoPage} 
                    totalPages={totalVideoPages} 
                    onPageChange={setVideoPage} 
                  />
                </>
              )}
            </div>
          )}
        </section>
      )}

      {/* Lightbox Portal */}
      <Lightbox 
        isOpen={lightboxOpen} 
        imageSrc={lightboxImage} 
        onClose={() => setLightboxOpen(false)} 
        title={lightboxTitle}
      />

      {/* Premium Full Article Modal Reading View */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            {/* Click outer to close */}
            <div className="absolute inset-0" onClick={() => setSelectedArticle(null)} />
            
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="glass-card max-w-3xl w-full rounded-3xl relative z-10 border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Reading Progress Bar at the top of the modal */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-[21]">
                <div className="h-full bg-brand-primary shadow-[0_0_8px_#ff2a5f]" style={{ width: `${scrollProgress}%` }} />
              </div>

              {/* Header Cover Image */}
              <div className="w-full h-56 md:h-64 relative overflow-hidden bg-black/50 border-b border-white/5 flex items-center justify-center shrink-0">
                <img 
                  src={getNewsImage(selectedArticle)} 
                  alt={selectedArticle.title} 
                  className="w-full h-full object-cover opacity-80" 
                />
                
                {/* Shadow Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
                
                {/* Close Button overlay */}
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-5 right-5 p-2 bg-dark/60 hover:bg-brand-primary text-gray-300 hover:text-white rounded-full backdrop-blur-md transition-all z-20 shadow-lg border border-white/10"
                >
                  <X size={16} />
                </button>

                {/* Article badge overlay inside header */}
                <div className="absolute bottom-5 left-6 md:left-8 flex gap-2">
                  <span className={`px-3 py-1 rounded-full border text-xxs font-extrabold uppercase tracking-wider backdrop-blur-md ${getCategoryBadgeColor(selectedArticle.type)}`}>
                    {(selectedArticle.type || '').replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Text Content Area (Scrollable) */}
              <div 
                ref={articleContentRef}
                onScroll={handleModalScroll}
                className="p-6 md:p-8 flex flex-col gap-5 overflow-y-auto"
              >
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 font-mono border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {new Date(selectedArticle.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {getReadTime(selectedArticle.content)}
                    </span>
                  </div>
                  
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Eye size={12} />
                    {modalViews} views
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight font-sans">
                  {selectedArticle.title}
                </h2>
                
                <div className="w-16 h-1 bg-brand-primary rounded" />

                {/* Paragraph Content */}
                <div className="text-gray-300 text-sm md:text-base leading-relaxed font-light space-y-4 pt-2">
                  {(selectedArticle.content || '').split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Share Article Section */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-xs text-gray-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Share2 size={13} />
                    Share this Update
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => triggerToast('Shared to Twitter!')}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-brand-primary/10 hover:border-brand-primary/20 transition-all"
                      title="Share on Twitter"
                    >
                      <Twitter size={14} />
                    </button>
                    <button 
                      onClick={() => triggerToast('Shared to LinkedIn!')}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-brand-primary/10 hover:border-brand-primary/20 transition-all"
                      title="Share on LinkedIn"
                    >
                      <Linkedin size={14} />
                    </button>
                    <button 
                      onClick={() => triggerToast('Shared to Facebook!')}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-brand-primary/10 hover:border-brand-primary/20 transition-all"
                      title="Share on Facebook"
                    >
                      <Facebook size={14} />
                    </button>
                    <button 
                      onClick={() => handleCopyLink(selectedArticle)}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-brand-primary/10 hover:border-brand-primary/20 transition-all flex items-center gap-1.5 text-xs font-semibold"
                      title="Copy link"
                    >
                      <LinkIcon size={14} />
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Read Next Section */}
                {getRelatedArticles(selectedArticle).length > 0 && (
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider font-mono mb-4">Read Next</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getRelatedArticles(selectedArticle).map((rel) => (
                        <div 
                          key={rel.id} 
                          onClick={() => setSelectedArticle(rel)}
                          className="flex gap-3 items-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/5 shrink-0">
                            <img src={getNewsImage(rel)} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350" />
                          </div>
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-gray-500 font-mono block mb-1">
                              {new Date(rel.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                            <span className="text-white text-xs block font-bold truncate group-hover:text-brand-primary transition-colors">
                              {rel.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Footer details */}
              <div className="p-4 border-t border-white/5 bg-white/2 flex justify-between items-center text-xs text-gray-500 font-mono shrink-0">
                <span>AUTHOR: UMA PRESS OFFICE</span>
                <span>STATUS: PUBLISHED &bull; PUBLIC</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Media;
