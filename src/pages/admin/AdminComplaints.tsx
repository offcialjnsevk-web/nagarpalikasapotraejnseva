import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { LeafletMap } from '../../components/common/LeafletMap';
import { Complaint, ComplaintStatus, Priority } from '../../types';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  UserCheck,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Phone,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const AdminComplaints: React.FC = () => {
  const { t, lang } = useLanguage();
  const { profile } = useAuth();
  const { complaints, departments, employees, wards, updateComplaintStatus } = useMunicipalData();

  // Filters State
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [wardFilter, setWardFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Selected Complaint Modal State
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [actionModalMode, setActionModalMode] = useState<'VIEW' | 'EDIT' | 'ASSIGN'>('VIEW');

  // Form State for Updates
  const [editStatus, setEditStatus] = useState<ComplaintStatus>('PENDING');
  const [editPriority, setEditPriority] = useState<Priority>('NORMAL');
  const [assignedEmpId, setAssignedEmpId] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Filter complaints
  const filtered = complaints.filter((c) => {
    const matchesSearch =
      !search ||
      c.complaintNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(search.toLowerCase()) ||
      c.citizenPhone.includes(search) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || c.departmentId === deptFilter;
    const matchesWard = wardFilter === 'ALL' || c.wardNumber === wardFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;

    return matchesSearch && matchesDept && matchesWard && matchesStatus && matchesPriority;
  });

  const openActionModal = (c: Complaint, mode: 'VIEW' | 'EDIT' | 'ASSIGN') => {
    setSelectedComplaint(c);
    setActionModalMode(mode);
    setEditStatus(c.status);
    setEditPriority(c.priority);
    setAssignedEmpId(c.assignedEmployeeId || '');
    setAdminRemarks('');
    setActionSuccess('');
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsProcessing(true);
    const assignedEmp = employees.find((emp) => emp.id === assignedEmpId);

    await updateComplaintStatus(
      selectedComplaint.id,
      editStatus,
      adminRemarks.trim() || `प्रशासक द्वारा स्थिति ${editStatus} अद्यतन की गई।`,
      profile?.displayName || 'प्रशासक',
      profile?.role || 'super_admin',
      assignedEmpId || selectedComplaint.assignedEmployeeId,
      assignedEmp?.fullName || selectedComplaint.assignedEmployeeName
    );

    setIsProcessing(false);
    setActionSuccess('शिकायत अद्यतन एवं संबंधित पक्षों को अधिसूचना प्रेषित कर दी गई है!');
    setTimeout(() => {
      setSelectedComplaint(null);
    }, 1500);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const data = filtered.map((c) => ({
      'Complaint ID': c.complaintNumber,
      'Citizen Name': c.citizenName,
      Mobile: c.citizenPhone,
      Ward: c.wardNumber,
      Address: c.address,
      Department: c.departmentName,
      Category: c.category,
      Subject: c.subject,
      Priority: c.priority,
      Status: c.status,
      'Assigned Employee': c.assignedEmployeeName || 'Unassigned',
      'Created Date': new Date(c.createdAt).toLocaleDateString('en-IN'),
      Latitude: c.latitude,
      Longitude: c.longitude,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Complaints');
    XLSX.writeFile(wb, `NagarPalika-Sapotra-Complaints-${Date.now()}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header and Export Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">शिकायत प्रशासन</span>
          <h1 className="text-2xl font-black text-[#123568]">नगर पालिका शिकायत प्रबंधन तालिका</h1>
          <p className="text-xs text-slate-500 font-hindi mt-0.5">
            सभी वार्डों की शिकायतों का विवरण, कर्मचारी आवंटन, प्राथमिकीकरण एवं स्थिति निस्तारण।
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>एक्सेल एक्सपोर्ट (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="आईडी, नागरिक, फोन..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#174EA6]"
          />
        </div>

        {/* Dept Filter */}
        <div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#174EA6]"
          >
            <option value="ALL">समस्त विभाग (All Departments)</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameHi}
              </option>
            ))}
          </select>
        </div>

        {/* Ward Filter */}
        <div>
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#174EA6]"
          >
            <option value="ALL">समस्त वार्ड (All Wards)</option>
            {wards.map((w) => (
              <option key={w.id} value={w.wardNumber}>
                वार्ड नं. {w.wardNumber} ({w.wardNameHi})
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#174EA6]"
          >
            <option value="ALL">समस्त स्थितियां (All Status)</option>
            <option value="PENDING">लंबित (Pending)</option>
            <option value="ASSIGNED">आवंटित (Assigned)</option>
            <option value="IN_PROGRESS">कार्यरत (In Progress)</option>
            <option value="UNDER_VERIFICATION">सत्यापनधीन</option>
            <option value="RESOLVED">निस्तारित (Resolved)</option>
            <option value="REOPENED">पुनः खुली (Reopened)</option>
            <option value="REJECTED">अस्वीकृत (Rejected)</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#174EA6]"
          >
            <option value="ALL">समस्त प्राथमिकता (Priority)</option>
            <option value="URGENT">अति आवश्यक (Urgent)</option>
            <option value="NORMAL">सामान्य (Normal)</option>
            <option value="LOW">निम्न (Low)</option>
          </select>
        </div>
      </div>

      {/* Main Complaints Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#123568] text-white uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5">शिकायत आईडी</th>
                <th className="p-3.5">नागरिक विवरण</th>
                <th className="p-3.5">विभाग / श्रेणी</th>
                <th className="p-3.5">वार्ड</th>
                <th className="p-3.5">प्राथमिकता</th>
                <th className="p-3.5">आवंटित कार्मिक</th>
                <th className="p-3.5">स्थिति</th>
                <th className="p-3.5 text-right">प्रशासनिक कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cmp) => (
                <tr key={cmp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#174EA6] whitespace-nowrap">
                    {cmp.complaintNumber}
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{cmp.citizenName}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{cmp.citizenPhone}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-medium text-slate-800">{cmp.departmentName}</p>
                    <p className="text-slate-500 text-[11px] truncate max-w-xs">{cmp.category}</p>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800 whitespace-nowrap">
                    वार्ड {cmp.wardNumber}
                  </td>
                  <td className="p-3.5">
                    <PriorityBadge priority={cmp.priority} />
                  </td>
                  <td className="p-3.5">
                    {cmp.assignedEmployeeName ? (
                      <span className="font-medium text-slate-900">{cmp.assignedEmployeeName}</span>
                    ) : (
                      <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                        अनावंटित
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <StatusBadge status={cmp.status} />
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => openActionModal(cmp, 'VIEW')}
                        className="p-1.5 rounded-lg bg-blue-50 text-[#174EA6] hover:bg-blue-100"
                        title="विवरण देखें"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openActionModal(cmp, 'ASSIGN')}
                        className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100"
                        title="कर्मचारी आवंटित करें"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openActionModal(cmp, 'EDIT')}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        title="स्थिति बदलें"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            कोई शिकायत नहीं मिली जो चुने गए फ़िल्टर से मेल खाती हो।
          </div>
        )}
      </div>

      {/* ACTION & DETAILS MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-base font-black text-[#174EA6]">
                    {selectedComplaint.complaintNumber}
                  </span>
                  <StatusBadge status={selectedComplaint.status} />
                  <PriorityBadge priority={selectedComplaint.priority} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedComplaint.subject}</h2>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {actionSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-2xl text-xs flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Mode: VIEW */}
            {actionModalMode === 'VIEW' && (
              <div className="space-y-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400">नागरिक का नाम:</span>
                    <p className="font-bold text-slate-900">{selectedComplaint.citizenName}</p>
                    <p className="text-slate-600 font-mono">{selectedComplaint.citizenPhone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">वार्ड एवं पता:</span>
                    <p className="font-bold text-slate-900">वार्ड नं. {selectedComplaint.wardNumber}</p>
                    <p className="text-slate-600">{selectedComplaint.address}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">विस्तृत समस्या:</span>
                    <p className="text-slate-800 font-medium leading-relaxed mt-0.5 font-hindi">
                      {selectedComplaint.description}
                    </p>
                  </div>
                </div>

                {/* Map & Coordinates */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">जीपीएस मैप स्थिति</h4>
                  <LeafletMap
                    center={[selectedComplaint.latitude, selectedComplaint.longitude]}
                    zoom={15}
                    markers={[
                      {
                        id: selectedComplaint.id,
                        lat: selectedComplaint.latitude,
                        lng: selectedComplaint.longitude,
                        title: selectedComplaint.complaintNumber,
                        description: selectedComplaint.subject,
                        status: selectedComplaint.status,
                      },
                    ]}
                    height="220px"
                  />
                </div>

                {/* Photos if any */}
                {selectedComplaint.photos && selectedComplaint.photos.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">नागरिक द्वारा प्रस्तुत फोटो</h4>
                    <div className="flex gap-3">
                      {selectedComplaint.photos.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Evidence"
                          className="w-28 h-28 object-cover rounded-xl border border-slate-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode: ASSIGN or EDIT */}
            {(actionModalMode === 'ASSIGN' || actionModalMode === 'EDIT') && (
              <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      स्थिति अद्यतन करें (Change Status) *
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as ComplaintStatus)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                    >
                      <option value="PENDING">लंबित (Pending Review)</option>
                      <option value="ASSIGNED">आवंटित (Assigned)</option>
                      <option value="IN_PROGRESS">कार्य प्रगति पर (In Progress)</option>
                      <option value="UNDER_VERIFICATION">सत्यापनधीन (Under Verification)</option>
                      <option value="RESOLVED">निस्तारित (Resolved)</option>
                      <option value="REOPENED">पुनः खोली गई (Reopened)</option>
                      <option value="REJECTED">अस्वीकृत / निरस्त (Rejected)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      फील्ड कर्मचारी आवंटित करें (Assign Staff)
                    </label>
                    <select
                      value={assignedEmpId}
                      onChange={(e) => setAssignedEmpId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                    >
                      <option value="">-- कर्मचारी चुनें --</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.fullName} ({emp.designation})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      प्रशासनिक टिप्पणी / निर्देश (Administrative Remarks) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="उदा. स्वच्छता निरीक्षक को 24 घंटे में सफाई करवाकर रिपोर्ट देने के निर्देश..."
                      value={adminRemarks}
                      onChange={(e) => setAdminRemarks(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-2.5 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white font-bold text-xs shadow-md transition-all"
                  >
                    सहेजें एवं अधिसूचना भेजें
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
