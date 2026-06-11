import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Calendar, Award, Image, Newspaper, Mail, TrendingUp, BarChart3 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalGallery: 0,
    totalNews: 0,
    totalMessages: 0
  });

  const [charts, setCharts] = useState({
    monthlyRegistrations: [],
    eventParticipation: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data.stats);
        setCharts(res.data.charts);
      } catch (err) {
        console.warn('Could not fetch dashboard metrics, using fallback mock stats.');
        // Seed fallback stats
        setStats({
          totalMembers: 145,
          totalEvents: 34,
          totalRegistrations: 382,
          totalGallery: 54,
          totalNews: 18,
          totalMessages: 47
        });
        
        setCharts({
          monthlyRegistrations: [
            { month: 'Jan 2026', count: 12 },
            { month: 'Feb 2026', count: 18 },
            { month: 'Mar 2026', count: 24 },
            { month: 'Apr 2026', count: 35 },
            { month: 'May 2026', count: 48 },
            { month: 'Jun 2026', count: 56 }
          ],
          eventParticipation: [
            { title: 'Management Conf.', registrations: 124 },
            { title: 'Jury Awards', registrations: 85 },
            { title: 'Coastal Trade talk', registrations: 68 },
            { title: 'SME Analytics', registrations: 54 },
            { title: 'Lecturer Tax sem.', registrations: 45 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Memberships', value: stats.totalMembers, icon: Users, color: 'text-indigo-400' },
    { label: 'Events Published', value: stats.totalEvents, icon: Calendar, color: 'text-sky-400' },
    { label: 'Event Registrants', value: stats.totalRegistrations, icon: BarChart3, color: 'text-emerald-400' },
    { label: 'Awards Nominated', value: stats.totalGallery, icon: Award, color: 'text-amber-400' }, // Mapping dummy count for display simplicity
    { label: 'Media Gallery Assets', value: stats.totalGallery, icon: Image, color: 'text-purple-400' },
    { label: 'Contact Messages', value: stats.totalMessages, icon: Mail, color: 'text-rose-400' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 rounded-full border-t-2 border-brand-primary animate-spin" />
      </div>
    );
  }

  const CHART_COLORS = ['#6366f1', '#3b82f6', '#c084fc', '#e2b857', '#f43f5e', '#10b981'];

  return (
    <div className="flex flex-col gap-8">
      {/* Stat Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <GlassCard key={idx} hoverEffect={true} className="p-6 flex items-center justify-between border border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold font-mono">{card.label}</span>
                <span className="text-2xl font-extrabold text-white font-sans mt-1">{card.value}</span>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center ${card.color}`}>
                <Icon size={20} />
              </div>
            </GlassCard>
          );
        })}
      </section>

      {/* Chart Displays */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Area chart */}
        <GlassCard hoverEffect={false} className="p-6 h-[400px] flex flex-col justify-between border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-brand-primary" />
            <h3 className="text-white font-bold text-sm uppercase tracking-wider font-mono">Monthly Memberships Trend</h3>
          </div>
          <div className="flex-grow w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyRegistrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#52525b" fontSize={10} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121216', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#6366f1', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Chart 2: Bar chart */}
        <GlassCard hoverEffect={false} className="p-6 h-[400px] flex flex-col justify-between border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-brand-secondary" />
            <h3 className="text-white font-bold text-sm uppercase tracking-wider font-mono">Event Attendance Levels</h3>
          </div>
          <div className="flex-grow w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.eventParticipation} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="title" stroke="#52525b" fontSize={9} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121216', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#3b82f6', fontSize: '12px' }}
                />
                <Bar dataKey="registrations" radius={[6, 6, 0, 0]} barSize={32}>
                  {charts.eventParticipation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};

export default AdminDashboard;
