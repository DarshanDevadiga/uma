import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Bearers from './pages/Bearers';
import Committees from './pages/Committees';
import Activities from './pages/Activities';
import Membership from './pages/Membership';
import Events from './pages/Events';
import Awards from './pages/Awards';
import Publications from './pages/Publications';
import Pd from './pages/Pd';
import Media from './pages/Media';
import NewsArticle from './pages/NewsArticle';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/AdminLogin';

// Lazy loaded admin views
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Lazy loaded admin submodules from AdminModules
const AdminMembers = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminMembers })));
const AdminEvents = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminEvents })));
const AdminBearers = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminBearers })));
const AdminCommittees = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminCommittees })));
const AdminAwards = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminAwards })));
const AdminPublications = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminPublications })));
const AdminGallery = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminGallery })));
const AdminNews = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminNews })));
const AdminContacts = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminContacts })));
const AdminTraining = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminTraining })));
const AdminSettings = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminSettings })));
const AdminEventRegistrations = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminEventRegistrations })));
const AdminActivities = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminActivities })));
const AdminSeo = lazy(() => import('./pages/AdminModules').then(m => ({ default: m.AdminSeo })));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={
          <div className="min-h-screen bg-dark flex items-center justify-center text-white">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-t-2 border-brand-primary animate-spin" />
              <span className="text-gray-400 text-sm tracking-widest font-mono">LOADING UMA...</span>
            </div>
          </div>
        }>
          <Routes>
          {/* ==========================================
              PUBLIC ROUTES (Wrapped in MainLayout)
             ========================================== */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/bearers" element={<MainLayout><Bearers /></MainLayout>} />
          <Route path="/committees" element={<MainLayout><Committees /></MainLayout>} />
          <Route path="/activities" element={<MainLayout><Activities /></MainLayout>} />
          <Route path="/membership" element={<MainLayout><Membership /></MainLayout>} />
          <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
          <Route path="/awards" element={<MainLayout><Awards /></MainLayout>} />
          <Route path="/publications" element={<MainLayout><Publications /></MainLayout>} />
          <Route path="/pd" element={<MainLayout><Pd /></MainLayout>} />
          <Route path="/media" element={<MainLayout><Media /></MainLayout>} />
          <Route path="/news/:id" element={<MainLayout><NewsArticle /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />

          {/* ==========================================
              ADMIN LOGIN (Publicly Accessible)
             ========================================== */}
          <Route path="/admin/login" element={<MainLayout><AdminLogin /></MainLayout>} />

          {/* ==========================================
              ADMIN DASHBOARD ROUTES (Wrapped in AdminLayout)
             ========================================== */}
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/members" element={<AdminLayout><AdminMembers /></AdminLayout>} />
          <Route path="/admin/events" element={<AdminLayout><AdminEvents /></AdminLayout>} />
          <Route path="/admin/event-registrations" element={<AdminLayout><AdminEventRegistrations /></AdminLayout>} />
          <Route path="/admin/bearers" element={<AdminLayout><AdminBearers /></AdminLayout>} />
          <Route path="/admin/committees" element={<AdminLayout><AdminCommittees /></AdminLayout>} />
          <Route path="/admin/awards" element={<AdminLayout><AdminAwards /></AdminLayout>} />
          <Route path="/admin/publications" element={<AdminLayout><AdminPublications /></AdminLayout>} />
          <Route path="/admin/gallery" element={<AdminLayout><AdminGallery /></AdminLayout>} />
          <Route path="/admin/news" element={<AdminLayout><AdminNews /></AdminLayout>} />
          <Route path="/admin/contacts" element={<AdminLayout><AdminContacts /></AdminLayout>} />
          <Route path="/admin/training" element={<AdminLayout><AdminTraining /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
          <Route path="/admin/activities" element={<AdminLayout><AdminActivities /></AdminLayout>} />
          <Route path="/admin/seo" element={<AdminLayout><AdminSeo /></AdminLayout>} />

          {/* Fallback wildcard redirect to Home */}
          <Route path="*" element={<MainLayout><Home /></MainLayout>} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
