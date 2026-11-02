import React, { useState } from 'react';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { LeafletMap, MapMarker } from '../../components/common/LeafletMap';
import { MapPin, Filter, Search, Layers, Building } from 'lucide-react';

export const AdminGpsMap: React.FC = () => {
  const { complaints, publicDemands, departments, wards } = useMunicipalData();

  const [wardFilter, setWardFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showDemands, setShowDemands] = useState(true);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesWard = wardFilter === 'ALL' || c.wardNumber === wardFilter;
    const matchesDept = deptFilter === 'ALL' || c.departmentId === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesWard && matchesDept && matchesStatus;
  });

  // Complaint markers
  const complaintMarkers: MapMarker[] = filteredComplaints.map((c) => ({
    id: c.id,
    lat: c.latitude,
    lng: c.longitude,
    title: `${c.complaintNumber} - ${c.citizenName}`,
    description: `${c.departmentName} | वार्ड ${c.wardNumber} | ${c.subject}`,
    status: c.status,
    type: 'complaint',
  }));

  // Demand markers
  const demandMarkers: MapMarker[] = showDemands
    ? publicDemands.map((d) => ({
        id: d.id,
        lat: d.latitude,
        lng: d.longitude,
        title: `[मांग] ${d.demandNumber} (${d.supportCount} समर्थन)`,
        description: `${d.title} (वार्ड ${d.wardNumber})`,
        status: d.status,
        type: 'demand',
        color: '#8b5cf6',
      }))
    : [];

  const allMarkers = [...complaintMarkers, ...demandMarkers];

  return (
    <div className="space-y-6">
      {/* Top Banner and Map Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">
            भौगोलिक सूचना प्रणाली (GIS Console)
          </span>
          <h1 className="text-2xl font-black text-[#123568]">सपोटरा संपूर्ण जीपीएस मैप पटल</h1>
          <p className="text-xs text-slate-500 font-hindi mt-0.5">
            सभी 10 वार्डों में शिकायतों एवं विकास मांगों की लाइव भौगोलिक स्थिति एवं क्षेत्रीय घनत्व।
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-[#D83C3C]" />
            <span>लंबित (Pending)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-[#E99A24]" />
            <span>कार्य प्रगति पर</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-[#16864A]" />
            <span>निस्तारित</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
            <span>विकास मांग पत्र</span>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
          >
            <option value="ALL">समस्त वार्ड (All Wards)</option>
            {wards.map((w) => (
              <option key={w.id} value={w.wardNumber}>
                वार्ड नं. {w.wardNumber} ({w.wardNameHi})
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
          >
            <option value="ALL">समस्त विभाग (All Depts)</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameHi}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
          >
            <option value="ALL">समस्त स्थितियां (All Status)</option>
            <option value="PENDING">लंबित (Pending)</option>
            <option value="IN_PROGRESS">कार्यरत (In Progress)</option>
            <option value="RESOLVED">निस्तारित (Resolved)</option>
          </select>
        </div>

        <div className="flex items-center justify-between px-2">
          <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showDemands}
              onChange={(e) => setShowDemands(e.target.checked)}
              className="rounded text-[#174EA6]"
            />
            <span>विकास मांगें भी दर्शाएं</span>
          </label>
          <span className="font-bold text-slate-500 font-mono">चिह्नित: {allMarkers.length}</span>
        </div>
      </div>

      {/* Full-Screen Map Container */}
      <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-200">
        <LeafletMap
          center={[26.1554, 76.7578]}
          zoom={14}
          markers={allMarkers}
          height="620px"
        />
      </div>
    </div>
  );
};
