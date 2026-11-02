import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { LeafletMap } from '../../components/common/LeafletMap';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const { settings } = useMunicipalData();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [category, setCategory] = useState('सामान्य सुझाव');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !message.trim()) return;

    setSubmitted(true);
    setName('');
    setMobile('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#123568] via-[#174EA6] to-[#0f2d59] rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-3">
        <span className="inline-block bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
          नागरिक संपर्क एवं संवाद केंद्र
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">संपर्क सूत्र एवं नागरिक सुझाव (Contact Us)</h1>
        <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto font-hindi">
          नगर पालिका सपोटरा के कार्यालय का पता, हेल्पलाइन नंबर, ईमेल एवं अपने बहुमूल्य सुझाव प्रेषित करने हेतु फॉर्म।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact Info & Emergency */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-[#123568] border-b border-slate-100 pb-3">
              नगर पालिका कार्यालय सपोटरा
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#174EA6] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-semibold">कार्यालय पता:</span>
                  <p className="font-semibold text-slate-800 leading-relaxed mt-0.5">{settings.officeAddress}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#174EA6] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-semibold">कार्यालय फोन / फैक्स:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{settings.officePhone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-[#174EA6] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-semibold">आधिकारिक ईमेल आईडी:</span>
                  <p className="font-semibold text-slate-800 font-mono mt-0.5">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#174EA6] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-semibold">जनसुनवाई एवं कार्यालय समय:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    प्रातः 9:30 बजे से सायं 6:00 बजे तक (सोमवार से शुक्रवार)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Directory */}
          <div className="bg-red-50/70 border border-red-200 rounded-3xl p-6 space-y-3 text-xs">
            <h4 className="font-bold text-red-900 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>आपातकालीन टोल-फ्री एवं हेल्पलाइन</span>
            </h4>
            <div className="space-y-2 text-red-950 font-medium">
              <p className="flex justify-between">
                <span>अग्निशमन (Fire Station):</span>
                <strong className="font-bold">{settings.fireHelpline}</strong>
              </p>
              <p className="flex justify-between">
                <span>पुलिस नियंत्रण कक्ष (Police):</span>
                <strong className="font-bold">{settings.policeHelpline}</strong>
              </p>
              <p className="flex justify-between">
                <span>एम्बुलेंस सेवा (Ambulance):</span>
                <strong className="font-bold">{settings.ambulanceHelpline}</strong>
              </p>
              <p className="flex justify-between pt-1 border-t border-red-200 text-slate-800">
                <span>सपोटरा आपदा नियंत्रण कक्ष:</span>
                <strong className="font-bold text-red-700">{settings.emergencyControlRoom}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Feedback & Map */}
        <div className="lg:col-span-7 space-y-6">
          {/* Feedback Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <h3 className="text-lg font-extrabold text-[#123568] mb-1">
              नागरिक सुझाव एवं प्रतिक्रिया फॉर्म (Citizen Feedback)
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-hindi">
              नगर पालिका की सेवाओं को और बेहतर बनाने हेतु अपने महत्वपूर्ण सुझाव व विचार हमें भेजें।
            </p>

            {submitted && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs flex items-center space-x-2 mb-4 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>आपका सुझाव सफलतापूर्वक नगर पालिका प्रशासन को प्राप्त हो गया है। धन्यवाद!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">आपका नाम *</label>
                  <input
                    type="text"
                    required
                    placeholder="पूरा नाम"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#174EA6]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">मोबाइल नंबर *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-अंकीय मोबाइल नंबर"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#174EA6]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">सुझाव की श्रेणी</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="सामान्य सुझाव">सामान्य सुझाव (General Suggestion)</option>
                  <option value="स्वच्छता व्यवस्था">सफाई एवं कचरा प्रबंधन पर सुझाव</option>
                  <option value="प्रकाश व्यवस्था">स्ट्रीट लाइट सुधार सुझाव</option>
                  <option value="सड़क व नाली">सड़क व नाली विकास सुझाव</option>
                  <option value="पोर्टल सुविधा">ई-जन सेवा पोर्टल पर तकनीकी सुझाव</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">आपका सुझाव / संदेश *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="अपने विचार एवं सुझाव यहां विस्तारपूर्वक लिखें..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white font-bold text-xs shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>सुझाव प्रेषित करें (Submit Feedback)</span>
                </button>
              </div>
            </form>
          </div>

          {/* Municipal Office Location Map */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm text-slate-900">नगर पालिका भवन सपोटरा - गूगल मैप्स स्थिति</h4>
            <LeafletMap
              center={[26.1554, 76.7578]}
              zoom={15}
              markers={[
                {
                  id: 'np-office',
                  lat: 26.1554,
                  lng: 76.7578,
                  title: 'नगर पालिका भवन सपोटरा',
                  description: 'मुख्य कार्यालय, जिला करौली',
                  color: '#123568',
                },
              ]}
              height="240px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
