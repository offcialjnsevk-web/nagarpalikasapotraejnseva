import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance, getTodayDateString, formatTimeIST } from '../../context/AttendanceContext';
import { AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Send,
  Download,
  Filter,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  Search,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const AdminAttendancePage: React.FC = () => {
  const { registeredEmployees } = useAuth();
  const {
    records,
    todayDate,
    markAllPresent,
    markAllAbsent,
    updateEmployeeStatus,
    getStatsByDate,
    sendDailyAttendanceWhatsApp,
  } = useAttendance();

  const [selectedDate, setSelectedDate] = useState<string>(todayDate);
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string>('');

  const stats = getStatsByDate(selectedDate);

  // Filter employees
  const filteredEmployees = registeredEmployees.filter((emp) => {
    const matchesDept = selectedDept === 'ALL' || emp.departmentId === selectedDept;
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleMarkAllPresent = () => {
    markAllPresent(selectedDate);
    setActionNotice('✅ सभी कर्मचारियों को आज उपस्थित (PRESENT) मार्क कर दिया गया है!');
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleMarkAllAbsent = () => {
    markAllAbsent(selectedDate);
    setActionNotice('⚠️ सभी कर्मचारियों को अनुपस्थित (ABSENT) मार्क कर दिया गया है!');
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleSendReport = () => {
    const url = sendDailyAttendanceWhatsApp(selectedDate);
    window.open(url, '_blank');
  };

  const handleExportCSV = () => {
    const dayRecords = records.filter((r) => r.date === selectedDate);
    const headers = 'Employee Code,Name,Designation,Department,Status,Check-In Time,Check-Out Time,Remarks\n';
    const rows = registeredEmployees
      .map((emp) => {
        const rec = dayRecords.find((r) => r.employeeId === emp.id);
        return `"${emp.employeeCode}","${emp.fullName}","${emp.designation}","${emp.departmentName}","${
          rec?.status || 'ABSENT'
        }","${rec?.checkInTime || '-'}","${rec?.checkOutTime || '-'}","${rec?.remarks || '-'}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Sapotra_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">
              मानव संसाधन एवं उपस्थिति नियंत्रण (HR & Biometric Attendance)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              लाइव सिंक सक्रिय
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#123568] mt-1">
            दैनिक कार्मिक उपस्थिति प्रबंधन (Daily Staff Attendance Sheet)
          </h1>
          <p className="text-xs text-slate-500 font-hindi mt-0.5">
            नगर पालिका सपोटरा के सभी सफाई, तकनीकी, लाइनमैन एवं प्रशासनिक स्टाफ की हाजिरी मॉनिटरिंग एवं नियंत्रण।
          </p>
        </div>

        {/* Date Selector & WhatsApp Send */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-[#174EA6] focus:outline-none"
          />

          <button
            onClick={handleSendReport}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>व्हाट्सएप रिपोर्ट भेजें</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>CSV एक्सपोर्ट</span>
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs font-bold text-[#123568] flex items-center justify-between animate-fadeIn">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice('')} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
      )}

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-bold block">कुल कार्मिक (Total)</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.total}</span>
          <span className="text-[10px] text-slate-400 font-hindi">सपोटरा नगर पालिका</span>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-2xs">
          <span className="text-[11px] text-emerald-800 font-bold block">उपस्थित (Present)</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{stats.present}</span>
          <span className="text-[10px] text-emerald-600 font-hindi">कार्यालय परिसर में</span>
        </div>

        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 shadow-2xs">
          <span className="text-[11px] text-blue-800 font-bold block">फील्ड ड्यूटी (Field)</span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">{stats.fieldDuty}</span>
          <span className="text-[10px] text-blue-600 font-hindi">वार्डों में मौके पर</span>
        </div>

        <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200 shadow-2xs">
          <span className="text-[11px] text-red-800 font-bold block">अनुपस्थित (Absent)</span>
          <span className="text-2xl font-black text-red-700 mt-1 block">{stats.absent}</span>
          <span className="text-[10px] text-red-600 font-hindi">बिना सूचना अनुपस्थित</span>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-2xs">
          <span className="text-[11px] text-amber-800 font-bold block">अवकाश (On Leave)</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{stats.onLeave}</span>
          <span className="text-[10px] text-amber-600 font-hindi">स्वीकृत छुट्टी</span>
        </div>

        <div className="bg-[#123568] text-white p-4 rounded-2xl border border-slate-700 shadow-2xs">
          <span className="text-[11px] text-amber-300 font-bold block">उपस्थिति दर (%)</span>
          <span className="text-2xl font-black text-white mt-1 block">{stats.percentage}%</span>
          <span className="text-[10px] text-slate-300 font-hindi">आज का प्रदर्शन</span>
        </div>
      </div>

      {/* 3. BATCH ACTION BAR (Admin can send all employ present & absent) */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 p-4 sm:p-5 rounded-3xl border border-blue-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#174EA6] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#123568]">
              सामूहिक उपस्थिति नियंत्रण (Batch Attendance Actions)
            </h4>
            <p className="text-[11px] text-slate-600 font-hindi">
              एक क्लिक में सभी कर्मचारियों की उपस्थिति या अनुपस्थिति निर्धारित करें
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Mark All Present */}
          <button
            onClick={handleMarkAllPresent}
            className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>सभी को उपस्थित करें (Mark All Present)</span>
          </button>

          {/* Mark All Absent */}
          <button
            onClick={handleMarkAllAbsent}
            className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all"
          >
            <XCircle className="w-4 h-4" />
            <span>सभी को अनुपस्थित करें (Mark All Absent)</span>
          </button>
        </div>
      </div>

      {/* 4. Filters & Search Strip */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#174EA6]"
          >
            <option value="ALL">समस्त विभाग (All Branches)</option>
            <option value="dept-sanitation">सफाई एवं ठोस अपशिष्ट</option>
            <option value="dept-streetlight">स्ट्रीट लाइट शाखा</option>
            <option value="dept-road">सड़क एवं PWD विंग</option>
            <option value="dept-water">पेयजल आपूर्ति शाखा</option>
            <option value="dept-drainage">जल निकासी एवं नाला</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नाम या कार्मिक कोड खोजें..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#174EA6]"
          />
        </div>
      </div>

      {/* 5. Master Attendance Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#123568] text-white uppercase font-bold text-[11px]">
              <tr>
                <th className="p-3.5">कार्मिक विवरण</th>
                <th className="p-3.5">पदनाम एवं शाखा</th>
                <th className="p-3.5">आज की स्थिति (Toggle Status)</th>
                <th className="p-3.5">चेक-इन समय</th>
                <th className="p-3.5">चेक-आउट</th>
                <th className="p-3.5">स्थान / दूरी</th>
                <th className="p-3.5">कार्यवाही / नोट</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const rec = records.find(
                  (r) => r.employeeId === emp.id && r.date === selectedDate
                );
                const currentStatus: AttendanceStatus = rec?.status || 'ABSENT';

                return (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    {/* Employee Profile */}
                    <td className="p-3.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#174EA6] font-bold flex items-center justify-center shrink-0">
                          {emp.fullName[0] || 'क'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{emp.fullName}</p>
                          <span className="font-mono text-[10px] text-[#174EA6] font-bold">
                            {emp.employeeCode}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Designation & Dept */}
                    <td className="p-3.5">
                      <p className="font-bold text-slate-800">{emp.designation}</p>
                      <p className="text-[10px] text-slate-500">{emp.departmentName}</p>
                    </td>

                    {/* Interactive Status Switcher Buttons */}
                    <td className="p-3.5">
                      <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 gap-1">
                        <button
                          type="button"
                          onClick={() => updateEmployeeStatus(emp.id, selectedDate, 'PRESENT')}
                          className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all ${
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:bg-white'
                          }`}
                        >
                          उपस्थित
                        </button>

                        <button
                          type="button"
                          onClick={() => updateEmployeeStatus(emp.id, selectedDate, 'FIELD_DUTY')}
                          className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all ${
                            currentStatus === 'FIELD_DUTY'
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:bg-white'
                          }`}
                        >
                          फील्ड
                        </button>

                        <button
                          type="button"
                          onClick={() => updateEmployeeStatus(emp.id, selectedDate, 'ON_LEAVE')}
                          className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all ${
                            currentStatus === 'ON_LEAVE'
                              ? 'bg-amber-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:bg-white'
                          }`}
                        >
                          अवकाश
                        </button>

                        <button
                          type="button"
                          onClick={() => updateEmployeeStatus(emp.id, selectedDate, 'ABSENT')}
                          className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all ${
                            currentStatus === 'ABSENT'
                              ? 'bg-red-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:bg-white'
                          }`}
                        >
                          अनुपस्थित
                        </button>
                      </div>
                    </td>

                    {/* Check In Time */}
                    <td className="p-3.5 font-mono text-slate-700">
                      {rec?.checkInTime ? (
                        <span className="font-bold text-emerald-700">{rec.checkInTime}</span>
                      ) : (
                        <span className="text-slate-400">--:--</span>
                      )}
                    </td>

                    {/* Check Out Time */}
                    <td className="p-3.5 font-mono text-slate-700">
                      {rec?.checkOutTime ? (
                        <span className="font-bold text-blue-700">{rec.checkOutTime}</span>
                      ) : (
                        <span className="text-slate-400">--:--</span>
                      )}
                    </td>

                    {/* Location / Geofence */}
                    <td className="p-3.5 text-slate-600">
                      {rec?.isWithinGeofence ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>कार्यालय परिसर</span>
                        </span>
                      ) : rec?.distanceMeters ? (
                        <span className="text-slate-500">
                          {rec.distanceMeters > 1000
                            ? `${(rec.distanceMeters / 1000).toFixed(1)} किमी (फील्ड)`
                            : `${rec.distanceMeters} मी.`}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Remarks & Mode */}
                    <td className="p-3.5">
                      <span className="text-slate-600 text-[11px] block max-w-xs truncate">
                        {rec?.remarks || (rec?.markedBy === 'ADMIN' ? 'प्रशासक सत्यापित' : '-')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
