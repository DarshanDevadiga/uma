import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hoverEffect = true, delay = 0, onClick }) => {
  const hoverProps = hoverEffect
    ? {
        whileHover: { 
          scale: 1.04, 
          y: -4,
          borderColor: 'rgba(99, 102, 241, 0.35)',
          boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)'
        },
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }
    : {};

  const cardContent = (
    <motion.div 
      className={`glass-card p-6 rounded-2xl relative overflow-hidden group border border-white/5 transition-colors duration-300 ${
        hoverEffect ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
      {...hoverProps}
    >
      {/* Dynamic glow overlay on hover */}
      {hoverEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      
      {/* Accent glow corner */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );

  if (delay > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default GlassCard;
