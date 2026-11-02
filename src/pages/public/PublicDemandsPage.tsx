import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LeafletMap } from '../../components/common/LeafletMap';
import { PublicDemand, DemandStatus } from '../../types';
import {
  FileText,
  ThumbsUp,
  Users,
  MapPin,
  PlusCircle,
  CheckCircle,
  Filter,
  Search,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

const DEMAND_CATEGORIES = [
  'New Road Construction',
  'Road Repair',
  'Street Light Installation',
  'Drain Construction',
  'Park Development',
  'CCTV Installation',
  'Public Toilet Construction',
  'Drinking Water Facilities',
  'Community Hall',
  'Public Infrastructure',
  'Other Development Requests',
];

export const PublicDemandsPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const { publicDemands, wards, submitPublicDemand, supportPublicDemand } = useMunicipalData();

  const [activeTab, setActiveTab] = useState<'browse' | 'submit'>('browse');
  const [selectedWardFilter, setSelectedWardFilter] = useState('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Support OTP / Phone modal state
  const [supportModalDemand, setSupportModalDemand] = useState<PublicDemand | null>(null);
  const [voterPhone, setVoterPhone] = useState('9414012345');
  const [supporterName, setSupporterName] = useState('राधाकिशन मीना');
  const [supporterAddress, setSupporterAddress] = useState('मकान नं. 45, मुख्य बाजार, सपोटरा');
  const [supporterWard, setSupporterWard] = useState('5');
  const [supporterAadhaar, setSupporterAadhaar] = useState('7894-1234-5678');
  const [supporterAadhaarDoc, setSupporterAadhaarDoc] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80');
  const [showLegalWarningModal, setShowLegalWarningModal] = useState(false);
  const [legalWarningAgreed, setLegalWarningAgreed] = useState(false);
  const [supportStatusMsg, setSupportStatusMsg] = useState('');
  const [supportFormError, setSupportFormError] = useState('');

  // New Demand Form State
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [wardNumber, setWardNumber] = useState('1');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(DEMAND_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [beneficiaryCount, setBeneficiaryCount] = useState<number>(250);
  const [publicRemarks, setPublicRemarks] = useState('');
  const [latitude, setLatitude] = useState(26.1554);
  const [longitude, setLongitude] = useState(76.7578);
  const [formSubmittedDemand, setFormSubmittedDemand] = useState<PublicDemand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter demands
  const filteredDemands = publicDemands.filter((d) => {
    const matchesWard = selectedWardFilter === 'ALL' || d.wardNumber === selectedWardFilter;
    const matchesCat = selectedCategoryFilter === 'ALL' || d.category === selectedCategoryFilter;
    const matchesSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.demandNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.applicantName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWard && matchesCat && matchesSearch;
  });

  const handleOpenSupport = (demand: PublicDemand) => {
    setSupportModalDemand(demand);
    setSupportStatusMsg('');
    setSupportFormError('');
    setShowLegalWarningModal(false);
    setLegalWarningAgreed(false);
  };

  const handleProceedToWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supporterName.trim()) {
      setSupportFormError('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }
    if (!supporterAddress.trim()) {
      setSupportFormError('कृपया अपना पूरा आवासीय पता दर्ज करें।');
      return;
    }
    if (voterPhone.length < 10) {
      setSupportFormError('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }
    const cleanAadhaar = supporterAadhaar.replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      setSupportFormError('कृपया 12 अंकों का वैध आधार नंबर दर्ज करें।');
      return;
    }
    setSupportFormError('');
    setShowLegalWarningModal(true);
  };

  const handleFinalSupportSubmit = async () => {
    if (!supportModalDemand || !legalWarningAgreed) return;

    setIsSubmitting(true);
    try {
      const res = await supportPublicDemand(supportModalDemand.id, voterPhone, {
        name: supporterName.trim(),
        address: supporterAddress.trim(),
        wardNumber: supporterWard,
        aadhaarNumber: supporterAadhaar.trim(),
        aadhaarDoc: supporterAadhaarDoc,
      });

      setSupportStatusMsg(res.message);
      if (res.success) {
        setTimeout(() => {
          setShowLegalWarningModal(false);
          setSupportModalDemand(null);
          setSupportStatusMsg('');
          setLegalWarningAgreed(false);
        }, 2500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemandCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim() || !title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await submitPublicDemand({
        applicantName: applicantName.trim(),
        applicantPhone: applicantPhone.trim(),
        wardNumber,
        title: title.trim(),
        category,
        description: description.trim(),
        beneficiaryCount: Number(beneficiaryCount) || 100,
        publicRemarks: publicRemarks.trim(),
        latitude,
        longitude,
        photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=600&q=80'],
        status: 'SUBMITTED',
      });

      setFormSubmittedDemand(created);
      setActiveTab('browse');
    } catch (err) {
      console.error('Error submitting public demand: ', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#123568] via-[#174EA6] to-[#0f2d59] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="space-y-3 max-w-2xl">
          <span className="inline-block bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
            लोकतांत्रिक जनभागीदारी मंच • सपोटरा
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            सार्वजनिक मांग पत्र पोर्टल (Public Demands Portal)
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-hindi leading-relaxed">
            अपने वार्ड में नई सड़क, नाला, पार्क, पेयजल, हाई-मास्ट लाइट या सामुदायिक विकास कार्य हेतु प्रस्ताव प्रस्तुत करें
            एवं अन्य नागरिकों के मांग पत्रों को जन समर्थन (Upvote) देकर प्राथमिकता दिलाएं।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md ${
              activeTab === 'browse'
                ? 'bg-white text-[#174EA6]'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            📋 मांग पत्र देखें एवं समर्थन दें
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 ${
              activeTab === 'submit'
                ? 'bg-[#F39A25] text-white'
                : 'bg-[#F39A25]/90 hover:bg-[#F39A25] text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ नया मांग पत्र प्रस्तुत करें</span>
          </button>
        </div>
      </div>

      {/* SUCCESS BANNER AFTER CREATION */}
      {formSubmittedDemand && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-emerald-950 flex flex-col sm:flex-row justify-between items-center gap-4 animate-in slide-in-from-top-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <h3 className="font-extrabold text-base">आपका विकास मांग पत्र सफलता पूर्वक पंजीकृत हो गया है!</h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                मांग पत्र संख्या:{' '}
                <strong className="font-mono text-sm bg-emerald-200/60 px-2 py-0.5 rounded">
                  {formSubmittedDemand.demandNumber}
                </strong>{' '}
                • अब आपके वार्ड के अन्य नागरिक भी इसे समर्थन (Upvote) दे सकते हैं।
              </p>
            </div>
          </div>
          <button
            onClick={() => setFormSubmittedDemand(null)}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shrink-0"
          >
            ठीक है (Dismiss)
          </button>
        </div>
      )}

      {/* BROWSE TAB */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="शीर्षक, आवेदक अथवा मांग सं..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#174EA6]"
              />
            </div>

            <div>
              <select
                value={selectedWardFilter}
                onChange={(e) => setSelectedWardFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#174EA6]"
              >
                <option value="ALL">सभी वार्ड (All Wards 1-10)</option>
                {wards.map((w) => (
                  <option key={w.id} value={w.wardNumber}>
                    वार्ड नं. {w.wardNumber} ({w.wardNameHi})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#174EA6]"
              >
                <option value="ALL">सभी विकास श्रेणियां (All Categories)</option>
                {DEMAND_CATEGORIES.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center text-xs font-bold text-slate-500 justify-end">
              <span>कुल मांगें: {filteredDemands.length}</span>
            </div>
          </div>

          {/* Demands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDemands.map((dem) => (
              <div
                key={dem.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-black text-[#174EA6] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {dem.demandNumber}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        वार्ड नं. {dem.wardNumber}
                      </span>
                      <StatusBadge status={dem.status} />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-snug">{dem.title}</h3>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {dem.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-hindi bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {dem.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-slate-400 text-[11px]">प्रस्तावक नागरिक:</span>
                      <p className="font-bold text-slate-800">{dem.applicantName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px]">अनुमानित लाभार्थी:</span>
                      <p className="font-bold text-indigo-700 flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{dem.beneficiaryCount}+ निवासी</span>
                      </p>
                    </div>
                  </div>

                  {dem.sanctionedBudget && (
                    <div className="bg-emerald-50 text-emerald-900 p-2.5 rounded-xl border border-emerald-200 text-xs flex justify-between items-center">
                      <span>स्वीकृत बजट राशि:</span>
                      <span className="font-extrabold text-sm text-emerald-700">₹ {dem.sanctionedBudget} लाख</span>
                    </div>
                  )}
                </div>

                {/* Support / Upvote Strip */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-[#174EA6] flex items-center justify-center font-bold text-xs">
                      {dem.supportCount}
                    </div>
                    <span className="text-xs font-bold text-slate-700">नागरिक समर्थन</span>
                  </div>

                  <button
                    onClick={() => handleOpenSupport(dem)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#174EA6] to-[#123568] hover:from-[#123568] hover:to-[#0f2d59] text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>समर्थन दें (Support)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMIT TAB */}
      {activeTab === 'submit' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-xl font-extrabold text-[#123568]">नया सार्वजनिक विकास मांग पत्र प्रस्तुत करें</h2>
            <p className="text-xs text-slate-500 mt-1 font-hindi">
              सपोटरा नगर पालिका क्षेत्र में आवश्यक सामुदायिक व बुनियादी ढांचे के विकास हेतु अपना प्रस्ताव दर्ज करें।
            </p>
          </div>

          <form onSubmit={handleDemandCreate} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  प्रस्तावक / आवेदक का नाम *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. बनवारी लाल शर्मा एवं स्थानीय निवासी"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#174EA6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  मोबाइल नंबर (सत्यापन हेतु) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-अंकीय मोबाइल नंबर"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#174EA6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  वार्ड संख्या (Ward Number) *
                </label>
                <select
                  value={wardNumber}
                  onChange={(e) => setWardNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-[#174EA6]"
                >
                  {wards.map((w) => (
                    <option key={w.id} value={w.wardNumber}>
                      वार्ड नं. {w.wardNumber} - {w.wardNameHi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  मांग श्रेणी (Demand Category) *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-[#174EA6]"
                >
                  {DEMAND_CATEGORIES.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  मांग पत्र का मुख्य शीर्षक (Demand Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. वार्ड 4 में महावीर जी मार्ग से कृष्णा कॉलोनी तक नई सीसी सड़क व नाली निर्माण"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#174EA6]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  विस्तृत मांग विवरण (Detailed Proposal & Justification) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="इस कार्य की आवश्यकता क्यों है, वर्तमान में क्या समस्या आ रही है, कितने परिवारों को लाभ मिलेगा..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#174EA6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  अनुमानित लाभार्थी संख्या (Beneficiary Count) *
                </label>
                <input
                  type="number"
                  min={10}
                  step={50}
                  value={beneficiaryCount}
                  onChange={(e) => setBeneficiaryCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#174EA6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  विशेष सार्वजनिक टिप्पणी (Public Remarks)
                </label>
                <input
                  type="text"
                  placeholder="उदा. पहले भी बोर्ड में चर्चा हुई थी..."
                  value={publicRemarks}
                  onChange={(e) => setPublicRemarks(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#174EA6]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  प्रस्तावित विकास स्थल (GPS Location on Map)
                </label>
                <LeafletMap
                  center={[latitude, longitude]}
                  zoom={14}
                  selectable={true}
                  selectedLocation={[latitude, longitude]}
                  onLocationSelect={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                  height="260px"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-[#F39A25] hover:bg-[#d88214] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all"
              >
                <span>मांग पत्र सबमिट करें (Submit Proposal)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUPPORT / UPVOTE MODAL - STEP 1: IDENTITY & AADHAAR */}
      {supportModalDemand && !showLegalWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2 text-[#174EA6]">
                <ThumbsUp className="w-5 h-5 text-amber-500" />
                <span>मांग पत्र समर्थन हेतु नागरिक पहचान सत्यापन</span>
              </h3>
              <button
                onClick={() => setSupportModalDemand(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Selected Demand Header */}
            <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 text-xs">
              <p className="font-bold text-slate-900">{supportModalDemand.title}</p>
              <p className="text-slate-500 mt-0.5">
                मांग क्रमांक: <span className="font-mono font-bold text-[#174EA6]">{supportModalDemand.demandNumber}</span> • वार्ड नं. {supportModalDemand.wardNumber}
              </p>
            </div>

            {/* Supporter Details Form */}
            <form onSubmit={handleProceedToWarning} className="space-y-3.5 text-xs">
              {/* Full Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. आपका पूरा नाम (आधार कार्ड के अनुसार) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राधाकिशन मीना"
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#174EA6]"
                />
              </div>

              {/* Residential Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  2. आपका पूर्ण आवासीय पता (सपोटरा) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. मकान नं. 45, मुख्य बाजार, सपोटरा"
                  value={supporterAddress}
                  onChange={(e) => setSupporterAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#174EA6]"
                />
              </div>

              {/* Ward & Mobile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    3. आपका वार्ड संख्या *
                  </label>
                  <select
                    value={supporterWard}
                    onChange={(e) => setSupporterWard(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#174EA6]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((wn) => (
                      <option key={wn} value={String(wn)}>
                        वार्ड नं. {wn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    4. 10-अंकीय मोबाइल नंबर *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="मोबाइल नंबर"
                    value={voterPhone}
                    onChange={(e) => setVoterPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#174EA6]"
                  />
                </div>
              </div>

              {/* Aadhaar Number */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  5. 12-अंकीय आधार कार्ड संख्या (Aadhaar Number) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={14}
                  placeholder="XXXX-XXXX-XXXX"
                  value={supporterAadhaar}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1-');
                    setSupporterAadhaar(formatted);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-[#174EA6]"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">सुरक्षित डेटाबेस में केवल अंतिम 4 अंक प्रदर्शित होंगे (उदा. XXXX-XXXX-5678)।</p>
              </div>

              {/* Aadhaar Card Upload */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-300 space-y-2">
                <label className="block font-bold text-slate-700">
                  6. आधार कार्ड फोटो / पहचान दस्तावेज अपलोड करें *
                </label>
                <div className="flex items-center space-x-3">
                  {supporterAadhaarDoc && (
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-white">
                      <img src={supporterAadhaarDoc} alt="Aadhaar preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setSupporterAadhaarDoc(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#174EA6] file:text-white hover:file:bg-[#123568]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSupporterAadhaarDoc('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80')}
                  className="text-[10px] text-[#174EA6] hover:underline font-bold"
                >
                  ✓ नमूना आधार कार्ड दस्तावेज लोड करें
                </button>
              </div>

              {supportFormError && (
                <div className="p-2.5 rounded-xl text-xs font-bold bg-rose-50 border border-rose-200 text-rose-800">
                  ⚠️ {supportFormError}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSupportModalDemand(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
                >
                  <span>विधिक घोषणा एवं पुष्टि हेतु आगे बढ़ें</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STEP 2: STATUTORY LEGAL WARNING & FIR POPUP */}
      {showLegalWarningModal && supportModalDemand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 border-2 border-rose-500">
            {/* Warning Header */}
            <div className="flex items-center space-x-3 text-rose-700">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 border border-rose-200">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg leading-tight text-slate-900">
                  विधिक चेतावनी एवं पहचान सत्यता घोषणा
                </h3>
                <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                  Statutory Legal Warning & Official Declaration
                </p>
              </div>
            </div>

            {/* Warning Text Box */}
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 text-xs space-y-2 text-rose-950 font-hindi leading-relaxed">
              <p className="font-black text-rose-800 text-sm">
                सावधान: फर्जी समर्थन या गलत पहचान दर्ज करना दंडनीय अपराध है!
              </p>
              <p>
                "यदि आपके द्वारा प्रस्तुत <strong>नाम ({supporterName})</strong>, <strong>पता ({supporterAddress})</strong>, अथवा <strong>आधार कार्ड ({supporterAadhaar.slice(0, 4)}...{supporterAadhaar.slice(-4)})</strong> में से कोई भी विवरण गलत, कूटरचित, फर्जी या किसी अन्य नागरिक का पाया गया, तो आपके खिलाफ <strong>भारतीय न्याय संहिता (BNS 2023)</strong> एवं <strong>राजस्थान नगरपालिका अधिनियम, 2009</strong> की सुसंगत धाराओं के अंतर्गत सख्त कानूनी कार्यवाही करते हुए <strong>पुलिस प्राथमिकी (FIR)</strong> दर्ज करवाई जा सकती है।"
              </p>
              <p className="text-[11px] text-rose-800/90 pt-1 border-t border-rose-200 font-semibold">
                नगर पालिका प्रशासन द्वारा सभी समर्थनों का फील्ड स्तर पर भौतिक व डिजिटल सत्यापन किया जा सकता है।
              </p>
            </div>

            {/* Checkbox Declaration */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="flex items-start space-x-3 cursor-pointer text-xs select-none">
                <input
                  type="checkbox"
                  checked={legalWarningAgreed}
                  onChange={(e) => setLegalWarningAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                />
                <span className="font-bold text-slate-800 leading-snug">
                  मैं प्रमाणित करता/करती हूँ कि मेरे द्वारा दिया गया नाम, पता व आधार पूर्णतः सत्य है। यदि यह असत्य पाया जाता है तो मैं स्वयं विधिक कार्यवाही व दंडात्मक परिणाम हेतु उत्तरदायी रहूँगा/रहूँगी।
                </span>
              </label>
            </div>

            {/* Status notification */}
            {supportStatusMsg && (
              <div
                className={`p-3 rounded-2xl text-xs font-bold text-center ${
                  supportStatusMsg.includes('सफलतापूर्वक')
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {supportStatusMsg}
              </div>
            )}

            {/* Final Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowLegalWarningModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                ← वापस संशोधन करें
              </button>

              <button
                type="button"
                disabled={!legalWarningAgreed || isSubmitting}
                onClick={handleFinalSupportSubmit}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-black text-xs shadow-lg transition-all flex items-center space-x-1.5"
              >
                <span>{isSubmitting ? 'समर्थन दर्ज हो रहा है...' : 'सहमत हूँ, समर्थन दर्ज करें'}</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
