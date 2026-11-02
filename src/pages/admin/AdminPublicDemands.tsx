import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PublicDemand, DemandStatus } from '../../types';
import { FileText, ThumbsUp, Users, CheckCircle, XCircle, Search, Edit2 } from 'lucide-react';

export const AdminPublicDemands: React.FC = () => {
  const { publicDemands, updateDemandStatus } = useMunicipalData();
  const [search, setSearch] = useState('');
  const [selectedDemand, setSelectedDemand] = useState<PublicDemand | null>(null);
  const [newStatus, setNewStatus] = useState<DemandStatus>('UNDER_REVIEW');
  const [budget, setBudget] = useState<number>(0);
  const [adminRemarks, setAdminRemarks] = useState('');

  const filtered = publicDemands.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.demandNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.applicantName.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemand) return;
    await updateDemandStatus(selectedDemand.id, newStatus, adminRemarks, budget > 0 ? budget : undefined);
    setSelectedDemand(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">वार्ड विकास मांग प्रबंधन</span>
          <h1 className="text-2xl font-black text-[#123568]">सार्वजनिक मांग पत्र एवं जन समर्थन समीक्षा</h1>
        </div>
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#123568] text-white uppercase font-bold text-[11px]">
              <tr>
                <th className="p-3.5">मांग आईडी</th>
                <th className="p-3.5">शीर्षक एवं प्रस्तावक</th>
                <th className="p-3.5">वार्ड / श्रेणी</th>
                <th className="p-3.5">जन समर्थन (Votes)</th>
                <th className="p-3.5">लाभार्थी</th>
                <th className="p-3.5">स्वीकृत बजट</th>
                <th className="p-3.5">स्थिति</th>
                <th className="p-3.5 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((dem) => (
                <tr key={dem.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-[#174EA6]">{dem.demandNumber}</td>
                  <td className="p-3.5 max-w-xs">
                    <p className="font-bold text-slate-900 line-clamp-1">{dem.title}</p>
                    <p className="text-slate-500 text-[11px]">{dem.applicantName} ({dem.applicantPhone})</p>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-700">वार्ड {dem.wardNumber}</span>
                    <p className="text-slate-500 text-[11px]">{dem.category}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 font-bold">
                      <ThumbsUp className="w-3 h-3 text-[#174EA6]" />
                      <span>{dem.supportCount} नागरिक</span>
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-indigo-700">{dem.beneficiaryCount}+ निवासी</td>
                  <td className="p-3.5 font-bold text-emerald-700">
                    {dem.sanctionedBudget ? `₹ ${dem.sanctionedBudget} लाख` : '—'}
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={dem.status} />
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedDemand(dem);
                        setNewStatus(dem.status);
                        setBudget(dem.sanctionedBudget || 0);
                        setAdminRemarks(dem.adminRemarks || '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#174EA6] hover:bg-blue-100 font-bold"
                    >
                      स्थिति बदलें / बजट
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDemand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">मांग पत्र स्थिति व बजट आवंटन</h3>
            <p className="text-xs text-slate-500 font-hindi">{selectedDemand.title}</p>
            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">स्थिति चयन (Demand Status)</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as DemandStatus)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="UNDER_REVIEW">समीक्षाधीन (Under Review)</option>
                  <option value="SITE_INSPECTION">मौका मुआयना (Site Inspection)</option>
                  <option value="FEASIBILITY_ASSESSMENT">तकनीकी संभाव्यता (Feasibility)</option>
                  <option value="APPROVED">बोर्ड द्वारा अनुमोदित (Approved)</option>
                  <option value="BUDGET_PENDING">बजट स्वीकृति प्रतीक्षारत (Budget Pending)</option>
                  <option value="WORK_SANCTIONED">कार्य स्वीकृत (Sanctioned)</option>
                  <option value="WORK_IN_PROGRESS">कार्य प्रगति पर (In Progress)</option>
                  <option value="COMPLETED">कार्य पूर्ण (Completed)</option>
                  <option value="REJECTED">अस्वीकृत (Rejected)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">स्वीकृत बजट (लाख ₹ में)</label>
                <input
                  type="number"
                  step="0.1"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  placeholder="उदा. 25.50"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">प्रशासनिक टिप्पणी</label>
                <textarea
                  rows={3}
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  placeholder="प्रस्ताव संख्या अथवा बोर्ड निर्णय..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDemand(null)}
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
