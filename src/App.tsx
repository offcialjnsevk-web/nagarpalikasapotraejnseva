/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MunicipalDataProvider, useMunicipalData } from './context/MunicipalDataContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { DepartmentsPage } from './pages/public/DepartmentsPage';
import { RegisterComplaintPage } from './pages/public/RegisterComplaintPage';
import { TrackComplaintPage } from './pages/public/TrackComplaintPage';
import { PublicDemandsPage } from './pages/public/PublicDemandsPage';
import { DevelopmentWorksPage } from './pages/public/DevelopmentWorksPage';
import { PublicNoticesPage } from './pages/public/PublicNoticesPage';
import { ContactPage } from './pages/public/ContactPage';
import { PrivacyTermsPage } from './pages/public/PrivacyTermsPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminComplaints } from './pages/admin/AdminComplaints';
import { AdminPublicDemands } from './pages/admin/AdminPublicDemands';
import { AdminGpsMap } from './pages/admin/AdminGpsMap';
import { AdminDepartments } from './pages/admin/AdminDepartments';
import { AdminEmployees } from './pages/admin/AdminEmployees';
import { AdminWards } from './pages/admin/AdminWards';
import { AdminNotificationSettings } from './pages/admin/AdminNotificationSettings';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminCms } from './pages/admin/AdminCms';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';

// Employee Pages
import { EmployeePortal } from './pages/employee/EmployeePortal';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [tabMeta, setTabMeta] = useState<any>(null);
  const [currentAdminTab, setCurrentAdminTab] = useState<string>('dashboard');

  const handleNavigate = (tab: string, meta?: any) => {
    setCurrentTab(tab);
    setTabMeta(meta);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin Section
  if (currentTab === 'admin') {
    return (
      <AdminLayout
        currentAdminTab={currentAdminTab}
        setCurrentAdminTab={setCurrentAdminTab}
        onExitToPublic={() => handleNavigate('home')}
      >
        {currentAdminTab === 'dashboard' && <AdminDashboard onNavigateTab={setCurrentAdminTab} />}
        {currentAdminTab === 'complaints' && <AdminComplaints />}
        {currentAdminTab === 'demands' && <AdminPublicDemands />}
        {currentAdminTab === 'gps_map' && <AdminGpsMap />}
        {currentAdminTab === 'departments' && <AdminDepartments />}
        {currentAdminTab === 'employees' && <AdminEmployees />}
        {currentAdminTab === 'wards' && <AdminWards />}
        {currentAdminTab === 'projects' && <DevelopmentWorksPage />}
        {currentAdminTab === 'notices' && <PublicNoticesPage />}
        {currentAdminTab === 'notifications' && <AdminNotificationSettings />}
        {currentAdminTab === 'reports' && <AdminReports />}
        {currentAdminTab === 'cms' && <AdminCms />}
        {currentAdminTab === 'audit_logs' && <AdminAuditLogs />}
        {currentAdminTab === 'system_settings' && <AdminNotificationSettings />}
      </AdminLayout>
    );
  }

  // If in Employee Section
  if (currentTab === 'employee') {
    return (
      <div className="min-h-screen bg-[#F4F7FC] flex flex-col">
        <Navbar currentTab={currentTab} setCurrentTab={handleNavigate} />
        <div className="flex-1">
          <EmployeePortal />
        </div>
        <Footer setCurrentTab={handleNavigate} />
      </div>
    );
  }

  // Standard Public Website
  return (
    <div className="min-h-screen bg-[#F4F7FC] flex flex-col">
      <Navbar currentTab={currentTab} setCurrentTab={handleNavigate} />

      <main className="flex-1">
        {currentTab === 'home' && <HomePage setCurrentTab={handleNavigate} />}
        {currentTab === 'about' && <AboutPage />}
        {currentTab === 'departments' && <DepartmentsPage setCurrentTab={handleNavigate} />}
        {currentTab === 'register_complaint' && (
          <RegisterComplaintPage
            initialDeptId={tabMeta?.deptId}
            onSuccess={() => handleNavigate('track')}
          />
        )}
        {currentTab === 'track' && <TrackComplaintPage initialSearchId={tabMeta?.searchId} />}
        {currentTab === 'public_demand' && <PublicDemandsPage />}
        {currentTab === 'development_works' && <DevelopmentWorksPage />}
        {currentTab === 'notices' && <PublicNoticesPage />}
        {currentTab === 'contact' && <ContactPage />}
        {currentTab === 'privacy' && <PrivacyTermsPage />}
      </main>

      <Footer setCurrentTab={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MunicipalDataProvider>
          <AppContent />
        </MunicipalDataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
