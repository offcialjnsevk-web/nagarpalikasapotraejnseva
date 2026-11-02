import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { Building2, ShieldCheck, MapPin, Users, Award, Target, Landmark, Phone, Mail } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const { settings, wards } = useMunicipalData();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#123568] via-[#174EA6] to-[#0f2d59] rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-4">
        <span className="inline-block bg-amber-400/20 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold border border-amber-400/30">
          परिचय एवं प्रशासनिक रूपरेखा
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">नगर पालिका सपोटरा (करौली, राजस्थान)</h1>
        <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto font-hindi leading-relaxed">
          सपोटरा नगर के सर्वांगीण, स्वच्छ एवं आधुनिक विकास के लिए समर्पित स्थानीय स्वशासन संस्था।
        </p>
      </div>

      {/* Intro & History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#174EA6]">नगर पालिका सपोटरा के बारे में</span>
          <h2 className="text-2xl font-extrabold text-[#123568]">स्थानीय स्वशासन, इतिहास एवं भौगोलिक स्थिति</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-hindi">
            सपोटरा राजस्थान के करौली जिले का एक ऐतिहासिक एवं प्रमुख उपखंड मुख्यालय है। यह डांग क्षेत्र के केंद्र में स्थित
            है तथा श्री महावीर जी एवं करौली जिला मुख्यालय के मध्य एक महत्वपूर्ण व्यावसायिक एवं सांस्कृतिक केंद्र के रूप में
            उभरा है।
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-hindi">
            राजस्थान नगर पालिका अधिनियम, 2009 के अंतर्गत गठित नगर पालिका सपोटरा 10 नगरीय वार्डों में विभक्त है। यह संस्था
            नगरवासियों को स्वच्छता, पेयजल, स्ट्रीट लाइट, पक्की सड़कों, नालियों, पार्क एवं नागरिक प्रमाणपत्र (जन्म-मृत्यु, पट्टा)
            जैसी मूलभूत नागरिक सुविधाएं उपलब्ध कराने हेतु कृतसंकल्पित है।
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-[#174EA6]" />
            <span>प्रमुख तथ्य एवं सांख्यिकी (Key Facts)</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-400">राज्य एवं जिला:</span>
              <p className="font-bold text-slate-800">राजस्थान (करौली)</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-400">पिन कोड:</span>
              <p className="font-bold text-slate-800">322218</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-400">कुल वार्ड संख्या:</span>
              <p className="font-bold text-slate-800">10 वार्ड (विस्तारित)</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-400">अनुमानित जनसंख्या:</span>
              <p className="font-bold text-slate-800">30,000+ नागरिक</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl col-span-2">
              <span className="text-slate-400">मुख्यालय पता:</span>
              <p className="font-bold text-slate-800">{settings.officeAddress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#174EA6] text-white flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-[#123568]">हमारा विज़न (Our Vision)</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-hindi">
            सपोटरा को आधुनिक बुनियादी ढांचे, 100% ठोस कचरा प्रबंधन, हरित वातावरण, सुरक्षित प्रकाश व्यवस्था एवं डिजिटल
            ई-गवर्नेंस से युक्त एक आत्मनिर्भर, आदर्श एवं स्मार्ट कस्बा बनाना।
          </p>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F39A25] text-white flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-amber-950">हमारा मिशन (Our Mission)</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-hindi">
            प्रत्येक नागरिक को बिना किसी बिचौलिए के पारदर्शी डिजिटल सेवाएं प्रदान करना, शिकायतों का 48 घंटे के भीतर
            गुणवत्तापूर्ण समाधान सुनिश्चित करना तथा जनसहभागिता से विकास कार्यों को गति देना।
          </p>
        </div>
      </div>

      {/* Leadership Profiles */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#174EA6]">नगर पालिका प्रशासन</span>
          <h2 className="text-2xl font-extrabold text-[#123568]">कार्यकारी नेतृत्व (Administrative Leadership)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chairman Profile */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-5 items-center">
            <img
              src={settings.chairmanPhoto}
              alt={settings.chairmanName}
              className="w-28 h-28 rounded-2xl object-cover border-4 border-amber-400 shadow-md shrink-0"
            />
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                अध्यक्ष (President)
              </span>
              <h3 className="text-lg font-extrabold text-[#123568]">{settings.chairmanName}</h3>
              <p className="text-xs text-slate-500 font-medium">नगर पालिका मण्डल सपोटरा, जिला करौली</p>
              <p className="text-xs text-slate-600 font-hindi mt-2 leading-relaxed">
                "नागरिकों की सेवा, स्वच्छता अभियान और वार्ड विकास को गति देना ही हमारे बोर्ड का मूल उद्देश्य है।"
              </p>
            </div>
          </div>

          {/* EO Profile */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-5 items-center">
            <img
              src={settings.eoPhoto}
              alt={settings.eoName}
              className="w-28 h-28 rounded-2xl object-cover border-4 border-[#174EA6] shadow-md shrink-0"
            />
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold text-[#174EA6] uppercase tracking-wider">
                अधिशाषी अधिकारी (EO - RAS)
              </span>
              <h3 className="text-lg font-extrabold text-[#123568]">{settings.eoName}</h3>
              <p className="text-xs text-slate-500 font-medium">राजस्थान प्रशासनिक सेवा (RAS)</p>
              <p className="text-xs text-slate-600 font-hindi mt-2 leading-relaxed">
                "ई-जन सेवा पोर्टल द्वारा पारदर्शी शिकायत निवारण एवं सख्त निगरानी प्रणाली स्थापित की गई है।"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wards Overview Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="text-lg font-extrabold text-[#123568]">वार्ड क्षेत्राधिकार विवरण (Wards Jurisdiction)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">वार्ड संख्या</th>
                <th className="p-3">वार्ड का नाम एवं प्रमुख क्षेत्र</th>
                <th className="p-3">वार्ड प्रतिनिधि / पार्षद</th>
                <th className="p-3">संपर्क नंबर</th>
                <th className="p-3 text-right">जनसंख्या</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wards.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/80">
                  <td className="p-3 font-bold text-[#174EA6]">वार्ड नं. {w.wardNumber}</td>
                  <td className="p-3">
                    <p className="font-semibold text-slate-900">{w.wardNameHi}</p>
                    <p className="text-slate-500 text-[11px]">{w.areaDescription}</p>
                  </td>
                  <td className="p-3 font-medium text-slate-800">{w.councilorName}</td>
                  <td className="p-3 font-mono text-slate-600">{w.councilorPhone}</td>
                  <td className="p-3 text-right font-mono font-semibold text-slate-700">{w.population}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
