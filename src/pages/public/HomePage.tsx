import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import {
  Megaphone,
  FileText,
  Search,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  Tractor,
  Bell,
  Phone,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface HomePageProps {
  setCurrentTab: (tab: string, meta?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab }) => {
  const { complaints, settings, notices } = useMunicipalData();
  const [trackInputId, setTrackInputId] = useState('NP-2026-00125');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto advance banner slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Multiple Live Complaints Slider State
  const [complaintSlideIndex, setComplaintSlideIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isHoveredComplaint, setIsHoveredComplaint] = useState(false);

  // Exact reference complaint from image
  const refComplaint = complaints.find((c) => c.complaintNumber === 'NP-2026-00125') || complaints[0];

  // List of live complaints for slider
  const displayComplaints = complaints && complaints.length > 0 ? complaints : [refComplaint];
  const activeComplaint = displayComplaints[complaintSlideIndex % displayComplaints.length] || refComplaint;

  // Auto advance live complaint slider every 5 seconds unless user hovers
  useEffect(() => {
    if (isHoveredComplaint || displayComplaints.length <= 1) return;
    const timer = setInterval(() => {
      setComplaintSlideIndex((prev) => (prev + 1) % displayComplaints.length);
      setActivePhotoIndex(0);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayComplaints.length, isHoveredComplaint]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInputId.trim()) {
      setCurrentTab('track', { searchId: trackInputId.trim() });
    }
  };

  return (
    <div className="space-y-6 pb-12 bg-[#F4F7FC]">
      {/* 1. HERO SLIDER BANNER - Dynamic 3-Slide Carousel with Uploaded Portal Banner */}
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 group">
          {/* SLIDE 0: Uploaded Official Grand Portal Banner */}
          {currentSlide === 0 && (
            <div className="relative w-full overflow-hidden transition-all duration-700 animate-in fade-in">
              <img
                src="/assets/aistudio/Digital_Sapotra_Municipal_Portal_Banner_638e53bd.png"
                alt="नगर पालिका सपोटरा - e-Jan Seva Portal Banner"
                className="w-full h-auto min-h-[220px] sm:min-h-[300px] md:min-h-[360px] object-cover object-center"
              />
              {/* Subtle hover gradient and interactive quick links */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between w-full gap-2">
                  <span className="bg-[#123568]/85 text-white backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/20 hidden sm:inline-block">
                    🏛️ नगर पालिका सपोटरा • e-Jan Seva Portal
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentTab('register_complaint')}
                      className="px-4 py-2 rounded-xl bg-[#D83C3C] hover:bg-[#b82e2e] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1"
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>शिकायत दर्ज करें</span>
                    </button>
                    <button
                      onClick={() => setCurrentTab('public_demand')}
                      className="px-4 py-2 rounded-xl bg-[#174EA6] hover:bg-[#123d85] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>मांग पत्र</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 1: Interactive Sapotra Municipal Building Hero */}
          {currentSlide === 1 && (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#174EA6] via-[#123568] to-slate-900 text-white min-h-[340px] flex items-stretch transition-all duration-700 animate-in fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch w-full">
                <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between relative z-10">
                  <div className="space-y-3">
                    <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>आपकी समस्या, हमारा समाधान</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                      नगर पालिका सपोटरा
                    </h2>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FACC15] tracking-wide font-sans">
                      e-Jan Seva Portal
                    </h3>
                    <p className="text-sm sm:text-base text-slate-100 font-hindi max-w-lg leading-relaxed pt-2">
                      शिकायत, जन मांग, विकास कार्य एवं नगर सेवाओं के लिए एकीकृत डिजिटल नागरिक प्लेटफॉर्म।
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-6">
                    <button
                      onClick={() => setCurrentTab('register_complaint')}
                      className="bg-[#F39A25] hover:bg-[#d88214] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                    >
                      <span>ऑनलाइन शिकायत दर्ज करें</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentTab('track')}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-xs transition-all"
                    >
                      स्थिति ट्रैक करें
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 relative h-64 lg:h-auto overflow-hidden">
                  <img
                    src="/src/assets/images/sapotra_municipal_building_1793599131195.jpg"
                    alt="नगर पालिका सपोटरा भवन"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs text-[#123568] px-3.5 py-1 rounded-full text-xs font-black shadow-sm">
                    नगर पालिका सपोटरा भवन
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Leadership & Civic Governance Slide */}
          {currentSlide === 2 && (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#123568] via-[#1b437e] to-[#0e274d] text-white min-h-[340px] p-6 sm:p-10 flex flex-col justify-between transition-all duration-700 animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/15 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    राजस्थान सरकार • स्वायत्त शासन विभाग
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black mt-1">
                    सपोटरा नगर पालिका प्रशासनिक नेतृत्व
                  </h2>
                </div>
                <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full font-bold border border-white/20">
                  सुशासन एवं नागरिक संतुष्टि
                </span>
              </div>

              {/* Leadership Mini Gallery on Slide 2 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                {/* 1. CM */}
                <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 mb-2">
                    <img
                      src="/assets/aistudio/Digital_Sapotra_Municipal_Portal_Banner_638e53bd.png"
                      alt="श्री भजन लाल शर्मा"
                      className="w-full h-full object-cover object-top scale-175"
                    />
                  </div>
                  <h4 className="text-xs font-black">श्री भजन लाल शर्मा</h4>
                  <p className="text-[10px] text-amber-300 font-medium">माननीय मुख्यमंत्री, राजस्थान</p>
                </div>

                {/* 2. MLA */}
                <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 mb-2">
                    <img
                      src="/assets/aistudio/Digital_Sapotra_Municipal_Portal_Banner_638e53bd.png"
                      alt="श्री हंसराज मीना"
                      className="w-full h-full object-cover object-left scale-175"
                    />
                  </div>
                  <h4 className="text-xs font-black">श्री हंसराज मीना</h4>
                  <p className="text-[10px] text-amber-300 font-medium">माननीय विधायक, सपोटरा</p>
                </div>

                {/* 3. EO */}
                <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#174EA6] mb-2">
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-11-02_at_11.32.26_AM_b7fb52de.jpeg"
                      alt="श्री गजेन्द्र सिंह छाबड़ा"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h4 className="text-xs font-black">श्री गजेन्द्र सिंह छाबड़ा</h4>
                  <p className="text-[10px] text-blue-200 font-medium">अधिशासी अधिकारी (EO)</p>
                </div>

                {/* 4. Chairman */}
                <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 mb-2">
                    <img
                      src="/assets/aistudio/1000109485_bac2d6fd.jpg"
                      alt="श्रीमती सपना बैरवा"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h4 className="text-xs font-black">श्रीमती सपना बैरवा</h4>
                  <p className="text-[10px] text-amber-300 font-medium">अध्यक्ष, नगर पालिका सपोटरा</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-300 pt-2 border-t border-white/10">
                <span>नगर पालिका मण्डल सपोटरा, जिला करौली (राजस्थान)</span>
                <button
                  onClick={() => setCurrentTab('about')}
                  className="text-amber-300 hover:text-white font-bold flex items-center space-x-1"
                >
                  <span>विस्तृत परिचय देखें</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Prev / Next Slider Arrows */}
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs z-20"
            title="पिछला बैनर"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs z-20"
            title="अगला बैनर"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slider Indicator Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20 bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all ${
                  currentSlide === idx
                    ? 'w-6 h-2 bg-amber-400 rounded-full'
                    : 'w-2 h-2 bg-white/50 hover:bg-white rounded-full'
                }`}
                title={`स्लाइड ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. FOUR PRIMARY ACTION CARDS (Exact colors & icons from Reference Image) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: शिकायत दर्ज करें (Red Coral Card) */}
          <div
            onClick={() => setCurrentTab('register_complaint')}
            className="cursor-pointer bg-[#D83C3C] hover:bg-[#c42f2f] text-white rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center space-x-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Megaphone className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight">शिकायत दर्ज करें</h3>
              <p className="text-xs text-white/90 font-hindi mt-1 leading-snug">
                अपने क्षेत्र की समस्या की ऑनलाइन शिकायत करें
              </p>
            </div>
          </div>

          {/* Card 2: मांग पत्र दर्ज करें (Government Blue Card) */}
          <div
            onClick={() => setCurrentTab('public_demand')}
            className="cursor-pointer bg-[#174EA6] hover:bg-[#123d85] text-white rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center space-x-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight">मांग पत्र दर्ज करें</h3>
              <p className="text-xs text-white/90 font-hindi mt-1 leading-snug">
                किसी विकास कार्य/सुविधा के लिए मांग प्रस्तुत करें
              </p>
            </div>
          </div>

          {/* Card 3: शिकायत ट्रैक करें (Forest Green Card) */}
          <div
            onClick={() => setCurrentTab('track')}
            className="cursor-pointer bg-[#16864A] hover:bg-[#126b3b] text-white rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center space-x-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Search className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight">शिकायत ट्रैक करें</h3>
              <p className="text-xs text-white/90 font-hindi mt-1 leading-snug">
                दर्ज शिकायत की वर्तमान स्थिति देखें
              </p>
            </div>
          </div>

          {/* Card 4: सुझाव दें (Purple Card) */}
          <div
            onClick={() => setCurrentTab('contact')}
            className="cursor-pointer bg-[#7E3AF2] hover:bg-[#6c2bd9] text-white rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center space-x-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight">सुझाव दें</h3>
              <p className="text-xs text-white/90 font-hindi mt-1 leading-snug">
                नगरपालिका के कार्यों में सुधार हेतु अपना सुझाव दें
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EIGHT PILL STATS BAR (Exact Numbers & Labels from Reference Image) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 items-center text-center">
          {/* 1. कुल शिकायतें */}
          <div className="flex items-center space-x-2 px-2 py-1.5 border-r border-slate-100 last:border-none justify-center">
            <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs shrink-0">
              💬
            </span>
            <div className="text-left">
              <p className="text-[10px] text-slate-500 font-semibold leading-none">कुल शिकायतें</p>
              <p className="text-sm font-black text-slate-900 leading-tight">12,548</p>
            </div>
          </div>

          {/* 2. निस्तारित */}
          <div className="flex items-center space-x-2 px-2 py-1.5 border-r border-slate-100 last:border-none justify-center">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs shrink-0">
              ✔️
            </span>
            <div className="text-left">
              <p className="text-[10px] text-slate-500 font-semibold leading-none">निस्तारित</p>
              <p className="text-sm font-black text-emerald-700 leading-tight">10,276</p>
            </div>
          </div>

          {/* 3. कार्यवाही जारी */}
          <div className="flex items-center space-x-2 px-2 py-1.5 border-r border-slate-100 last:border-none justify-center">
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs shrink-0">
              ⏳
            </span>
            <div className="text-left">
              <p className="text-[10px] text-slate-500 font-semibold leading-none">कार्यवाही जारी</p>
              <p className="text-sm font-black text-amber-800 leading-tight">1,465</p>
            </div>
          </div>

          {/* 4. लंबित */}
          <div className="flex items-center space-x-2 px-2 py-1.5 border-r border-slate-100 last:border-none justify-center">
            <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs shrink-0">
              ❗
            </span>
            <div className="text-left">
              <p className="text-[10px] text-slate-500 font-semibold leading-none">लंबित</p>
              <p className="text-sm font-black text-rose-700 leading-tight">807</p>
            </div>
          </div>

          {/* 5. विभाग */}
          <button
            onClick={() => setCurrentTab('departments')}
            className="flex items-center space-x-2 px-2 py-1.5 border-r border-slate-100 hover:bg-slate-50 rounded-xl transition-colors justify-center"
          >
            <Building className="w-5 h-5 text-[#174EA6] shrink-0" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-slate-900 leading-none">विभाग</p>
              <p className="text-[10px] text-[#174EA6] font-semibold leading-none mt-0.5">सूची देखें</p>
            </div>
          </button>

          {/* 6. विकास कार्य */}
          <button
            onClick={() => setCurrentTab('development_works')}
            className="flex items-center space-x-2 px-2 py-1.5 border-r border-slate-100 hover:bg-slate-50 rounded-xl transition-colors justify-center"
          >
            <Tractor className="w-5 h-5 text-emerald-700 shrink-0" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-slate-900 leading-none">विकास कार्य</p>
              <p className="text-[10px] text-emerald-700 font-semibold leading-none mt-0.5">प्रगति देखें</p>
            </div>
          </button>

          {/* 7. सूचना एवं आदेश */}
          <button
            onClick={() => setCurrentTab('notices')}
            className="flex items-center space-x-2 px-2 py-1.5 border-r border-slate-100 hover:bg-slate-50 rounded-xl transition-colors justify-center"
          >
            <Bell className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-slate-900 leading-none">सूचना एवं आदेश</p>
              <p className="text-[10px] text-amber-600 font-semibold leading-none mt-0.5">नवीनतम सूचनाएं</p>
            </div>
          </button>

          {/* 8. हेल्पलाइन */}
          <div className="flex items-center space-x-2 px-2 py-1.5 justify-center">
            <Phone className="w-5 h-5 text-indigo-600 shrink-0" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-slate-900 leading-none">हेल्पलाइन</p>
              <p className="text-[10px] text-slate-600 font-mono font-bold leading-none mt-0.5">+91-9414010000</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THREE BOTTOM CARDS: CHAIRMAN MESSAGE, EO MESSAGE & IMPORTANT NOTICES (Exact from Image) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: अध्यक्ष का संदेश - श्रीमती सपना बैरवा */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="/assets/aistudio/1000109485_bac2d6fd.jpg"
                  alt="श्रीमती सपना बैरवा - अध्यक्ष, नगर पालिका सपोटरा"
                  className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-amber-400 shadow-xs shrink-0"
                />
                <div>
                  <h3 className="text-sm font-extrabold text-[#123568]">अध्यक्ष का संदेश</h3>
                  <p className="text-xs font-bold text-amber-700 leading-tight">श्रीमती सपना बैरवा</p>
                  <p className="text-[10px] text-slate-500 font-medium">नगर पालिका सपोटरा</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-hindi bg-slate-50 p-3 rounded-2xl border border-slate-100">
                नगर पालिका सपोटरा का क्षेत्र नगर के सर्वांगीण विकास एवं नागरिकों को बेहतर सुविधाएं उपलब्ध कराना है। यह
                e-Jan Seva Portal इसी दिशा में एक महत्वपूर्ण कदम है।
              </p>
            </div>
            <p className="text-[11px] font-bold text-slate-700 text-right mt-3">
              — श्रीमती सपना बैरवा (अध्यक्ष, नगर पालिका सपोटरा)
            </p>
          </div>

          {/* Card 2: अधिशासी अधिकारी (EO) का संदेश - श्री गजेन्द्र सिंह छाबड़ा */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-11-02_at_11.32.26_AM_b7fb52de.jpeg"
                  alt="श्री गजेन्द्र सिंह छाबड़ा - अधिशासी अधिकारी (EO), सपोटरा"
                  className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-[#174EA6] shadow-xs shrink-0"
                />
                <div>
                  <h3 className="text-sm font-extrabold text-[#123568]">अधिशासी अधिकारी का संदेश</h3>
                  <p className="text-xs font-bold text-[#174EA6] leading-tight">श्री गजेन्द्र सिंह छाबड़ा</p>
                  <p className="text-[10px] text-slate-500 font-medium">अधिशासी अधिकारी (EO), सपोटरा</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-hindi bg-slate-50 p-3 rounded-2xl border border-slate-100">
                यह पोर्टल नागरिकों की शिकायतों एवं मांगों के त्वरित निस्तारण हेतु बनाया गया है। आप सभी से अनुरोध है कि
                नगर के विकास में अपनी सक्रिय भागीदारी निभाएं।
              </p>
            </div>
            <p className="text-[11px] font-bold text-slate-700 text-right mt-3">
              — श्री गजेन्द्र सिंह छाबड़ा (अधिशासी अधिकारी, नगर पालिका सपोटरा)
            </p>
          </div>

          {/* Card 3: महत्वपूर्ण सूचनाएं (Notice Board with 'नपा' badges) */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-[#123568] flex items-center space-x-1.5">
                  <span className="text-base">📢</span>
                  <span>महत्वपूर्ण सूचनाएं</span>
                </h3>
                <button
                  onClick={() => setCurrentTab('notices')}
                  className="text-xs font-bold text-[#174EA6] hover:underline"
                >
                  सभी देखें →
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="font-hindi text-slate-800 text-[11px] truncate">
                    • स्वच्छता अभियान — विशेष अभियान
                  </span>
                  <span className="bg-[#D83C3C] text-white text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 ml-2">
                    नपा
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="font-hindi text-slate-800 text-[11px] truncate">
                    • स्ट्रीट लाइट मरम्मत हेतु हेल्पलाइन सक्रिय
                  </span>
                  <span className="bg-[#D83C3C] text-white text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 ml-2">
                    नपा
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="font-hindi text-slate-800 text-[11px] truncate">
                    • वार्डवार विकास कार्यों की बैठक
                  </span>
                  <span className="bg-[#D83C3C] text-white text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 ml-2">
                    नपा
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="font-hindi text-slate-800 text-[11px] truncate">
                    • नगर पालिका कर जमा करने की अंतिम तिथि
                  </span>
                  <span className="bg-[#D83C3C] text-white text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 ml-2">
                    नपा
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-3 pt-2 border-t border-slate-100">
              दैनिक प्रशासनिक विज्ञप्तियां
            </p>
          </div>
        </div>
      </section>

      {/* 5. THE THREE INTERACTIVE REFERENCE WIDGETS FROM MIDDLE ROW OF COLLAGE */}
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <div className="border-t border-slate-200/80 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#174EA6]">
                नागरिक समाधान केंद्र (Civic Interaction Hub)
              </span>
              <h2 className="text-xl font-extrabold text-[#123568]">
                त्वरित ट्रैकिंग, जन मांग एवं शिकायत विवरण
              </h2>
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ● लाइव डेटा सिंक्रनाइज़्ड
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Widget 1: शिकायत की स्थिति देखें (Track Complaint) */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#123568] flex items-center space-x-1.5 border-b border-slate-100 pb-2.5">
                  <Search className="w-4 h-4 text-[#174EA6]" />
                  <span>शिकायत की स्थिति देखें (Track Complaint)</span>
                </h3>

                <form onSubmit={handleTrackSubmit} className="mt-3 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">
                    शिकायत क्रमांक (Complaint ID) दर्ज करें *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackInputId}
                      onChange={(e) => setTrackInputId(e.target.value)}
                      placeholder="जैसे: NP-2026-00125"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white text-xs font-bold shrink-0"
                    >
                      खोजें
                    </button>
                  </div>
                </form>

                {/* Tracked Result Box */}
                <div className="mt-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-800">
                      शिकायत स्थिति: <strong className="text-emerald-700">कार्यवाही जारी (In Progress)</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Complaint ID: {refComplaint.complaintNumber} | दर्ज तिथि: 15 Jan 2026
                  </p>

                  {/* 4-Step Visual Dots Tracker from reference collage */}
                  <div className="grid grid-cols-4 gap-1 text-center pt-2">
                    <div>
                      <div className="w-5 h-5 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                      <p className="text-[9px] font-bold text-slate-700 mt-1">शिकायत दर्ज</p>
                      <p className="text-[8px] text-slate-400">15 Jan, 10:24 AM</p>
                    </div>
                    <div>
                      <div className="w-5 h-5 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                      <p className="text-[9px] font-bold text-slate-700 mt-1">विभाग को भेजी</p>
                      <p className="text-[8px] text-slate-400">15 Jan, 10:30 AM</p>
                    </div>
                    <div>
                      <div className="w-5 h-5 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold animate-pulse">
                        ✓
                      </div>
                      <p className="text-[9px] font-bold text-slate-700 mt-1">कार्यवाही जारी</p>
                      <p className="text-[8px] text-slate-400">15 Jan, 02:15 PM</p>
                    </div>
                    <div>
                      <div className="w-5 h-5 mx-auto rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold">
                        4
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 mt-1">निस्तारित</p>
                      <p className="text-[8px] text-slate-400">(प्रतीक्षारत)</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentTab('track', { searchId: refComplaint.complaintNumber })}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-[#174EA6] font-bold text-xs text-center transition-colors"
              >
                पूरी जानकारी देखें →
              </button>
            </div>

            {/* Widget 2: जन मांग पत्र (Public Demand with Road Roller graphic) */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#123568] flex items-center space-x-1.5 border-b border-slate-100 pb-2.5">
                  <FileText className="w-4 h-4 text-[#F39A25]" />
                  <span>जन मांग पत्र (Public Demand)</span>
                </h3>

                <p className="text-xs text-slate-600 font-hindi mt-3 leading-relaxed">
                  अपने वार्ड या क्षेत्र के विकास हेतु मांग पत्र ऑनलाइन दर्ज करें।
                </p>

                {/* 6 Checkmark items from reference collage */}
                <div className="mt-3 grid grid-cols-1 gap-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>सड़क निर्माण / मरम्मत</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>स्ट्रीट लाइट लगवाना</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>नाली / ड्रेनेज निर्माण</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>पार्क / उद्यान विकास</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>पेयजल व्यवस्था</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>अन्य विकास कार्य</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentTab('public_demand')}
                className="w-full py-2.5 rounded-xl bg-[#F39A25] hover:bg-[#d88214] text-white font-bold text-xs text-center shadow-xs transition-colors flex items-center justify-center space-x-1"
              >
                <span>मांग पत्र दर्ज करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Widget 3: शिकायत विवरण (Live Multiple Complaints Slider) */}
            <div
              onMouseEnter={() => setIsHoveredComplaint(true)}
              onMouseLeave={() => setIsHoveredComplaint(false)}
              className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between space-y-3.5 relative group"
            >
              <div>
                {/* Header with Live Badge, Status, and Prev/Next Navigation Controls */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">📋</span>
                    <h3 className="text-sm font-extrabold text-[#123568]">
                      शिकायत विवरण
                    </h3>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-200 animate-pulse">
                      ● लाइव
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* Dynamic Status Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeComplaint.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : activeComplaint.status === 'IN_PROGRESS' || activeComplaint.status === 'ASSIGNED'
                          ? 'bg-blue-100 text-[#174EA6]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {activeComplaint.status === 'RESOLVED'
                        ? 'निस्तारित'
                        : activeComplaint.status === 'IN_PROGRESS' || activeComplaint.status === 'ASSIGNED'
                        ? 'कार्यवाही जारी'
                        : 'लंबित'}
                    </span>

                    {/* Prev / Next Slider Arrows */}
                    <div className="flex items-center space-x-1 pl-1">
                      <button
                        type="button"
                        onClick={() => {
                          setComplaintSlideIndex((prev) =>
                            prev === 0 ? displayComplaints.length - 1 : prev - 1
                          );
                          setActivePhotoIndex(0);
                        }}
                        className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-[#174EA6] hover:text-white flex items-center justify-center text-slate-600 transition-colors"
                        title="पिछली शिकायत"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setComplaintSlideIndex((prev) => (prev + 1) % displayComplaints.length);
                          setActivePhotoIndex(0);
                        }}
                        className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-[#174EA6] hover:text-white flex items-center justify-center text-slate-600 transition-colors"
                        title="अगली शिकायत"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Complaint Number and Slide Index */}
                <div className="flex justify-between items-center text-xs mt-2">
                  <p className="font-mono font-black text-[#174EA6]">
                    Complaint ID: {activeComplaint.complaintNumber}
                  </p>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    {((complaintSlideIndex % displayComplaints.length) + 1)} / {displayComplaints.length}
                  </span>
                </div>

                {/* Site photo with details table */}
                <div className="mt-2.5 grid grid-cols-2 gap-3 items-center">
                  <div className="h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group/img">
                    <img
                      src={
                        (activeComplaint.photos && activeComplaint.photos[activePhotoIndex]) ||
                        activeComplaint.photos?.[0] ||
                        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={activeComplaint.subject}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded">
                      फ़ोटो #{(activePhotoIndex || 0) + 1}
                    </span>
                  </div>

                  <div className="text-[11px] space-y-1 text-slate-600">
                    <p className="truncate">
                      विभाग: <strong className="text-slate-800">{activeComplaint.departmentName}</strong>
                    </p>
                    <p className="truncate">
                      श्रेणी: <strong className="text-slate-800">{activeComplaint.category}</strong>
                    </p>
                    <p>
                      दर्ज तिथि:{' '}
                      <strong className="text-slate-800 font-mono">
                        {activeComplaint.createdAt
                          ? new Date(activeComplaint.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '15 Jan 2026'}
                      </strong>
                    </p>
                    <p className="truncate">
                      स्थान: <strong className="text-slate-800">{activeComplaint.address}</strong>
                    </p>
                    <button
                      onClick={() => setCurrentTab('track', { searchId: activeComplaint.complaintNumber })}
                      className="inline-flex items-center space-x-1 text-[10px] font-bold text-[#174EA6] hover:underline pt-0.5"
                    >
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>मानचित्र देखें 📍</span>
                    </button>
                  </div>
                </div>

                {/* Complaint Description */}
                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2.5 font-hindi line-clamp-2">
                  <span className="font-bold text-slate-800">विषय: {activeComplaint.subject} — </span>
                  {activeComplaint.description}
                </p>

                {/* Interactive Thumbnails & Slide Indicators */}
                <div className="flex justify-between items-center gap-2 mt-2">
                  {/* Thumbnails row */}
                  <div className="flex gap-1.5">
                    {(activeComplaint.photos && activeComplaint.photos.length > 0
                      ? activeComplaint.photos.slice(0, 3)
                      : [
                          'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=300&q=80',
                          'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=300&q=80',
                          'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=300&q=80',
                        ]
                    ).map((thumb, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActivePhotoIndex(idx)}
                        className={`w-12 h-9 rounded-lg overflow-hidden border cursor-pointer transition-all ${
                          activePhotoIndex === idx
                            ? 'border-[#174EA6] ring-2 ring-[#174EA6]/30 shadow-xs'
                            : 'border-slate-200 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={thumb} alt="thumb" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  {/* Complaint Carousel Dots */}
                  <div className="flex items-center space-x-1">
                    {displayComplaints.slice(0, 5).map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => {
                          setComplaintSlideIndex(dotIdx);
                          setActivePhotoIndex(0);
                        }}
                        className={`transition-all rounded-full ${
                          complaintSlideIndex % displayComplaints.length === dotIdx
                            ? 'w-4 h-1.5 bg-[#174EA6]'
                            : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                        }`}
                        title={`शिकायत #${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setCurrentTab('track', { searchId: activeComplaint.complaintNumber })}
                className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#174EA6] font-bold text-xs text-center transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>इस शिकायत ({activeComplaint.complaintNumber}) का पूर्ण स्टेटस देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
