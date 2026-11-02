import React, { useState } from 'react';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { Department } from '../../types';
import { Layers, Plus, Edit2, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

export const AdminDepartments: React.FC = () => {
  const { departments, saveDepartment } = useMunicipalData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [name, setName] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [headName, setHeadName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [slaDays, setSlaDays] = useState(3);
  const [categoriesText, setCategoriesText] = useState('');

  const openCreate = () => {
    setEditingDept(null);
    setName('');
    setNameHi('');
    setHeadName('');
    setContactPhone('+91 94140 ');
    setWhatsappNumber('+91 94140 ');
    setEmail('');
    setSlaDays(3);
    setCategoriesText('कचरा उठाव, नाली सफाई, अन्य');
    setModalOpen(true);
  };

  const openEdit = (d: Department) => {
    setEditingDept(d);
    setName(d.name);
    setNameHi(d.nameHi);
    setHeadName(d.headName);
    setContactPhone(d.contactPhone);
    setWhatsappNumber(d.whatsappNumber);
    setEmail(d.email);
    setSlaDays(d.slaDays);
    setCategoriesText(d.categories.join(', '));
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categories = categoriesText.split(',').map((c) => c.trim()).filter(Boolean);

    const dept: Department = {
      id: editingDept?.id || 'dept-' + Date.now(),
      name,
      nameHi,
      headName,
      contactPhone,
      whatsappNumber,
      email,
      slaDays: Number(slaDays) || 3,
      icon: editingDept?.icon || 'Layers',
      categories,
      isActive: true,
      createdAt: editingDept?.createdAt || new Date().toISOString(),
    };

    await saveDepartment(dept);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">विभागीय संरचना</span>
          <h1 className="text-2xl font-black text-[#123568]">नगर पालिका विभाग प्रबंधन</h1>
          <p className="text-xs text-slate-500 font-hindi mt-0.5">
            सभी नागरिक विभागों का गठन, प्रभारी अधिकारी, संपर्क एवं शिकायत निवारण SLA समय सीमा।
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#F39A25] hover:bg-[#d88214] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ नया विभाग जोड़ें</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-xs bg-blue-50 text-[#174EA6] px-2.5 py-0.5 rounded-full border border-blue-200">
                  SLA: {dept.slaDays} दिन
                </span>
                <button
                  onClick={() => openEdit(dept)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-extrabold text-base text-slate-900">{dept.nameHi}</h3>
              <p className="text-xs text-slate-500 font-mono">{dept.name}</p>

              <div className="mt-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                <p className="font-bold text-slate-800">{dept.headName}</p>
                <p className="text-slate-600 flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-[#174EA6]" />
                  <span>{dept.contactPhone}</span>
                </p>
                <p className="text-slate-600 flex items-center space-x-1">
                  <Mail className="w-3 h-3 text-[#174EA6]" />
                  <span className="truncate">{dept.email}</span>
                </p>
              </div>

              <div className="mt-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  श्रेणियां ({dept.categories.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {dept.categories.map((c, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-emerald-700 font-bold">● सक्रिय विभाग</span>
              <button onClick={() => openEdit(dept)} className="text-[#174EA6] font-bold hover:underline">
                संपादित करें
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              {editingDept ? 'विभाग विवरण संपादित करें' : 'नया नगर पालिका विभाग जोड़ें'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">विभाग का नाम (हिंदी) *</label>
                <input
                  type="text"
                  required
                  value={nameHi}
                  onChange={(e) => setNameHi(e.target.value)}
                  placeholder="उदा. उद्यान एवं वृक्षारोपण विभाग"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Name (English) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Garden & Afforestation Department"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">विभागाध्यक्ष / प्रभारी *</label>
                  <input
                    type="text"
                    required
                    value={headName}
                    onChange={(e) => setHeadName(e.target.value)}
                    placeholder="श्री दिनेश कुमार"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SLA समाधान दिन</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={slaDays}
                    onChange={(e) => setSlaDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">संपर्क फोन नंबर *</label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp नंबर</label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">आधिकारिक ईमेल आईडी</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dept.sapotra@rajasthan.gov.in"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">शिकायत श्रेणियां (कॉमा से अलग करें)</label>
                <textarea
                  rows={2}
                  value={categoriesText}
                  onChange={(e) => setCategoriesText(e.target.value)}
                  placeholder="श्रेणी 1, श्रेणी 2, श्रेणी 3"
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
