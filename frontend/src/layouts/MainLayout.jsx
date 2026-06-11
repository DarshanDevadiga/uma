import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticlesBg from '../components/ParticlesBg';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-dark text-dark-text">
      {/* Dynamic Animated background particles */}
      <ParticlesBg />
      
      {/* Navigation Header */}
      <Navbar />
      
      {/* Content wrapper with top spacing for fixed navbar */}
      <main className="flex-grow pt-24 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>
      
      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
