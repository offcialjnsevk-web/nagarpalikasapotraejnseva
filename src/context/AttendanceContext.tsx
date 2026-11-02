import React, { createContext, useContext, useState, useEffect } from 'react';
import { AttendanceRecord, AttendanceStatus } from '../types';
import { useAuth } from './AuthContext';

// Nagar Palika Sapotra Municipal Office Geo Coordinates (Karauli, Rajasthan)
export const SAPOTRA_MUNICIPAL_OFFICE = {
  name: 'नगर पालिका सपोटरा कार्यालय भवन',
  lat: 26.1558,
  lng: 76.7570,
  radiusMeters: 120, // 120m valid office perimeter
  address: 'नगर पालिका भवन, मुख्य बस स्टैंड मार्ग, सपोटरा, जिला करौली (राजस्थान) - 322218',
};

// Distance calculation using Haversine formula (meters)
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function formatTimeIST(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// Initial mock attendance for demonstration
function generateInitialAttendance(employees: any[]): AttendanceRecord[] {
  const today = getTodayDateString();
  const records: AttendanceRecord[] = [];

  const sampleStatuses: AttendanceStatus[] = ['PRESENT', 'PRESENT', 'FIELD_DUTY', 'PRESENT', 'ON_LEAVE'];
  const sampleTimes = ['09:15 AM', '09:24 AM', '09:40 AM', '09:10 AM', ''];

  employees.forEach((emp, index) => {
    const status = sampleStatuses[index % sampleStatuses.length];
    const isPresent = status === 'PRESENT';
    const isField = status === 'FIELD_DUTY';

    records.push({
      id: `att-${today}-${emp.id}`,
      employeeId: emp.id,
      employeeCode: emp.employeeCode,
      employeeName: emp.fullName,
      designation: emp.designation,
      departmentId: emp.departmentId,
      departmentName: emp.departmentName,
      date: today,
      status: status,
      checkInTime: isPresent || isField ? sampleTimes[index % sampleTimes.length] : undefined,
      checkOutTime: isPresent && index === 0 ? '05:45 PM' : undefined,
      checkInLat: isPresent ? SAPOTRA_MUNICIPAL_OFFICE.lat + 0.0001 : isField ? 26.159 : undefined,
      checkInLng: isPresent ? SAPOTRA_MUNICIPAL_OFFICE.lng + 0.0001 : isField ? 76.762 : undefined,
      distanceMeters: isPresent ? 35 : isField ? 1420 : undefined,
      isWithinGeofence: isPresent,
      selfieUrl: isPresent ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' : undefined,
      remarks: isField ? 'वार्ड नं. 7 में नाला निरीक्षण ड्यूटी' : isPresent ? 'समय पर बायोमेट्रिक/GPS उपस्थिति' : 'आकस्मिक अवकाश आवेदन',
      markedBy: isPresent ? 'SELF' : 'ADMIN',
      updatedAt: new Date().toISOString(),
    });
  });

  return records;
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  fieldDuty: number;
  onLeave: number;
  halfDay: number;
  percentage: number;
}

interface AttendanceContextType {
  records: AttendanceRecord[];
  todayDate: string;
  checkIn: (employeeId: string, coords?: { lat: number; lng: number }, selfieUrl?: string, remarks?: string) => Promise<{ success: boolean; message: string; isOfficeRadius: boolean; distance: number }>;
  checkOut: (employeeId: string, remarks?: string) => Promise<{ success: boolean; message: string }>;
  markAllPresent: (date?: string) => void;
  markAllAbsent: (date?: string) => void;
  updateEmployeeStatus: (employeeId: string, date: string, status: AttendanceStatus, remarks?: string) => void;
  getEmployeeTodayRecord: (employeeId: string) => AttendanceRecord | undefined;
  getEmployeeHistory: (employeeId: string) => AttendanceRecord[];
  getStatsByDate: (date?: string) => AttendanceStats;
  sendDailyAttendanceWhatsApp: (date?: string) => string;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { registeredEmployees } = useAuth();
  const todayDate = getTodayDateString();

  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('np_sapotra_attendance_records');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return generateInitialAttendance(registeredEmployees);
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('np_sapotra_attendance_records', JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  }, [records]);

  // Ensure every employee has an entry for today
  useEffect(() => {
    setRecords((prev) => {
      let updated = [...prev];
      let changed = false;

      registeredEmployees.forEach((emp) => {
        const hasToday = updated.some((r) => r.employeeId === emp.id && r.date === todayDate);
        if (!hasToday) {
          changed = true;
          updated.push({
            id: `att-${todayDate}-${emp.id}`,
            employeeId: emp.id,
            employeeCode: emp.employeeCode,
            employeeName: emp.fullName,
            designation: emp.designation,
            departmentId: emp.departmentId,
            departmentName: emp.departmentName,
            date: todayDate,
            status: 'ABSENT', // Default to absent until checked in or marked
            markedBy: 'ADMIN',
            updatedAt: new Date().toISOString(),
          });
        }
      });

      return changed ? updated : prev;
    });
  }, [registeredEmployees, todayDate]);

  // Employee Self Check-In
  const checkIn = async (
    employeeId: string,
    coords?: { lat: number; lng: number },
    selfieUrl?: string,
    remarks?: string
  ) => {
    const lat = coords?.lat || SAPOTRA_MUNICIPAL_OFFICE.lat + (Math.random() - 0.5) * 0.0005;
    const lng = coords?.lng || SAPOTRA_MUNICIPAL_OFFICE.lng + (Math.random() - 0.5) * 0.0005;
    const distance = calculateDistanceMeters(lat, lng, SAPOTRA_MUNICIPAL_OFFICE.lat, SAPOTRA_MUNICIPAL_OFFICE.lng);
    const isOfficeRadius = distance <= SAPOTRA_MUNICIPAL_OFFICE.radiusMeters;
    const checkTime = formatTimeIST();

    const emp = registeredEmployees.find((e) => e.id === employeeId);
    if (!emp) {
      return { success: false, message: 'कर्मचारी रिकॉर्ड नहीं मिला!', isOfficeRadius: false, distance: 0 };
    }

    setRecords((prev) => {
      const existingIndex = prev.findIndex((r) => r.employeeId === employeeId && r.date === todayDate);
      const newRecord: AttendanceRecord = {
        id: `att-${todayDate}-${employeeId}`,
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        employeeName: emp.fullName,
        designation: emp.designation,
        departmentId: emp.departmentId,
        departmentName: emp.departmentName,
        date: todayDate,
        status: isOfficeRadius ? 'PRESENT' : 'FIELD_DUTY',
        checkInTime: checkTime,
        checkInLat: lat,
        checkInLng: lng,
        distanceMeters: distance,
        isWithinGeofence: isOfficeRadius,
        selfieUrl: selfieUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        remarks: remarks || (isOfficeRadius ? 'नगर पालिका कार्यालय परिसर में उपस्थिति दर्ज' : `फील्ड ड्यूटी (${distance}m दूरी)`),
        markedBy: 'SELF',
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], ...newRecord };
        return copy;
      } else {
        return [newRecord, ...prev];
      }
    });

    return {
      success: true,
      message: isOfficeRadius
        ? `चेक-इन सफल! समय: ${checkTime} (कार्यालय परिधि: ${distance}m)`
        : `फील्ड चेक-इन दर्ज! समय: ${checkTime} (कार्यालय से दूरी: ${(distance / 1000).toFixed(1)} किमी)`,
      isOfficeRadius,
      distance,
    };
  };

  // Employee Self Check-Out
  const checkOut = async (employeeId: string, remarks?: string) => {
    const checkTime = formatTimeIST();

    setRecords((prev) => {
      return prev.map((r) => {
        if (r.employeeId === employeeId && r.date === todayDate) {
          return {
            ...r,
            checkOutTime: checkTime,
            remarks: remarks ? `${r.remarks || ''} | प्रस्थान नोट: ${remarks}` : r.remarks,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      });
    });

    return {
      success: true,
      message: `सफलतापूर्वक चेक-आउट दर्ज! प्रस्थान समय: ${checkTime}`,
    };
  };

  // Admin 1-Click: Mark All Present
  const markAllPresent = (date: string = todayDate) => {
    setRecords((prev) => {
      const updated = [...prev];
      registeredEmployees.forEach((emp) => {
        const idx = updated.findIndex((r) => r.employeeId === emp.id && r.date === date);
        const recordData: AttendanceRecord = {
          id: `att-${date}-${emp.id}`,
          employeeId: emp.id,
          employeeCode: emp.employeeCode,
          employeeName: emp.fullName,
          designation: emp.designation,
          departmentId: emp.departmentId,
          departmentName: emp.departmentName,
          date: date,
          status: 'PRESENT',
          checkInTime: '09:30 AM',
          distanceMeters: 45,
          isWithinGeofence: true,
          remarks: 'प्रशासक द्वारा 1-क्लिक सामूहिक उपस्थिति सत्यापित',
          markedBy: 'ADMIN',
          updatedAt: new Date().toISOString(),
        };

        if (idx >= 0) {
          updated[idx] = { ...updated[idx], ...recordData };
        } else {
          updated.push(recordData);
        }
      });
      return updated;
    });
  };

  // Admin 1-Click: Mark All Absent
  const markAllAbsent = (date: string = todayDate) => {
    setRecords((prev) => {
      const updated = [...prev];
      registeredEmployees.forEach((emp) => {
        const idx = updated.findIndex((r) => r.employeeId === emp.id && r.date === date);
        const recordData: AttendanceRecord = {
          id: `att-${date}-${emp.id}`,
          employeeId: emp.id,
          employeeCode: emp.employeeCode,
          employeeName: emp.fullName,
          designation: emp.designation,
          departmentId: emp.departmentId,
          departmentName: emp.departmentName,
          date: date,
          status: 'ABSENT',
          checkInTime: undefined,
          checkOutTime: undefined,
          remarks: 'प्रशासक द्वारा अनुपस्थित अंकित',
          markedBy: 'ADMIN',
          updatedAt: new Date().toISOString(),
        };

        if (idx >= 0) {
          updated[idx] = { ...updated[idx], ...recordData };
        } else {
          updated.push(recordData);
        }
      });
      return updated;
    });
  };

  // Admin: Update individual employee status
  const updateEmployeeStatus = (
    employeeId: string,
    date: string,
    status: AttendanceStatus,
    remarks?: string
  ) => {
    const emp = registeredEmployees.find((e) => e.id === employeeId);
    if (!emp) return;

    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.employeeId === employeeId && r.date === date);
      const isPresent = status === 'PRESENT';
      const isField = status === 'FIELD_DUTY';

      const updatedRecord: AttendanceRecord = {
        id: `att-${date}-${employeeId}`,
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        employeeName: emp.fullName,
        designation: emp.designation,
        departmentId: emp.departmentId,
        departmentName: emp.departmentName,
        date: date,
        status: status,
        checkInTime: isPresent || isField ? (prev[idx]?.checkInTime || formatTimeIST()) : undefined,
        checkOutTime: isPresent ? prev[idx]?.checkOutTime : undefined,
        remarks: remarks || `प्रशासक द्वारा ${status} अपडेट`,
        markedBy: 'ADMIN',
        updatedAt: new Date().toISOString(),
      };

      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...updatedRecord };
        return copy;
      } else {
        return [updatedRecord, ...prev];
      }
    });
  };

  const getEmployeeTodayRecord = (employeeId: string) => {
    return records.find((r) => r.employeeId === employeeId && r.date === todayDate);
  };

  const getEmployeeHistory = (employeeId: string) => {
    return records
      .filter((r) => r.employeeId === employeeId)
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  const getStatsByDate = (date: string = todayDate): AttendanceStats => {
    const dayRecords = records.filter((r) => r.date === date);
    const total = registeredEmployees.length || dayRecords.length || 1;

    let present = 0;
    let absent = 0;
    let fieldDuty = 0;
    let onLeave = 0;
    let halfDay = 0;

    registeredEmployees.forEach((emp) => {
      const rec = dayRecords.find((r) => r.employeeId === emp.id);
      if (!rec || rec.status === 'ABSENT') {
        absent++;
      } else if (rec.status === 'PRESENT') {
        present++;
      } else if (rec.status === 'FIELD_DUTY') {
        fieldDuty++;
      } else if (rec.status === 'ON_LEAVE') {
        onLeave++;
      } else if (rec.status === 'HALF_DAY') {
        halfDay++;
      }
    });

    const activeWorking = present + fieldDuty + halfDay * 0.5;
    const percentage = Math.round((activeWorking / total) * 100);

    return { total, present, absent, fieldDuty, onLeave, halfDay, percentage };
  };

  // Send WhatsApp Report formatted for EO / Chairman
  const sendDailyAttendanceWhatsApp = (date: string = todayDate): string => {
    const stats = getStatsByDate(date);
    const text = `*🏛️ नगर पालिका सपोटरा (करौली) – दैनिक कार्मिक उपस्थिति रिपोर्ट*
📅 *दिनांक:* ${date}
⏰ *समय:* ${formatTimeIST()}

📊 *उपस्थिति सारांश:*
👥 कुल कार्मिक: *${stats.total}*
✅ उपस्थित (कार्यालय): *${stats.present}*
📍 फील्ड ड्यूटी: *${stats.fieldDuty}*
❌ अनुपस्थित: *${stats.absent}*
🏖️ अवकाश: *${stats.onLeave}*
📈 कुल उपस्थिति दर: *${stats.percentage}%*

📌 *समीक्षा:* अधिशासी अधिकारी (EO) एवं अध्यक्ष महोदया को अवलोकनार्थ प्रेषित।
डिजिटल ई-जन सेवा पोर्टल, नगर पालिका सपोटरा।`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/919414012345?text=${encoded}`;
  };

  return (
    <AttendanceContext.Provider
      value={{
        records,
        todayDate,
        checkIn,
        checkOut,
        markAllPresent,
        markAllAbsent,
        updateEmployeeStatus,
        getEmployeeTodayRecord,
        getEmployeeHistory,
        getStatsByDate,
        sendDailyAttendanceWhatsApp,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
