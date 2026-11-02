import React, { useState } from 'react';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { Employee } from '../../types';
import { Users, Plus, Edit2, Phone, Mail, Award, CheckCircle } from 'lucide-react';

export const AdminEmployees: React.FC = () => {
  const { employees, departments, saveEmployee } = useMunicipalData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [deptId, setDeptId] = useState(departments[0]?.id || '');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [assignedWard, setAssignedWard] = useState('All Wards');

  const openCreate = () => {
    setEditingEmp(null);
    setFullName('');
    setDesignation('फील्ड सुपरवाइजर');
    setDeptId(departments[0]?.id || '');
    setMobile('+91 94140 ');
    setWhatsapp('+91 94140 ');
    setEmail('');
    setAssignedWard('All Wards');
    setModalOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setFullName(emp.fullName);
    setDesignation(emp.designation);
    setDeptId(emp.departmentId);
    setMobile(emp.mobileNumber);
    setWhatsapp(emp.whatsappNumber);
    setEmail(emp.email);
    setAssignedWard(emp.assignedWard || 'All Wards');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find((d) => d.id === deptId);

    const emp: Employee = {
      id: editingEmp?.id || 'emp-' + Date.now(),
      employeeCode: editingEmp?.employeeCode || `EMP-SPT-${Math.floor(100 + Math.random() * 900)}`,
      fullName,
      designation,
      departmentId: deptId,
      departmentName: dept?.name || 'Municipal Department',
      mobileNumber: mobile,
      whatsappNumber: whatsapp,
      email,
      assignedWard,
      status: 'ACTIVE',
      totalAssigned: editingEmp?.totalAssigned || 0,
      totalResolved: editingEmp?.totalResolved || 0,
      createdAt: editingEmp?.createdAt || new Date().toISOString(),
    };

    await saveEmployee(emp);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">मानव संसाधन प्रबंधन</span>
          <h1 className="text-2xl font-black text-[#123568]">नगर पालिका कर्मचारी एवं फील्ड स्टाफ</h1>
          <p className="text-xs text-slate-500 font-hindi mt-0.5">
            निरीक्षकों, कनिष्ठ अभियंताओं एवं फील्ड तकनीशियनों का विवरण व वार्ड आवंटन।
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ नया कर्मचारी जोड़ें</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#123568] text-white uppercase font-bold text-[11px]">
              <tr>
                <th className="p-3.5">कार्मिक कोड</th>
                <th className="p-3.5">पूरा नाम एवं पदनाम</th>
                <th className="p-3.5">विभाग</th>
                <th className="p-3.5">संपर्क एवं WhatsApp</th>
                <th className="p-3.5">आवंटित वार्ड</th>
                <th className="p-3.5">प्रदर्शन (निस्तारित)</th>
                <th className="p-3.5 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-[#174EA6]">{emp.employeeCode}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{emp.fullName}</p>
                    <p className="text-slate-500 text-[11px]">{emp.designation}</p>
                  </td>
                  <td className="p-3.5 font-medium text-slate-800">{emp.departmentName}</td>
                  <td className="p-3.5 font-mono text-slate-700">
                    <p>{emp.mobileNumber}</p>
                    <p className="text-[10px] text-emerald-700 font-bold">WhatsApp सक्षम</p>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">{emp.assignedWard}</td>
                  <td className="p-3.5">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {emp.totalResolved} निस्तारित
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => openEdit(emp)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#174EA6] hover:bg-blue-100 font-bold"
                    >
                      संपादित करें
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              {editingEmp ? 'कर्मचारी विवरण संपादित करें' : 'नया कर्मचारी पंजीकृत करें'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">पूरा नाम *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">पदनाम (Designation) *</label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">विभाग *</label>
                <select
                  value={deptId}
                  onChange={(e) => setDeptId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nameHi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">मोबाइल नंबर *</label>
                  <input
                    type="text"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp नंबर</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">आवंटित वार्ड</label>
                <input
                  type="text"
                  value={assignedWard}
                  onChange={(e) => setAssignedWard(e.target.value)}
                  placeholder="उदा. Ward 1, 2, 3 अथवा All Wards"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white font-bold"
                >
                  सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
