import React, { useState } from 'react';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { FileText, CheckCircle2, AlertTriangle, Upload, ShieldCheck, Mail, User, MapPin, Award, Check } from 'lucide-react';
import { WorkApplication } from '../../types';

interface WorkRegistrationPageProps {
  onSuccess?: () => void;
}

export const WorkRegistrationPage: React.FC<WorkRegistrationPageProps> = () => {
  const { sendNotification } = useMunicipalData();

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    aadhaarNumber: '',
    email: '',
    percentage10th: '',
    percentage12th: '',
    rscitDetails: 'RSCIT Pass (RKCL)',
    aadhaarDoc: 'aadhaar_uploaded.pdf',
    photoDoc: 'photo_uploaded.jpg',
    signatureDoc: 'signature_uploaded.png',
    affidavitDoc: 'affidavit_uploaded.pdf',
    marksheet10thDoc: '10th_marksheet_uploaded.pdf',
    rscitDoc: 'rscit_cert_uploaded.pdf',
  });

  const [submittedData, setSubmittedData] = useState<WorkApplication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, [field]: file.name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMsg('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg('कृपया अपना पूरा पता दर्ज करें।');
      return;
    }
    if (!formData.aadhaarNumber || formData.aadhaarNumber.length < 12) {
      setErrorMsg('कृपया वैध 12 अंकों का आधार कार्ड नंबर दर्ज करें।');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setErrorMsg('कृपया वैध ईमेल आईडी दर्ज करें जिसपर आपको ऑथेंटिकेशन और टोकन नंबर भेजा जा सके।');
      return;
    }
    if (!formData.percentage10th) {
      setErrorMsg('10वीं की परसेंटेज दर्ज करना अनिवार्य (Compulsory) है।');
      return;
    }

    setIsSubmitting(true);

    // Simulate network latency & token generation
    setTimeout(async () => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const tokenNumber = `WKS-2026-${randomNum}`;
      const now = new Date().toISOString();

      const newApp: WorkApplication = {
        id: 'work-' + Date.now(),
        tokenNumber,
        fullName: formData.fullName,
        address: formData.address,
        aadhaarNumber: formData.aadhaarNumber,
        email: formData.email,
        percentage10th: parseFloat(formData.percentage10th),
        percentage12th: formData.percentage12th ? parseFloat(formData.percentage12th) : undefined,
        rscitDetails: formData.rscitDetails,
        aadhaarDoc: formData.aadhaarDoc,
        photoDoc: formData.photoDoc,
        signatureDoc: formData.signatureDoc,
        affidavitDoc: formData.affidavitDoc,
        marksheet10thDoc: formData.marksheet10thDoc,
        rscitDoc: formData.rscitDoc,
        status: 'UNDER_REVIEW',
        createdAt: now,
      };

      // Save to local storage
      const existing = JSON.parse(localStorage.getItem('np_sapotra_work_apps') || '[]');
      localStorage.setItem('np_sapotra_work_apps', JSON.stringify([newApp, ...existing]));

      // Send email simulation / notification log
      const emailContent = `नमस्ते ${formData.fullName} जी,\n\nनगर पालिका सपोटरा के रोजगार एवं कार्य पोर्टल पर आपका आवेदन सफलतापूर्वक प्राप्त हो गया है।\n\nआपका ऑथेंटिकेशन एवं टोकन नंबर: ${tokenNumber}\n\nहम आपके दस्तावेजों की समीक्षा कर रहे हैं। जैसे ही समीक्षा पूरी होगी, हम आपको 24 घंटे के अंदर विस्तृत अपडेट मेल पर भेज देंगे।\n\nThank you for joining Nagar Palika Sapotra!`;

      await sendNotification(
        'EMAIL',
        formData.email,
        formData.fullName,
        'WORK_APPLICATION_SUBMITTED',
        tokenNumber,
        emailContent
      );

      setSubmittedData(newApp);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#123568] to-[#1a4a8d] text-white rounded-3xl p-6 md:p-8 shadow-xl mb-8 border border-blue-400/30">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              नगर पालिका सपोटरा — ई-जन सेवा पोर्टल
            </span>
            <h1 className="text-2xl md:text-3xl font-black">रोजगार एवं कार्य पंजीयन सेक्शन (Work Section)</h1>
          </div>
        </div>
        <p className="text-slate-200 text-sm md:text-base leading-relaxed">
          municipal projects, skilled deployment, and verification portal. 10वीं कक्षा, आधार, फोटो, हस्ताक्षर एवं शपथ पत्र अपलोड के साथ आवेदन जमा करें।
        </p>
      </div>

      {submittedData ? (
        /* Success & Confirmation Modal Box */
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-500 p-6 md:p-10 animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-4 py-1.5 rounded-full border border-emerald-300 mb-3 uppercase tracking-wider">
              आवेदन सफलतापूर्वक जमा हुआ ✓
            </span>
            <h2 className="text-2xl font-black text-slate-900 mb-1">
              आपका आवेदन पंजीकृत हो गया है
            </h2>
            <p className="text-slate-600 text-sm mb-6 max-w-lg">
              आपके द्वारा दर्ज की गई ईमेल आईडी <strong className="text-blue-700">{submittedData.email}</strong> पर ऑथेंटिकेशन और टोकन नंबर भेज दिया गया है।
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 w-full max-w-xl text-left mb-6 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-500">ऑथेंटिकेशन / टोकन नंबर:</span>
                <span className="font-mono text-base font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                  {submittedData.tokenNumber}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                <div><strong>नाम:</strong> {submittedData.fullName}</div>
                <div><strong>पता:</strong> {submittedData.address}</div>
                <div><strong>10वीं प्रतिशत:</strong> {submittedData.percentage10th}%</div>
                <div><strong>स्थिति:</strong> <span className="text-amber-600 font-bold">समीक्षाधीन (Under Review)</span></div>
              </div>
            </div>

            {/* Required user confirmation text box */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-5 text-left text-blue-900 text-sm leading-relaxed mb-6 shadow-xs flex items-start space-x-3">
              <ShieldCheck className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">नगर पालिका प्रशासनिक संदेश:</p>
                <p className="italic font-medium">
                  "हम रिव्यू कर रहे हैं। और जैसे रिव्यू होने के बाद ही हम आपको डिटेल सबमिट करेंगे और 24 घंटे के अंदर आपको डेट रिव्यू मिल जाएगी। थैंक यू फॉर जॉइनिंग।"
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSubmittedData(null);
                setFormData({
                  fullName: '',
                  address: '',
                  aadhaarNumber: '',
                  email: '',
                  percentage10th: '',
                  percentage12th: '',
                  rscitDetails: 'RSCIT Pass (RKCL)',
                  aadhaarDoc: 'aadhaar_uploaded.pdf',
                  photoDoc: 'photo_uploaded.jpg',
                  signatureDoc: 'signature_uploaded.png',
                  affidavitDoc: 'affidavit_uploaded.pdf',
                  marksheet10thDoc: '10th_marksheet_uploaded.pdf',
                  rscitDoc: 'rscit_cert_uploaded.pdf',
                });
              }}
              className="px-6 py-3 bg-[#123568] hover:bg-[#1a4a8d] text-white font-bold rounded-xl shadow-md transition-all text-sm"
            >
              नया आवेदन दर्ज करें
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-8 space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
            <FileText className="w-5 h-5 text-[#123568]" />
            <h2 className="text-lg font-black text-slate-900">रोजगार एवं कार्य पंजीयन फॉर्म</h2>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                पूरा नाम (Full Name) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="अपना पूरा नाम दर्ज करें"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#123568] text-sm font-medium"
                />
              </div>
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                ईमेल आईडी (Email ID) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@gmail.com (टोकन यहाँ आएगा)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#123568] text-sm font-medium"
                />
              </div>
            </div>

            {/* Aadhaar Number */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                आधार कार्ड नंबर (Aadhaar Number) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  maxLength={12}
                  value={formData.aadhaarNumber}
                  onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder="12 अंकों का आधार नंबर"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#123568] text-sm font-medium font-mono"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                पूरा पता (Address) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="वार्ड नं., मोहल्ला, सपोटरा, करौली"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#123568] text-sm font-medium"
                />
              </div>
            </div>

            {/* 10th Percentage - COMPULSORY */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                10वीं की परसेंटेज (10th %) <span className="text-red-500">* (अनिवार्य)</span>
              </label>
              <input
                type="number"
                step="0.01"
                max="100"
                value={formData.percentage10th}
                onChange={(e) => setFormData({ ...formData, percentage10th: e.target.value })}
                placeholder="उदा. 78.5"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#123568] text-sm font-medium"
              />
            </div>

            {/* 12th Percentage - NOT COMPULSORY */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                12वीं की परसेंटेज (12th %) <span className="text-slate-400 font-normal">(वैकल्पिक / Optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                max="100"
                value={formData.percentage12th}
                onChange={(e) => setFormData({ ...formData, percentage12th: e.target.value })}
                placeholder="उदा. 82.0 (यदि हो तो)"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#123568] text-sm font-medium"
              />
            </div>

            {/* RSCIT Details */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                आरएससीआईटी (RSCIT कोर्स / प्रमाण पत्र विवरण)
              </label>
              <input
                type="text"
                value={formData.rscitDetails}
                onChange={(e) => setFormData({ ...formData, rscitDetails: e.target.value })}
                placeholder="RSCIT Roll No. / Certificate No."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#123568] text-sm font-medium"
              />
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              आवश्यक दस्तावेज अपलोड (Document Uploads)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Aadhaar Upload */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-100 transition-all">
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                <span className="block text-xs font-bold text-slate-700 mb-1">आधार कार्ड अपलोड</span>
                <span className="text-[10px] text-emerald-600 font-bold block mb-2">{formData.aadhaarDoc}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, 'aadhaarDoc')}
                  className="text-xs text-slate-500 w-full file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {/* Photo Upload */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-100 transition-all">
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                <span className="block text-xs font-bold text-slate-700 mb-1">फोटो अपलोड (Photo) <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-emerald-600 font-bold block mb-2">{formData.photoDoc}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'photoDoc')}
                  className="text-xs text-slate-500 w-full file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {/* Signature Upload */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-100 transition-all">
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                <span className="block text-xs font-bold text-slate-700 mb-1">साइन अपलोड (Signature) <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-emerald-600 font-bold block mb-2">{formData.signatureDoc}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'signatureDoc')}
                  className="text-xs text-slate-500 w-full file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {/* Affidavit Upload */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-100 transition-all">
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                <span className="block text-xs font-bold text-slate-700 mb-1">शपथ पत्र अपलोड (Affidavit)</span>
                <span className="text-[10px] text-emerald-600 font-bold block mb-2">{formData.affidavitDoc}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, 'affidavitDoc')}
                  className="text-xs text-slate-500 w-full file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {/* 10th Marksheet Upload */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-100 transition-all">
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                <span className="block text-xs font-bold text-slate-700 mb-1">10वीं की मार्कशीट अपलोड <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-emerald-600 font-bold block mb-2">{formData.marksheet10thDoc}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, 'marksheet10thDoc')}
                  className="text-xs text-slate-500 w-full file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {/* RSCIT Document Upload */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-100 transition-all">
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                <span className="block text-xs font-bold text-slate-700 mb-1">आरएससीआईटी डॉक्यूमेंट अपलोड</span>
                <span className="text-[10px] text-emerald-600 font-bold block mb-2">{formData.rscitDoc}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, 'rscitDoc')}
                  className="text-xs text-slate-500 w-full file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-gradient-to-r from-[#123568] to-[#1a4a8d] hover:from-[#0f2d58] hover:to-[#153f7a] text-white font-black rounded-xl shadow-lg transition-all text-sm flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>आवेदन जमा हो रहा है...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>आवेदन सबमिट करें & टोकन प्राप्त करें</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
