import React from 'react';
import { ComplaintStatus, DemandStatus, Priority } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const StatusBadge: React.FC<{ status: ComplaintStatus | DemandStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const { lang } = useLanguage();

  const getStyle = () => {
    switch (status) {
      case 'SUBMITTED':
      case 'PENDING':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'ASSIGNED':
      case 'SITE_INSPECTION':
      case 'FEASIBILITY_ASSESSMENT':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'IN_PROGRESS':
      case 'WORK_IN_PROGRESS':
      case 'UNDER_REVIEW':
        return 'bg-indigo-50 text-indigo-800 border-indigo-300';
      case 'UNDER_VERIFICATION':
      case 'BUDGET_PENDING':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'RESOLVED':
      case 'APPROVED':
      case 'WORK_SANCTIONED':
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'REOPENED':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'REJECTED':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getLabel = () => {
    if (lang === 'hi') {
      switch (status) {
        case 'SUBMITTED':
          return 'दर्ज (Submitted)';
        case 'PENDING':
          return 'लंबित (Pending)';
        case 'ASSIGNED':
          return 'आवंटित (Assigned)';
        case 'IN_PROGRESS':
          return 'कार्य प्रगति पर (In Progress)';
        case 'UNDER_VERIFICATION':
          return 'सत्यापनधीन (Under Verification)';
        case 'RESOLVED':
          return 'निस्तारित (Resolved)';
        case 'REOPENED':
          return 'पुनः खुली (Reopened)';
        case 'REJECTED':
          return 'अस्वीकृत (Rejected)';
        case 'APPROVED':
          return 'स्वीकृत (Approved)';
        case 'WORK_SANCTIONED':
          return 'कार्य स्वीकृत (Sanctioned)';
        case 'COMPLETED':
          return 'पूर्ण (Completed)';
        default:
          return status;
      }
    }
    return status.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {getLabel()}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const { lang } = useLanguage();

  const getStyle = () => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800 border-red-300 animate-pulse';
      case 'NORMAL':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'LOW':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getLabel = () => {
    if (lang === 'hi') {
      switch (priority) {
        case 'URGENT':
          return 'अति आवश्यक (Urgent)';
        case 'NORMAL':
          return 'सामान्य (Normal)';
        case 'LOW':
          return 'निम्न (Low)';
      }
    }
    return priority;
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${getStyle()}`}>
      {getLabel()}
    </span>
  );
};
