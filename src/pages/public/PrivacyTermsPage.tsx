import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle } from 'lucide-react';

export const PrivacyTermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">
          पारदर्शिता, सुरक्षा एवं गोपनीयता
        </span>
        <h1 className="text-3xl font-extrabold text-[#123568]">गोपनीयता नीति एवं उपयोग की शर्तें</h1>
        <p className="text-xs text-slate-500 font-hindi">
          नगर पालिका सपोटरा (करौली, राजस्थान) - ई-जन सेवा पोर्टल
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6 text-xs text-slate-700 leading-relaxed font-hindi">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[#174EA6]" />
            <span>१. नागरिक डेटा संरक्षण एवं गोपनीयता नीति (Data Privacy)</span>
          </h2>
          <p>
            नगर पालिका सपोटरा के ई-जन सेवा पोर्टल पर नागरिकों द्वारा दी गई व्यक्तिगत जानकारी (जैसे नाम, मोबाइल नंबर,
            ईमेल, एवं जीपीएस लोकेशन) केवल शिकायत निवारण एवं आधिकारिक सेवा सूचना प्रेषण हेतु सुरक्षित रखी जाती है।
          </p>
          <p>
            नागरिकों का मोबाइल नंबर एवं व्यक्तिगत विवरण किसी भी तीसरे पक्ष (Third Party) के साथ साझा नहीं किया जाता है।
            शिकायत के सार्वजनिक अवलोकन में केवल शिकायत का विषय, स्थिति एवं सामान्य क्षेत्र ही प्रदर्शित किया जाता है।
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>२. उपयोग की शर्तें (Terms of Service)</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              यह पोर्टल नगर पालिका सपोटरा क्षेत्राधिकार (वार्ड 1 से 10) के अंतर्गत आने वाले नगरीय मामलों के लिए है।
            </li>
            <li>
              नागरिकों से अनुरोध है कि वे केवल वास्तविक एवं प्रमाणिक शिकायतें व मांग पत्र दर्ज करें। किसी भी प्रकार की
              अपमानजनक, दुर्भावनापूर्ण या झूठी शिकायत दर्ज करना दंडनीय हो सकता है।
            </li>
            <li>
              शिकायत दर्ज करते समय फोटो अपलोड एवं जीपीएस लोकेशन का सही चयन करें ताकि नगर पालिका फील्ड दल त्वरित कार्रवाई
              कर सके।
            </li>
          </ul>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>३. परिनियोजन एवं अधिकृत डिस्क्लेमर (Deployment Disclaimer)</span>
          </h2>
          <p className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-600">
            <strong>महत्वपूर्ण सूचना:</strong> यह वेब एप्लिकेशन नगर पालिका सपोटरा हेतु अधिकृत परिनियोजन के लिए तैयार
            डिजिटल ई-जन सेवा प्रोटोटाइप है। सिस्टम सेटिंग्स, ब्रांडिंग, आधिकारिक फोन नंबर, एवं अधिसूचना गेटवे को स्थानीय
            प्रशासनिक आवश्यकताओं के अनुसार एडमिन पैनल द्वारा कॉन्फ़िगर किया जा सकता है।
          </p>
        </section>
      </div>
    </div>
  );
};
