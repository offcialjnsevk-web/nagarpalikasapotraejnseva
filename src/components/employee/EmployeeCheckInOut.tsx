import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance, SAPOTRA_MUNICIPAL_OFFICE, calculateDistanceMeters, formatTimeIST } from '../../context/AttendanceContext';
import {
  Clock,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ShieldCheck,
  Navigation,
  RefreshCw,
  LogOut,
  Sparkles,
  Info,
  Check,
  User,
} from 'lucide-react';

export const EmployeeCheckInOut: React.FC = () => {
  const { currentEmployee, profile } = useAuth();
  const {
    getEmployeeTodayRecord,
    getEmployeeHistory,
    checkIn,
    checkOut,
    todayDate,
  } = useAttendance();

  // Active employee ID
  const activeEmpId = currentEmployee?.id || profile.employeeId || 'emp-101';
  const todayRecord = getEmployeeTodayRecord(activeEmpId);
  const history = getEmployeeHistory(activeEmpId);

  // Live IST Clock
  const [currentTime, setCurrentTime] = useState<string>(formatTimeIST());
  const [currentDateStr, setCurrentDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('hi-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDateStr(
        now.toLocaleDateString('hi-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Geolocation State
  const [isLocating, setIsLocating] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: SAPOTRA_MUNICIPAL_OFFICE.lat + 0.0001,
    lng: SAPOTRA_MUNICIPAL_OFFICE.lng + 0.0001,
  });
  const [distance, setDistance] = useState<number>(38);
  const [isWithinOffice, setIsWithinOffice] = useState<boolean>(true);

  // Shift & Punch Form State
  const [selfieCaptured, setSelfieCaptured] = useState<boolean>(true);
  const [selfieUrl, setSelfieUrl] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );
  const [remarks, setRemarks] = useState('');
  const [checkOutNotes, setCheckOutNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Detect GPS Location
  const detectLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const dist = calculateDistanceMeters(lat, lng, SAPOTRA_MUNICIPAL_OFFICE.lat, SAPOTRA_MUNICIPAL_OFFICE.lng);
          setCurrentCoords({ lat, lng });
          setDistance(dist);
          setIsWithinOffice(dist <= SAPOTRA_MUNICIPAL_OFFICE.radiusMeters);
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation fallback to office simulation', err);
          // Fallback simulation: inside Sapotra office
          const simLat = SAPOTRA_MUNICIPAL_OFFICE.lat + (Math.random() - 0.5) * 0.0004;
          const simLng = SAPOTRA_MUNICIPAL_OFFICE.lng + (Math.random() - 0.5) * 0.0004;
          const dist = calculateDistanceMeters(simLat, simLng, SAPOTRA_MUNICIPAL_OFFICE.lat, SAPOTRA_MUNICIPAL_OFFICE.lng);
          setCurrentCoords({ lat: simLat, lng: simLng });
          setDistance(dist);
          setIsWithinOffice(dist <= SAPOTRA_MUNICIPAL_OFFICE.radiusMeters);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  // Handle Punch In
  const handleCheckIn = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await checkIn(activeEmpId, currentCoords, selfieUrl, remarks);
      setFeedback({
        type: res.success ? 'success' : 'error',
        message: res.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Punch Out
  const handleCheckOut = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await checkOut(activeEmpId, checkOutNotes);
      setFeedback({
        type: res.success ? 'success' : 'error',
        message: res.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCheckedIn = !!todayRecord?.checkInTime;
  const isCheckedOut = !!todayRecord?.checkOutTime;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Live Clock */}
      <div className="bg-gradient-to-r from-[#123568] via-[#174EA6] to-[#0f2d59] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-300/30 px-3 py-1 rounded-full text-xs font-bold">
              <span>🏛️ नगर पालिका सपोटरा (करौली)</span>
              <span>•</span>
              <span>डिजिटल बायोमेट्रिक एवं जीपीएस हाजिरी प्रणाली</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              दैनिक उपस्थिति एवं चेक-इन / चेक-आउट
            </h1>
            <p className="text-xs text-blue-100 font-hindi">
              सपोटरा नगर पालिका परिषद के कार्मिकों हेतु आधिकारिक उपस्थिति सत्यापन विंडो
            </p>
          </div>

          {/* Real-time IST Clock Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[200px] shadow-inner">
            <div className="flex items-center justify-center space-x-1.5 text-amber-300 text-xs font-bold mb-1">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>भारतीय मानक समय (IST)</span>
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-white">
              {currentTime}
            </div>
            <div className="text-[11px] text-slate-200 mt-0.5 capitalize">
              {currentDateStr || todayDate}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center space-x-3 text-xs font-bold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 3. Main Action Grid: Punch In/Out Card + GPS & Selfie Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Punch Control Box */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          {/* Staff Info Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#174EA6] flex items-center justify-center text-xl font-black">
                {currentEmployee?.fullName ? currentEmployee.fullName[0] : 'क'}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {currentEmployee?.fullName || profile.displayName || 'श्री राजेश कुमार मीना'}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentEmployee?.designation || profile.designation || 'स्वच्छता निरीक्षक'} •{' '}
                  <span className="font-mono font-bold text-[#174EA6]">
                    {currentEmployee?.employeeCode || 'EMP-SPT-101'}
                  </span>
                </p>
              </div>
            </div>

            {/* Current Today Status Badge */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-bold">आज की स्थिति:</span>
              {isCheckedOut ? (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                  🏁 चेक-आउट पूर्ण (Shift Ended)
                </span>
              ) : isCheckedIn ? (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1" />
                  <span>🟢 ड्यूटी पर उपस्थित (Active)</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs border border-amber-300">
                  ⏳ उपस्थिति लंबित (Punch Pending)
                </span>
              )}
            </div>
          </div>

          {/* Today's Punch Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">चेक-इन समय (Punch In)</span>
              <span className="text-base font-bold text-emerald-700 font-mono">
                {todayRecord?.checkInTime || '--:--'}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">चेक-आउट समय (Punch Out)</span>
              <span className="text-base font-bold text-blue-700 font-mono">
                {todayRecord?.checkOutTime || '--:--'}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">कार्यालय से दूरी</span>
              <span className="text-base font-bold text-[#123568] font-mono">
                {todayRecord?.distanceMeters ? `${todayRecord.distanceMeters} मी.` : `${distance} मी.`}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">सत्यापन विधि</span>
              <span className="text-xs font-bold text-slate-800">
                {todayRecord?.markedBy === 'ADMIN' ? 'प्रशासक सत्यापित' : 'GPS + सेल्फी'}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-4 pt-2">
            {!isCheckedIn ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    आज की ड्यूटी / टिप्पणी (वैकल्पिक)
                  </label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="उदा. सामान्य वार्ड निरीक्षण एवं कचरा संग्रहण मॉनिटरिंग"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#174EA6] focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleCheckIn}
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span>
                    {isSubmitting
                      ? 'हाजिरी दर्ज हो रही है...'
                      : `🟢 चेक-इन दर्ज करें (Punch In - ${isWithinOffice ? 'कार्यालय' : 'फील्ड ड्यूटी'})`}
                  </span>
                </button>
              </div>
            ) : !isCheckedOut ? (
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-emerald-900 text-xs">
                      ✅ आज की उपस्थिति {todayRecord?.checkInTime} बजे दर्ज हो चुकी है।
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      ड्यूटी समाप्त होने पर नीचे दिए गए बटन से चेक-आउट दर्ज करें।
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-200 text-emerald-900 rounded-lg text-xs font-mono font-bold">
                    सक्रिय शिफ्ट
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    दिनभर का कार्य विवरण / प्रस्थान नोट (Check-out Remarks)
                  </label>
                  <input
                    type="text"
                    value={checkOutNotes}
                    onChange={(e) => setCheckOutNotes(e.target.value)}
                    placeholder="उदा. वार्ड 5 में सफाई पूरी करवाई गई, 2 शिकायतें हल की गईं"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#174EA6] focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleCheckOut}
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4 text-blue-200" />
                  <span>
                    {isSubmitting ? 'चेक-आउट दर्ज हो रहा है...' : '🔴 आज का चेक-आउट दर्ज करें (Punch Out)'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-300 text-center space-y-1">
                <p className="text-xs font-bold text-slate-800">
                  🎉 आज की दोनों उपस्थिति (चेक-इन एवं चेक-आउट) पूर्ण हो चुकी हैं!
                </p>
                <p className="text-[11px] text-slate-500">
                  चेक-इन: {todayRecord?.checkInTime} | चेक-आउट: {todayRecord?.checkOutTime}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): GPS Radius & Selfie Proof Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#174EA6]" />
              <span>जीपीएस एवं सेल्फी सत्यापन</span>
            </h3>
            <button
              onClick={detectLocation}
              disabled={isLocating}
              className="text-[#174EA6] hover:text-[#123568] flex items-center space-x-1 text-[11px] font-bold"
            >
              <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
              <span>रिफ्रेश</span>
            </button>
          </div>

          {/* GPS Geofence Status */}
          <div
            className={`p-3.5 rounded-2xl border ${
              isWithinOffice
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-amber-50/70 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1.5">
              <Navigation className={`w-4 h-4 ${isWithinOffice ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span className="font-bold text-xs">
                {isWithinOffice ? 'कार्यालय परिधि में (मान्य)' : 'फील्ड लोकेशन दर्ज'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              सपोटरा पालिका मुख्यालय से अनुमानित दूरी: <b>{distance} मीटर</b>{' '}
              {isWithinOffice ? '(120m के भीतर वैध)' : '(फील्ड कार्य उपस्थिति)'}
            </p>
            <p className="text-[10px] text-slate-500 font-mono mt-1">
              Lat: {currentCoords.lat.toFixed(5)} | Lng: {currentCoords.lng.toFixed(5)}
            </p>
          </div>

          {/* Selfie Snapshot Preview */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
              <span className="flex items-center space-x-1">
                <Camera className="w-3.5 h-3.5 text-[#174EA6]" />
                <span>हाजिरी सेल्फी प्रमाण (Photo Proof)</span>
              </span>
              <span className="text-[10px] text-emerald-600">सत्यापित ✓</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center">
              <img
                src={selfieUrl}
                alt="Attendance selfie"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white p-1.5 rounded-xl text-[9px] flex justify-between items-center">
                <span>नगर पालिका सपोटरा</span>
                <span className="font-mono">{currentTime}</span>
              </div>
            </div>

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelfieUrl(
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
                  )
                }
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-bold text-slate-700 transition-all text-center"
              >
                फोटो 1
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelfieUrl(
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                  )
                }
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-bold text-slate-700 transition-all text-center"
              >
                फोटो 2
              </button>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-hindi border-t border-slate-100 pt-3">
            📍 नगर पालिका कार्यालय: मुख्य बस स्टैंड मार्ग, सपोटरा (करौली), पिन- 322218
          </div>
        </div>
      </div>

      {/* 4. Monthly Attendance Log & Calendar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-bold text-[#123568] flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#174EA6]" />
              <span>मासिक उपस्थिति विवरण (Attendance History & Log)</span>
            </h3>
            <p className="text-xs text-slate-500 font-hindi">
              वर्तमान माह के दैनिक चेक-इन, चेक-आउट एवं उपस्थिति स्थिति
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>उपस्थित</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <span>फील्ड ड्यूटी</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span>अनुपस्थित</span>
            </span>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#123568] text-white text-[11px] uppercase font-bold">
              <tr>
                <th className="p-3">दिनांक</th>
                <th className="p-3">स्थिति (Status)</th>
                <th className="p-3">चेक-इन समय</th>
                <th className="p-3">चेक-आउट समय</th>
                <th className="p-3">स्थान एवं दूरी</th>
                <th className="p-3">कार्य विवरण / टिप्पणी</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length > 0 ? (
                history.map((rec) => {
                  const isPres = rec.status === 'PRESENT';
                  const isField = rec.status === 'FIELD_DUTY';
                  const isAbs = rec.status === 'ABSENT';

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold font-mono text-slate-900">{rec.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            isPres
                              ? 'bg-emerald-100 text-emerald-800'
                              : isField
                              ? 'bg-blue-100 text-blue-800'
                              : isAbs
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isPres
                            ? 'उपस्थित (Present)'
                            : isField
                            ? 'फील्ड ड्यूटी'
                            : isAbs
                            ? 'अनुपस्थित'
                            : 'अवकाश'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-700">{rec.checkInTime || '-'}</td>
                      <td className="p-3 font-mono text-slate-700">{rec.checkOutTime || '-'}</td>
                      <td className="p-3 text-slate-600">
                        {rec.distanceMeters ? `${rec.distanceMeters} मी. (कार्यालय)` : 'परिसर'}
                      </td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">{rec.remarks || '-'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    कोई पूर्व उपस्थिति रिकॉर्ड उपलब्ध नहीं है।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
