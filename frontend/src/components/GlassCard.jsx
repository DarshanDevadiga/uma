import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hoverEffect = true, delay = 0, onClick }) => {
  const cardContent = (
    <div 
      className={`glass-card p-6 rounded-2xl relative overflow-hidden group ${
        hoverEffect ? 'glass-card-hover cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
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
    </div>
  );

  if (delay > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default GlassCard;
