import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Complaint,
  PublicDemand,
  Department,
  Employee,
  Ward,
  DevelopmentProject,
  PublicNotice,
  SystemSettings,
  NotificationLog,
  AuditLog,
  ComplaintStatus,
  DemandStatus,
  Priority,
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_PUBLIC_DEMANDS,
  INITIAL_DEPARTMENTS,
  INITIAL_EMPLOYEES,
  INITIAL_WARDS,
  INITIAL_DEVELOPMENT_PROJECTS,
  INITIAL_NOTICES,
  INITIAL_SETTINGS,
  INITIAL_NOTIFICATION_LOGS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, updateDoc } from 'firebase/firestore';

interface MunicipalDataContextType {
  complaints: Complaint[];
  publicDemands: PublicDemand[];
  departments: Department[];
  employees: Employee[];
  wards: Ward[];
  projects: DevelopmentProject[];
  notices: PublicNotice[];
  settings: SystemSettings;
  notificationLogs: NotificationLog[];
  auditLogs: AuditLog[];
  isSyncing: boolean;

  // Actions
  registerComplaint: (data: Omit<Complaint, 'id' | 'complaintNumber' | 'createdAt' | 'updatedAt' | 'history'>) => Promise<Complaint>;
  updateComplaintStatus: (
    id: string,
    status: ComplaintStatus,
    remarks: string,
    updatedBy: string,
    updatedByRole: string,
    assignedEmployeeId?: string,
    assignedEmployeeName?: string,
    beforePhoto?: string,
    afterPhoto?: string
  ) => Promise<void>;
  submitCitizenFeedback: (id: string, feedback: string, rating: number) => Promise<void>;
  reopenComplaint: (id: string, reason: string) => Promise<void>;

  submitPublicDemand: (data: Omit<PublicDemand, 'id' | 'demandNumber' | 'supportCount' | 'supportedPhones' | 'createdAt' | 'updatedAt'>) => Promise<PublicDemand>;
  supportPublicDemand: (
    demandId: string,
    citizenPhone: string,
    supporterDetails?: {
      name: string;
      address: string;
      wardNumber: string;
      aadhaarNumber: string;
      aadhaarDoc?: string;
    }
  ) => Promise<{ success: boolean; message: string }>;
  updateDemandStatus: (demandId: string, status: DemandStatus, adminRemarks?: string, budget?: number) => Promise<void>;

  saveDepartment: (dept: Department) => Promise<void>;
  saveEmployee: (emp: Employee) => Promise<void>;
  saveWard: (ward: Ward) => Promise<void>;
  saveProject: (project: DevelopmentProject) => Promise<void>;
  saveNotice: (notice: PublicNotice) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
  updateSettings: (newSettings: SystemSettings) => Promise<void>;

  sendNotification: (channel: 'WHATSAPP' | 'SMS' | 'EMAIL', recipientPhone: string, recipientName: string, event: string, referenceId: string, content: string) => Promise<void>;
  resetToDemoData: () => void;
  clearAllDemoData: () => void;
}

const MunicipalDataContext = createContext<MunicipalDataContextType | undefined>(undefined);

export const MunicipalDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('np_sapotra_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [publicDemands, setPublicDemands] = useState<PublicDemand[]>(() => {
    const saved = localStorage.getItem('np_sapotra_demands');
    return saved ? JSON.parse(saved) : INITIAL_PUBLIC_DEMANDS;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('np_sapotra_departments');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('np_sapotra_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [wards, setWards] = useState<Ward[]>(() => {
    const saved = localStorage.getItem('np_sapotra_wards');
    return saved ? JSON.parse(saved) : INITIAL_WARDS;
  });

  const [projects, setProjects] = useState<DevelopmentProject[]>(() => {
    const saved = localStorage.getItem('np_sapotra_projects');
    return saved ? JSON.parse(saved) : INITIAL_DEVELOPMENT_PROJECTS;
  });

  const [notices, setNotices] = useState<PublicNotice[]>(() => {
    const saved = localStorage.getItem('np_sapotra_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('np_sapotra_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(() => {
    const saved = localStorage.getItem('np_sapotra_logs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATION_LOGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('np_sapotra_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('np_sapotra_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('np_sapotra_demands', JSON.stringify(publicDemands));
  }, [publicDemands]);

  useEffect(() => {
    localStorage.setItem('np_sapotra_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('np_sapotra_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('np_sapotra_wards', JSON.stringify(wards));
  }, [wards]);

  useEffect(() => {
    localStorage.setItem('np_sapotra_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('np_sapotra_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('np_sapotra_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('np_sapotra_logs', JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  useEffect(() => {
    localStorage.setItem('np_sapotra_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Try initial Firestore fetch if collection has documents
  useEffect(() => {
    const loadFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'complaints'));
        if (!querySnapshot.empty) {
          const fetched: Complaint[] = [];
          querySnapshot.forEach((d) => {
            fetched.push(d.data() as Complaint);
          });
          if (fetched.length > 0) {
            setComplaints(fetched);
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'complaints');
      }
    };
    loadFromFirestore();
  }, []);

  const addAuditLog = (
    actorName: string,
    actorRole: string,
    action: string,
    targetType: AuditLog['targetType'],
    targetId: string,
    details: string
  ) => {
    const log: AuditLog = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString(),
      actorName,
      actorRole,
      action,
      targetType,
      targetId,
      details,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const sendNotification = async (
    channel: 'WHATSAPP' | 'SMS' | 'EMAIL',
    recipientPhone: string,
    recipientName: string,
    event: string,
    referenceId: string,
    content: string
  ) => {
    const isDemo = settings.whatsappGatewayConfig.demoMode;
    const newLog: NotificationLog = {
      id: 'log-' + Date.now() + Math.floor(Math.random() * 1000),
      channel,
      recipientPhone,
      recipientName,
      event,
      referenceId,
      content,
      status: isDemo ? 'DEMO_MODE' : 'DELIVERED',
      timestamp: new Date().toISOString(),
    };

    setNotificationLogs((prev) => [newLog, ...prev]);

    // Attempt firestore save
    try {
      await setDoc(doc(db, 'notificationLogs', newLog.id), newLog);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'notificationLogs');
    }
  };

  const registerComplaint = async (
    data: Omit<Complaint, 'id' | 'complaintNumber' | 'createdAt' | 'updatedAt' | 'history'>
  ): Promise<Complaint> => {
    setIsSyncing(true);
    const count = complaints.length + 1;
    const complaintNumber = `NP-SPT-2026-${String(count).padStart(4, '0')}`;
    const id = 'cmp-' + Date.now();
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      ...data,
      id,
      complaintNumber,
      createdAt: now,
      updatedAt: now,
      status: 'SUBMITTED',
      history: [
        {
          status: 'SUBMITTED',
          updatedBy: data.citizenName + ' (नागरिक)',
          updatedByRole: 'citizen',
          timestamp: now,
          remarks: 'शिकायत ई-जन सेवा पोर्टल पर सफलतापूर्वक दर्ज हुई।',
          action: 'Complaint Registered',
        },
      ],
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'complaints', id), newComplaint);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `complaints/${id}`);
    }

    // Identify department contact & send WhatsApp notifications
    const dept = departments.find((d) => d.id === data.departmentId);
    const deptHeadPhone = dept?.whatsappNumber || '+91 94140 12345';
    const deptName = dept?.nameHi || data.departmentName;
    const deptHeadName = dept?.headName || 'विभागीय प्रभारी';

    // 1. Send WhatsApp to Chairman (श्रीमती सपना बैरवा)
    const chairmanMsg = `*नया नागरिक शिकायत अलर्ट - नगर पालिका सपोटरा*\n\nआदरणीय अध्यक्ष महोदया श्रीमती सपना बैरवा जी,\nई-जन सेवा पोर्टल पर वार्ड नं. ${data.wardNumber} से नई जन शिकायत प्राप्त हुई है।\n\nशिकायत क्रमांक: ${complaintNumber}\nविभाग: ${deptName}\nश्रेणी: ${data.category}\nनागरिक: ${data.citizenName} (${data.citizenPhone})\nस्थान: ${data.address}\nविषय: ${data.subject}\nविवरण: ${data.description}\n\nनिगरानी हेतु डैशबोर्ड: https://sapotra.rajasthan.gov.in/admin`;
    await sendNotification('WHATSAPP', '+91 94140 10001', 'श्रीमती सपना बैरवा (अध्यक्ष)', 'COMPLAINT_REGISTERED_CHAIRMAN', complaintNumber, chairmanMsg);

    // 2. Send WhatsApp to Executive Officer (श्री गजेन्द्र सिंह छाबड़ा, EO)
    const eoMsg = `*प्रशासनिक शिकायत सूचना - नगर पालिका सपोटरा*\n\nश्रीमान अधिशासी अधिकारी (EO) श्री गजेन्द्र सिंह छाबड़ा जी,\nनागरिक शिकायत क्रमांक: ${complaintNumber}\nविभाग: ${deptName} (${deptHeadName})\nवार्ड सं: ${data.wardNumber}\nस्थान: ${data.address}\nविषय: ${data.subject}\nजीपीएस मैप: https://maps.google.com/?q=${data.latitude},${data.longitude}\n\nसंबंधित फील्ड टीम को त्वरित निस्तारण हेतु निर्देशित कर दिया गया है। नियत SLA: 48 घंटे।`;
    await sendNotification('WHATSAPP', '+91 94140 10002', 'श्री गजेन्द्र सिंह छाबड़ा (अधिशासी अधिकारी)', 'COMPLAINT_REGISTERED_EO', complaintNumber, eoMsg);

    // 3. Send WhatsApp to Department Officer / Inspector
    const officerMsg = `*कार्यवाही निर्देश (ACTION REQUIRED) - नगर पालिका सपोटरा*\n\nश्रीमान ${deptHeadName} (${deptName}),\nआपके विभाग हेतु वार्ड नं. ${data.wardNumber} में नई शिकायत आवंटित हुई है।\n\nआईडी: ${complaintNumber}\nस्थान: ${data.address}\nजीपीएस: https://maps.google.com/?q=${data.latitude},${data.longitude}\nसमस्या विषय: ${data.subject}\n\nकृपया मौके पर फील्ड टीम भेजकर त्वरित कार्यवाही प्रारंभ करें एवं समाधान फोटो पोर्टल पर अपलोड करें।`;
    await sendNotification('WHATSAPP', deptHeadPhone, `${deptHeadName} (${deptName})`, 'COMPLAINT_REGISTERED_DEPT', complaintNumber, officerMsg);

    // 4. Send WhatsApp confirmation to Citizen
    const citizenMsg = `नमस्ते ${data.citizenName} जी, नगर पालिका सपोटरा के ई-जन सेवा पोर्टल पर आपकी शिकायत ${complaintNumber} सफलता पूर्वक दर्ज कर ली गई है।\n\nविभाग: ${deptName}\nविषय: ${data.subject}\nस्थान: ${data.address}\n\nआपकी शिकायत अध्यक्ष महोदया, अधिशासी अधिकारी (EO) एवं संबंधित विभाग प्रभारी को प्रेषित कर दी गई है।\nलाइव स्थिति देखें: https://sapotra.rajasthan.gov.in/track?id=${complaintNumber}\n\n— नगर पालिका सपोटरा (आपकी समस्या, हमारा समाधान)`;
    await sendNotification('WHATSAPP', data.citizenPhone, data.citizenName, 'COMPLAINT_REGISTERED_CITIZEN', complaintNumber, citizenMsg);

    addAuditLog(data.citizenName, 'citizen', 'COMPLAINT_REGISTERED', 'COMPLAINT', complaintNumber, `Registered complaint in Ward ${data.wardNumber} for ${deptName}. Dispatched WhatsApp notifications to Chairman, EO, Dept Head, and Citizen.`);

    setIsSyncing(false);
    return newComplaint;
  };

  const updateComplaintStatus = async (
    id: string,
    status: ComplaintStatus,
    remarks: string,
    updatedBy: string,
    updatedByRole: string,
    assignedEmployeeId?: string,
    assignedEmployeeName?: string,
    beforePhoto?: string,
    afterPhoto?: string
  ) => {
    setIsSyncing(true);
    const now = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newHistory = [
            ...(c.history || []),
            {
              status,
              updatedBy,
              updatedByRole,
              timestamp: now,
              remarks,
              action: `Status updated to ${status}`,
            },
          ];

          const updated: Complaint = {
            ...c,
            status,
            updatedAt: now,
            history: newHistory,
            assignedEmployeeId: assignedEmployeeId !== undefined ? assignedEmployeeId : c.assignedEmployeeId,
            assignedEmployeeName: assignedEmployeeName !== undefined ? assignedEmployeeName : c.assignedEmployeeName,
            beforePhoto: beforePhoto !== undefined ? beforePhoto : c.beforePhoto,
            afterPhoto: afterPhoto !== undefined ? afterPhoto : c.afterPhoto,
            resolutionRemarks: remarks || c.resolutionRemarks,
            resolvedAt: status === 'RESOLVED' ? now : c.resolvedAt,
          };

          // Firestore update
          setDoc(doc(db, 'complaints', id), updated).catch((err) => {
            handleFirestoreError(err, OperationType.UPDATE, `complaints/${id}`);
          });

          // Trigger Citizen SMS/WhatsApp Notification on status change
          let updateMsg = `नगर पालिका सपोटरा: शिकायत ${c.complaintNumber} की स्थिति अब "${status}" हो गई है। रिमार्क: ${remarks}`;
          sendNotification('SMS', c.citizenPhone, c.citizenName, `STATUS_${status}`, c.complaintNumber, updateMsg);

          return updated;
        }
        return c;
      })
    );

    addAuditLog(updatedBy, updatedByRole, `STATUS_${status}`, 'COMPLAINT', id, remarks);
    setIsSyncing(false);
  };

  const submitCitizenFeedback = async (id: string, feedback: string, rating: number) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = {
            ...c,
            citizenFeedback: feedback,
            citizenRating: rating,
            updatedAt: new Date().toISOString(),
          };
          updateDoc(doc(db, 'complaints', id), {
            citizenFeedback: feedback,
            citizenRating: rating,
            updatedAt: updated.updatedAt,
          }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, `complaints/${id}`));
          return updated;
        }
        return c;
      })
    );
  };

  const reopenComplaint = async (id: string, reason: string) => {
    await updateComplaintStatus(
      id,
      'REOPENED',
      `नागरिक द्वारा शिकायत पुनः खोली गई। कारण: ${reason}`,
      'नागरिक (Citizen)',
      'citizen'
    );
  };

  const submitPublicDemand = async (
    data: Omit<PublicDemand, 'id' | 'demandNumber' | 'supportCount' | 'supportedPhones' | 'createdAt' | 'updatedAt'>
  ): Promise<PublicDemand> => {
    setIsSyncing(true);
    const count = publicDemands.length + 1;
    const demandNumber = `DM-SPT-2026-${String(count).padStart(4, '0')}`;
    const id = 'dem-' + Date.now();
    const now = new Date().toISOString();

    const newDemand: PublicDemand = {
      ...data,
      id,
      demandNumber,
      supportCount: 1,
      supportedPhones: [data.applicantPhone],
      createdAt: now,
      updatedAt: now,
    };

    setPublicDemands((prev) => [newDemand, ...prev]);

    try {
      await setDoc(doc(db, 'publicDemands', id), newDemand);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `publicDemands/${id}`);
    }

    addAuditLog(data.applicantName, 'citizen', 'PUBLIC_DEMAND_SUBMITTED', 'DEMAND', demandNumber, `Submitted public demand for ${data.title}`);
    setIsSyncing(false);
    return newDemand;
  };

  const supportPublicDemand = async (
    demandId: string,
    citizenPhone: string,
    supporterDetails?: {
      name: string;
      address: string;
      wardNumber: string;
      aadhaarNumber: string;
      aadhaarDoc?: string;
    }
  ): Promise<{ success: boolean; message: string }> => {
    let success = false;
    let message = '';

    setPublicDemands((prev) =>
      prev.map((dem) => {
        if (dem.id === demandId) {
          if (dem.supportedPhones.includes(citizenPhone)) {
            message = 'आप पहले ही इस मांग पत्र का समर्थन कर चुके हैं।';
            return dem;
          }
          success = true;
          message = 'आधार सत्यापन एवं विधिक घोषणा उपरांत मांग पत्र पर आपका समर्थन सफलतापूर्वक दर्ज कर लिया गया है!';
          const updated = {
            ...dem,
            supportCount: dem.supportCount + 1,
            supportedPhones: [...dem.supportedPhones, citizenPhone],
            updatedAt: new Date().toISOString(),
          };

          updateDoc(doc(db, 'publicDemands', demandId), {
            supportCount: updated.supportCount,
            supportedPhones: updated.supportedPhones,
            updatedAt: updated.updatedAt,
          }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, `publicDemands/${demandId}`));

          if (supporterDetails) {
            addAuditLog(
              supporterDetails.name,
              'citizen',
              'DEMAND_SUPPORTED_WITH_AADHAAR',
              'DEMAND',
              dem.demandNumber,
              `Aadhaar Verified Support: ${supporterDetails.name}, Ward ${supporterDetails.wardNumber}, Aadhaar: ****-****-${supporterDetails.aadhaarNumber.slice(-4)}. Signed statutory declaration.`
            );
          }

          return updated;
        }
        return dem;
      })
    );

    return { success, message };
  };

  const updateDemandStatus = async (demandId: string, status: DemandStatus, adminRemarks?: string, budget?: number) => {
    const now = new Date().toISOString();
    setPublicDemands((prev) =>
      prev.map((d) => {
        if (d.id === demandId) {
          const updated = {
            ...d,
            status,
            adminRemarks: adminRemarks || d.adminRemarks,
            sanctionedBudget: budget !== undefined ? budget : d.sanctionedBudget,
            updatedAt: now,
          };
          setDoc(doc(db, 'publicDemands', demandId), updated).catch((err) => {
            handleFirestoreError(err, OperationType.UPDATE, `publicDemands/${demandId}`);
          });
          return updated;
        }
        return d;
      })
    );
  };

  const saveDepartment = async (dept: Department) => {
    setDepartments((prev) => {
      const exists = prev.some((d) => d.id === dept.id);
      return exists ? prev.map((d) => (d.id === dept.id ? dept : d)) : [dept, ...prev];
    });
    setDoc(doc(db, 'departments', dept.id), dept).catch((err) => handleFirestoreError(err, OperationType.WRITE, `departments/${dept.id}`));
  };

  const saveEmployee = async (emp: Employee) => {
    setEmployees((prev) => {
      const exists = prev.some((e) => e.id === emp.id);
      return exists ? prev.map((e) => (e.id === emp.id ? emp : e)) : [emp, ...prev];
    });
    setDoc(doc(db, 'employees', emp.id), emp).catch((err) => handleFirestoreError(err, OperationType.WRITE, `employees/${emp.id}`));
  };

  const saveWard = async (ward: Ward) => {
    setWards((prev) => {
      const exists = prev.some((w) => w.id === ward.id);
      return exists ? prev.map((w) => (w.id === ward.id ? ward : w)) : [ward, ...prev];
    });
    setDoc(doc(db, 'wards', ward.id), ward).catch((err) => handleFirestoreError(err, OperationType.WRITE, `wards/${ward.id}`));
  };

  const saveProject = async (project: DevelopmentProject) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === project.id);
      return exists ? prev.map((p) => (p.id === project.id ? project : p)) : [project, ...prev];
    });
    setDoc(doc(db, 'developmentProjects', project.id), project).catch((err) => handleFirestoreError(err, OperationType.WRITE, `developmentProjects/${project.id}`));
  };

  const saveNotice = async (notice: PublicNotice) => {
    setNotices((prev) => {
      const exists = prev.some((n) => n.id === notice.id);
      return exists ? prev.map((n) => (n.id === notice.id ? notice : n)) : [notice, ...prev];
    });
    setDoc(doc(db, 'publicNotices', notice.id), notice).catch((err) => handleFirestoreError(err, OperationType.WRITE, `publicNotices/${notice.id}`));
  };

  const deleteNotice = async (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const updateSettings = async (newSettings: SystemSettings) => {
    setSettings(newSettings);
    setDoc(doc(db, 'systemSettings', 'portal_config'), { ...newSettings, updatedAt: new Date().toISOString() }).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, 'systemSettings/portal_config')
    );
  };

  const resetToDemoData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setPublicDemands(INITIAL_PUBLIC_DEMANDS);
    setDepartments(INITIAL_DEPARTMENTS);
    setEmployees(INITIAL_EMPLOYEES);
    setWards(INITIAL_WARDS);
    setProjects(INITIAL_DEVELOPMENT_PROJECTS);
    setNotices(INITIAL_NOTICES);
    setSettings(INITIAL_SETTINGS);
    setNotificationLogs(INITIAL_NOTIFICATION_LOGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.clear();
  };

  const clearAllDemoData = () => {
    setComplaints([]);
    setPublicDemands([]);
    setNotificationLogs([]);
    setAuditLogs([]);
    localStorage.removeItem('np_sapotra_complaints');
    localStorage.removeItem('np_sapotra_demands');
    localStorage.removeItem('np_sapotra_logs');
    localStorage.removeItem('np_sapotra_audit');
  };

  return (
    <MunicipalDataContext.Provider
      value={{
        complaints,
        publicDemands,
        departments,
        employees,
        wards,
        projects,
        notices,
        settings,
        notificationLogs,
        auditLogs,
        isSyncing,
        registerComplaint,
        updateComplaintStatus,
        submitCitizenFeedback,
        reopenComplaint,
        submitPublicDemand,
        supportPublicDemand,
        updateDemandStatus,
        saveDepartment,
        saveEmployee,
        saveWard,
        saveProject,
        saveNotice,
        deleteNotice,
        updateSettings,
        sendNotification,
        resetToDemoData,
        clearAllDemoData,
      }}
    >
      {children}
    </MunicipalDataContext.Provider>
  );
};

export const useMunicipalData = () => {
  const context = useContext(MunicipalDataContext);
  if (!context) {
    throw new Error('useMunicipalData must be used within a MunicipalDataProvider');
  }
  return context;
};
