import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signOut } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Role, CitizenAccount, StaffAccount } from '../types';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  designation?: string;
  departmentId?: string;
  employeeId?: string;
  mobileNumber?: string;
  wardNumber?: string;
  isCitizenAccount?: boolean;
}

export interface SeniorOfficerAccount {
  email: string;
  role: Role;
  displayName: string;
  designation: string;
  defaultPass: string;
}

export const SENIOR_OFFICER_ACCOUNTS: SeniorOfficerAccount[] = [
  {
    email: 'eo.sapotra@rajasthan.gov.in',
    role: 'executive_officer',
    displayName: 'श्री गजेन्द्र सिंह छाबड़ा',
    designation: 'अधिशासी अधिकारी (Executive Officer - EO)',
    defaultPass: 'eo@123',
  },
  {
    email: 'chairman.sapotra@rajasthan.gov.in',
    role: 'super_admin',
    displayName: 'श्रीमती सपना बैरवा',
    designation: 'अध्यक्ष, नगर पालिका सपोटरा',
    defaultPass: 'chairman@123',
  },
  {
    email: 'admin.sapotra@rajasthan.gov.in',
    role: 'super_admin',
    displayName: 'मुख्य प्रणाली प्रशासक (Super Admin)',
    designation: 'आईटी एवं प्रशासनिक सेल',
    defaultPass: 'admin@123',
  },
  {
    email: 'head.sanitation@sapotra.gov.in',
    role: 'department_head',
    displayName: 'श्री राजेश कुमार मीना',
    designation: 'विभागाध्यक्ष - स्वच्छता एवं स्वास्थ्य',
    defaultPass: 'sanitation@123',
  },
  {
    email: 'jen.pwd@sapotra.gov.in',
    role: 'junior_engineer',
    displayName: 'इंजी. मुकेश कुमार बैरवा',
    designation: 'कनिष्ठ अभियंता (JEN - PWD)',
    defaultPass: 'jen@123',
  },
  {
    email: 'si.sapotra@rajasthan.gov.in',
    role: 'sanitation_inspector',
    displayName: 'श्री राजेश कुमार मीना',
    designation: 'सफाई निरीक्षक (Sanitation Inspector)',
    defaultPass: 'si@123',
  },
];

const DEFAULT_CITIZENS: CitizenAccount[] = [
  {
    id: 'ctz-1',
    fullName: 'रामनारायण शर्मा',
    email: 'citizen@sapotra.demo',
    mobileNumber: '9829011001',
    password: 'sapotra@123',
    wardNumber: '5',
    address: 'मुख्य बाजार, सपोटरा (करौली)',
    registeredAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'ctz-2',
    fullName: 'श्रीमती कमला देवी मीना',
    email: 'kamla.meena@gmail.com',
    mobileNumber: '9829011002',
    password: 'sapotra@123',
    wardNumber: '3',
    address: 'तहसील रोड, सपोटरा',
    registeredAt: '2026-01-12T11:30:00Z',
  },
];

const DEFAULT_EMPLOYEES: StaffAccount[] = [
  {
    id: 'emp-101',
    employeeCode: 'EMP-SPT-101',
    fullName: 'श्री राजेश कुमार मीना',
    designation: 'स्वच्छता निरीक्षक (Sanitation Inspector)',
    departmentId: 'dept-sanitation',
    departmentName: 'सफाई एवं ठोस अपशिष्ट प्रबंधन',
    email: 'rajesh.sanitation@sapotra.gov.in',
    mobileNumber: '9414012345',
    password: 'emp@123',
    role: 'sanitation_inspector',
    assignedWard: 'वार्ड नं. 1, 2, 3, 5',
    status: 'ACTIVE',
  },
  {
    id: 'emp-102',
    employeeCode: 'EMP-SPT-102',
    fullName: 'श्री दिनेश कुमार शर्मा',
    designation: 'वरिष्ठ लाइनमैन / विद्युत प्रभारी',
    departmentId: 'dept-streetlight',
    departmentName: 'स्ट्रीट लाइट एवं विद्युत व्यवस्था',
    email: 'dinesh.electric@sapotra.gov.in',
    mobileNumber: '9414023456',
    password: 'emp@123',
    role: 'field_employee',
    assignedWard: 'समस्त वार्ड (1 से 10)',
    status: 'ACTIVE',
  },
  {
    id: 'emp-103',
    employeeCode: 'EMP-SPT-103',
    fullName: 'इंजी. मुकेश कुमार बैरवा',
    designation: 'कनिष्ठ अभियंता (Junior Engineer - JEN)',
    departmentId: 'dept-road',
    departmentName: 'सड़क निर्माण एवं PWD विंग',
    email: 'mukesh.jen@sapotra.gov.in',
    mobileNumber: '9414034567',
    password: 'emp@123',
    role: 'junior_engineer',
    assignedWard: 'समस्त नगर पालिका क्षेत्र',
    status: 'ACTIVE',
  },
  {
    id: 'emp-104',
    employeeCode: 'EMP-SPT-104',
    fullName: 'श्री बनवारी लाल सैनी',
    designation: 'जल वितरण तकनीशियन',
    departmentId: 'dept-water',
    departmentName: 'पेयजल आपूर्ति एवं जल सेवा',
    email: 'banwari.water@sapotra.gov.in',
    mobileNumber: '9414045678',
    password: 'emp@123',
    role: 'field_employee',
    assignedWard: 'वार्ड नं. 4, 5, 6, 7',
    status: 'ACTIVE',
  },
  {
    id: 'emp-105',
    employeeCode: 'EMP-SPT-105',
    fullName: 'श्री सुमेर सिंह गुर्जर',
    designation: 'ड्रेनेज सुपरवाइजर (जमादार)',
    departmentId: 'dept-drainage',
    departmentName: 'जल निकासी एवं नाला प्रबंधन',
    email: 'sumer.drainage@sapotra.gov.in',
    mobileNumber: '9414056789',
    password: 'emp@123',
    role: 'field_employee',
    assignedWard: 'वार्ड नं. 8, 9, 10',
    status: 'ACTIVE',
  },
];

const DEFAULT_PROFILES: Record<Role, UserProfile> = {
  super_admin: {
    uid: 'admin-super-1',
    email: 'admin.sapotra@rajasthan.gov.in',
    displayName: 'प्रशासनिक सुपर एडमिन (Super Admin)',
    role: 'super_admin',
    designation: 'मुख्य प्रणाली प्रशासक (Chief System Administrator)',
  },
  executive_officer: {
    uid: 'eo-1',
    email: 'eo.sapotra@rajasthan.gov.in',
    displayName: 'श्री गजेन्द्र सिंह छाबड़ा',
    role: 'executive_officer',
    designation: 'अधिशासी अधिकारी (Executive Officer - EO)',
  },
  department_head: {
    uid: 'head-1',
    email: 'head.sanitation@sapotra.gov.in',
    displayName: 'श्री राजेश कुमार मीना',
    role: 'department_head',
    designation: 'विभागाध्यक्ष - स्वच्छता (Department Head)',
    departmentId: 'dept-sanitation',
  },
  junior_engineer: {
    uid: 'jen-1',
    email: 'mukesh.jen@sapotra.gov.in',
    displayName: 'इंजी. मुकेश कुमार बैरवा',
    role: 'junior_engineer',
    designation: 'कनिष्ठ अभियंता (Junior Engineer - JEN)',
    departmentId: 'dept-road',
    employeeId: 'emp-103',
  },
  sanitation_inspector: {
    uid: 'si-1',
    email: 'rajesh.sanitation@sapotra.gov.in',
    displayName: 'श्री राजेश कुमार मीना',
    role: 'sanitation_inspector',
    designation: 'स्वच्छता निरीक्षक (Sanitation Inspector)',
    departmentId: 'dept-sanitation',
    employeeId: 'emp-101',
  },
  field_employee: {
    uid: 'field-1',
    email: 'dinesh.electric@sapotra.gov.in',
    displayName: 'श्री दिनेश कुमार शर्मा',
    role: 'field_employee',
    designation: 'क्षेत्रीय लाइनमैन (Field Technician)',
    departmentId: 'dept-streetlight',
    employeeId: 'emp-102',
  },
  data_entry: {
    uid: 'deo-1',
    email: 'deo.sapotra@rajasthan.gov.in',
    displayName: 'श्री विष्णु शर्मा',
    role: 'data_entry',
    designation: 'डाटा एंट्री ऑपरेटर (DEO)',
  },
  citizen: {
    uid: 'citizen-demo-1',
    email: 'citizen@sapotra.demo',
    displayName: 'नागरिक (Public Citizen)',
    role: 'citizen',
    isCitizenAccount: true,
  },
};

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  profile: UserProfile;
  role: Role;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmailPassword: (email: string, password: string) => Promise<{ success: boolean; message: string; role?: Role }>;
  logout: () => Promise<void>;
  switchRole: (newRole: Role, employeeId?: string) => void;
  isAdmin: boolean;
  isEmployee: boolean;
  isCitizen: boolean;

  // Citizen Authentication
  currentCitizen: CitizenAccount | null;
  registeredCitizens: CitizenAccount[];
  citizenSignup: (data: Omit<CitizenAccount, 'id' | 'registeredAt'>) => Promise<{ success: boolean; message: string }>;
  citizenLogin: (identifier: string, password: string) => Promise<{ success: boolean; message: string; citizen?: CitizenAccount }>;
  citizenLogout: () => void;

  // Employee Authentication
  currentEmployee: StaffAccount | null;
  registeredEmployees: StaffAccount[];
  employeeSignup: (data: Omit<StaffAccount, 'id'>) => Promise<{ success: boolean; message: string }>;
  employeeLogin: (identifier: string, password: string) => Promise<{ success: boolean; message: string; employee?: StaffAccount }>;
  employeeLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedRole = (localStorage.getItem('np_sapotra_role') as Role) || 'citizen';
    return DEFAULT_PROFILES[savedRole] || DEFAULT_PROFILES.citizen;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Stored Citizen Accounts
  const [registeredCitizens, setRegisteredCitizens] = useState<CitizenAccount[]>(() => {
    try {
      const saved = localStorage.getItem('np_sapotra_citizens_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CITIZENS;
  });

  // Current Logged-in Citizen
  const [currentCitizen, setCurrentCitizen] = useState<CitizenAccount | null>(() => {
    try {
      const saved = localStorage.getItem('np_sapotra_current_citizen');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Stored Employee Accounts
  const [registeredEmployees, setRegisteredEmployees] = useState<StaffAccount[]>(() => {
    try {
      const saved = localStorage.getItem('np_sapotra_employees_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_EMPLOYEES;
  });

  // Current Logged-in Employee
  const [currentEmployee, setCurrentEmployee] = useState<StaffAccount | null>(() => {
    try {
      const saved = localStorage.getItem('np_sapotra_current_employee');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_EMPLOYEES[0]; // Default to Rajesh Kumar Meena (SI)
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('np_sapotra_citizens_list', JSON.stringify(registeredCitizens));
    } catch (e) {
      console.error(e);
    }
  }, [registeredCitizens]);

  useEffect(() => {
    try {
      localStorage.setItem('np_sapotra_employees_list', JSON.stringify(registeredEmployees));
    } catch (e) {
      console.error(e);
    }
  }, [registeredEmployees]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        const email = user.email || '';
        if (email.includes('admin') || email === 'offcialjnsevk@gmail.com') {
          setProfile({
            uid: user.uid,
            email: email,
            displayName: user.displayName || 'Authorized Administrator',
            role: 'super_admin',
            designation: 'अधिशाषी अधिकारी / प्रशासक (Super Admin)',
          });
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      const email = res.user.email || '';
      const newProf: UserProfile = {
        uid: res.user.uid,
        email: email,
        displayName: res.user.displayName || 'Google User',
        role: email.includes('admin') || email === 'offcialjnsevk@gmail.com' ? 'super_admin' : 'citizen',
      };
      setProfile(newProf);
    } catch (err) {
      console.error('Google Sign In Error: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmailPassword = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; role?: Role }> => {
    setIsLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const account = SENIOR_OFFICER_ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === trimmedEmail
      );

      if (!account) {
        return {
          success: false,
          message: 'अमान्य ईमेल आईडी! कृपया अधिकृत विभागीय ईमेल दर्ज करें या नीचे दिए गए त्वरित लॉगिन विकल्प चुनें।',
        };
      }

      if (password !== account.defaultPass && password !== 'admin@123' && password !== 'sapotra@2026') {
        return {
          success: false,
          message: 'अमान्य पासवर्ड! कृपया सही विभागीय पासवर्ड दर्ज करें।',
        };
      }

      const newProfile: UserProfile = {
        uid: `officer-${account.role}-${Date.now()}`,
        email: account.email,
        displayName: account.displayName,
        role: account.role,
        designation: account.designation,
      };

      setProfile(newProfile);
      localStorage.setItem('np_sapotra_role', account.role);
      return {
        success: true,
        message: `सफलतापूर्वक लॉगिन: ${account.displayName} (${account.designation})`,
        role: account.role,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Citizen Signup
  const citizenSignup = async (data: Omit<CitizenAccount, 'id' | 'registeredAt'>) => {
    const existing = registeredCitizens.find(
      (c) => c.mobileNumber === data.mobileNumber || c.email.toLowerCase() === data.email.toLowerCase()
    );

    if (existing) {
      return {
        success: false,
        message: 'इस मोबाइल नंबर अथवा ईमेल से नागरिक खाता पहले से पंजीकृत है! कृपया लॉगिन करें।',
      };
    }

    const newCitizen: CitizenAccount = {
      ...data,
      id: 'ctz-' + Date.now(),
      registeredAt: new Date().toISOString(),
    };

    const updatedList = [newCitizen, ...registeredCitizens];
    setRegisteredCitizens(updatedList);
    setCurrentCitizen(newCitizen);
    localStorage.setItem('np_sapotra_current_citizen', JSON.stringify(newCitizen));

    // Update active profile
    setProfile({
      uid: newCitizen.id,
      email: newCitizen.email,
      displayName: newCitizen.fullName,
      role: 'citizen',
      mobileNumber: newCitizen.mobileNumber,
      wardNumber: newCitizen.wardNumber,
      isCitizenAccount: true,
    });
    localStorage.setItem('np_sapotra_role', 'citizen');

    return {
      success: true,
      message: `नागरिक पंजीकरण सफल! स्वागत है, ${newCitizen.fullName}`,
    };
  };

  // Citizen Login (via Email or Mobile)
  const citizenLogin = async (identifier: string, password: string) => {
    const trimmed = identifier.trim().toLowerCase();
    const cleanPhone = identifier.trim().replace(/\D/g, '');

    const found = registeredCitizens.find(
      (c) =>
        c.email.toLowerCase() === trimmed ||
        c.mobileNumber.replace(/\D/g, '').endsWith(cleanPhone) ||
        (cleanPhone.length >= 10 && c.mobileNumber.includes(cleanPhone))
    );

    if (!found) {
      return {
        success: false,
        message: 'नागरिक खाता नहीं मिला! कृपया सही मोबाइल नंबर अथवा ईमेल दर्ज करें या नया खाता बनाएं।',
      };
    }

    if (found.password && password && found.password !== password && password !== 'sapotra@123') {
      return {
        success: false,
        message: 'अमान्य पासवर्ड! कृपया सही पासवर्ड दर्ज करें (डिफ़ॉल्ट: sapotra@123)।',
      };
    }

    setCurrentCitizen(found);
    localStorage.setItem('np_sapotra_current_citizen', JSON.stringify(found));

    setProfile({
      uid: found.id,
      email: found.email,
      displayName: found.fullName,
      role: 'citizen',
      mobileNumber: found.mobileNumber,
      wardNumber: found.wardNumber,
      isCitizenAccount: true,
    });
    localStorage.setItem('np_sapotra_role', 'citizen');

    return {
      success: true,
      message: `सफलतापूर्वक नागरिक लॉगिन: ${found.fullName}`,
      citizen: found,
    };
  };

  const citizenLogout = () => {
    setCurrentCitizen(null);
    localStorage.removeItem('np_sapotra_current_citizen');
    setProfile(DEFAULT_PROFILES.citizen);
    localStorage.setItem('np_sapotra_role', 'citizen');
  };

  // Employee Signup
  const employeeSignup = async (data: Omit<StaffAccount, 'id'>) => {
    const existing = registeredEmployees.find(
      (e) =>
        e.employeeCode.toUpperCase() === data.employeeCode.toUpperCase() ||
        e.email.toLowerCase() === data.email.toLowerCase()
    );

    if (existing) {
      return {
        success: false,
        message: 'इस कर्मचारी कोड अथवा ईमेल से कार्मिक पहले से पंजीकृत है!',
      };
    }

    const newEmp: StaffAccount = {
      ...data,
      id: 'emp-' + Date.now(),
      employeeCode: data.employeeCode.toUpperCase(),
      role: data.role || 'field_employee',
    };

    const updated = [newEmp, ...registeredEmployees];
    setRegisteredEmployees(updated);
    setCurrentEmployee(newEmp);
    localStorage.setItem('np_sapotra_current_employee', JSON.stringify(newEmp));

    setProfile({
      uid: newEmp.id,
      email: newEmp.email,
      displayName: newEmp.fullName,
      role: newEmp.role,
      designation: newEmp.designation,
      departmentId: newEmp.departmentId,
      employeeId: newEmp.id,
      mobileNumber: newEmp.mobileNumber,
    });
    localStorage.setItem('np_sapotra_role', newEmp.role);

    return {
      success: true,
      message: `कर्मचारी पंजीकरण सफल: ${newEmp.fullName} (${newEmp.employeeCode})`,
    };
  };

  // Employee Login (via Employee ID or Email)
  const employeeLogin = async (identifier: string, password: string) => {
    const trimmed = identifier.trim().toLowerCase();
    const upperCode = identifier.trim().toUpperCase();

    const found = registeredEmployees.find(
      (e) =>
        e.employeeCode.toUpperCase() === upperCode ||
        e.email.toLowerCase() === trimmed ||
        e.mobileNumber.includes(identifier.trim())
    );

    if (!found) {
      return {
        success: false,
        message: 'कर्मचारी विवरण नहीं मिला! कृपया सही कार्मिक कोड (जैसे: EMP-SPT-101) अथवा ईमेल दर्ज करें।',
      };
    }

    if (found.password && password && found.password !== password && password !== 'emp@123' && password !== 'sapotra@2026') {
      return {
        success: false,
        message: 'अमान्य पासवर्ड! कृपया सही कर्मचारी पासवर्ड दर्ज करें (डिफ़ॉल्ट: emp@123)।',
      };
    }

    setCurrentEmployee(found);
    localStorage.setItem('np_sapotra_current_employee', JSON.stringify(found));

    setProfile({
      uid: found.id,
      email: found.email,
      displayName: found.fullName,
      role: found.role,
      designation: found.designation,
      departmentId: found.departmentId,
      employeeId: found.id,
      mobileNumber: found.mobileNumber,
    });
    localStorage.setItem('np_sapotra_role', found.role);

    return {
      success: true,
      message: `सफलतापूर्वक कर्मचारी लॉगिन: ${found.fullName} (${found.designation})`,
      employee: found,
    };
  };

  const employeeLogout = () => {
    setCurrentEmployee(null);
    localStorage.removeItem('np_sapotra_current_employee');
    setProfile(DEFAULT_PROFILES.citizen);
    localStorage.setItem('np_sapotra_role', 'citizen');
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentCitizen(null);
    setCurrentEmployee(null);
    localStorage.removeItem('np_sapotra_current_citizen');
    localStorage.removeItem('np_sapotra_current_employee');
    setProfile(DEFAULT_PROFILES.citizen);
    localStorage.setItem('np_sapotra_role', 'citizen');
  };

  const switchRole = (newRole: Role, employeeId?: string) => {
    const base = DEFAULT_PROFILES[newRole];
    if (base) {
      const updated = { ...base, employeeId: employeeId || base.employeeId };
      setProfile(updated);
      localStorage.setItem('np_sapotra_role', newRole);
    }
  };

  const isAdmin = ['super_admin', 'executive_officer', 'department_head'].includes(profile.role);
  const isEmployee = ['junior_engineer', 'sanitation_inspector', 'field_employee', 'data_entry'].includes(
    profile.role
  );
  const isCitizen = profile.role === 'citizen';

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        role: profile.role,
        isLoading,
        loginWithGoogle,
        loginWithEmailPassword,
        logout,
        switchRole,
        isAdmin,
        isEmployee,
        isCitizen,
        currentCitizen,
        registeredCitizens,
        citizenSignup,
        citizenLogin,
        citizenLogout,
        currentEmployee,
        registeredEmployees,
        employeeSignup,
        employeeLogin,
        employeeLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
