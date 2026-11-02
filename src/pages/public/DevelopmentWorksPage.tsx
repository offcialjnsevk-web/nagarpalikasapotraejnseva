import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { DevelopmentProject } from '../../types';
import {
  FolderGit2,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Building,
  MapPin,
  Search,
  Eye,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  Camera,
  X,
} from 'lucide-react';

export const DevelopmentWorksPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const { projects } = useMunicipalData();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [activePhotoModes, setActivePhotoModes] = useState<Record<string, 'BEFORE' | 'AFTER'>>({});
  const [comparisonModalProject, setComparisonModalProject] = useState<DevelopmentProject | null>(null);

  const filtered = projects.filter((p) => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const matchesSearch =
      !search ||
      p.titleHi.toLowerCase().includes(search.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(search.toLowerCase()) ||
      p.contractorAgency.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'WORK_STARTED':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusHindi = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'कार्य पूर्ण (Completed)';
      case 'IN_PROGRESS':
        return 'प्रगतिरत (In Progress)';
      case 'WORK_STARTED':
        return 'कार्य प्रारंभ (Work Started)';
      default:
        return status;
    }
  };

  const setCardPhotoMode = (projId: string, mode: 'BEFORE' | 'AFTER') => {
    setActivePhotoModes((prev) => ({ ...prev, [projId]: mode }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#123568] via-[#174EA6] to-[#0f2d59] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-block bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
            नागरिक आधारभूत विकास दर्पण • सपोटरा
          </span>
          <h1 className="text-3xl font-extrabold">सपोटरा नगर विकास परियोजनाएं (Civic Works)</h1>
          <p className="text-xs sm:text-sm text-slate-200 font-hindi">
            नगर पालिका क्षेत्र में स्वीकृत, प्रगतिरत एवं पूर्ण हो चुके सभी विकास कार्यों की कार्य से पहले (Before) एवं कार्य पूर्णता के बाद (After) की लाइव फोटो सहित पारदर्शी लेखा-जोखा।
          </p>
        </div>

        {/* Filter & Search controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="सड़क, नाला या कोड खोजें..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 px-4 py-2.5 rounded-2xl bg-white text-slate-900 text-xs font-bold shadow-md focus:outline-hidden placeholder:text-slate-400"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 text-xs font-bold shadow-md focus:outline-hidden"
          >
            <option value="ALL">समस्त कार्य (All Projects)</option>
            <option value="COMPLETED">पूर्ण कार्य (Completed)</option>
            <option value="IN_PROGRESS">प्रगतिरत कार्य (In Progress)</option>
            <option value="WORK_STARTED">प्रारंभ कार्य (Started)</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((proj) => {
          const currentMode = activePhotoModes[proj.id] || (proj.status === 'COMPLETED' ? 'AFTER' : 'BEFORE');
          const beforeImg = proj.beforeImages?.[0] || 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80';
          const afterImg = proj.afterImages?.[0] || proj.images[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80';
          const displayedImg = currentMode === 'BEFORE' ? beforeImg : afterImg;

          return (
            <div
              key={proj.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Image Header with Before/After Switch */}
              <div className="relative h-52 w-full bg-slate-900 overflow-hidden group">
                <img
                  src={displayedImg}
                  alt={proj.titleHi}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                  {proj.projectCode}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${getStatusBadge(proj.status)}`}>
                    {getStatusHindi(proj.status)}
                  </span>
                </div>

                {/* BEFORE / AFTER TOGGLE BUTTONS directly on photo */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/20 space-x-1">
                    <button
                      type="button"
                      onClick={() => setCardPhotoMode(proj.id, 'BEFORE')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all flex items-center space-x-1 ${
                        currentMode === 'BEFORE'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Camera className="w-3 h-3" />
                      <span>पहले (Before)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardPhotoMode(proj.id, 'AFTER')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all flex items-center space-x-1 ${
                        currentMode === 'AFTER'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>बाद में (After)</span>
                    </button>
                  </div>

                  {/* Compare button */}
                  <button
                    type="button"
                    onClick={() => setComparisonModalProject(proj)}
                    className="p-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-bold text-xs shadow-md transition-all flex items-center space-x-1"
                    title="दोनों फोटो एक साथ तुलना करें"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#174EA6]" />
                    <span className="text-[10px] hidden sm:inline">तुलना</span>
                  </button>
                </div>

                {/* State Tag */}
                <div className="absolute top-12 left-3">
                  {currentMode === 'BEFORE' ? (
                    <span className="bg-rose-500/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      कार्य से पहले की स्थिति
                    </span>
                  ) : (
                    <span className="bg-emerald-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      नवनिर्मित / वर्तमान स्थिति
                    </span>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span className="bg-blue-50 text-[#174EA6] px-2.5 py-0.5 rounded-md border border-blue-200">
                    वार्ड {proj.wardNumber}
                  </span>
                  <span>स्वीकृति: {new Date(proj.sanctionDate).toLocaleDateString('hi-IN')}</span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 leading-snug line-clamp-2">
                  {proj.titleHi}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-hindi bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {proj.description}
                </p>

                {/* Budget & Contractor Details */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <span className="text-[10px] text-amber-700 uppercase font-bold block">स्वीकृत बजट</span>
                    <span className="text-base font-black text-amber-900">₹ {proj.approvedBudget.toFixed(2)} लाख</span>
                  </div>
                  <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                    <span className="text-[10px] text-blue-700 uppercase font-bold block">लक्ष्य पूर्णता</span>
                    <span className="text-xs font-bold text-blue-900">
                      {new Date(proj.targetCompletionDate).toLocaleDateString('hi-IN')}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">भौतिक कार्य प्रगति:</span>
                    <span className="font-black text-[#174EA6]">{proj.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${proj.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Contractor & Modal Trigger */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                  <span className="truncate max-w-[180px]">
                    संवेदक: <strong className="text-slate-800">{proj.contractorAgency}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => setComparisonModalProject(proj)}
                    className="text-[#174EA6] hover:text-[#123568] font-black flex items-center space-x-1 shrink-0"
                  >
                    <span>Before & After देखें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BEFORE & AFTER FULLSCREEN COMPARISON MODAL */}
      {comparisonModalProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#174EA6] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                    {comparisonModalProject.projectCode}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(comparisonModalProject.status)}`}>
                    {getStatusHindi(comparisonModalProject.status)}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  {comparisonModalProject.titleHi}
                </h2>
                <p className="text-xs text-slate-500">
                  वार्ड नं. {comparisonModalProject.wardNumber} • स्वीकृत बजट: ₹{comparisonModalProject.approvedBudget} लाख
                </p>
              </div>

              <button
                type="button"
                onClick={() => setComparisonModalProject(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-Side Before & After View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* BEFORE IMAGE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-700 flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                    <span>कार्य से पूर्व स्थिति (BEFORE)</span>
                  </span>
                  <span className="text-[11px] text-slate-500">प्रारंभ पूर्व रिकॉर्ड फोटो</span>
                </div>
                <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-rose-200 relative bg-slate-900 shadow-md">
                  <img
                    src={comparisonModalProject.beforeImages?.[0] || 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80'}
                    alt="Before Work"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">
                    प्रारंभिक स्थिति (पुराना स्वरूप)
                  </div>
                </div>
              </div>

              {/* AFTER IMAGE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-700 flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                    <span>कार्य पूर्णता / वर्तमान स्थिति (AFTER)</span>
                  </span>
                  <span className="text-[11px] text-slate-500">प्रगति: {comparisonModalProject.progressPercent}%</span>
                </div>
                <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-emerald-300 relative bg-slate-900 shadow-md">
                  <img
                    src={comparisonModalProject.afterImages?.[0] || comparisonModalProject.images[0]}
                    alt="After Work"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded">
                    नवनिर्मित स्वरूप (सुदृढ़ निर्माण)
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Technical Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-800">परियोजना विवरण एवं गुणवत्ता प्रमाणन:</h4>
              <p className="text-slate-600 font-hindi leading-relaxed">
                {comparisonModalProject.description}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block font-semibold">कार्य एजेंसी</span>
                  <span className="font-bold text-slate-800">{comparisonModalProject.contractorAgency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">कार्य आरंभ</span>
                  <span className="font-bold text-slate-800">
                    {new Date(comparisonModalProject.startDate).toLocaleDateString('hi-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">पूर्णता लक्ष्य</span>
                  <span className="font-bold text-slate-800">
                    {new Date(comparisonModalProject.targetCompletionDate).toLocaleDateString('hi-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">भौतिक प्रगति</span>
                  <span className="font-bold text-emerald-700">{comparisonModalProject.progressPercent}% पूर्ण</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setComparisonModalProject(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-md"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

