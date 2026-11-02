import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, User, Phone, Mail, Lock, MapPin, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface CitizenAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'LOGIN' | 'SIGNUP';
  onSuccess?: () => void;
}

export const CitizenAuthModal: React.FC<CitizenAuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'LOGIN',
  onSuccess,
}) => {
  const { citizenLogin, citizenSignup } = useAuth();
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(defaultMode);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [wardNumber, setWardNumber] = useState('5');
  const [address, setAddress] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('कृपया मोबाइल नंबर या ईमेल दर्ज करें।');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('कृपया पासवर्ड दर्ज करें।');
      return;
    }

    setIsLoading(true);
    try {
      const res = await citizenLogin(loginIdentifier, loginPassword);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 800);
      } else {
        setErrorMsg(res.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim() || !mobileNumber.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('कृपया सभी आवश्यक विवरण भरें।');
      return;
    }
    if (mobileNumber.replace(/\D/g, '').length < 10) {
      setErrorMsg('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }

    setIsLoading(true);
    try {
      const res = await citizenSignup({
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim(),
        password: password.trim(),
        wardNumber: wardNumber,
        address: address.trim() || `वार्ड नं. ${wardNumber}, सपोटरा`,
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 1000);
      } else {
        setErrorMsg(res.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoCitizen = async () => {
    setLoginIdentifier('9829011001');
    setLoginPassword('sapotra@123');
    setIsLoading(true);
    const res = await citizenLogin('9829011001', 'sapotra@123');
    setIsLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#123568] to-[#174EA6] p-5 text-white flex justify-between items-center relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 text-xl font-black">
              🏛️
            </div>
            <div>
              <span className="text-[10px] tracking-widest text-amber-300 font-bold uppercase">
                नगर पालिका सपोटरा (करौली)
              </span>
              <h2 className="text-lg font-black tracking-tight">नागरिक ई-सेवा पोर्टल (Citizen Portal)</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => {
              setMode('LOGIN');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-3 text-center transition-all border-b-2 ${
              mode === 'LOGIN'
                ? 'border-[#174EA6] text-[#174EA6] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            नागरिक लॉगिन (Citizen Login)
          </button>
          <button
            onClick={() => {
              setMode('SIGNUP');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-3 text-center transition-all border-b-2 ${
              mode === 'SIGNUP'
                ? 'border-[#174EA6] text-[#174EA6] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            नया नागरिक पंजीकरण (Signup)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Demo Citizen Login Banner */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold text-amber-900 text-[11px]">त्वरित परीक्षण (Demo Account):</p>
                <p className="text-[10px] text-amber-800">मोबाइल: 9829011001 | पास: sapotra@123</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoCitizen}
              disabled={isLoading}
              className="px-2.5 py-1.5 bg-[#174EA6] hover:bg-[#123568] text-white font-bold rounded-lg text-[10px] shadow-sm transition-all"
            >
              1-क्लिक लॉगिन
            </button>
          </div>

          {/* Form: LOGIN */}
          {mode === 'LOGIN' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  मोबाइल नंबर या ईमेल आईडी <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="उदा. 9829011001 या citizen@sapotra.demo"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  पासवर्ड <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="आपका सुरक्षित पासवर्ड (डिफ़ॉल्ट: sapotra@123)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>पासवर्ड भूल गए? हेल्पलाइन: +91 94140 12345</span>
                <button
                  type="button"
                  onClick={() => setMode('SIGNUP')}
                  className="text-[#174EA6] font-bold hover:underline"
                >
                  नया खाता बनाएं
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white font-bold shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? <span>सत्यापित किया जा रहा है...</span> : <span>नागरिक लॉगिन करें</span>}
              </button>
            </form>
          ) : (
            /* Form: SIGNUP */
            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  नागरिक का पूरा नाम <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="उदा. रामनारायण शर्मा"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    मोबाइल नंबर (10 अंक) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="98290XXXXX"
                      maxLength={10}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    ईमेल आईडी <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    वार्ड नंबर (सपोटरा) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={wardNumber}
                    onChange={(e) => setWardNumber(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs bg-white"
                  >
                    {Array.from({ length: 25 }, (_, i) => i + 1).map((w) => (
                      <option key={w} value={w.toString()}>
                        वार्ड नं. {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    पासवर्ड सेट करें <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="न्यूनतम 6 अक्षर"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  मोहल्ला / निवास पता <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="उदा. मुख्य बाजार, निकट हनुमान मंदिर, सपोटरा"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-[#16864A] hover:bg-emerald-800 text-white font-bold shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? <span>खाता तैयार किया जा रहा है...</span> : <span>पंजीकरण पूर्ण करें (Create Account)</span>}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-center text-[10px] text-slate-500 font-hindi">
          🔒 आपका डेटा नगर पालिका सपोटरा के सुरक्षित सर्वर पर राजस्थान आईटी एक्ट अनुसार संरक्षित है।
        </div>
      </div>
    </div>
  );
};
