export type Role =
  | 'super_admin'
  | 'executive_officer'
  | 'department_head'
  | 'junior_engineer'
  | 'sanitation_inspector'
  | 'field_employee'
  | 'data_entry'
  | 'citizen';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'UNDER_VERIFICATION'
  | 'RESOLVED'
  | 'REOPENED'
  | 'REJECTED';

export type Priority = 'LOW' | 'NORMAL' | 'URGENT';

export type DemandStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SITE_INSPECTION'
  | 'FEASIBILITY_ASSESSMENT'
  | 'APPROVED'
  | 'REJECTED'
  | 'BUDGET_PENDING'
  | 'WORK_SANCTIONED'
  | 'WORK_IN_PROGRESS'
  | 'COMPLETED';

export type ProjectStatus =
  | 'PROPOSED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'TENDER_STAGE'
  | 'WORK_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ON_HOLD';

export interface Complaint {
  id: string;
  complaintNumber: string; // e.g. NP-SPT-2026-0001
  citizenName: string;
  citizenPhone: string;
  citizenEmail?: string;
  wardNumber: string;
  address: string;
  departmentId: string;
  departmentName: string;
  category: string;
  subject: string;
  description: string;
  priority: Priority;
  status: ComplaintStatus;
  latitude: number;
  longitude: number;
  accuracy?: number;
  photos: string[];
  documents?: string[];
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  assignedAt?: string;
  beforePhoto?: string;
  afterPhoto?: string;
  resolutionRemarks?: string;
  reopenReason?: string;
  citizenFeedback?: string;
  citizenRating?: number;
  expectedResolutionDate?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  history?: ComplaintHistoryItem[];
}

export interface ComplaintHistoryItem {
  status: ComplaintStatus;
  updatedBy: string;
  updatedByRole: string;
  timestamp: string;
  remarks: string;
  action: string;
}

export interface PublicDemand {
  id: string;
  demandNumber: string; // e.g. DM-SPT-2026-0001
  applicantName: string;
  applicantPhone: string;
  wardNumber: string;
  title: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  photos: string[];
  beneficiaryCount: number;
  publicRemarks?: string;
  status: DemandStatus;
  supportCount: number;
  supportedPhones: string[];
  adminRemarks?: string;
  sanctionedBudget?: number;
  sanctionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  nameHi: string;
  headName: string;
  contactPhone: string;
  whatsappNumber: string;
  email: string;
  slaDays: number;
  icon: string;
  categories: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Employee {
  id: string;
  employeeCode: string; // e.g. EMP-SPT-101
  fullName: string;
  designation: string;
  departmentId: string;
  departmentName: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  assignedWard?: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  totalAssigned: number;
  totalResolved: number;
  createdAt: string;
}

export interface Ward {
  id: string;
  wardNumber: string;
  wardName: string;
  wardNameHi: string;
  councilorName: string;
  councilorPhone: string;
  population: number;
  areaDescription: string;
  latitude: number;
  longitude: number;
}

export interface DevelopmentProject {
  id: string;
  projectCode: string;
  title: string;
  titleHi: string;
  wardNumber: string;
  departmentId: string;
  description: string;
  approvedBudget: number; // in INR Lakhs
  sanctionDate: string;
  startDate: string;
  targetCompletionDate: string;
  contractorAgency: string;
  progressPercent: number;
  status: ProjectStatus;
  latitude: number;
  longitude: number;
  images: string[];
  beforeImages?: string[];
  afterImages?: string[];
}

export interface PublicNotice {
  id: string;
  noticeNumber: string;
  title: string;
  titleHi: string;
  description: string;
  category: 'NOTICE' | 'ORDER' | 'TENDER' | 'EVENT' | 'PRESS_RELEASE';
  publishDate: string;
  expiryDate?: string;
  pdfUrl?: string;
  isActive: boolean;
}

export interface NotificationLog {
  id: string;
  channel: 'WHATSAPP' | 'SMS' | 'EMAIL';
  recipientPhone: string;
  recipientName: string;
  event: string;
  referenceId: string;
  content: string;
  status: 'DELIVERED' | 'SENT' | 'DEMO_MODE' | 'FAILED';
  timestamp: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: 'COMPLAINT' | 'DEMAND' | 'DEPARTMENT' | 'EMPLOYEE' | 'SETTINGS' | 'NOTICE';
  targetId: string;
  details: string;
}

export interface SystemSettings {
  portalName: string;
  portalNameHi: string;
  tagline: string;
  taglineHi: string;
  chairmanName: string;
  chairmanNameHi: string;
  chairmanMessage: string;
  chairmanMessageHi: string;
  chairmanPhoto: string;
  eoName: string;
  eoNameHi: string;
  eoMessage: string;
  eoMessageHi: string;
  eoPhoto: string;
  officeAddress: string;
  officePhone: string;
  emergencyControlRoom: string;
  fireHelpline: string;
  policeHelpline: string;
  ambulanceHelpline: string;
  email: string;
  whatsappGatewayConfig: {
    enabled: boolean;
    phoneNumberId: string;
    businessAccountId: string;
    accessToken: string;
    demoMode: boolean;
  };
  smsGatewayConfig: {
    enabled: boolean;
    apiKey: string;
    senderId: string;
    demoMode: boolean;
  };
  emailSmtpConfig: {
    enabled: boolean;
    host: string;
    port: number;
    user: string;
    demoMode: boolean;
  };
}

export type AttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'HALF_DAY'
  | 'ON_LEAVE'
  | 'FIELD_DUTY';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  designation: string;
  departmentId: string;
  departmentName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime?: string; // e.g. "09:30 AM"
  checkOutTime?: string; // e.g. "05:45 PM"
  checkInLat?: number;
  checkInLng?: number;
  distanceMeters?: number;
  isWithinGeofence?: boolean;
  selfieUrl?: string;
  remarks?: string;
  markedBy: 'SELF' | 'ADMIN' | 'BIOMETRIC';
  updatedAt: string;
}

export interface CitizenAccount {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  password?: string;
  wardNumber: string;
  address: string;
  registeredAt: string;
}

export interface StaffAccount {
  id: string;
  employeeCode: string;
  fullName: string;
  designation: string;
  departmentId: string;
  departmentName: string;
  email: string;
  mobileNumber: string;
  password?: string;
  role: Role;
  assignedWard: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
}

export interface WorkApplication {
  id: string;
  tokenNumber: string;
  fullName: string;
  address: string;
  aadhaarNumber: string;
  email: string;
  percentage10th: number;
  percentage12th?: number;
  rscitDetails: string;
  aadhaarDoc: string;
  marksheet10thDoc: string;
  rscitDoc?: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

