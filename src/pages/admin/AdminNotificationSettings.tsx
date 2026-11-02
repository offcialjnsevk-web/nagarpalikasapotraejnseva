import React, { useState } from 'react';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { SystemSettings } from '../../types';
import { MessageSquare, Phone, Mail, Send, CheckCircle, ShieldAlert, Key, Server, RefreshCw } from 'lucide-react';

export const AdminNotificationSettings: React.FC = () => {
  const { settings, updateSettings, notificationLogs, sendNotification } = useMunicipalData();

  const [formSettings, setFormSettings] = useState<SystemSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Test Notification State
  const [testChannel, setTestChannel] = useState<'WHATSAPP' | 'SMS' | 'EMAIL'>('WHATSAPP');
  const [testPhone, setTestPhone] = useState('+91 94140 12345');
  const [testMessage, setTestMessage] = useState('नगर पालिका सपोटरा: यह ई-जन सेवा पोर्टल का परीक्षण संदेश है।');
  const [testSuccess, setTestSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone.trim() || !testMessage.trim()) return;

    await sendNotification(
      testChannel,
      testPhone.trim(),
      'परीक्षण प्राप्तकर्ता (Test User)',
      'MANUAL_TEST_NOTIFICATION',
      'TEST-' + Date.now(),
      testMessage.trim()
    );

    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">
          गेटवे एवं संचार प्रबंधन
        </span>
        <h1 className="text-2xl font-black text-[#123568]">व्हाट्सएप, एसएमएस एवं ईमेल गेटवे सेटिंग्स</h1>
        <p className="text-xs text-slate-500 font-hindi mt-0.5">
          शिकायत दर्ज होने एवं स्थिति बदलने पर नागरिकों व विभागीय प्रभारियों को ऑटोमेटिक अलर्ट भेजने का सुरक्षित गेटवे।
        </p>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>संचार गेटवे सेटिंग्स सुरक्षित रूप से सहेज ली गई हैं!</span>
        </div>
      )}

      {/* Gateway Configuration Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* WhatsApp Business API Box */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Business Cloud API</span>
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                formSettings.whatsappGatewayConfig.demoMode
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {formSettings.whatsappGatewayConfig.demoMode ? 'डेमो मोड (Demo Mode)' : 'लाइव प्रोडक्शन'}
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">WhatsApp Phone Number ID</label>
            <input
              type="text"
              value={formSettings.whatsappGatewayConfig.phoneNumberId}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  whatsappGatewayConfig: { ...formSettings.whatsappGatewayConfig, phoneNumberId: e.target.value },
                })
              }
              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Business Account ID (WABA)</label>
            <input
              type="text"
              value={formSettings.whatsappGatewayConfig.businessAccountId}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  whatsappGatewayConfig: { ...formSettings.whatsappGatewayConfig, businessAccountId: e.target.value },
                })
              }
              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Permanent Access Token (Secret)</label>
            <input
              type="password"
              value={formSettings.whatsappGatewayConfig.accessToken}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  whatsappGatewayConfig: { ...formSettings.whatsappGatewayConfig, accessToken: e.target.value },
                })
              }
              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-500"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formSettings.whatsappGatewayConfig.demoMode}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    whatsappGatewayConfig: { ...formSettings.whatsappGatewayConfig, demoMode: e.target.checked },
                  })
                }
                className="rounded text-[#174EA6]"
              />
              <span>डेमो मोड सक्षम रखें (सिमुलेटेड डिलीवरी लॉग)</span>
            </label>
          </div>
        </div>

        {/* SMS Gateway Box */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>SMS Gateway (Govt DLT Approved)</span>
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                formSettings.smsGatewayConfig.demoMode
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {formSettings.smsGatewayConfig.demoMode ? 'डेमो मोड (Demo Mode)' : 'लाइव DLT'}
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">SMS API Key</label>
            <input
              type="password"
              value={formSettings.smsGatewayConfig.apiKey}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  smsGatewayConfig: { ...formSettings.smsGatewayConfig, apiKey: e.target.value },
                })
              }
              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">DLT Header / Sender ID</label>
            <input
              type="text"
              value={formSettings.smsGatewayConfig.senderId}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  smsGatewayConfig: { ...formSettings.smsGatewayConfig, senderId: e.target.value },
                })
              }
              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono uppercase font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">DLT Template ID (Grievance)</label>
            <input
              type="text"
              defaultValue="140716182930219"
              readOnly
              className="w-full p-2.5 rounded-xl border border-slate-200 font-mono bg-slate-50 text-slate-500"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formSettings.smsGatewayConfig.demoMode}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    smsGatewayConfig: { ...formSettings.smsGatewayConfig, demoMode: e.target.checked },
                  })
                }
                className="rounded text-[#174EA6]"
              />
              <span>डेमो मोड सक्षम रखें (सिमुलेटेड SMS)</span>
            </label>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-[#174EA6] hover:bg-[#123568] text-white font-bold text-xs shadow-md transition-all"
          >
            गेटवे सेटिंग्स सहेजें (Save Configuration)
          </button>
        </div>
      </form>

      {/* Live Test Sender */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
          <Send className="w-4 h-4 text-[#F39A25]" />
          <span>लाइव टेस्ट मैसेज सेंडर (Send Test Notification)</span>
        </h3>

        {testSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-2xl text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>परीक्षण संदेश सफलतापूर्वक प्रेषित किया गया एवं डिलीवरी लॉग में दर्ज हुआ!</span>
          </div>
        )}

        <form onSubmit={handleSendTest} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">चैनल चुनें</label>
            <select
              value={testChannel}
              onChange={(e) => setTestChannel(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
            >
              <option value="WHATSAPP">WhatsApp Business</option>
              <option value="SMS">SMS Gateway</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">प्राप्तकर्ता मोबाइल नंबर *</label>
            <input
              type="text"
              required
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">परीक्षण संदेश पाठ</label>
            <input
              type="text"
              required
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#F39A25] hover:bg-[#d88214] text-white font-bold text-xs shadow-sm transition-all"
            >
              परीक्षण संदेश भेजें (Trigger Test)
            </button>
          </div>
        </form>
      </div>

      {/* Notification Logs Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-6">
        <h3 className="font-extrabold text-sm text-slate-900">अधिसूचना प्रेषण लॉग (Notification Audit Logs)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="p-3">समय</th>
                <th className="p-3">चैनल</th>
                <th className="p-3">प्राप्तकर्ता</th>
                <th className="p-3">इवेंट / संदर्भ संख्या</th>
                <th className="p-3">संदेश सामग्री</th>
                <th className="p-3 text-right">स्थिति</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notificationLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString('hi-IN')}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.channel === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {log.channel}
                    </span>
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{log.recipientName}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{log.recipientPhone}</p>
                  </td>
                  <td className="p-3 font-mono text-[#174EA6] font-bold">{log.referenceId}</td>
                  <td className="p-3 text-slate-700 max-w-sm truncate">{log.content}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.status === 'DEMO_MODE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {log.status}
                    </span>
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
