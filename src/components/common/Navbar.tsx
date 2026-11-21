import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  Phone,
  Home,
  FileText,
  AlertCircle,
  Search,
  Building,
  Layers,
  Bell,
  ChevronDown,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { Role } from '../../types';
import { Smartphone } from 'lucide-react';
import { MobileMockupModal } from './MobileMockupModal';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string, meta?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { lang, setLang, fontSize, setFontSize } = useLanguage();
  const { role, profile, switchRole, logout, isAdmin, isEmployee } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  const handleNavClick = (tabId: string, meta?: any) => {
    setCurrentTab(tabId, meta);
    setMobileMenuOpen(false);
    setDeptDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleSelect = (newRole: Role) => {
    switchRole(newRole);
    setRoleMenuOpen(false);
    if (newRole === 'citizen') {
      setCurrentTab('home');
    } else if (['super_admin', 'executive_officer', 'department_head'].includes(newRole)) {
      setCurrentTab('admin');
    } else {
      setCurrentTab('employee');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
      {/* 1. Top Government Black/Dark Bar */}
      <div className="bg-[#121c2d] text-white text-[11px] px-4 py-1 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2">
          {/* Ashoka Emblem Vector representation */}
          <div className="w-4 h-5 flex items-center justify-center text-amber-400 font-serif font-black text-xs">
            🏛
          </div>
          <span className="font-bold tracking-wide text-slate-200">राजस्थान सरकार</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px] text-slate-300">
          <button onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })} className="hidden sm:inline hover:text-white">
            मुख्य सामग्री पर जाएँ
          </button>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden md:inline hover:text-white cursor-pointer">स्क्रीन रीडर</span>
          <span className="hidden md:inline text-slate-600">|</span>

          {/* Font resizing */}
          <div className="flex items-center space-x-1 font-mono">
            <button
              onClick={() => setFontSize('normal')}
              className={`hover:text-amber-400 px-0.5 ${fontSize === 'normal' ? 'font-bold text-amber-400' : ''}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`hover:text-amber-400 px-0.5 ${fontSize === 'large' ? 'font-bold text-amber-400' : ''}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`hover:text-amber-400 px-0.5 ${fontSize === 'xlarge' ? 'font-bold text-amber-400' : ''}`}
            >
              A+
            </button>
          </div>
          <span className="text-slate-600">|</span>

          {/* Language Switcher */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setLang('hi')}
              className={`hover:text-amber-400 ${lang === 'hi' ? 'text-amber-400 font-bold' : ''}`}
            >
              हिन्दी ▾
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setLang('en')}
              className={`hover:text-amber-400 ${lang === 'en' ? 'text-amber-400 font-bold' : ''}`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header with Emblem, Saffron Tagline Frame and 5 Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Ashoka Lion Emblem + Nagar Palika Sapotra */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-3 cursor-pointer shrink-0"
        >
          {/* Government Ashoka Lion Emblem */}
          <div className="w-12 h-14 flex flex-col items-center justify-center text-slate-800 shrink-0">
            <div className="text-xl leading-none">🏛️</div>
            <span className="text-[7px] font-black uppercase tracking-tight text-slate-700 mt-0.5">सत्यमेव जयते</span>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-xl sm:text-2xl font-black text-[#123568] tracking-tight leading-none">
                नगर पालिका सपोटरा
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">
              Nagar Palika Sapotra
            </p>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="text-[11px] font-extrabold text-[#F39A25] italic tracking-wide">
                e-Jan Seva Portal
              </span>
              <div className="w-12 h-0.5 bg-gradient-to-r from-[#F39A25] to-transparent rounded-full" />
            </div>
          </div>
        </div>

        {/* Center: Ornamental Decorative Saffron Tagline Frame (Exact from collage image) */}
        <div className="hidden lg:flex flex-col items-center justify-center px-6 py-1.5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-[#F39A25]/50 rounded-2xl shadow-xs relative">
          <div className="absolute -top-2 px-2 bg-white text-[9px] font-bold text-[#b86b0a] uppercase tracking-wider rounded-full border border-[#F39A25]/30">
            ★ डिजिटल राजस्थान ★
          </div>
          <span className="text-sm font-extrabold text-[#123568] font-hindi leading-snug">
            आपकी समस्या, हमारा समाधान
          </span>
          <span className="text-xs font-black text-[#F39A25] tracking-wide leading-none">
            डिजिटल सपोटरा
          </span>
        </div>

        {/* Right: 5 Quick Action Circular Icons with Labels (Exact from image) */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-5">
          <button
            onClick={() => handleNavClick('home')}
            className="flex flex-col items-center text-slate-700 hover:text-[#174EA6] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center text-[#174EA6] mb-0.5 shadow-2xs">
              <Home className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold">होम</span>
          </button>

          <button
            onClick={() => handleNavClick('register_complaint')}
            className="flex flex-col items-center text-slate-700 hover:text-red-600 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-red-50 group-hover:bg-red-100 flex items-center justify-center text-red-600 mb-0.5 shadow-2xs">
              <AlertCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold">जन शिकायत</span>
          </button>

          <button
            onClick={() => handleNavClick('public_demand')}
            className="flex flex-col items-center text-slate-700 hover:text-[#F39A25] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-[#F39A25] mb-0.5 shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold">जन मांग</span>
          </button>

          <button
            onClick={() => handleNavClick('track')}
            className="flex flex-col items-center text-slate-700 hover:text-emerald-600 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-600 mb-0.5 shadow-2xs">
              <Search className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold">स्थिति देखें</span>
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className="flex flex-col items-center text-slate-700 hover:text-indigo-600 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-indigo-600 mb-0.5 shadow-2xs">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold">संपर्क</span>
          </button>

          {/* Role switcher for evaluation */}
          <div className="relative pl-2 border-l border-slate-200">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 border border-slate-300"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#174EA6]" />
              <span className="text-[11px] font-bold">
                {role === 'citizen' ? 'नागरिक' : role === 'super_admin' ? 'एडमिन' : 'स्टाफ'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  पोर्टल स्विच करें
                </div>
                <button
                  onClick={() => handleRoleSelect('citizen')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex justify-between ${role === 'citizen' ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span>आम नागरिक पोर्टल</span>
                  {role === 'citizen' && <span>✓</span>}
                </button>
                <button
                  onClick={() => handleRoleSelect('super_admin')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex justify-between ${role === 'super_admin' ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span>Admin Panel (प्रशासक)</span>
                  {role === 'super_admin' && <span>✓</span>}
                </button>
                <button
                  onClick={() => handleRoleSelect('field_employee')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex justify-between ${role === 'field_employee' ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span>Employee Panel (कर्मचारी)</span>
                  {role === 'field_employee' && <span>✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Mockup Simulation Button */}
          <button
            type="button"
            onClick={() => setMobileModalOpen(true)}
            className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all shadow-2xs"
            title="मोबाइल ऐप व रिस्पॉन्सिव व्यू देखें"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-600" />
            <span>मोबाइल प्रीव्यू</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 3. Main Government Blue Navigation Bar (Exact Tabs from Image) */}
      <nav className="hidden md:block bg-[#123568] text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center space-x-1 py-0.5">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2.5 rounded transition-colors ${currentTab === 'home' ? 'bg-white text-[#123568]' : 'hover:bg-white/10 text-white'}`}
            >
              मुख्य पृष्ठ
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2.5 rounded transition-colors ${currentTab === 'about' ? 'bg-white text-[#123568]' : 'hover:bg-white/10 text-white'}`}
            >
              नगर पालिका परिचय
            </button>

            {/* Department with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
                className={`flex items-center space-x-1 px-3 py-2.5 rounded transition-colors ${currentTab === 'departments' ? 'bg-white text-[#123568]' : 'hover:bg-white/10 text-white'}`}
              >
                <span>विभाग</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {deptDropdownOpen && (
                <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs text-slate-800">
                  <button
                    onClick={() => handleNavClick('departments')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 font-bold text-[#174EA6]"
                  >
                    समस्त 14 विभाग देखें →
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => handleNavClick('register_complaint', { deptId: 'dept-sanitation' })}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50"
                  >
                    सफाई विभाग
                  </button>
                  <button
                    onClick={() => handleNavClick('register_complaint', { deptId: 'dept-streetlight' })}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50"
                  >
                    स्ट्रीट लाइट विभाग
                  </button>
                  <button
                    onClick={() => handleNavClick('register_complaint', { deptId: 'dept-road' })}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50"
                  >
                    सड़क निर्माण विभाग
                  </button>
                  <button
                    onClick={() => handleNavClick('register_complaint', { deptId: 'dept-water' })}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50"
                  >
                    पेयजल विभाग
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('register_complaint')}
              className={`px-3 py-2.5 rounded transition-colors ${currentTab === 'register_complaint' ? 'bg-white text-[#123568]' : 'hover:bg-white/10 text-white'}`}
            >
              शिकायत/समस्या
            </button>
            <button
              onClick={() => handleNavClick('public_demand')}
              className={`px-3 py-2.5 rounded transition-colors ${currentTab === 'public_demand' ? 'bg-white text-[#123568]' : 'hover:bg-white/10 text-white'}`}
            >
              मांग पत्र
            </button>
            <button
              onClick={() => handleNavClick('work_section')}
              className={`px-3 py-2.5 rounded transition-colors font-black ${currentTab === 'work_section' ? 'bg-amber-400 text-slate-900' : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300'}`}
            >
              ★ वर्क सेक्शन (रोजगार)
            </button>
            <button
              onClick={() => handleNavClick('development_works')}
              className={`px-3 py-2.5 rounded transition-colors ${currentTab === 'development_works' ? 'bg-white text-[#123568]' : 'hover:bg-white/10 text-white'}`}
            >
              विकास कार्य
            </button>
            <button
              onClick={() => handleNavClick('notices')}
              className={`px-3 py-2.5 rounded transition-colors ${currentTab === 'notices' ? 'bg-white text-[#123568]' : 'hover:bg-white/10 text-white'}`}
            >
              सूचना एवं आदेश
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-2.5 rounded transition-colors ${currentTab === 'contact' ? 'bg-white text-[#123568]' : 'hover:bg-white/10 text-white'}`}
            >
              संपर्क करें
            </button>
          </div>

          {/* Quick Panels Switcher */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleNavClick('admin')}
              className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-[11px]"
            >
              🔐 Admin Panel
            </button>
            <button
              onClick={() => handleNavClick('employee')}
              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
            >
              👷 Employee Panel
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 shadow-lg animate-in slide-in-from-top-4 text-xs font-bold">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
          >
            🏠 मुख्य पृष्ठ
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
          >
            🏛️ नगर पालिका परिचय
          </button>
          <button
            onClick={() => handleNavClick('departments')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
          >
            🏢 समस्त विभाग
          </button>
          <button
            onClick={() => handleNavClick('register_complaint')}
            className="w-full text-left px-3 py-2 rounded-lg bg-red-50 text-red-700"
          >
            📢 शिकायत दर्ज करें
          </button>
          <button
            onClick={() => handleNavClick('public_demand')}
            className="w-full text-left px-3 py-2 rounded-lg bg-amber-50 text-[#b96f0b]"
          >
            📄 मांग पत्र दर्ज करें
          </button>
          <button
            onClick={() => handleNavClick('work_section')}
            className="w-full text-left px-3 py-2 rounded-lg bg-amber-500 text-slate-900 font-black"
          >
            ★ वर्क सेक्शन (रोजगार एवं कार्य पंजीयन)
          </button>
          <button
            onClick={() => handleNavClick('track')}
            className="w-full text-left px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700"
          >
            🔍 शिकायत ट्रैक करें
          </button>
          <button
            onClick={() => handleNavClick('development_works')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
          >
            🏗️ विकास कार्य
          </button>
          <button
            onClick={() => handleNavClick('notices')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
          >
            📢 सूचना एवं आदेश
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
          >
            📞 संपर्क करें
          </button>

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-1.5">
            <button
              onClick={() => setMobileModalOpen(true)}
              className="w-full text-center py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center space-x-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>📱 मोबाइल प्रीव्यू (Mobile Mockup)</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-center py-2 rounded-xl bg-[#123568] text-white font-bold"
            >
              🔐 Admin Panel लॉगिन
            </button>
            <button
              onClick={() => handleNavClick('employee')}
              className="w-full text-center py-2 rounded-xl bg-emerald-700 text-white font-bold"
            >
              👷 Employee Panel
            </button>
          </div>
        </div>
      )}

      {/* Mobile Mockup Simulator Modal */}
      <MobileMockupModal
        isOpen={mobileModalOpen}
        onClose={() => setMobileModalOpen(false)}
        onSelectTab={handleNavClick}
      />
    </header>
  );
};
