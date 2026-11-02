import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import {
  Sparkles,
  Lightbulb,
  Hammer,
  Droplets,
  Waves,
  Shield,
  Trees,
  Home,
  FileSpreadsheet,
  Flame,
  Activity,
  Layers,
  Search,
  Phone,
  MessageCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface DepartmentsPageProps {
  setCurrentTab: (tab: string, meta?: any) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ setCurrentTab }) => {
  const { t, lang } = useLanguage();
  const { departments } = useMunicipalData();
  const [search, setSearch] = useState('');

  const getIcon = (name: string) => {
    if (name.includes('Sanitation') || name.includes('स्वच्छता')) return Sparkles;
    if (name.includes('Street') || name.includes('विद्युत')) return Lightbulb;
    if (name.includes('Road') || name.includes('सड़क')) return Hammer;
    if (name.includes('Water') || name.includes('जल')) return Droplets;
    if (name.includes('Drainage') || name.includes('नाली')) return Waves;
    if (name.includes('Fire') || name.includes('अग्नि')) return Flame;
    if (name.includes('Garden') || name.includes('उद्यान')) return Trees;
    if (name.includes('Health') || name.includes('स्वास्थ्य')) return Activity;
    if (name.includes('Revenue') || name.includes('राजस्व')) return FileSpreadsheet;
    return Layers;
  };

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.nameHi.toLowerCase().includes(search.toLowerCase()) ||
      d.headName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#123568] to-[#174EA6] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-block bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
            नागरिक सेवा निर्देशिका (Department Directory)
          </span>
          <h1 className="text-3xl font-extrabold">नगर पालिका विभाग एवं सेवा समय सीमा (SLA)</h1>
          <p className="text-xs sm:text-sm text-slate-200 font-hindi">
            प्रत्येक विभाग के प्रभारी अधिकारी, शिकायत निवारण की निर्धारित समय सीमा एवं ऑनलाइन शिकायत दर्ज करने की सुविधा।
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="विभाग खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white text-slate-900 text-xs focus:outline-hidden shadow-md"
          />
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dept) => {
          const Icon = getIcon(dept.name);
          return (
            <div
              key={dept.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#174EA6] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <Clock className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    SLA: {dept.slaDays} दिन
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">{dept.nameHi}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{dept.name}</p>
                </div>

                {/* Head Contact Info */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                  <p className="font-bold text-slate-800">{dept.headName}</p>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-[#174EA6]" />
                      <span>{dept.contactPhone}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp सक्रिय</span>
                    </span>
                  </div>
                </div>

                {/* Service Categories list */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    मुख्य सेवाएं एवं शिकायत श्रेणियां:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dept.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direct Lodge Complaint Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setCurrentTab('register_complaint', { deptId: dept.id })}
                  className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-[#F39A25] hover:bg-[#d88214] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <span>इस विभाग में शिकायत दर्ज करें</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
