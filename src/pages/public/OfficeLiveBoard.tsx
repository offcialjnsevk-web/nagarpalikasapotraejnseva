import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance, formatTimeIST } from '../../context/AttendanceContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import {
  Clock,
  Radio,
  Users,
  CheckCircle2,
  MapPin,
  Building2,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Activity,
  Sparkles,
  PhoneCall,
  Calendar,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export const OfficeLiveBoard: React.FC = () => {
  const { registeredEmployees } = useAuth();
  const { records, todayDate, getStatsByDate } = useAttendance();
  const { complaints } = useMunicipalData();

  const stats = getStatsByDate(todayDate);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Live IST Clock
  const [timeStr, setTimeStr] = useState<string>(formatTimeIST());
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('hi-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString('hi-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // Recent checked-in employees
  const recentPunches = records
    .filter((r) => r.date === todayDate && r.checkInTime)
    .sort((a, b) => (b.checkInTime || '').localeCompare(a.checkInTime || ''))
    .slice(0, 6);

  // High-level officers
  const keyOfficers = [
    {
      title: 'अधिशासी अधिकारी (EO)',
      name: 'श्री गजेन्द्र सिंह छाबड़ा',
      status: 'IN_OFFICE',
      statusText: 'कार्यालय कक्ष में उपस्थित',
      color: 'bg-emerald-500',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      phone: '+91 94140 12345',
      room: 'कक्ष सं. 101 (प्रथम तल)',
    },
    {
      title: 'पालिका अध्यक्ष',
      name: 'श्रीमती सपना बैरवा',
      status: 'IN_OFFICE',
      statusText: 'अध्यक्ष कक्ष में उपस्थित',
      color: 'bg-emerald-500',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      phone: '+91 98290 11000',
      room: 'अध्यक्ष कक्ष, मुख्य भवन',
    },
    {
      title: 'कनिष्ठ अभियंता (JEN - PWD)',
      name: 'इंजी. मुकेश कुमार बैरवा',
      status: 'FIELD',
      statusText: 'फील्ड निरीक्षण (वार्ड नं. 5 व 8)',
      color: 'bg-blue-500',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      phone: '+91 94140 34567',
      room: 'तकनीकी सेल',
    },
    {
      title: 'स्वच्छता निरीक्षक (SI)',
      name: 'श्री राजेश कुमार मीना',
      status: 'IN_OFFICE',
      statusText: 'सफाई कंट्रोल रूम में उपस्थित',
      color: 'bg-emerald-500',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      phone: '+91 94140 12345',
      room: 'स्वच्छता शाखा',
    },
  ];

  return (
    <div className={`space-y-6 ${isFullscreen ? 'p-6 bg-slate-900 min-h-screen text-white' : ''}`}>
      {/* 1. TOP HEADER & BROADCAST BAR */}
      <div className="bg-gradient-to-r from-[#123568] via-[#174EA6] to-[#0f2d59] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 text-xs">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-black text-amber-300 tracking-wider uppercase">
                🔴 लाइव उपस्थिति एवं नागरिक सेवा स्थिति (Live Office Status)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              नगर पालिका सपोटरा – डिजिटल कार्यालय लाइव बोर्ड
            </h1>

            <p className="text-xs sm:text-sm text-blue-100 font-hindi max-w-2xl leading-relaxed">
              सपोटरा नगर परिषद में अधिकारियों की उपस्थिति, फील्ड टीमों की सक्रियता एवं नागरिक जन-सुनवाई की पारदर्शी लाइव स्थिति।
            </p>
          </div>

          {/* Real-time Clock & Fullscreen Toggle */}
          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto justify-between">
            <div className="bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/20 text-center shadow-lg">
              <div className="flex items-center justify-center space-x-1.5 text-amber-300 text-xs font-bold mb-1">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>लाइव डिजिटल घड़ी (IST)</span>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-black tracking-wider text-white">
                {timeStr}
              </div>
              <div className="text-[11px] text-blue-200 mt-0.5 capitalize">{dateStr}</div>
            </div>

            <button
              onClick={toggleFullscreen}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isFullscreen ? 'सामान्य व्यू' : 'फुलस्क्रीन डिस्प्ले (LED Mode)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. OFFICE STATUS & LIVE METRICS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Office Open status */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-emerald-700">कार्यालय खुला है (Open)</span>
            </div>
            <p className="text-sm font-bold text-slate-900 mt-0.5">समय: 09:30 AM – 06:00 PM</p>
            <p className="text-[10px] text-slate-500 font-hindi">नागरिक सहायता काउंटर सक्रिय</p>
          </div>
        </div>

        {/* Staff Present Today */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#174EA6] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500">कुल सक्रिय कार्मिक ऑन ड्यूटी</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">
              {stats.present + stats.fieldDuty} / {stats.total} कार्मिक
            </p>
            <p className="text-[10px] text-emerald-600 font-bold font-hindi">
              ✓ {stats.percentage}% हाजिरी दर दर्ज
            </p>
          </div>
        </div>

        {/* Field Teams Active */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500">वार्डों में फील्ड दल</span>
            <p className="text-xl font-black text-amber-700 mt-0.5">
              {stats.fieldDuty} टीमें मौके पर सक्रिय
            </p>
            <p className="text-[10px] text-slate-500 font-hindi">सफाई, रोड व लाइट रिपेयर</p>
          </div>
        </div>

        {/* Complaints Resolved Today */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500">आज निस्तारित जन-समस्याएं</span>
            <p className="text-xl font-black text-purple-800 mt-0.5">14 शिकायतें हल</p>
            <p className="text-[10px] text-slate-500 font-hindi">औसत निवारण समय: 3.5 घंटे</p>
          </div>
        </div>
      </div>

      {/* 3. SENIOR OFFICERS LIVE PRESENCE BOARD */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#123568] flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#174EA6]" />
              <span>वरिष्ठ पालिका अधिकारी लाइव उपलब्धता (Officer Presence Board)</span>
            </h2>
            <p className="text-xs text-slate-500 font-hindi">
              सपोटरा नगर पालिका के मुख्य पदाधिकारियों की कक्ष एवं फील्ड उपस्थिति
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 font-bold">कक्ष में उपस्थित</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-600 font-bold">फील्ड निरीक्षण</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyOfficers.map((off, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all space-y-2.5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{off.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${off.badgeClass}`}>
                  {off.statusText}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900">{off.name}</h4>
                <p className="text-[11px] text-slate-500 font-hindi">{off.room}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center space-x-1">
                  <PhoneCall className="w-3 h-3 text-[#174EA6]" />
                  <span>{off.phone}</span>
                </span>
                <span className="text-emerald-700 font-bold">जन-सुनवाई जारी ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. REAL-TIME CHECK-IN STREAM & DEPARTMENT GAUGES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Department-wise live presence (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-[#123568] flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#174EA6]" />
              <span>विभागीय उपस्थिति दर (Departmental Presence Meter)</span>
            </h3>
            <span className="text-xs text-slate-500 font-bold">आज की सक्रियता</span>
          </div>

          <div className="space-y-3.5">
            {[
              { name: 'सफाई एवं ठोस अपशिष्ट प्रबंधन (Sanitation)', pct: 95, present: 8, total: 8, color: 'bg-emerald-500' },
              { name: 'स्ट्रीट लाइट एवं विद्युत व्यवस्था', pct: 100, present: 3, total: 3, color: 'bg-emerald-500' },
              { name: 'सड़क निर्माण एवं PWD तकनीकी सेल', pct: 85, present: 4, total: 5, color: 'bg-blue-500' },
              { name: 'पेयजल आपूर्ति एवं जल सेवा', pct: 90, present: 3, total: 3, color: 'bg-emerald-500' },
              { name: 'प्रशासनिक सेल एवं राजस्व शाखा', pct: 100, present: 4, total: 4, color: 'bg-indigo-500' },
            ].map((dept, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{dept.name}</span>
                  <span className="text-[#174EA6] font-mono">
                    {dept.pct}% ({dept.present}/{dept.total} उपस्थित)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${dept.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${dept.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-[11px] text-[#123568] font-hindi leading-relaxed">
            ℹ️ प्रत्येक शाखा का बायोमेट्रिक एवं जीपीएस डेटा सपोटरा नगर पालिका के केंद्रीय सर्वर से सीधे जुड़ा हुआ है।
          </div>
        </div>

        {/* Right: Live Check-In Activity Ticker (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-[#123568] flex items-center space-x-2">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>लाइव चेक-इन फ़ीड (Recent Check-Ins)</span>
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              रियल-टाइम
            </span>
          </div>

          <div className="space-y-2.5">
            {recentPunches.length > 0 ? (
              recentPunches.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{rec.employeeName}</p>
                      <p className="text-[10px] text-slate-500">
                        {rec.designation} •{' '}
                        <span className="text-emerald-700 font-bold">
                          {rec.isWithinGeofence ? 'कार्यालय परिसर' : 'फील्ड'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-[#174EA6] text-xs">
                      {rec.checkInTime}
                    </span>
                    <span className="block text-[9px] text-slate-400">पंच इन</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                आज का चेक-इन डेटा अपडेट हो रहा है...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
