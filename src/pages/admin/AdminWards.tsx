import React, { useState } from 'react';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { Ward } from '../../types';
import { MapPin, Plus, Edit2, Users, Phone, Building } from 'lucide-react';

export const AdminWards: React.FC = () => {
  const { wards, complaints, publicDemands, saveWard } = useMunicipalData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWard, setEditingWard] = useState<Ward | null>(null);

  const [wardNumber, setWardNumber] = useState('11');
  const [wardName, setWardName] = useState('');
  const [wardNameHi, setWardNameHi] = useState('');
  const [councilorName, setCouncilorName] = useState('');
  const [councilorPhone, setCouncilorPhone] = useState('+91 98290 ');
  const [population, setPopulation] = useState(3000);
  const [areaDescription, setAreaDescription] = useState('');

  const openCreate = () => {
    setEditingWard(null);
    setWardNumber(String(wards.length + 1));
    setWardName('New Ward Area');
    setWardNameHi('नया वार्ड क्षेत्र');
    setCouncilorName('');
    setCouncilorPhone('+91 98290 ');
    setPopulation(3000);
    setAreaDescription('');
    setModalOpen(true);
  };

  const openEdit = (w: Ward) => {
    setEditingWard(w);
    setWardNumber(w.wardNumber);
    setWardName(w.wardName);
    setWardNameHi(w.wardNameHi);
    setCouncilorName(w.councilorName);
    setCouncilorPhone(w.councilorPhone);
    setPopulation(w.population);
    setAreaDescription(w.areaDescription);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ward: Ward = {
      id: editingWard?.id || 'ward-' + wardNumber,
      wardNumber,
      wardName,
      wardNameHi,
      councilorName,
      councilorPhone,
      population: Number(population) || 2500,
      areaDescription,
      latitude: editingWard?.latitude || 26.1554,
      longitude: editingWard?.longitude || 76.7578,
    };

    await saveWard(ward);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">नगरीय विभाजन</span>
          <h1 className="text-2xl font-black text-[#123568]">सपोटरा वार्ड प्रबंधन (Ward Administration)</h1>
          <p className="text-xs text-slate-500 font-hindi mt-0.5">
            सभी 10 वार्डों के सीमांकन, निर्वाचित पार्षद, जनसंख्या एवं वार्ड-वार समस्या विश्लेषण।
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ नया वार्ड जोड़ें</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {wards.map((ward) => {
          const totalCmp = complaints.filter((c) => c.wardNumber === ward.wardNumber).length;
          const pendingCmp = complaints.filter((c) => c.wardNumber === ward.wardNumber && c.status !== 'RESOLVED').length;
          const demands = publicDemands.filter((d) => d.wardNumber === ward.wardNumber).length;

          return (
            <div key={ward.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-sm font-black bg-blue-100 text-[#174EA6] px-3 py-1 rounded-xl">
                    वार्ड संख्या {ward.wardNumber}
                  </span>
                  <button
                    onClick={() => openEdit(ward)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 leading-snug">{ward.wardNameHi}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{ward.wardName}</p>

                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed font-hindi">
                  {ward.areaDescription}
                </p>

                <div className="mt-3 text-xs space-y-1">
                  <p className="text-slate-700">
                    पार्षद: <strong>{ward.councilorName}</strong>
                  </p>
                  <p className="text-slate-500 font-mono flex items-center space-x-1">
                    <Phone className="w-3 h-3 text-[#174EA6]" />
                    <span>{ward.councilorPhone}</span>
                  </p>
                  <p className="text-slate-500">
                    जनसंख्या: <strong>{ward.population}</strong> नागरिक
                  </p>
                </div>
              </div>

              {/* Ward Mini Metrics */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-blue-50 p-2 rounded-xl">
                  <span className="text-[10px] text-blue-700 font-bold block">कुल शिकायत</span>
                  <span className="font-black text-slate-900">{totalCmp}</span>
                </div>
                <div className="bg-rose-50 p-2 rounded-xl">
                  <span className="text-[10px] text-rose-700 font-bold block">लंबित</span>
                  <span className="font-black text-rose-600">{pendingCmp}</span>
                </div>
                <div className="bg-indigo-50 p-2 rounded-xl">
                  <span className="text-[10px] text-indigo-700 font-bold block">विकास मांग</span>
                  <span className="font-black text-indigo-600">{demands}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              {editingWard ? 'वार्ड विवरण संपादित करें' : 'नया वार्ड जोड़ें'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">वार्ड संख्या *</label>
                  <input
                    type="text"
                    required
                    value={wardNumber}
                    onChange={(e) => setWardNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">जनसंख्या</label>
                  <input
                    type="number"
                    value={population}
                    onChange={(e) => setPopulation(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">वार्ड का नाम (हिंदी) *</label>
                <input
                  type="text"
                  required
                  value={wardNameHi}
                  onChange={(e) => setWardNameHi(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ward Name (English)</label>
                <input
                  type="text"
                  value={wardName}
                  onChange={(e) => setWardName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">पार्षद का नाम</label>
                  <input
                    type="text"
                    value={councilorName}
                    onChange={(e) => setCouncilorName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">पार्षद संपर्क फोन</label>
                  <input
                    type="text"
                    value={councilorPhone}
                    onChange={(e) => setCouncilorPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">क्षेत्रीय विवरण एवं सीमांकन</label>
                <textarea
                  rows={2}
                  value={areaDescription}
                  onChange={(e) => setAreaDescription(e.target.value)}
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
