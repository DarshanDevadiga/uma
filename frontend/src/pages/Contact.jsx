import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, ShieldAlert } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import api from '../services/api';

const Contact = () => {
  const [settings, setSettings] = useState({
    address: 'Udupi Management Association (UMA), 2nd Floor, Poornaprajna College Campus, Udupi - 576101, Karnataka, India',
    phone: '+91 820 2520412',
    email: 'info@udupimanagement.org',
    google_map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3882.029871587515!2d74.74716767592759!3d13.348421886992985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbcb29bbf628549%3A0xe54e3d36de9ab9e8!2sPoornaprajna%20College!5e0!3m2!1sen!2sin!4v1718100000000!5m2!1sen!2sin'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings({
          address: res.data.address || settings.address,
          phone: res.data.phone || settings.phone,
          email: res.data.email || settings.email,
          google_map: res.data.google_map || settings.google_map
        });
      } catch (err) {
        console.warn('Could not fetch contact settings, using fallback.');
      }
    };
    fetchContactSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all required fields (Name, Email, Subject, Message).');
      setLoading(false);
      return;
    }

    try {
      await api.post('/contacts', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-4 pt-10">
        <span className="text-brand-primary font-bold text-xs uppercase tracking-widest font-mono">Get in touch</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white font-sans">Contact UMA</h1>
        <div className="w-20 h-1 bg-brand-primary rounded mx-auto mt-1" />
        <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
          Have queries regarding membership applications, sponsorships, or general affiliations? Message our office.
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-10">
        {/* Info panel left */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GlassCard hoverEffect={false} className="p-8 flex flex-col gap-6 relative border border-white/5">
            <h3 className="text-lg font-bold text-white font-sans">Office Location</h3>
            <div className="w-10 h-1 bg-brand-primary rounded mt-[-8px]" />
            
            <ul className="flex flex-col gap-6 text-sm">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-xxs">Office Address</span>
                  <span className="text-gray-300 leading-relaxed">{settings.address}</span>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-xxs">Phone Number</span>
                  <span className="text-gray-300">{settings.phone}</span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-xxs">Email Address</span>
                  <span className="text-gray-300 break-all">{settings.email}</span>
                </div>
              </li>
            </ul>
          </GlassCard>

          {/* Google Map iframe */}
          <div className="w-full h-64 rounded-3xl overflow-hidden border border-white/5 shadow-md">
            <iframe 
              src={settings.google_map}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="UMA Google Map"
            />
          </div>
        </div>

        {/* Message Form right */}
        <div className="lg:col-span-7">
          <GlassCard className="p-8" hoverEffect={false}>
            <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-6">
              <Mail className="text-brand-primary" size={22} />
              <h3 className="text-lg font-bold text-white font-sans">Send Message</h3>
            </div>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 text-center py-10"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                  <CheckCircle size={32} />
                </div>
                <h4 className="text-white font-bold text-lg mt-2">Message Dispatched!</h4>
                <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                  Thank you. Your message has been saved and sent to our admin team. A confirmation receipt has been sent to your email.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="btn-secondary px-6 py-2.5 rounded-xl text-sm font-medium mt-4 text-white border-white/10"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <ShieldAlert size={14} className="shrink-0" />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Your Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      placeholder="e.g. john@example.com"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="e.g. +91 9876543210"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Subject *</label>
                    <input 
                      type="text" 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleChange}
                      placeholder="e.g. Sponsorship Query"
                      className="glass-input px-4 py-3 rounded-xl text-sm text-white" 
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Message Description *</label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange}
                    placeholder="Describe your inquiry details..."
                    rows={4}
                    className="glass-input px-4 py-3 rounded-xl text-sm text-white resize-none" 
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary w-full py-4 rounded-xl text-sm font-bold mt-2 shadow-lg flex items-center justify-center gap-2 text-white"
                >
                  {loading ? (
                    'Sending Message...'
                  ) : (
                    <>
                      Send Message
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default Contact;
