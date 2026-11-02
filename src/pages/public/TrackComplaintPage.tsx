import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { LeafletMap } from '../../components/common/LeafletMap';
import { PrintComplaintReceipt } from '../../components/common/PrintComplaintReceipt';
import { Complaint } from '../../types';
import {
  Search,
  MapPin,
  Clock,
  User,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Star,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface TrackComplaintPageProps {
  initialSearchId?: string;
}

export const TrackComplaintPage: React.FC<TrackComplaintPageProps> = ({ initialSearchId }) => {
  const { t, lang } = useLanguage();
  const { complaints, submitCitizenFeedback, reopenComplaint } = useMunicipalData();

  const [query, setQuery] = useState(initialSearchId || '');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchError, setSearchError] = useState('');

  // Reopen Modal
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  // Feedback State
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Receipt Modal
  const [receiptOpen, setReceiptOpen] = useState(false);

  useEffect(() => {
    if (initialSearchId) {
      handleSearch(initialSearchId);
    }
  }, [initialSearchId]);

  const handleSearch = (searchQuery: string) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchError('कृपया वैध शिकायत संख्या अथवा 10-अंकीय मोबाइल नंबर दर्ज करें।');
      return;
    }

    setSearchError('');
    // Look up by complaintNumber (case-insensitive) or by phone number
    const found = complaints.find(
      (c) =>
        c.complaintNumber.toLowerCase() === q ||
        c.id.toLowerCase() === q ||
        c.citizenPhone.replace(/\D/g, '') === q.replace(/\D/g, '')
    );

    if (found) {
      setSelectedComplaint(found);
    } else {
      setSearchError(`शिकायत संख्या "${searchQuery}" से कोई रिकॉर्ड नहीं मिला। कृपया पुनः जांचें।`);
      setSelectedComplaint(null);
    }
  };

  const handleReopenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !reopenReason.trim()) return;

    await reopenComplaint(selectedComplaint.id, reopenReason.trim());
    setReopenModalOpen(false);
    setReopenReason('');

    // Refresh selected complaint view
    const updated = complaints.find((c) => c.id === selectedComplaint.id);
    if (updated) setSelectedComplaint({ ...updated, status: 'REOPENED' });
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    await submitCitizenFeedback(selectedComplaint.id, feedbackText.trim(), rating);
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 4000);
  };

  const getTimelineSteps = (status: string) => {
    const sequence = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'UNDER_VERIFICATION', 'RESOLVED'];
    const currentIndex = sequence.indexOf(status);

    return sequence.map((step, idx) => {
      const isPastOrCurrent = currentIndex >= idx || status === 'RESOLVED';
      const isCurrent = status === step;
      let label = step;
      if (step === 'SUBMITTED') label = '१. शिकायत दर्ज';
      if (step === 'ASSIGNED') label = '२. कर्मचारी आवंटित';
      if (step === 'IN_PROGRESS') label = '३. कार्य प्रगति पर';
      if (step === 'UNDER_VERIFICATION') label = '४. सत्यापन प्रक्रिया';
      if (step === 'RESOLVED') label = '५. समाधान पूर्ण';

      return {
        step,
        label,
        completed: isPastOrCurrent,
        current: isCurrent,
      };
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-[#123568] to-[#174EA6] rounded-3xl p-6 sm:p-8 text-white shadow-lg text-center space-y-4">
        <span className="inline-block bg-white/10 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-white/20">
          पारदर्शी ट्रैकिंग प्रणाली • नगर पालिका सपोटरा
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold">शिकायत स्थिति ट्रैक करें (Track Grievance)</h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-lg mx-auto font-hindi">
          शिकायत पंजीकरण के समय प्राप्त अपनी शिकायत संख्या (उदा. NP-SPT-2026-0001) अथवा पंजीकृत मोबाइल नंबर दर्ज करें।
        </p>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="max-w-xl mx-auto pt-2"
        >
          <div className="bg-white p-1.5 rounded-2xl shadow-md flex items-center border-2 border-white/80 focus-within:border-amber-400">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="शिकायत संख्या अथवा 10-अंकीय मोबाइल नंबर..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 text-slate-800 text-sm focus:outline-hidden"
            />
            <button
              type="submit"
              className="bg-[#F39A25] hover:bg-[#d88214] text-white px-6 py-2.5 rounded-xl font-bold text-xs shrink-0 shadow-sm transition-all"
            >
              ट्रैक करें
            </button>
          </div>
        </form>

        {searchError && (
          <p className="text-xs text-rose-200 bg-rose-900/50 max-w-md mx-auto p-2 rounded-xl font-semibold">
            ⚠️ {searchError}
          </p>
        )}

        {/* Quick Demo Pill Search */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-300">
          <span>उदा. त्वरित ट्रैक करें:</span>
          {complaints.slice(0, 3).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setQuery(c.complaintNumber);
                handleSearch(c.complaintNumber);
              }}
              className="bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded-md font-mono text-[11px]"
            >
              {c.complaintNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Complaint Tracking Details */}
      {selectedComplaint && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Status Header Banner */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">शिकायत संख्या:</span>
                <span className="font-mono text-xl font-black text-[#174EA6]">
                  {selectedComplaint.complaintNumber}
                </span>
                <StatusBadge status={selectedComplaint.status} />
                <PriorityBadge priority={selectedComplaint.priority} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedComplaint.subject}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                विभाग: <strong className="text-slate-800">{selectedComplaint.departmentName}</strong> • वार्ड नं.{' '}
                {selectedComplaint.wardNumber} • {new Date(selectedComplaint.createdAt).toLocaleDateString('hi-IN')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setReceiptOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>रसीद / पर्ची प्रिंट करें</span>
              </button>

              {selectedComplaint.status === 'RESOLVED' && (
                <button
                  onClick={() => setReopenModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>पुनः खोलें (Reopen)</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#174EA6]" />
              <span>प्रगति समयरेखा (Status Resolution Timeline)</span>
            </h3>

            {/* Step sequence */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {getTimelineSteps(selectedComplaint.status).map((st, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    st.completed
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div
                    className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                      st.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {st.completed ? '✓' : i + 1}
                  </div>
                  <p className="text-xs font-bold leading-tight">{st.label}</p>
                </div>
              ))}
            </div>

            {/* Action History Log */}
            {selectedComplaint.history && selectedComplaint.history.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  कार्रवाई इतिहास एवं लॉग (Audit Trail)
                </h4>
                <div className="space-y-2">
                  {selectedComplaint.history.map((h, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                      <div>
                        <span className="font-bold text-[#174EA6]">{h.action}</span>
                        <span className="text-slate-500 ml-2">({h.updatedBy})</span>
                        <p className="text-slate-700 mt-0.5">{h.remarks}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0">
                        {new Date(h.timestamp).toLocaleString('hi-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details & Location Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Details Box */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                शिकायत विवरण एवं नियुक्त कार्मिक
              </h3>

              <div className="space-y-3 text-slate-700">
                <div>
                  <span className="text-slate-400">विस्तृत समस्या:</span>
                  <p className="text-slate-900 font-medium mt-0.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400">नागरिक का नाम:</span>
                    <p className="font-bold text-slate-900">{selectedComplaint.citizenName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">वार्ड एवं क्षेत्र:</span>
                    <p className="font-bold text-slate-900">वार्ड नं. {selectedComplaint.wardNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">पता व लैंडमार्क:</span>
                    <p className="font-semibold text-slate-800">{selectedComplaint.address}</p>
                  </div>
                </div>

                {/* Assigned Employee Box */}
                <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200">
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                    नियुक्त फील्ड कर्मचारी / प्रभारी
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedComplaint.assignedEmployeeName || 'विभाग द्वारा कर्मचारी आवंटन प्रक्रियाधीन है'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    अपेक्षित निस्तारण तिथि: {selectedComplaint.expectedResolutionDate || '48-72 घंटे'}
                  </p>
                </div>

                {/* Before & After Photos if resolved */}
                {selectedComplaint.beforePhoto && selectedComplaint.afterPhoto && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="font-bold text-slate-800 block mb-2">समाधान साक्ष्य (Before & After Evidence):</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">काम से पहले (Before):</span>
                        <img
                          src={selectedComplaint.beforePhoto}
                          alt="Before"
                          className="w-full h-28 object-cover rounded-xl border border-slate-200"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold block mb-1">समाधान के बाद (After):</span>
                        <img
                          src={selectedComplaint.afterPhoto}
                          alt="After"
                          className="w-full h-28 object-cover rounded-xl border border-emerald-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Map Box */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>समस्या स्थल जीपीएस स्थिति</span>
                  </h3>
                  <a
                    href={`https://maps.google.com/?q=${selectedComplaint.latitude},${selectedComplaint.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#174EA6] hover:underline"
                  >
                    Google Maps नेविगेशन ↗
                  </a>
                </div>

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
                  height="260px"
                />

                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  अक्षांश: {selectedComplaint.latitude.toFixed(5)} | देशांतर: {selectedComplaint.longitude.toFixed(5)}
                </p>
              </div>

              {/* Citizen Feedback Box if resolved */}
              {selectedComplaint.status === 'RESOLVED' && (
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">नागरिक संतुष्टि रेटिंग एवं फीडबैक</h4>
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-0.5 hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-2">
                    <input
                      type="text"
                      placeholder="कार्य समाधान पर अपना अनुभव अथवा टिप्पणी लिखें..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs bg-white focus:outline-hidden"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-amber-800">
                        {feedbackSuccess ? '✓ आपकी प्रतिक्रिया दर्ज हो गई है!' : 'आपके फीडबैक से सेवाएं बेहतर होती हैं'}
                      </span>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                      >
                        फीडबैक सबमिट करें
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reopen Complaint Modal */}
      {reopenModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2 text-rose-600">
                <RotateCcw className="w-5 h-5" />
                <span>शिकायत पुनः खोलें (Reopen Request)</span>
              </h3>
              <button onClick={() => setReopenModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 font-hindi leading-relaxed">
              यदि आप कार्य समाधान से संतुष्ट नहीं हैं अथवा समस्या पुनः उत्पन्न हो गई है, तो कृपया कारण लिखें। यह शिकायत
              सीधे अधिशाषी अधिकारी (EO) एवं उच्चाधिकारियों को पुनर्निरीक्षण हेतु प्रेषित की जाएगी।
            </p>

            <form onSubmit={handleReopenSubmit} className="space-y-4">
              <textarea
                required
                rows={4}
                placeholder="पुनः खोलने का स्पष्ट कारण लिखें (उदा. नाली की पूरी सफाई नहीं हुई, पुनः गंदा पानी भर रहा है...)"
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setReopenModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
                >
                  पुनः खोलने हेतु प्रेषित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptOpen && selectedComplaint && (
        <PrintComplaintReceipt
          complaint={selectedComplaint}
          onClose={() => setReceiptOpen(false)}
        />
      )}
    </div>
  );
};
