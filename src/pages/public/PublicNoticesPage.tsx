import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { Bell, FileText, Download, Calendar, Filter, Search, ExternalLink } from 'lucide-react';

export const PublicNoticesPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const { notices } = useMunicipalData();
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = notices.filter((n) => {
    const matchesCat = categoryFilter === 'ALL' || n.category === categoryFilter;
    const matchesSearch =
      !search ||
      n.titleHi.toLowerCase().includes(search.toLowerCase()) ||
      n.noticeNumber.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'TENDER':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'ORDER':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'EVENT':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#123568] to-[#174EA6] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-block bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
            आधिकारिक विज्ञप्तियां एवं आदेश
          </span>
          <h1 className="text-3xl font-extrabold">सार्वजनिक सूचनाएं, निविदाएं एवं आदेश</h1>
          <p className="text-xs sm:text-sm text-slate-200 font-hindi">
            नगर पालिका सपोटरा द्वारा जारी समस्त सार्वजनिक घोषणाएं, सफाई अभियान, ई-निविदाएं एवं प्रशासनिक परिपत्र।
          </p>
        </div>

        {/* Filter */}
        <div className="w-full md:w-64 shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-white text-slate-900 text-xs font-bold shadow-md focus:outline-hidden"
          >
            <option value="ALL">समस्त सूचनाएं (All Categories)</option>
            <option value="NOTICE">सार्वजनिक सूचना (Notice)</option>
            <option value="TENDER">ई-निविदा (E-Tenders)</option>
            <option value="ORDER">प्रशासनिक आदेश (Govt Orders)</option>
            <option value="EVENT">विशेष शिविर / कार्यक्रम (Events)</option>
          </select>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-[#174EA6]/50 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                  {item.noticeNumber}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryBadge(item.category)}`}>
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>प्रकाशन: {new Date(item.publishDate).toLocaleDateString('hi-IN')}</span>
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900">{item.titleHi}</h3>
              <p className="text-xs text-slate-600 font-hindi leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => alert(`सूचना डाउनलोड: ${item.titleHi}\n(आधिकारिक पीडीएफ फाइल सिमुलेशन)`)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-50 text-[#174EA6] hover:bg-blue-100 text-xs font-bold transition-colors border border-blue-200"
              >
                <Download className="w-4 h-4" />
                <span>PDF डाउनलोड</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
