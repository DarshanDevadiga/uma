import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';
import api from '../services/api';
import logoImg from '../assets/logo.png';

const Footer = () => {
  const [settings, setSettings] = useState({
    address: 'Udupi Management Association (UMA), 2nd Floor, Poornaprajna College Campus, Udupi - 576101, Karnataka, India',
    phone: '+91 820 2520412',
    email: 'info@udupimanagement.org'
  });

  useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.address || res.data.phone || res.data.email) {
          setSettings({
            address: res.data.address || settings.address,
            phone: res.data.phone || settings.phone,
            email: res.data.email || settings.email
          });
        }
      } catch (err) {
        console.warn('Could not fetch custom footer settings, using default.');
      }
    };
    fetchFooterSettings();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark border-t border-white/5 pt-16 pb-8 relative overflow-hidden z-10">
      {/* Decorative radial glows */}
      <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-96 h-96 rounded-full bg-brand-secondary/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Column 1: Brand details */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="UMA Logo" 
              className="w-12 h-12 rounded-lg object-cover shadow-sm" 
            />
            <span className="font-semibold text-base tracking-wider text-white">
              UDUPI MANAGEMENT ASSOCIATION
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mt-2">
            A premium leadership forum coordinating professional growth, educational guidelines, and industrial collaborations in Udupi and regional zones.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-primary transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-primary transition-colors">
              <Twitter size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-primary transition-colors">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Useful Links</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Association</Link>
            </li>
            <li>
              <Link to="/bearers" className="text-gray-400 hover:text-white transition-colors">Office Bearers</Link>
            </li>
            <li>
              <Link to="/committees" className="text-gray-400 hover:text-white transition-colors">Teacher Committees</Link>
            </li>
            <li>
              <Link to="/activities" className="text-gray-400 hover:text-white transition-colors">Activities Calendar</Link>
            </li>
            <li>
              <Link to="/events" className="text-gray-400 hover:text-white transition-colors">Events & Conferences</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Portals */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Portals</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link to="/membership" className="text-gray-400 hover:text-white transition-colors">Membership Registration</Link>
            </li>
            <li>
              <Link to="/awards" className="text-gray-400 hover:text-white transition-colors">Award Nomination Form</Link>
            </li>
            <li>
              <Link to="/publications" className="text-gray-400 hover:text-white transition-colors">Digital Library & Outreach</Link>
            </li>
            <li>
              <Link to="/pd" className="text-gray-400 hover:text-white transition-colors">Professional Development</Link>
            </li>
            <li>
              <Link to="/media" className="text-gray-400 hover:text-white transition-colors">News & Galleries</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Address Info */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Get in Touch</h4>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-brand-primary shrink-0 mt-0.5" />
              <span className="text-gray-400 leading-relaxed">{settings.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-brand-primary shrink-0" />
              <span className="text-gray-400">{settings.phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-brand-primary shrink-0" />
              <span className="text-gray-400 break-all">{settings.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <span>&copy; {currentYear} Udupi Management Association. All Rights Reserved.</span>
        <div className="flex gap-4">
          <Link to="/admin/login" className="hover:text-brand-primary transition-colors">Admin Console</Link>
          <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
