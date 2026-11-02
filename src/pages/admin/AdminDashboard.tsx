import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Users,
  AlertTriangle,
  Bell,
  ChevronDown,
  Calendar,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { complaints, publicDemands } = useMunicipalData();
  const [selectedMonth, setSelectedMonth] = useState('इस माह');

  // Exact KPI numbers from reference collage image (Bottom-Left)
  const kpiData = {
    totalComplaints: 1248,
    resolved: 982,
    inProgress: 178,
    pending: 88,
    totalDemands: 346,
    citizenEndorsements: 2945,
    slaOverdue: 27,
    todayComplaints: 86,
  };

  // Monthly trends data for bar chart
  const monthlyTrends = [
    { month: 'अगस्त', count: 140 },
    { month: 'सितंबर', count: 185 },
    { month: 'अक्टूबर', count: 210 },
    { month: 'नवंबर', count: 260 },
    { month: 'दिसंबर', count: 310 },
    { month: 'जनवरी', count: 360 },
  ];

  // Department distribution for donut chart
  const deptDistribution = [
    { name: 'सफाई विभाग', percent: 32, color: '#174EA6' },
    { name: 'प्रकाश विभाग', percent: 18, color: '#06B6D4' },
    { name: 'सड़क विभाग', percent: 16, color: '#10B981' },
    { name: 'जल आपूर्ति', percent: 10, color: '#8B5CF6' },
    { name: 'अन्य', percent: 24, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Bar with Title, Month Filter & Date Range matching reference image */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-hindi mt-0.5">
            नगर पालिका सपोटरा — शिकायत, मांग एवं प्रशासनिक सेवा प्रदर्शन
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0 text-xs">
          {/* Month selector dropdown */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-300 text-slate-800 font-bold py-2 pl-3.5 pr-8 rounded-xl focus:ring-2 focus:ring-[#174EA6] cursor-pointer"
            >
              <option value="इस माह">इस माह</option>
              <option value="पिछला माह">पिछला माह</option>
              <option value="चालू तिमाही">चालू तिमाही</option>
              <option value="वार्षिक 2025-26">वार्षिक 2025-26</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Date range badge */}
          <div className="flex items-center space-x-1.5 bg-slate-100 text-slate-700 px-3 py-2 rounded-xl border border-slate-200 font-mono font-semibold">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>01 Jan 2026 – 31 Jan 2026</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          EIGHT KPI CARDS (Exact 2-row layout from collage)
          ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. कुल शिकायतें: 1,248 */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="cursor-pointer bg-white rounded-2xl p-4 shadow-xs border border-slate-200 hover:border-blue-400 transition-all flex items-center space-x-3.5"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#174EA6] flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold">कुल शिकायतें</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">1,248</p>
          </div>
        </div>

        {/* 2. निस्तारित: 982 */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="cursor-pointer bg-white rounded-2xl p-4 shadow-xs border border-slate-200 hover:border-emerald-400 transition-all flex items-center space-x-3.5"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold">निस्तारित</p>
            <p className="text-xl font-black text-emerald-700 mt-0.5">982</p>
          </div>
        </div>

        {/* 3. कार्यवाही जारी: 178 */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="cursor-pointer bg-white rounded-2xl p-4 shadow-xs border border-slate-200 hover:border-amber-400 transition-all flex items-center space-x-3.5"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold">कार्यवाही जारी</p>
            <p className="text-xl font-black text-amber-700 mt-0.5">178</p>
          </div>
        </div>

        {/* 4. लंबित: 88 */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="cursor-pointer bg-white rounded-2xl p-4 shadow-xs border border-slate-200 hover:border-red-400 transition-all flex items-center space-x-3.5"
        >
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold">लंबित</p>
            <p className="text-xl font-black text-red-700 mt-0.5">88</p>
          </div>
        </div>

        {/* 5. कुल मांग पत्र: 346 */}
        <div
          onClick={() => onNavigateTab('demands')}
          className="cursor-pointer bg-white rounded-2xl p-4 shadow-xs border border-slate-200 hover:border-purple-400 transition-all flex items-center space-x-3.5"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold">कुल मांग पत्र</p>
            <p className="text-xl font-black text-purple-700 mt-0.5">346</p>
          </div>
        </div>

        {/* 6. समर्थन प्राप्त: 2,945 */}
        <div
          onClick={() => onNavigateTab('demands')}
          className="cursor-pointer bg-white rounded-2xl p-4 shadow-xs border border-slate-200 hover:border-emerald-400 transition-all flex items-center space-x-3.5"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold">समर्थन प्राप्त</p>
            <p className="text-xl font-black text-emerald-800 mt-0.5">2,945</p>
          </div>
        </div>

        {/* 7. समय सीमा पार: 27 */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="cursor-pointer bg-white rounded-2xl p-4 shadow-xs border border-slate-200 hover:border-rose-400 transition-all flex items-center space-x-3.5"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold">समय सीमा पार</p>
            <p className="text-xl font-black text-rose-700 mt-0.5">27</p>
          </div>
        </div>

        {/* 8. आज की शिकायतें: 86 */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="cursor-pointer bg-white rounded-2xl p-4 shadow-xs border border-slate-200 hover:border-blue-400 transition-all flex items-center space-x-3.5"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#174EA6] flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold">आज की शिकायतें</p>
            <p className="text-xl font-black text-[#174EA6] mt-0.5">86</p>
          </div>
        </div>
      </div>

      {/* ========================================================
          TWO BOTTOM CHARTS FROM COLLAGE:
          1. शिकायतें (विभागवार) Donut Chart
          2. मासिक प्रवृत्ति (शिकायतें) Bar Chart
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: शिकायतें (विभागवार) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            शिकायतें (विभागवार)
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
            {/* SVG Donut Chart with Center Text */}
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" stroke="#E2E8F0" strokeWidth="14" fill="transparent" />

                {/* Segment 1: सफाई विभाग 32% (color #174EA6) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#174EA6"
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray={`${32 * 2.387} ${100 * 2.387}`}
                  strokeDashoffset="0"
                />

                {/* Segment 2: प्रकाश विभाग 18% (color #06B6D4) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#06B6D4"
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray={`${18 * 2.387} ${100 * 2.387}`}
                  strokeDashoffset={`-${32 * 2.387}`}
                />

                {/* Segment 3: सड़क विभाग 16% (color #10B981) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#10B981"
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray={`${16 * 2.387} ${100 * 2.387}`}
                  strokeDashoffset={`-${(32 + 18) * 2.387}`}
                />

                {/* Segment 4: जल आपूर्ति 10% (color #8B5CF6) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#8B5CF6"
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray={`${10 * 2.387} ${100 * 2.387}`}
                  strokeDashoffset={`-${(32 + 18 + 16) * 2.387}`}
                />

                {/* Segment 5: अन्य 24% (color #F59E0B) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#F59E0B"
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray={`${24 * 2.387} ${100 * 2.387}`}
                  strokeDashoffset={`-${(32 + 18 + 16 + 10) * 2.387}`}
                />
              </svg>

              {/* Center Donut Label from Reference Image: "कुल / 1,248" */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-slate-500 font-bold">कुल</span>
                <span className="text-base font-black text-slate-900 leading-none mt-0.5">1,248</span>
              </div>
            </div>

            {/* Legend from Reference Image */}
            <div className="space-y-2 text-xs font-semibold text-slate-700">
              {deptDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>
                    {item.name} – {item.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: मासिक प्रवृत्ति (शिकायतें) Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900">
              मासिक प्रवृत्ति (शिकायतें)
            </h2>
            <span className="text-xs text-slate-500 font-mono">विगत ६ माह का सांख्यिकी</span>
          </div>

          {/* Bar Chart Container */}
          <div className="pt-4">
            <div className="flex items-end space-x-4 sm:space-x-8 h-48 border-b border-l border-slate-200 pl-3 pb-2 relative">
              {/* Y-Axis Grid Lines */}
              <div className="absolute left-0 top-0 text-[10px] text-slate-400 font-mono -translate-x-full pr-1">
                400
              </div>
              <div className="absolute left-0 top-1/4 text-[10px] text-slate-400 font-mono -translate-x-full pr-1">
                300
              </div>
              <div className="absolute left-0 top-2/4 text-[10px] text-slate-400 font-mono -translate-x-full pr-1">
                200
              </div>
              <div className="absolute left-0 top-3/4 text-[10px] text-slate-400 font-mono -translate-x-full pr-1">
                100
              </div>
              <div className="absolute left-0 bottom-0 text-[10px] text-slate-400 font-mono -translate-x-full pr-1">
                0
              </div>

              {/* Bars */}
              {monthlyTrends.map((bar, idx) => {
                const heightPct = Math.round((bar.count / 400) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-mono font-bold text-[#174EA6] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                      {bar.count}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[42px] bg-[#174EA6] hover:bg-[#123568] rounded-t-lg transition-all duration-300 relative"
                    />
                    <span className="text-[11px] font-hindi text-slate-600 mt-2 whitespace-nowrap">
                      {bar.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
