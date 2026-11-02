import React, { useState } from 'react';
import {
  Smartphone,
  X,
  Megaphone,
  FileText,
  Search,
  MessageSquare,
  Home,
  Building,
  Bell,
  Phone,
  ChevronLeft,
  MapPin,
  Camera,
  ArrowRight,
} from 'lucide-react';

interface MobileMockupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: string) => void;
}

export const MobileMockupModal: React.FC<MobileMockupModalProps> = ({ isOpen, onClose, onSelectTab }) => {
  const [mobileScreen, setMobileScreen] = useState<'HOME' | 'FORM'>('HOME');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-3xl p-6 max-w-5xl w-full shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold">
              मोबाइल दृश्य सिमुलेशन (Mobile Responsive Mockups)
            </h2>
            <span className="text-xs bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
              रेफरेंस कोलाज अनुसार
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Two Phones Side-by-Side matching bottom-right of reference collage */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-2">
          {/* PHONE 1: NAGAR PALIKA SAPOTRA MOBILE HOME */}
          <div className="w-[310px] h-[600px] bg-white text-slate-900 rounded-[44px] shadow-2xl border-[8px] border-slate-800 relative flex flex-col overflow-hidden">
            {/* Phone Speaker Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-full z-20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-900 mr-2" />
              <span className="w-8 h-1 bg-slate-700 rounded-full" />
            </div>

            {/* Mobile Status Bar */}
            <div className="pt-3 px-6 pb-1 flex justify-between text-[11px] font-bold text-slate-700 bg-white z-10">
              <span>9:31</span>
              <span>📶 5G 🔋</span>
            </div>

            {/* Mobile Header */}
            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center space-x-2">
                <span className="text-sm">🏛️</span>
                <div>
                  <h4 className="text-xs font-black text-[#123568] leading-tight">नगर पालिका</h4>
                  <p className="text-[10px] font-bold text-slate-600 leading-none">सपोटरा</p>
                </div>
              </div>
              <button
                onClick={() => setMobileScreen('FORM')}
                className="text-xs font-black p-1 text-slate-700 hover:text-blue-600"
              >
                ☰
              </button>
            </div>

            {/* Scrollable Mobile Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans">
              {/* Hero Building Card */}
              <div className="rounded-2xl overflow-hidden relative shadow-xs border border-slate-200 h-32">
                <img
                  src="/src/assets/images/sapotra_municipal_building_1793599131195.jpg"
                  alt="Building"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[11px] font-bold text-white leading-tight">
                    e-Jan Seva Portal • सपोटरा
                  </span>
                </div>
              </div>

              {/* 4 Action Cards Grid matching mobile collage phone 1 */}
              <div className="grid grid-cols-2 gap-2">
                {/* 1. शिकायत दर्ज करें */}
                <div
                  onClick={() => setMobileScreen('FORM')}
                  className="cursor-pointer bg-[#D83C3C] text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs"
                >
                  <Megaphone className="w-5 h-5 mb-1" />
                  <span className="text-xs font-black leading-tight">शिकायत दर्ज करें</span>
                </div>

                {/* 2. मांग पत्र दर्ज करें */}
                <div
                  onClick={() => {
                    onClose();
                    onSelectTab?.('public_demand');
                  }}
                  className="cursor-pointer bg-[#174EA6] text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs"
                >
                  <FileText className="w-5 h-5 mb-1" />
                  <span className="text-xs font-black leading-tight">मांग पत्र दर्ज करें</span>
                </div>

                {/* 3. स्थिति देखें */}
                <div
                  onClick={() => {
                    onClose();
                    onSelectTab?.('track');
                  }}
                  className="cursor-pointer bg-[#16864A] text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs"
                >
                  <Search className="w-5 h-5 mb-1" />
                  <span className="text-xs font-black leading-tight">स्थिति देखें</span>
                </div>

                {/* 4. सुझाव दें */}
                <div
                  onClick={() => {
                    onClose();
                    onSelectTab?.('contact');
                  }}
                  className="cursor-pointer bg-[#7E3AF2] text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs"
                >
                  <MessageSquare className="w-5 h-5 mb-1" />
                  <span className="text-xs font-black leading-tight">सुझाव दें</span>
                </div>
              </div>

              {/* Citizen Stats */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <p className="text-[10px] text-slate-500 font-bold">कुल निस्तारित शिकायतें</p>
                <p className="text-lg font-black text-emerald-700">10,276 (98%)</p>
              </div>
            </div>

            {/* Mobile Bottom Navigation Bar matching collage phone 1:
                [होम]  [विभाग]  [सूचना]  [संपर्क]
            */}
            <div className="bg-white border-t border-slate-200 px-3 py-2 flex justify-around text-center text-slate-600 text-[10px] font-bold">
              <div className="text-[#174EA6] flex flex-col items-center cursor-pointer">
                <Home className="w-4 h-4" />
                <span>होम</span>
              </div>
              <div
                onClick={() => {
                  onClose();
                  onSelectTab?.('departments');
                }}
                className="flex flex-col items-center cursor-pointer hover:text-blue-600"
              >
                <Building className="w-4 h-4" />
                <span>विभाग</span>
              </div>
              <div
                onClick={() => {
                  onClose();
                  onSelectTab?.('notices');
                }}
                className="flex flex-col items-center cursor-pointer hover:text-blue-600"
              >
                <Bell className="w-4 h-4" />
                <span>सूचना</span>
              </div>
              <div
                onClick={() => {
                  onClose();
                  onSelectTab?.('contact');
                }}
                className="flex flex-col items-center cursor-pointer hover:text-blue-600"
              >
                <Phone className="w-4 h-4" />
                <span>संपर्क</span>
              </div>
            </div>
          </div>

          {/* PHONE 2: MOBILE COMPLAINT REGISTRATION SCREEN */}
          <div className="w-[310px] h-[600px] bg-white text-slate-900 rounded-[44px] shadow-2xl border-[8px] border-slate-800 relative flex flex-col overflow-hidden">
            {/* Phone Speaker Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-full z-20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-900 mr-2" />
              <span className="w-8 h-1 bg-slate-700 rounded-full" />
            </div>

            {/* Mobile Status Bar */}
            <div className="pt-3 px-6 pb-1 flex justify-between text-[11px] font-bold text-slate-700 bg-white z-10">
              <span>9:31</span>
              <span>📶 5G 🔋</span>
            </div>

            {/* Header: < शिकायत दर्ज करें */}
            <div className="px-3 py-2 border-b border-slate-100 flex items-center space-x-2 bg-white z-10">
              <button
                onClick={() => setMobileScreen('HOME')}
                className="p-1 text-slate-700 hover:text-blue-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h4 className="text-xs font-black text-slate-900">शिकायत दर्ज करें</h4>
            </div>

            {/* Stepper matching collage phone 2: 1 2 3 4 5 */}
            <div className="px-4 py-2 border-b border-slate-100 flex justify-between text-[10px] font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                ✓
              </span>
              <span className="w-5 h-5 rounded-full bg-[#174EA6] text-white flex items-center justify-center shadow-xs">
                2
              </span>
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                3
              </span>
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                4
              </span>
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                5
              </span>
            </div>

            {/* Form Fields matching collage phone 2 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  विभाग चुनें <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                  <option>सफाई विभाग</option>
                  <option>प्रकाश विभाग</option>
                  <option>सड़क विभाग</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  श्रेणी <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                  <option>कचरा/गंदगी</option>
                  <option>नाली जाम</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  विवरण <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="यहाँ समस्या का विवरण लिखें..."
                  defaultValue="वार्ड नं. 5 में मुख्य बाजार के पास 3 दिनों से कचरा जमा है..."
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              {/* Two pill buttons from collage phone 2:
                  [लोकेशन (GPS)]  [फोटो अपलोड]
              */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  className="flex items-center justify-center space-x-1 p-2 rounded-xl border border-blue-300 bg-blue-50 text-[#174EA6] text-[11px] font-bold"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>लोकेशन (GPS)</span>
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center space-x-1 p-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 text-[11px] font-bold"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-600" />
                  <span>फोटो अपलोड</span>
                </button>
              </div>
            </div>

            {/* Bottom Button matching collage phone 2: [आगे बढ़ें →] */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectTab?.('register_complaint');
                }}
                className="w-full py-2.5 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white text-xs font-bold shadow-md flex items-center justify-center space-x-1.5"
              >
                <span>आगे बढ़ें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-4 border-t border-slate-800 text-xs text-slate-400">
          प्रदर्शित मोबाइल लेआउट नगर पालिका सपोटरा के PWA / स्मार्टफोन इंटरफेस का वास्तविक दृश्य है।
        </div>
      </div>
    </div>
  );
};
