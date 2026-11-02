import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth, SENIOR_OFFICER_ACCOUNTS } from '../../context/AuthContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import {
  LayoutDashboard,
  AlertCircle,
  FileText,
  Layers,
  Users,
  MapPin,
  Map,
  FolderGit2,
  Bell,
  MessageSquare,
  BarChart3,
  Globe,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  UserCheck,
} from 'lucide-react';

interface AdminLayoutProps {
  currentAdminTab: string;
  setCurrentAdminTab: (tab: string) => void;
  onExitToPublic: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentAdminTab,
  setCurrentAdminTab,
  onExitToPublic,
  children,
}) => {
  const { t, lang } = useLanguage();
  const { profile, role, logout, loginWithEmailPassword, switchRole, isAdmin } = useAuth();
  const { complaints, publicDemands } = useMunicipalData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Email/Password login form state
  const [emailInput, setEmailInput] = useState('eo.sapotra@rajasthan.gov.in');
  const [passInput, setPassInput] = useState('eo@123');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const pendingCount = complaints.filter((c) => c.status === 'PENDING' || c.status === 'SUBMITTED').length;
  const demandsCount = publicDemands.filter((d) => d.status === 'SUBMITTED' || d.status === 'UNDER_REVIEW').length;

  const adminNavItems = [
    { id: 'dashboard', label: 'डैशबोर्ड (Dashboard)', icon: LayoutDashboard },
    { id: 'attendance', label: 'दैनिक उपस्थिति नियंत्रण (Attendance Sheet)', icon: UserCheck },
    { id: 'complaints', label: 'शिकायत प्रबंधन (Complaints)', icon: AlertCircle, badge: pendingCount },
    { id: 'demands', label: 'मांग पत्र प्रबंधन (Demands)', icon: FileText, badge: demandsCount },
    { id: 'gps_map', label: 'जीपीएस मैप डैशबोर्ड (GPS Map)', icon: Map },
    { id: 'departments', label: 'विभाग प्रबंधन (Departments)', icon: Layers },
    { id: 'employees', label: 'कर्मचारी प्रबंधन (Employees)', icon: Users },
    { id: 'wards', label: 'वार्ड प्रबंधन (Ward Management)', icon: MapPin },
    { id: 'projects', label: 'विकास कार्य (Civic Projects)', icon: FolderGit2 },
    { id: 'notices', label: 'सार्वजनिक सूचनाएं (Notices)', icon: Bell },
    { id: 'notifications', label: 'व्हाट्सएप / SMS सेटिंग्स', icon: MessageSquare },
    { id: 'reports', label: 'रिपोर्ट्स एवं विश्लेषण (Analytics)', icon: BarChart3 },
    { id: 'cms', label: 'वेबसाइट सीएमएस (CMS)', icon: Globe },
    { id: 'audit_logs', label: 'ऑडिट लॉग्स (Audit Logs)', icon: ShieldAlert },
    { id: 'system_settings', label: 'सिस्टम सेटिंग्स (Settings)', icon: Settings },
  ];

  const handleOfficerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    setLoginSuccess('');

    try {
      const res = await loginWithEmailPassword(emailInput, passInput);
      if (res.success) {
        setLoginSuccess(res.message);
        setTimeout(() => {
          setShowLoginModal(false);
          setLoginSuccess('');
        }, 800);
      } else {
        setLoginError(res.message);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickOfficerSelect = async (account: typeof SENIOR_OFFICER_ACCOUNTS[0]) => {
    setEmailInput(account.email);
    setPassInput(account.defaultPass);
    setIsLoggingIn(true);
    setLoginError('');
    setLoginSuccess('');

    try {
      const res = await loginWithEmailPassword(account.email, account.defaultPass);
      if (res.success) {
        setLoginSuccess(res.message);
        setTimeout(() => {
          setShowLoginModal(false);
          setLoginSuccess('');
        }, 600);
      } else {
        setLoginError(res.message);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // If user is currently a citizen or clicked switch officer, show the Senior Officer Login Screen
  if (!isAdmin || showLoginModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#123568] via-[#0f2d59] to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 border-b border-slate-100 pb-5">
            <div className="w-16 h-16 rounded-2xl bg-[#123568] text-amber-400 flex items-center justify-center mx-auto text-3xl font-black shadow-lg">
              🏛️
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              नगर पालिका सपोटरा (करौली)
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#174EA6] uppercase tracking-wider">
              वरिष्ठ प्रशासनिक अधिकारी लॉगिन पोर्टल (Senior Officer Login)
            </p>
            <p className="text-xs text-slate-500 font-hindi">
              अधिकृत अधिशासी अधिकारी (EO), पालिका अध्यक्ष, कनिष्ठ अभियंता एवं विभागाध्यक्षों हेतु सुरक्षित प्रवेश
            </p>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleOfficerLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-[#174EA6]" />
                <span>सरकारी / अधिकृत ईमेल आईडी (Official Email ID) *</span>
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="eo.sapotra@rajasthan.gov.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#174EA6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#174EA6]" />
                <span>पासवर्ड (Password) *</span>
              </label>
              <input
                type="password"
                required
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#174EA6]"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl text-xs font-bold bg-rose-50 border border-rose-200 text-rose-800">
                ⚠️ {loginError}
              </div>
            )}

            {loginSuccess && (
              <div className="p-3 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-300 text-emerald-800">
                ✓ {loginSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white text-xs font-black shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoggingIn ? 'प्रमाणीकरण हो रहा है...' : 'अधिकारी डैशबोर्ड में प्रवेश करें'}</span>
            </button>
          </form>

          {/* Quick Officer Demo Tiles */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block text-center">
              त्वरित वरिष्ठ अधिकारी चयन (Quick 1-Click Access)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {SENIOR_OFFICER_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickOfficerSelect(acc)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 text-left transition-all flex items-center space-x-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#174EA6] font-black flex items-center justify-center text-xs shrink-0">
                    {acc.displayName.slice(0, 2)}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate">{acc.displayName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{acc.designation}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Return button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={onExitToPublic}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center space-x-1"
            >
              <span>← नागरिक वेबसाइट पर वापस जाएं</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#123568] text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xs">
            न.पा.
          </div>
          <div>
            <h2 className="text-sm font-bold">नगर पालिका सपोटरा</h2>
            <p className="text-[10px] text-amber-300 font-semibold">प्रशासनिक नियंत्रण कक्ष</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-72 bg-[#123568] text-white z-40 flex flex-col justify-between transition-transform duration-200 border-r border-[#0f2d59] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand header */}
          <div className="p-5 border-b border-white/10 bg-[#0e2a52]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-xl bg-[#123568] flex items-center justify-center font-bold text-xs text-amber-400">
                  सपोटरा
                </div>
              </div>
              <div>
                <h2 className="text-sm font-extrabold leading-tight text-white">नगर पालिका सपोटरा</h2>
                <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  Admin Command Console
                </p>
              </div>
            </div>

            {/* Profile Pill with Switch Officer Trigger */}
            <div className="mt-4 p-2.5 rounded-xl bg-white/10 border border-white/10 text-xs flex items-center justify-between">
              <div className="truncate">
                <p className="font-bold text-white truncate">{profile?.displayName}</p>
                <p className="text-[10px] text-slate-300 capitalize">{role.replace(/_/g, ' ')}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="bg-amber-400/20 hover:bg-amber-400/40 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-lg shrink-0 ml-1 transition-colors"
                title="अधिकारी बदलें या पुनः लॉगिन करें"
              >
                अधिकारी बदलें
              </button>
            </div>
          </div>

          {/* Navigation Items (Scrollable) */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-semibold scrollbar-none">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentAdminTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#174EA6] text-white font-bold shadow-md'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0 text-amber-300" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer exit actions */}
          <div className="p-3 border-t border-white/10 bg-[#0e2a52] space-y-1.5 text-xs">
            <button
              onClick={onExitToPublic}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>नागरिक वेबसाइट पर जाएं (Public Site)</span>
            </button>
            <button
              onClick={() => {
                logout();
                setShowLoginModal(true);
              }}
              className="w-full flex items-center justify-center space-x-2 px-3 py-1.5 rounded-xl text-rose-300 hover:bg-rose-900/40 text-[11px] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉगआउट (Sign Out)</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
};

