import React from 'react';
import { Complaint } from '../../types';
import { jsPDF } from 'jspdf';
import { Printer, Download, CheckCircle, MapPin, Calendar, User, Phone, ShieldCheck } from 'lucide-react';

interface PrintComplaintReceiptProps {
  complaint: Complaint;
  onClose?: () => void;
}

export const PrintComplaintReceipt: React.FC<PrintComplaintReceiptProps> = ({ complaint, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Header styling
    doc.setFillColor(18, 53, 104); // Navy Blue #123568
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('NAGAR PALIKA SAPOTRA, RAJASTHAN', 105, 15, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('e-Jan Seva Grievance Redressal Portal - Citizen Acknowledgment Receipt', 105, 25, { align: 'center' });

    // Complaint ID banner
    doc.setFillColor(244, 247, 252);
    doc.rect(15, 42, 180, 22, 'F');
    doc.setDrawColor(23, 78, 166);
    doc.setLineWidth(0.5);
    doc.rect(15, 42, 180, 22, 'S');

    doc.setTextColor(23, 78, 166);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`COMPLAINT ID: ${complaint.complaintNumber}`, 22, 54);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.text(`Status: ${complaint.status} | Priority: ${complaint.priority}`, 22, 60);

    // Citizen and Complaint Details Table
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);

    let y = 74;
    const addRow = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value || 'N/A', 75, y);
      y += 8;
    };

    addRow('Citizen Full Name:', complaint.citizenName);
    addRow('Mobile Number:', complaint.citizenPhone);
    addRow('Ward Number:', `Ward ${complaint.wardNumber}`);
    addRow('Address / Landmark:', complaint.address);
    addRow('Department:', complaint.departmentName);
    addRow('Category:', complaint.category);
    addRow('Subject:', complaint.subject);
    addRow('Registration Date:', new Date(complaint.createdAt).toLocaleString('en-IN'));
    addRow('Expected SLA Resolution:', complaint.expectedResolutionDate || 'Within 48-72 hours');
    addRow('GPS Coordinates:', `${complaint.latitude.toFixed(5)}, ${complaint.longitude.toFixed(5)}`);

    y += 4;
    doc.setDrawColor(226, 232, 240);
    doc.line(15, y, 195, y);
    y += 10;

    // Instructions Box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(18, 53, 104);
    doc.text('Important Instructions for Citizen:', 20, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('1. Please quote your Complaint ID in all future communications.', 20, y);
    y += 5;
    doc.text('2. Track status online anytime at: https://sapotra.rajasthan.gov.in/track', 20, y);
    y += 5;
    doc.text('3. You will receive WhatsApp and SMS updates as work progresses.', 20, y);
    y += 5;
    doc.text('4. In case of emergency or delay, contact Helpline: 1800-180-2422 / 07466-242220.', 20, y);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Nagar Palika Sapotra, District Karauli, Rajasthan - 322218 | Digital Rajasthan', 105, 280, {
      align: 'center',
    });

    doc.save(`Complaint-Receipt-${complaint.complaintNumber}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">नागरिक शिकायत रसीद (Citizen Receipt)</h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Printable section */}
        <div id="printable-receipt" className="py-6 space-y-6">
          <div className="text-center pb-4 border-b border-slate-100">
            <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold mb-2">
              ✓ शिकायत सफलतापूर्वक पंजीकृत
            </span>
            <h2 className="text-xl font-extrabold text-[#123568]">नगर पालिका सपोटरा (करौली, राजस्थान)</h2>
            <p className="text-xs text-slate-500 font-medium">ई-जन सेवा पोर्टल | Municipal Grievance Redressal Slip</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider">शिकायत संख्या (Complaint ID)</p>
              <p className="text-2xl font-black text-[#174EA6]">{complaint.complaintNumber}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                {complaint.status}
              </span>
              <p className="text-xs text-slate-500 mt-1">प्राथमिकता: {complaint.priority}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p className="text-xs text-slate-500">नागरिक का नाम</p>
              <p className="font-semibold text-slate-800">{complaint.citizenName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">मोबाइल नंबर</p>
              <p className="font-semibold text-slate-800">{complaint.citizenPhone}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">वार्ड संख्या</p>
              <p className="font-semibold text-slate-800">वार्ड नं. {complaint.wardNumber}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">संबंधित विभाग</p>
              <p className="font-semibold text-slate-800">{complaint.departmentName}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-500">शिकायत विषय</p>
              <p className="font-semibold text-slate-800">{complaint.subject}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-500">पता / लैंडमार्क</p>
              <p className="text-slate-700">{complaint.address}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">पंजीकरण दिनांक</p>
              <p className="text-slate-700">{new Date(complaint.createdAt).toLocaleString('hi-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">जीपीएस स्थिति</p>
              <p className="text-slate-700">
                {complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 leading-relaxed">
            📢 <strong>महत्वपूर्ण सूचना:</strong> आपकी शिकायत संबंधित विभाग को प्रेषित कर दी गई है। आपको WhatsApp / SMS
            के माध्यम से अद्यतन सूचना प्राप्त होगी। समस्या के समाधान के उपरांत आप पोर्टल पर अपना फीडबैक अवश्य दर्ज करें।
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-slate-200">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>प्रिंट रसीद (Print)</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#174EA6] text-white font-medium hover:bg-[#123568] transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>PDF डाउनलोड करें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
