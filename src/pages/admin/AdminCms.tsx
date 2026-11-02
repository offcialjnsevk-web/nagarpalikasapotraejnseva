import React, { useState } from 'react';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { SystemSettings } from '../../types';
import { Globe, Save, CheckCircle, Image, User, Phone, MapPin } from 'lucide-react';

export const AdminCms: React.FC = () => {
  const { settings, updateSettings } = useMunicipalData();
  const [cms, setCms] = useState<SystemSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(cms);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">
          वेबसाइट सामग्री प्रबंधन (CMS)
        </span>
        <h1 className="text-2xl font-black text-[#123568]">नगर पालिका पोर्टल सीएमएस संपादक</h1>
        <p className="text-xs text-slate-500 font-hindi mt-0.5">
          मुख्य पृष्ठ का संदेश, अध्यक्ष व अधिशाषी अधिकारी (EO) के वक्तव्य, फोटो एवं संपर्क विवरण को आवश्यकतानुसार अपडेट करें।
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>वेबसाइट सीएमएस सामग्री सफलतापूर्वक अद्यतन हो गई है!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Portal Branding */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
            १. मुख्य पोर्टल शीर्षक एवं टैगलाइन
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">पोर्टल का नाम (हिंदी) *</label>
              <input
                type="text"
                value={cms.portalNameHi}
                onChange={(e) => setCms({ ...cms, portalNameHi: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Portal Name (English) *</label>
              <input
                type="text"
                value={cms.portalName}
                onChange={(e) => setCms({ ...cms, portalName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">आधिकारिक टैगलाइन (Tagline) *</label>
              <input
                type="text"
                value={cms.taglineHi}
                onChange={(e) => setCms({ ...cms, taglineHi: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-hindi"
              />
            </div>
          </div>
        </div>

        {/* Chairman & EO Messages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chairman CMS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <User className="w-4 h-4 text-amber-500" />
              <span>२. अध्यक्ष महोदय का संदेश व विवरण</span>
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">अध्यक्ष का नाम *</label>
              <input
                type="text"
                value={cms.chairmanName}
                onChange={(e) => setCms({ ...cms, chairmanName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">अध्यक्ष का संदेश (हिंदी) *</label>
              <textarea
                rows={4}
                value={cms.chairmanMessage}
                onChange={(e) => setCms({ ...cms, chairmanMessage: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-hindi"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">फोटो यूआरएल (Image URL)</label>
              <input
                type="text"
                value={cms.chairmanPhoto}
                onChange={(e) => setCms({ ...cms, chairmanPhoto: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-500"
              />
            </div>
          </div>

          {/* EO CMS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <User className="w-4 h-4 text-[#174EA6]" />
              <span>३. अधिशाषी अधिकारी (EO) का संदेश व विवरण</span>
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">अधिशाषी अधिकारी का नाम *</label>
              <input
                type="text"
                value={cms.eoName}
                onChange={(e) => setCms({ ...cms, eoName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">अधिशाषी अधिकारी का संदेश *</label>
              <textarea
                rows={4}
                value={cms.eoMessage}
                onChange={(e) => setCms({ ...cms, eoMessage: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-hindi"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">फोटो यूआरएल (Image URL)</label>
              <input
                type="text"
                value={cms.eoPhoto}
                onChange={(e) => setCms({ ...cms, eoPhoto: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Office Contact Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>४. संपर्क सूत्र एवं आपदा नियंत्रण कक्ष विवरण</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">कार्यालय का आधिकारिक पता *</label>
              <input
                type="text"
                value={cms.officeAddress}
                onChange={(e) => setCms({ ...cms, officeAddress: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">कार्यालय फोन नंबर *</label>
              <input
                type="text"
                value={cms.officePhone}
                onChange={(e) => setCms({ ...cms, officePhone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">आपातकालीन नियंत्रण कक्ष</label>
              <input
                type="text"
                value={cms.emergencyControlRoom}
                onChange={(e) => setCms({ ...cms, emergencyControlRoom: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">आधिकारिक ईमेल आईडी</label>
              <input
                type="email"
                value={cms.email}
                onChange={(e) => setCms({ ...cms, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center space-x-2 px-8 py-3 rounded-2xl bg-[#174EA6] hover:bg-[#123568] text-white font-bold text-xs shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>सीएमएस सामग्री सुरक्षित सहेजें (Save CMS)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
