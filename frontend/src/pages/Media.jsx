import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Image as ImageIcon, Video, Calendar, ArrowRight, Play, Eye } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Lightbox from '../components/Lightbox';
import api, { BASE_URL } from '../services/api';

const Media = () => {
  const [activeTab, setActiveTab] = useState('news'); // news, photos, videos
  
  const [news, setNews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // Lightbox control
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [lightboxTitle, setLightboxTitle] = useState('');

  useEffect(() => {
    fetchMediaData();
  }, [activeTab]);

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
      
      // Seed Fallbacks
      if (activeTab === 'news') {
        setNews([
          {
            id: 1,
            title: 'UMA Partners with MAHE for Regional Incubation',
            content: 'Udupi Management Association has signed an MoU with Manipal Academy of Higher Education to expand research funding for startup models in coastal Karnataka. The incubator will offer co-working office shares at Poornaprajna Campus.',
            type: 'news',
            created_at: '2026-06-01T10:00:00.000Z',
            image_url: null
          },
          {
            id: 2,
            title: 'Official Statement on Annual Commerce Workshop Outcomes',
            content: 'The executive council has released summaries of the 2-day lecturers workshop on taxation. Over 120 pre-university teachers attended, finalizing standard classroom spreadsheets.',
            type: 'press_release',
            created_at: '2026-05-24T10:00:00.000Z',
            image_url: null
          }
        ]);
      } else if (activeTab === 'photos') {
        setPhotos([
          { id: 1, title: 'Inaugural Meeting 2026', media_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60' },
          { id: 2, title: 'Outstanding Manager Jury Panel', media_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60' },
          { id: 3, title: 'Commerce Teachers Seminar', media_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60' },
          { id: 4, title: 'Auditorium Audience Session', media_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=60' }
        ]);
      } else if (activeTab === 'videos') {
        setVideos([
          { id: 1, title: 'UMA Annual Day Highlights', media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60' },
          { id: 2, title: 'Discussion on AI in Coastal Trade', media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60' }
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

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-4 pt-10">
        <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Press & Galleries</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white font-sans">Media Centre</h1>
        <div className="w-20 h-1 bg-brand-primary rounded mx-auto mt-1" />
        <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
          Browse our photo archives, stream video highlights, and read recently issued UMA news feeds and press releases.
        </p>
      </section>

      {/* Tabs Menu */}
      <section className="flex justify-center border-b border-white/5 pb-4">
        <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl">
          {[
            { id: 'news', label: 'News Feed', icon: Newspaper },
            { id: 'photos', label: 'Photo Gallery', icon: ImageIcon },
            { id: 'videos', label: 'Video Stream', icon: Video }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

      {/* Content Rendering */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 rounded-full border-t-2 border-brand-primary animate-spin" />
        </div>
      ) : (
        <section className="mb-10 min-h-[40vh]">
          {/* A. NEWS FEED TAB */}
          {activeTab === 'news' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news.length === 0 ? (
                <div className="col-span-full py-16 text-center text-gray-500 text-sm">No news updates.</div>
              ) : (
                news.map((item, idx) => (
                  <GlassCard key={item.id || idx} hoverEffect={true} className="p-8 flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="uppercase text-brand-secondary font-bold">{item.type}</span>
                      </div>
                      
                      <h3 className="text-white font-extrabold text-xl leading-snug font-sans">{item.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-4">{item.content}</p>
                    </div>

                    {item.image_url && (
                      <div className="w-full h-48 rounded-xl overflow-hidden mt-6 border border-white/5">
                        <img src={`${BASE_URL}${item.image_url}`} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </GlassCard>
                ))
              )}
            </div>
          )}

          {/* B. PHOTO GALLERY (Masonry columns grid) */}
          {activeTab === 'photos' && (
            <div>
              {photos.length === 0 ? (
                <div className="text-center py-16 text-gray-500 text-sm">No photo records.</div>
              ) : (
                <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                  {photos.map((photo, idx) => {
                    const finalUrl = photo.media_url.startsWith('http') 
                      ? photo.media_url 
                      : `${BASE_URL}${photo.media_url}`;

                    return (
                      <div 
                        key={photo.id || idx} 
                        className="break-inside-avoid glass-card rounded-2xl overflow-hidden border border-white/5 cursor-pointer relative group"
                        onClick={() => handleOpenLightbox(photo.media_url, photo.title)}
                      >
                        <img 
                          src={finalUrl} 
                          alt={photo.title}
                          className="w-full h-auto object-cover rounded-2xl group-hover:scale-[1.02] duration-300"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <span className="text-white font-bold text-sm truncate">{photo.title}</span>
                          <span className="text-gray-400 text-xxs font-mono mt-1 flex items-center gap-1">
                            <Eye size={12} /> Click to Expand
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* C. VIDEO STREAM TAB */}
          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.length === 0 ? (
                <div className="col-span-full py-16 text-center text-gray-500 text-sm">No video streams.</div>
              ) : (
                videos.map((vid, idx) => (
                  <GlassCard key={vid.id || idx} hoverEffect={true} className="p-4 flex flex-col justify-between h-full">
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
                ))
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
    </div>
  );
};

export default Media;
