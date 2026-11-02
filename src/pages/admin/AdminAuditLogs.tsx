import React from 'react';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { ShieldAlert, Clock, User, FileText, CheckCircle } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useMunicipalData();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">
          साइबर सुरक्षा एवं ऑडिट ट्रेल
        </span>
        <h1 className="text-2xl font-black text-[#123568]">प्रशासनिक ऑडिट एवं गतिविधि लॉग्स (Audit Trail)</h1>
        <p className="text-xs text-slate-500 font-hindi mt-0.5">
          प्रणाली में शिकायत स्थिति परिवर्तन, कर्मचारी आवंटन एवं सेटिंग्स संशोधन का अपरिवर्तनीय डिजिटल रिकॉर्ड।
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#123568] text-white uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">समय (Timestamp)</th>
                <th className="p-3.5">प्रयोक्ता / प्राधिकारी</th>
                <th className="p-3.5">भूमिका (Role)</th>
                <th className="p-3.5">कार्रवाई (Action)</th>
                <th className="p-3.5">लक्ष्य प्रकार व आईडी</th>
                <th className="p-3.5">विस्तृत विवरण (Details)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('hi-IN')}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">{log.actorName}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#174EA6] font-semibold text-[10px] uppercase">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-800">{log.action}</td>
                  <td className="p-3.5 font-mono text-xs">
                    <span className="text-slate-500">{log.targetType}: </span>
                    <strong className="text-blue-700">{log.targetId}</strong>
                  </td>
                  <td className="p-3.5 text-slate-700 max-w-sm">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
