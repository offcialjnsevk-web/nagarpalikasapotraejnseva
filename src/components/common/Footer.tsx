import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { Phone, Mail, MapPin, Clock, ShieldCheck, AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { t, lang } = useLanguage();
  const { settings, resetToDemoData, clearAllDemoData } = useMunicipalData();

  return (
    <footer className="bg-[#123568] text-white pt-12 pb-8 border-t-4 border-[#F39A25]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Emergency Strip */}
        <div className="bg-white/10 rounded-2xl p-5 mb-10 border border-white/15 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-600/80 rounded-xl text-white">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-red-200 uppercase font-semibold tracking-wider">अग्निशमन सेवा (Fire)</p>
              <p className="text-base font-bold text-white">{settings.fireHelpline}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600/80 rounded-xl text-white">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-blue-200 uppercase font-semibold tracking-wider">पुलिस नियंत्रण (Police)</p>
              <p className="text-base font-bold text-white">{settings.policeHelpline}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-600/80 rounded-xl text-white">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-200 uppercase font-semibold tracking-wider">एम्बुलेंस (Ambulance)</p>
              <p className="text-base font-bold text-white">{settings.ambulanceHelpline}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/80 rounded-xl text-slate-900">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-amber-200 uppercase font-semibold tracking-wider">सपोटरा नियंत्रण कक्ष</p>
              <p className="text-sm font-bold text-white">{settings.emergencyControlRoom}</p>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/15 text-sm">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#F39A25] flex items-center justify-center font-bold text-xs text-slate-900">
                न.पा.
              </div>
              <h4 className="text-base font-bold text-white">{t('portal_title')}</h4>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-hindi">
              {t('footer_about_text')}
            </p>
            <div className="pt-2 text-xs text-amber-300 font-semibold flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>प्रमाणित डिजिटल सेवा पोर्टल • राजस्थान</span>
            </div>
          </div>

          {/* Col 2: Citizen Services */}
          <div>
            <h5 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">नागरिक त्वरित सेवाएं</h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => setCurrentTab('register_complaint')} className="hover:text-amber-300 transition-colors">
                  → शिकायत ऑनलाइन दर्ज करें
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('track')} className="hover:text-amber-300 transition-colors">
                  → दर्ज शिकायत की स्थिति ट्रैक करें
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('public_demand')} className="hover:text-amber-300 transition-colors">
                  → वार्ड विकास मांग पत्र प्रस्तुत करें
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('development_works')} className="hover:text-amber-300 transition-colors">
                  → नगर विकास परियोजनाओं की प्रगति
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('notices')} className="hover:text-amber-300 transition-colors">
                  → सार्वजनिक निविदाएं एवं ई-नीलामी
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Municipal Info */}
          <div>
            <h5 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">नगर पालिका संपर्क</h5>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.officeAddress}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>फोन: {settings.officePhone}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ईमेल: {settings.email}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>समय: 9:30 AM - 6:00 PM (सोम - शुक्र)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Prototype & Data Controls */}
          <div>
            <h5 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">परिनियोजन एवं डेमो नियंत्रण</h5>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 space-y-2 text-xs">
              <p className="text-slate-300 text-[11px] leading-relaxed">
                यह अधिकृत नगर पालिका तैनाती हेतु कॉन्फ़िगरेबल प्रोटोटाइप है। टेस्टिंग के लिए दिए गए डेमो डेटा को रीसेट अथवा रिमूव किया जा सकता है:
              </p>

              <div className="flex flex-col gap-1.5 pt-1">
                <button
                  onClick={resetToDemoData}
                  className="w-full flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded bg-blue-700/80 hover:bg-blue-600 text-white font-semibold text-[11px] transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>डेमो डेटा पुनः लोड करें (Reset Demo)</span>
                </button>
                <button
                  onClick={clearAllDemoData}
                  className="w-full flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 font-semibold text-[11px] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>सभी डेमो रिकॉर्ड हटाएं (Production Clean)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-3">
          <p>{t('footer_copyright')}</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentTab('privacy')} className="hover:text-white transition-colors underline">
              गोपनीयता नीति (Privacy Policy)
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('privacy')} className="hover:text-white transition-colors underline">
              नियम एवं शर्तें (Terms of Use)
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('admin')} className="hover:text-amber-300 font-semibold">
              🔐 प्रशासनिक प्रवेश
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
