import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMunicipalData } from '../../context/MunicipalDataContext';
import { X, UserCheck, Shield, Lock, Mail, Phone, Building, Briefcase, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Role } from '../../types';

interface EmployeeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'LOGIN' | 'SIGNUP';
  onSuccess?: () => void;
}

export const EmployeeAuthModal: React.FC<EmployeeAuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'LOGIN',
  onSuccess,
}) => {
  const { employeeLogin, employeeSignup, registeredEmployees } = useAuth();
  const { departments } = useMunicipalData();
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(defaultMode);

  // Login form state
  const [empIdentifier, setEmpIdentifier] = useState('');
  const [empPassword, setEmpPassword] = useState('');

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'dept-sanitation');
  const [designation, setDesignation] = useState('स्वच्छता सुपरवाइजर');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [assignedWard, setAssignedWard] = useState('वार्ड नं. 1 से 5');
  const [selectedRole, setSelectedRole] = useState<Role>('field_employee');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!empIdentifier.trim() || !empPassword.trim()) {
      setErrorMsg('कृपया कर्मचारी कोड/ईमेल एवं पासवर्ड दोनों दर्ज करें।');
      return;
    }

    setIsLoading(true);
    try {
      const res = await employeeLogin(empIdentifier, empPassword);
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

    if (!fullName.trim() || !employeeCode.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('कृपया सभी आवश्यक विवरण दर्ज करें।');
      return;
    }

    const dept = departments.find((d) => d.id === departmentId);

    setIsLoading(true);
    try {
      const res = await employeeSignup({
        fullName: fullName.trim(),
        employeeCode: employeeCode.trim().toUpperCase(),
        departmentId: departmentId,
        departmentName: dept?.nameHi || dept?.name || 'नगर पालिका विभाग',
        designation: designation.trim(),
        email: email.trim(),
        mobileNumber: mobileNumber.trim(),
        password: password.trim(),
        assignedWard: assignedWard,
        role: selectedRole,
        status: 'ACTIVE',
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

  const handleQuickEmployee = async (code: string, pass: string = 'emp@123') => {
    setEmpIdentifier(code);
    setEmpPassword(pass);
    setIsLoading(true);
    const res = await employeeLogin(code, pass);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#123568] via-[#174EA6] to-[#0f2d59] p-5 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 text-xl font-black">
              👷
            </div>
            <div>
              <span className="text-[10px] tracking-widest text-amber-300 font-bold uppercase">
                नगर पालिका सपोटरा - कार्मिक विंग
              </span>
              <h2 className="text-lg font-black tracking-tight">कर्मचारी सेवा एवं हाजिरी पोर्टल (Staff Portal)</h2>
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
            कर्मचारी लॉगिन (Staff Login)
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
            नया कर्मचारी पंजीकरण (Staff Signup)
          </button>
        </div>

        {/* Body */}
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

          {/* Quick Staff Login Grid */}
          <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#123568] flex items-center space-x-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>त्वरित कर्मचारी चयन (Quick Staff Demo Login):</span>
              </span>
              <span className="text-[10px] text-blue-700 font-mono">पासवर्ड: emp@123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {registeredEmployees.slice(0, 3).map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => handleQuickEmployee(emp.employeeCode)}
                  className="p-2 text-left rounded-xl bg-white hover:bg-blue-100/60 border border-blue-200 transition-all shadow-2xs group"
                >
                  <p className="font-bold text-slate-900 truncate group-hover:text-[#174EA6] text-[11px]">
                    {emp.fullName.replace('श्री ', '').replace('इंजी. ', '')}
                  </p>
                  <p className="text-[9px] text-slate-500 truncate">{emp.designation.split('(')[0]}</p>
                  <span className="inline-block mt-0.5 px-1 py-0.2 rounded bg-blue-100 text-[#174EA6] font-mono text-[8px] font-bold">
                    {emp.employeeCode}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form: LOGIN */}
          {mode === 'LOGIN' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  कार्मिक कोड (Employee Code) या विभागीय ईमेल <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={empIdentifier}
                    onChange={(e) => setEmpIdentifier(e.target.value)}
                    placeholder="उदा. EMP-SPT-101 या rajesh.sanitation@sapotra.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  कर्मचारी पासवर्ड <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={empPassword}
                    onChange={(e) => setEmpPassword(e.target.value)}
                    placeholder="पासवर्ड दर्ज करें (डिफ़ॉल्ट: emp@123)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>समस्या आने पर EO सेल से संपर्क करें</span>
                <button
                  type="button"
                  onClick={() => setMode('SIGNUP')}
                  className="text-[#174EA6] font-bold hover:underline"
                >
                  नया कार्मिक जोड़ें
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white font-bold shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? <span>सत्यापित किया जा रहा है...</span> : <span>कर्मचारी डैशबोर्ड में प्रवेश करें</span>}
              </button>
            </form>
          ) : (
            /* Form: SIGNUP */
            <form onSubmit={handleSignup} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    कर्मचारी का पूरा नाम <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="उदा. श्री कैलाश चंद मीना"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    कार्मिक कोड (Employee ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    placeholder="उदा. EMP-SPT-106"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs font-mono uppercase"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    विभागीय शाखा <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameHi || d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    पदनाम (Designation) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="उदा. फील्ड तकनीशियन / जमादार"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    विभागीय ईमेल <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="emp@sapotra.gov.in"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                      required
                    />
                  </div>
                </div>

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
                      placeholder="94140XXXXX"
                      maxLength={10}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    आवंटित कार्यक्षेत्र (Ward/Area)
                  </label>
                  <input
                    type="text"
                    value={assignedWard}
                    onChange={(e) => setAssignedWard(e.target.value)}
                    placeholder="उदा. वार्ड नं. 1 से 5"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    लॉगिन पासवर्ड सेट करें <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="न्यूनतम 6 अंक/अक्षर"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#174EA6] text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-[#174EA6] hover:bg-[#123568] text-white font-bold shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? <span>पंजीकृत किया जा रहा है...</span> : <span>कर्मचारी खाता बनाएं एवं हाजिरी शुरू करें</span>}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-center text-[10px] text-slate-500 font-hindi">
          ⚖️ अनाधिकृत कार्मिक पंजीकरण कानूनी अपराध है। सभी गतिविधियां IP एवं GPS ट्रैकिंग के अंतर्गत दर्ज हैं।
        </div>
      </div>
    </div>
  );
};
