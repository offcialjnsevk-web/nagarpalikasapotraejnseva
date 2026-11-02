import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { LeafletMap } from '../../components/common/LeafletMap';
import { Complaint } from '../../types';
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  CheckCircle2,
  MapPin,
  User,
  HelpCircle,
  LogOut,
  Bell,
  ChevronDown,
  ArrowRight,
  Camera,
  Upload,
  Check,
  X,
  AlertCircle,
  FileText,
  CalendarCheck,
} from 'lucide-react';
import { EmployeeCheckInOut } from '../../components/employee/EmployeeCheckInOut';

export const EmployeePortal: React.FC = () => {
  const { t } = useLanguage();
  const { profile, logout, currentEmployee } = useAuth();
  const { complaints, updateComplaintStatus } = useMunicipalData();

  // Active sidebar tab
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ATTENDANCE' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'MAP' | 'PROFILE'>('ATTENDANCE');

  // Selected complaint for action modal
  const [actionComplaint, setActionComplaint] = useState<Complaint | null>(null);

  // Workflow Form State
  const [workRemarks, setWorkRemarks] = useState('');
  const [beforePhoto, setBeforePhoto] = useState('');
  const [afterPhoto, setAfterPhoto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Exact reference items from collage image (Bottom-Middle)
  const assignedList = [
    {
      id: 'c-1',
      complaintNumber: 'NP-2026-00125',
      subject: 'वार्ड 5 - कचरा जमा है',
      ward: 'वार्ड नं. 5, मुख्य बाजार',
      priority: 'उच्च',
      priorityColor: 'bg-red-100 text-red-700 border-red-200',
      status: 'ASSIGNED',
      lat: 26.325678,
      lng: 76.521430,
      photo: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'c-2',
      complaintNumber: 'NP-2026-00126',
      subject: 'वार्ड 7 - नाली जाम',
      ward: 'वार्ड नं. 7, बालाजी चौक',
      priority: 'मध्यम',
      priorityColor: 'bg-amber-100 text-amber-700 border-amber-200',
      status: 'ASSIGNED',
      lat: 26.158,
      lng: 76.76,
      photo: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'c-3',
      complaintNumber: 'NP-2026-00127',
      subject: 'वार्ड 3 - गंदगी',
      ward: 'वार्ड नं. 3, तहसील रोड',
      priority: 'मध्यम',
      priorityColor: 'bg-amber-100 text-amber-700 border-amber-200',
      status: 'ASSIGNED',
      lat: 26.153,
      lng: 76.756,
      photo: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleOpenAction = (item: any) => {
    // Find in real complaints or create placeholder for demo
    const real = complaints.find((c) => c.complaintNumber === item.complaintNumber);
    if (real) {
      setActionComplaint(real);
      setBeforePhoto(real.photos[0] || item.photo);
      setWorkRemarks(real.resolutionRemarks || '');
    } else {
      setActionComplaint({
        id: item.id,
        complaintNumber: item.complaintNumber,
        departmentId: 'dept-sanitation',
        departmentName: 'सफाई विभाग',
        category: 'कचरा/गंदगी',
        subject: item.subject,
        description: 'वार्ड में तुरंत सफाई करवाने की आवश्यकता है।',
        wardNumber: '5',
        address: item.ward,
        latitude: item.lat,
        longitude: item.lng,
        photos: [item.photo],
        citizenName: 'राधाकिशन मीना',
        citizenPhone: '9414012345',
        status: 'ASSIGNED',
        priority: 'URGENT',
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setBeforePhoto(item.photo);
    }
  };

  const handleResolveComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionComplaint) return;
    setIsSubmitting(true);

    try {
      await updateComplaintStatus(
        actionComplaint.id,
        'RESOLVED',
        workRemarks || 'सफाई कर्मचारी द्वारा मौके पर पहुंचकर कचरा हटवाया गया एवं कीटनाशक छिड़काव किया गया।',
        'राकेश कुमार',
        'field_employee',
        'emp-s1',
        'राकेश कुमार (सफाई कर्मचारी)',
        beforePhoto,
        afterPhoto || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80'
      );
      setActionComplaint(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] font-sans pb-12">
      {/* Top Header matching reference image:
          "नगर पालिका सपोटरा / Employee Panel"
          Bell icon (2), "राकेश कुमार / सफाई कर्मचारी ▾"
      */}
      <header className="bg-[#123568] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <span className="text-lg">🏛️</span>
            </div>
            <div>
              <p className="text-xs text-blue-200 font-bold leading-none">नगर पालिका सपोटरा</p>
              <h1 className="text-base font-black tracking-tight leading-tight mt-0.5">
                Employee Panel
              </h1>
            </div>
          </div>

          {/* User Profile & Notification */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell with Red Badge "2" */}
            <div className="relative cursor-pointer" onClick={() => setNotificationOpen(!notificationOpen)}>
              <Bell className="w-5 h-5 text-white/90 hover:text-white" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#D83C3C] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center space-x-2 pl-2 border-l border-white/20 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-black flex items-center justify-center text-xs">
                RK
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <p className="font-bold">राकेश कुमार</p>
                <p className="text-[10px] text-blue-200">सफाई कर्मचारी</p>
              </div>
              <ChevronDown className="w-4 h-4 text-white/70" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout: Left Sidebar + Right Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDEBAR matching reference image */}
          <aside className="md:col-span-3 bg-white rounded-3xl p-4 shadow-xs border border-slate-200 space-y-1">
            {/* 1. डैशबोर्ड */}
            <button
              type="button"
              onClick={() => setActiveTab('DASHBOARD')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'DASHBOARD'
                  ? 'bg-[#174EA6] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>डैशबोर्ड</span>
            </button>

            {/* 1.5. दैनिक हाजिरी एवं चेक-इन */}
            <button
              type="button"
              onClick={() => setActiveTab('ATTENDANCE')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'ATTENDANCE'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CalendarCheck className="w-4 h-4 text-emerald-500 group-hover:text-emerald-700" />
                <span>दैनिक हाजिरी एवं पंच</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                GPS
              </span>
            </button>

            {/* 2. मुझे आवंटित शिकायतें (12) with Red 12 badge */}
            <button
              type="button"
              onClick={() => setActiveTab('ASSIGNED')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'ASSIGNED'
                  ? 'bg-[#174EA6] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ClipboardList className="w-4 h-4" />
                <span>मुझे आवंटित शिकायतें</span>
              </div>
              <span className="bg-[#D83C3C] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                12
              </span>
            </button>

            {/* 3. कार्यवाही में (4) */}
            <button
              type="button"
              onClick={() => setActiveTab('IN_PROGRESS')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'IN_PROGRESS'
                  ? 'bg-[#174EA6] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4" />
                <span>कार्यवाही में (4)</span>
              </div>
            </button>

            {/* 4. निस्तारित (68) */}
            <button
              type="button"
              onClick={() => setActiveTab('RESOLVED')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'RESOLVED'
                  ? 'bg-[#174EA6] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>निस्तारित (68)</span>
              </div>
            </button>

            {/* 5. GPS मानचित्र */}
            <button
              type="button"
              onClick={() => setActiveTab('MAP')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'MAP'
                  ? 'bg-[#174EA6] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>GPS मानचित्र</span>
            </button>

            {/* 6. प्रोफाइल */}
            <button
              type="button"
              onClick={() => setActiveTab('PROFILE')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'PROFILE'
                  ? 'bg-[#174EA6] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>प्रोफाइल</span>
            </button>

            {/* 7. सहायता */}
            <button
              type="button"
              onClick={() => alert('सपोटरा पालिका कंट्रोल रूम हेल्पलाइन: +91-9414010000')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              <HelpCircle className="w-4 h-4" />
              <span>सहायता</span>
            </button>

            {/* 8. लॉगआउट */}
            <div className="pt-2 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>लॉगआउट</span>
              </button>
            </div>
          </aside>

          {/* RIGHT MAIN AREA - ALL TABS FUNCTIONING */}
          <main className="md:col-span-9 space-y-6">
            {/* ========================================================
                TAB 0: ATTENDANCE (दैनिक हाजिरी एवं चेक-इन)
                ======================================================== */}
            {activeTab === 'ATTENDANCE' && <EmployeeCheckInOut />}

            {/* ========================================================
                TAB 1: DASHBOARD
                ======================================================== */}
            {activeTab === 'DASHBOARD' && (
              <div className="space-y-6">
                {/* Top Greeting Card matching reference collage */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    नमस्ते, राकेश कुमार 👋
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-hindi mt-1">
                    आपके लिए आज 5 नई शिकायतें आवंटित की गई हैं।
                  </p>

                  {/* 3 Counter Circles matching reference image */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                    {/* 1. कुल आवंटित */}
                    <div
                      onClick={() => setActiveTab('ASSIGNED')}
                      className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100 flex items-center space-x-3.5 cursor-pointer hover:bg-blue-100/60 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#174EA6] flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold">कुल आवंटित</p>
                        <p className="text-2xl font-black text-slate-900 mt-0.5">12</p>
                      </div>
                    </div>

                    {/* 2. कार्यवाही में */}
                    <div
                      onClick={() => setActiveTab('IN_PROGRESS')}
                      className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex items-center space-x-3.5 cursor-pointer hover:bg-emerald-100/60 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold">कार्यवाही में</p>
                        <p className="text-2xl font-black text-emerald-700 mt-0.5">4</p>
                      </div>
                    </div>

                    {/* 3. निस्तारित */}
                    <div
                      onClick={() => setActiveTab('RESOLVED')}
                      className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex items-center space-x-3.5 cursor-pointer hover:bg-emerald-100/60 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold">निस्तारित</p>
                        <p className="text-2xl font-black text-emerald-800 mt-0.5">68</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: आज की आवंटित शिकायतें */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      आज की आवंटित शिकायतें (Today's Assigned)
                    </h3>
                    <span className="text-xs font-mono text-slate-500 font-bold">
                      वार्ड सं. 3, 5, 7
                    </span>
                  </div>

                  <div className="space-y-3">
                    {assignedList.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-white transition-all gap-3"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-mono font-black text-xs text-[#174EA6] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                            {item.complaintNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {item.subject}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${item.priorityColor}`}
                          >
                            {item.priority}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenAction(item)}
                          className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl border border-[#174EA6] text-[#174EA6] hover:bg-[#174EA6] hover:text-white text-xs font-bold transition-all shrink-0 self-end sm:self-auto"
                        >
                          <span>कार्यवाही शुरू करें</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Embedded Live Map */}
                <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>आवंटित शिकायतों का जीपीएस नक्शा (Sapotra Field Map)</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">वार्ड 5 केंद्र</span>
                  </div>
                  <div className="h-64 rounded-2xl overflow-hidden border border-slate-200">
                    <LeafletMap
                      center={[26.325678, 76.521430]}
                      zoom={14}
                      selectedLocation={[26.325678, 76.521430]}
                      markers={[
                        {
                          id: 'm-np125',
                          lat: 26.325678,
                          lng: 76.521430,
                          title: 'NP-2026-00125 (वार्ड 5 कचरा सफाई)',
                          color: '#D83C3C',
                        },
                      ]}
                      height="100%"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 2: ASSIGNED (मुझे आवंटित शिकायतें)
                ======================================================== */}
            {activeTab === 'ASSIGNED' && (
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">मुझे आवंटित शिकायतें (Assigned Tasks)</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      सफाई विभाग • वार्ड नं. 3, 5, 7 में निस्तारण हेतु लंबित प्रकरण
                    </p>
                  </div>
                  <span className="bg-rose-100 text-rose-800 text-xs font-black px-3 py-1 rounded-full border border-rose-200">
                    12 शिकायतें लंबित
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {assignedList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2.5">
                          <span className="font-mono font-black text-xs text-[#174EA6] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                            {item.complaintNumber}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${item.priorityColor}`}>
                            {item.priority} प्राथमिकता
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">• 2 घंटे पूर्व</span>
                        </div>

                        <span className="text-xs text-slate-500 font-bold">
                          नियत SLA: 24 घंटे शेष
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                          <img src={item.photo} alt={item.subject} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1.5 flex-1 text-xs">
                          <h4 className="text-sm font-black text-slate-900">{item.subject}</h4>
                          <p className="text-slate-600">
                            स्थान: <strong>{item.ward}</strong> (जीपीएस: {item.lat}, {item.lng})
                          </p>
                          <p className="text-slate-500">
                            शिकायतकर्ता: <strong className="text-slate-800">राधाकिशन मीना</strong> (📞 9414012345)
                          </p>
                          <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                            विवरण: मौके पर कचरा पात्र ओवरफ्लो हो रहा है, तुरंत ट्रैक्टर-ट्रॉली लेकर सफाई की आवश्यकता है।
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                        <a
                          href={`https://maps.google.com/?q=${item.lat},${item.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center space-x-1"
                        >
                          <MapPin className="w-3.5 h-3.5 text-red-500" />
                          <span>नेविगेट करें</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleOpenAction(item)}
                          className="px-4 py-1.5 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs"
                        >
                          <span>कार्यवाही शुरू करें / समाधान दर्ज करें</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 3: IN_PROGRESS (कार्यवाही में)
                ======================================================== */}
            {activeTab === 'IN_PROGRESS' && (
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">कार्यवाही में शिकायतें (Work In Progress)</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      फील्ड टीम द्वारा कार्य प्रारंभ कर दिया गया है। समाधान फोटो अपलोड करें।
                    </p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-200">
                    4 प्रकरण प्रगति में
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-[#174EA6] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        NP-2026-00125
                      </span>
                      <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        ⚡ फील्ड टीम मौके पर मौजूद
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">
                      वार्ड 5 - मुख्य बाजार के पास कचरा सफाई अभियान
                    </h4>
                    <p className="text-xs text-slate-600">
                      स्थिति: सफाई दल पहुंच चुका है, कचरा उठान कार्य चल रहा है।
                    </p>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => handleOpenAction(assignedList[0])}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center space-x-1.5"
                      >
                        <Camera className="w-4 h-4" />
                        <span>समाधान फोटो अपलोड करें एवं निस्तारित करें</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 4: RESOLVED (निस्तारित)
                ======================================================== */}
            {activeTab === 'RESOLVED' && (
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">निस्तारित कार्य इतिहास (Resolved Complaints)</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      राकेश कुमार द्वारा माह में सफलतापूर्वक निस्तारित कुल 68 जन शिकायतें
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-300">
                    ✓ 68 सफलता दर 96%
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: 'NP-2026-00088',
                      title: 'वार्ड 3 - पुरानी तहसील के पास मृत पशु हटाना',
                      date: '28 जनवरी 2026',
                      rating: '⭐⭐⭐⭐⭐ 5.0 (नागरिक संतुष्ट)',
                      before: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80',
                      after: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=400&q=80',
                    },
                    {
                      id: 'NP-2026-00095',
                      title: 'वार्ड 7 - बालाजी मंदिर गली में नाली डीसिल्टिंग',
                      date: '26 जनवरी 2026',
                      rating: '⭐⭐⭐⭐ 4.5 (नागरिक संतुष्ट)',
                      before: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=400&q=80',
                      after: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=400&q=80',
                    },
                  ].map((res, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-[#174EA6]">{res.id}</span>
                        <span className="text-xs font-bold text-emerald-700">{res.rating}</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800">{res.title}</h4>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">कार्य से पूर्व फोटो</span>
                          <div className="h-24 rounded-xl overflow-hidden border border-slate-200 mt-1">
                            <img src={res.before} alt="Before" className="w-full h-full object-cover" />
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-700 font-bold block">निस्तारण पश्चात फोटो</span>
                          <div className="h-24 rounded-xl overflow-hidden border-2 border-emerald-300 mt-1">
                            <img src={res.after} alt="After" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex justify-between">
                        <span>निस्तारण तिथि: {res.date}</span>
                        <span className="text-emerald-700 font-bold">सत्यापित द्वारा: EO सपोटरा</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 5: MAP (GPS मानचित्र)
                ======================================================== */}
            {activeTab === 'MAP' && (
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">फील्ड लोकेशन जीपीएस मैप (Live GPS Field Map)</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      सपोटरा नगर पालिका क्षेत्र में आवंटित शिकायतों के वास्तविक जीपीएस पॉइंट्स
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#174EA6]">
                    26.325678, 76.521430
                  </span>
                </div>

                <div className="h-96 rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
                  <LeafletMap
                    center={[26.325678, 76.521430]}
                    zoom={15}
                    selectedLocation={[26.325678, 76.521430]}
                    markers={[
                      {
                        id: 'm1',
                        lat: 26.325678,
                        lng: 76.521430,
                        title: 'NP-2026-00125: वार्ड 5 - कचरा जमा है (उच्च)',
                        color: '#D83C3C',
                      },
                      {
                        id: 'm2',
                        lat: 26.158,
                        lng: 76.76,
                        title: 'NP-2026-00126: वार्ड 7 - नाली जाम (मध्यम)',
                        color: '#E99A24',
                      },
                      {
                        id: 'm3',
                        lat: 26.153,
                        lng: 76.756,
                        title: 'NP-2026-00127: वार्ड 3 - गंदगी (मध्यम)',
                        color: '#E99A24',
                      },
                    ]}
                    height="100%"
                  />
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 6: PROFILE (प्रोफाइल)
                ======================================================== */}
            {activeTab === 'PROFILE' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-black text-slate-900">कर्मचारी पहचान पत्र एवं प्रोफाइल</h2>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-300">
                    🟢 ऑन ड्यूटी (On Duty)
                  </span>
                </div>

                {/* ID Card Layout */}
                <div className="max-w-md mx-auto bg-gradient-to-br from-[#123568] to-[#174EA6] rounded-3xl p-6 text-white shadow-xl space-y-5 border-4 border-amber-400/40">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🏛️</span>
                      <div>
                        <p className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider">नगर पालिका सपोटरा (करौली)</p>
                        <p className="text-xs font-black">क्षेत्रीय कर्मचारी पहचान पत्र</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">2026-27</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black text-2xl border-2 border-amber-400 shrink-0">
                      RK
                    </div>
                    <div>
                      <h3 className="text-lg font-black">श्री राकेश कुमार</h3>
                      <p className="text-xs text-amber-300 font-bold">सफाई कर्मचारी / फील्ड ऑपरेटर</p>
                      <p className="text-[11px] text-blue-200 font-mono mt-0.5">कोड: EMP-SPT-101</p>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-2xl p-3 text-xs space-y-1.5 border border-white/10">
                    <p className="flex justify-between">
                      <span className="text-slate-300">विभाग:</span>
                      <span className="font-bold">सफाई एवं ठोस कचरा प्रबंधन</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-300">आवंटित वार्ड:</span>
                      <span className="font-bold">वार्ड नं. 3, 5, 7</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-300">मोबाइल / व्हाट्सएप:</span>
                      <span className="font-mono font-bold">+91 94140 12345</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-300">पर्यवेक्षक अधिकारी:</span>
                      <span className="font-bold">श्री गजेन्द्र सिंह छाबड़ा (EO)</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Field Action / Resolution Workflow Modal */}
      {actionComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#174EA6] uppercase tracking-wider">
                  फील्ड एक्शन रिपोर्टिंग
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {actionComplaint.complaintNumber} — {actionComplaint.subject}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActionComplaint(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Details */}
            <div className="bg-slate-50 p-3.5 rounded-2xl text-xs space-y-1.5 border border-slate-200">
              <p>
                <span className="text-slate-500">स्थान:</span> <strong>{actionComplaint.address}</strong>
              </p>
              <p>
                <span className="text-slate-500">नागरिक:</span> {actionComplaint.citizenName} (
                {actionComplaint.citizenPhone})
              </p>
              <p>
                <span className="text-slate-500">विवरण:</span> {actionComplaint.description}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleResolveComplaint} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  कार्यवाही विवरण एवं टिप्पणी (Work Remarks) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={workRemarks}
                  onChange={(e) => setWorkRemarks(e.target.value)}
                  placeholder="मौके पर पहुंचकर कचरा उठाया गया, ट्रॉली से डंपिंग यार्ड भिजवाया गया एवं चूना छिड़काव पूर्ण किया गया।"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#174EA6]"
                />
              </div>

              {/* Photos: Before & After */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-600">कार्य से पहले (Before Photo)</span>
                  <div className="h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={
                        beforePhoto ||
                        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
                      }
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-700">समाधान पश्चात (After Photo) *</span>
                  <div className="h-28 rounded-xl overflow-hidden border-2 border-dashed border-emerald-400 bg-emerald-50/50 flex flex-col items-center justify-center p-2 text-center relative">
                    {afterPhoto ? (
                      <img src={afterPhoto} alt="After" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <>
                        <Camera className="w-5 h-5 text-emerald-600 mb-1" />
                        <span className="text-[10px] text-emerald-800 font-bold">स्वच्छता फोटो अपलोड</span>
                        <button
                          type="button"
                          onClick={() =>
                            setAfterPhoto(
                              'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80'
                            )
                          }
                          className="mt-1 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs"
                        >
                          + डेमो फोटो
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActionComplaint(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'अपडेट हो रहा है...' : 'समाधान पूर्ण दर्ज करें'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
