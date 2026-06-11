import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { BASE_URL } from '../services/api';

const Lightbox = ({ isOpen, imageSrc, onClose, title = 'Media Preview' }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset zoom state when closed
  useEffect(() => {
    if (!isOpen) {
      setIsZoomed(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          {/* Close on Background click */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

          {/* Header Controls */}
          <div className="absolute top-4 left-0 right-0 z-10 px-6 flex justify-between items-center text-white">
            <span className="font-medium truncate text-sm md:text-base pr-4">{title}</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsZoomed(!isZoomed)} 
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                title={isZoomed ? "Zoom Out" : "Zoom In"}
              >
                {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
              </button>
              <button 
                onClick={onClose} 
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content Image Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-[90vw] max-h-[85vh] z-10 overflow-hidden flex items-center justify-center"
          >
            <img
              src={imageSrc.startsWith('http') ? imageSrc : `${BASE_URL}${imageSrc}`}
              alt={title}
              className={`max-w-full max-h-full rounded-lg object-contain transition-transform duration-300 ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
