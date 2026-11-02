import React, { useState } from 'react';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { BarChart3, Download, Calendar, FileSpreadsheet, Printer, TrendingUp, CheckCircle } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { complaints, departments, wards, publicDemands } = useMunicipalData();

  const [dateRange, setDateRange] = useState('ALL');
  const [reportType, setReportType] = useState('DEPT_PERFORMANCE');

  // Department report stats
  const deptPerformance = departments.map((d) => {
    const list = complaints.filter((c) => c.departmentId === d.id);
    const resolved = list.filter((c) => c.status === 'RESOLVED').length;
    const pending = list.filter((c) => c.status === 'PENDING' || c.status === 'SUBMITTED').length;
    const inProgress = list.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
    const rate = list.length > 0 ? Math.round((resolved / list.length) * 100) : 100;

    return {
      name: d.nameHi,
      slaDays: d.slaDays,
      total: list.length,
      resolved,
      pending,
      inProgress,
      rate,
    };
  });

  const exportReportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(deptPerformance);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DeptReport');
    XLSX.writeFile(wb, `NagarPalika-Sapotra-Performance-Report-${Date.now()}.xlsx`);
  };

  const exportReportPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(18, 53, 104);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('NAGAR PALIKA SAPOTRA, RAJASTHAN', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Executive Municipal Performance & Grievance SLA Redressal Report', 105, 23, { align: 'center' });

    let y = 45;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Department SLA Redressal Analysis:', 20, y);
    y += 10;

    doc.setFontSize(9);
    deptPerformance.forEach((dp, i) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${i + 1}. ${dp.name} (SLA: ${dp.slaDays} Days)`, 20, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`Total: ${dp.total} | Resolved: ${dp.resolved} | Pending: ${dp.pending} | SLA Rate: ${dp.rate}%`, 25, y);
      y += 9;
    });

    doc.save(`Municipal-Report-${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">
            प्रशासनिक विश्लेषण व प्रतिवेदन
          </span>
          <h1 className="text-2xl font-black text-[#123568]">नगर पालिका रिपोर्ट्स एवं विश्लेषण पटल</h1>
          <p className="text-xs text-slate-500 font-hindi mt-0.5">
            विभागीय समय सीमा (SLA) अनुपालन, वार्ड समाधान दक्षता एवं वार्षिक समीक्षा प्रतिवेदन।
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportReportExcel}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel रिपोर्ट</span>
          </button>
          <button
            onClick={exportReportPDF}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>PDF डाउनलोड</span>
          </button>
        </div>
      </div>

      {/* Department SLA Efficiency Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-[#174EA6]" />
          <span>विभागीय कार्य निष्पादन एवं SLA निस्तारण दर (Performance Audit)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="p-3">विभाग</th>
                <th className="p-3">निर्धारित SLA</th>
                <th className="p-3">कुल प्राप्त</th>
                <th className="p-3 text-emerald-700">संतुष्ट निस्तारित</th>
                <th className="p-3 text-amber-700">कार्यरत</th>
                <th className="p-3 text-rose-700">लंबित</th>
                <th className="p-3 text-right">सफलता दर</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deptPerformance.map((dp, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{dp.name}</td>
                  <td className="p-3 font-semibold text-slate-600">{dp.slaDays} दिन</td>
                  <td className="p-3 font-bold text-slate-800">{dp.total}</td>
                  <td className="p-3 font-black text-emerald-600">{dp.resolved}</td>
                  <td className="p-3 font-bold text-amber-600">{dp.inProgress}</td>
                  <td className="p-3 font-bold text-rose-600">{dp.pending}</td>
                  <td className="p-3 text-right">
                    <span className="font-mono font-black text-sm text-[#174EA6]">{dp.rate}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
