import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'hi' | 'en';
export type FontSize = 'normal' | 'large' | 'xlarge';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  hi: {
    // Top Bar & Header
    'govt_of_rajasthan': 'राजस्थान सरकार | Government of Rajasthan',
    'district_karauli': 'जिला: करौली (राजस्थान)',
    'portal_title': 'नगर पालिका सपोटरा',
    'portal_subtitle': 'ई-जन सेवा पोर्टल',
    'tagline': 'आपकी समस्या, हमारा समाधान – डिजिटल सपोटरा',
    'helpline': 'हेल्पलाइन नंबर',
    'emergency_control': 'आपातकालीन नियंत्रण कक्ष: 1800-180-2422',
    
    // Navigation
    'nav_home': 'मुख्य पृष्ठ',
    'nav_about': 'नगर पालिका परिचय',
    'nav_departments': 'विभाग विवरण',
    'nav_register_complaint': 'शिकायत दर्ज करें',
    'nav_public_demand': 'मांग पत्र (विकास मांग)',
    'nav_development_works': 'विकास कार्य',
    'nav_notices': 'सूचनाएं एवं निविदाएं',
    'nav_track': 'शिकायत ट्रैक करें',
    'nav_contact': 'संपर्क सूत्र',
    'nav_admin': 'प्रशासनिक लॉगिन',
    'nav_employee': 'कर्मचारी पोर्टल',

    // Action Cards
    'action_register_complaint': 'शिकायत दर्ज करें',
    'action_register_complaint_desc': 'सफाई, स्ट्रीट लाइट, सड़क, पेयजल अथवा नाली की समस्या का त्वरित ऑनलाइन समाधान पाएं।',
    'action_public_demand': 'मांग पत्र दर्ज करें',
    'action_public_demand_desc': 'अपने वार्ड में नई सड़क, पार्क, स्ट्रीट लाइट, नाला अथवा विकास कार्य हेतु मांग पत्र प्रस्तुत करें।',
    'action_track_complaint': 'शिकायत ट्रैक करें',
    'action_track_complaint_desc': 'अपनी दर्ज शिकायत की अद्यतन स्थिति, नियुक्त कर्मचारी व निवारण रिपोर्ट ऑनलाइन देखें।',
    'action_feedback': 'सुझाव एवं प्रतिक्रिया',
    'action_feedback_desc': 'नगर पालिका प्रशासन के कार्यों पर अपने बहुमूल्य सुझाव एवं शिकायत निवारण पर रेटिंग दें।',

    // Statistics
    'stat_total_complaints': 'कुल दर्ज शिकायतें',
    'stat_resolved_complaints': 'सफलतापूर्वक निस्तारित',
    'stat_pending_complaints': 'प्रक्रियाधीन / लंबित',
    'stat_resolution_rate': 'निस्तारण दर',
    'stat_public_demands': 'प्राप्त विकास मांगें',
    'stat_dev_projects': 'प्रगतिरत विकास कार्य',
    'stat_citizen_satisfaction': 'नागरिक संतुष्टि दर',

    // Statuses
    'status_SUBMITTED': 'दर्ज (Submitted)',
    'status_PENDING': 'लंबित (Pending)',
    'status_ASSIGNED': 'आवंटित (Assigned)',
    'status_IN_PROGRESS': 'कार्य प्रगति पर (In Progress)',
    'status_UNDER_VERIFICATION': 'सत्यापन प्रक्रियाधीन (Under Verification)',
    'status_RESOLVED': 'निस्तारित (Resolved)',
    'status_REOPENED': 'पुनः खोली गई (Reopened)',
    'status_REJECTED': 'निरस्त (Rejected)',

    // Priority
    'priority_LOW': 'सामान्य (Low)',
    'priority_NORMAL': 'मध्यम (Normal)',
    'priority_URGENT': 'अति आवश्यक (Urgent)',

    // Messages
    'chairman_title': 'नगर पालिका अध्यक्ष का संदेश',
    'eo_title': 'अधिशाषी अधिकारी (EO) का संदेश',
    'notices_heading': 'नवीनतम सूचनाएं एवं आदेश',
    'quick_track': 'त्वरित शिकायत स्थिति जांचें',
    'enter_complaint_id': 'शिकायत संख्या दर्ज करें (जैसे NP-SPT-2026-0001)',
    'track_button': 'ट्रैक करें',
    'view_all': 'सभी देखें',
    'emergency_contacts': 'आपातकालीन सेवाएं एवं संपर्क सूत्र',
    
    // Complaint Form
    'form_step_citizen': '१. नागरिक विवरण',
    'form_step_details': '२. शिकायत विवरण',
    'form_step_gps': '३. जीपीएस लोकेशन',
    'form_step_review': '४. समीक्षा एवं सबमिट',
    'field_full_name': 'नागरिक का पूरा नाम *',
    'field_mobile': 'मोबाइल नंबर (WhatsApp सक्षम) *',
    'field_email': 'ईमेल आईडी (वैकल्पिक)',
    'field_ward': 'वार्ड संख्या चुनें *',
    'field_address': 'पूरा पता व नजदीकी लैंडमार्क *',
    'field_department': 'संबंधित विभाग चुनें *',
    'field_category': 'शिकायत की श्रेणी *',
    'field_subject': 'शिकायत का विषय *',
    'field_description': 'विस्तृत विवरण *',
    'field_priority': 'प्राथमिकता स्तर',
    'field_upload_photo': 'स्थल का फोटो अपलोड करें',
    'btn_use_current_location': 'मेरी वर्तमान जीपीएस लोकेशन लें',
    'btn_next': 'अगला कदम',
    'btn_prev': 'पिछला कदम',
    'btn_submit': 'शिकायत सबमिट करें',
    'otp_verify_title': 'मोबाइल सत्यापन (OTP)',
    'otp_sent_to': 'पर भेजा गया ओटीपी दर्ज करें',
    'otp_verify_btn': 'ओटीपी सत्यापित करें',
    'otp_resend': 'पुनः ओटीपी भेजें',

    // Footer
    'footer_about_text': 'नगर पालिका सपोटरा (करौली, राजस्थान) का आधिकारिक डिजिटल पोर्टल। पारदर्शी प्रशासन एवं समयबद्ध नागरिक सेवाओं के लिए समर्पित।',
    'footer_address': 'कार्यालय पता: नगर पालिका भवन, मुख्य बस स्टैंड, सपोटरा (करौली), पिन 322218',
    'footer_timing': 'कार्यालय समय: सोमवार से शुक्रवार, प्रातः 9:30 से सायं 6:00 बजे तक',
    'footer_copyright': 'सर्वाधिकार सुरक्षित © 2026 नगर पालिका सपोटरा, राजस्थान सरकार।',
    'prototype_notice': 'यह नगर पालिका सपोटरा का आधिकारिक अधिकृत तैनाती हेतु प्रोटोटाइप ई-जन सेवा पोर्टल है।',
  },
  en: {
    // Top Bar & Header
    'govt_of_rajasthan': 'Government of Rajasthan',
    'district_karauli': 'District: Karauli (Rajasthan)',
    'portal_title': 'Nagar Palika Sapotra',
    'portal_subtitle': 'e-Jan Seva Portal',
    'tagline': 'Your Problem, Our Resolution – Digital Sapotra',
    'helpline': 'Helpline Number',
    'emergency_control': 'Emergency Control Room: 1800-180-2422',

    // Navigation
    'nav_home': 'Home',
    'nav_about': 'About Municipality',
    'nav_departments': 'Departments',
    'nav_register_complaint': 'Register Complaint',
    'nav_public_demand': 'Public Demand',
    'nav_development_works': 'Development Works',
    'nav_notices': 'Public Notices & Tenders',
    'nav_track': 'Track Complaint',
    'nav_contact': 'Contact Us',
    'nav_admin': 'Admin Login',
    'nav_employee': 'Employee Portal',

    // Action Cards
    'action_register_complaint': 'Register Complaint',
    'action_register_complaint_desc': 'Lodge municipal issues on sanitation, street lights, roads, water supply, or drainage with real-time tracking.',
    'action_public_demand': 'Submit Public Demand',
    'action_public_demand_desc': 'Submit development proposals for new roads, street lights, parks, or community infrastructure.',
    'action_track_complaint': 'Track Complaint',
    'action_track_complaint_desc': 'Check live progress, assigned officer details, before/after photos, and resolution reports.',
    'action_feedback': 'Feedback & Rating',
    'action_feedback_desc': 'Share feedback on municipal services and rate the resolution of your grievance.',

    // Statistics
    'stat_total_complaints': 'Total Complaints',
    'stat_resolved_complaints': 'Resolved Successfully',
    'stat_pending_complaints': 'Pending / In Progress',
    'stat_resolution_rate': 'Resolution Rate',
    'stat_public_demands': 'Public Demands',
    'stat_dev_projects': 'Civic Projects',
    'stat_citizen_satisfaction': 'Citizen Satisfaction',

    // Statuses
    'status_SUBMITTED': 'Submitted',
    'status_PENDING': 'Pending Review',
    'status_ASSIGNED': 'Assigned',
    'status_IN_PROGRESS': 'Work in Progress',
    'status_UNDER_VERIFICATION': 'Under Verification',
    'status_RESOLVED': 'Resolved',
    'status_REOPENED': 'Reopened',
    'status_REJECTED': 'Rejected',

    // Priority
    'priority_LOW': 'Low',
    'priority_NORMAL': 'Normal',
    'priority_URGENT': 'Urgent',

    // Messages
    'chairman_title': "President's Message",
    'eo_title': "Executive Officer's Message",
    'notices_heading': 'Latest Notices & Government Orders',
    'quick_track': 'Quick Complaint Status Check',
    'enter_complaint_id': 'Enter Complaint ID (e.g. NP-SPT-2026-0001)',
    'track_button': 'Track Now',
    'view_all': 'View All',
    'emergency_contacts': 'Emergency Services & Directory',

    // Complaint Form
    'form_step_citizen': '1. Citizen Details',
    'form_step_details': '2. Grievance Details',
    'form_step_gps': '3. GPS Location',
    'form_step_review': '4. Review & Submit',
    'field_full_name': 'Citizen Full Name *',
    'field_mobile': 'Mobile Number (WhatsApp enabled) *',
    'field_email': 'Email ID (Optional)',
    'field_ward': 'Select Ward Number *',
    'field_address': 'Complete Address & Landmark *',
    'field_department': 'Concerned Department *',
    'field_category': 'Complaint Category *',
    'field_subject': 'Complaint Subject *',
    'field_description': 'Detailed Description *',
    'field_priority': 'Priority Level',
    'field_upload_photo': 'Upload Site Photograph',
    'btn_use_current_location': 'Fetch My Current GPS Location',
    'btn_next': 'Next Step',
    'btn_prev': 'Previous Step',
    'btn_submit': 'Submit Complaint',
    'otp_verify_title': 'Mobile OTP Verification',
    'otp_sent_to': 'Enter 4-digit OTP sent to',
    'otp_verify_btn': 'Verify OTP',
    'otp_resend': 'Resend OTP',

    // Footer
    'footer_about_text': 'Official digital governance portal of Nagar Palika Sapotra (District Karauli, Rajasthan) for transparent grievance redressal and civic services.',
    'footer_address': 'Office Address: Nagar Palika Bhawan, Main Bus Stand, Sapotra (Karauli), PIN 322218',
    'footer_timing': 'Working Hours: Monday to Friday, 9:30 AM to 6:00 PM',
    'footer_copyright': 'All Rights Reserved © 2026 Nagar Palika Sapotra, Government of Rajasthan.',
    'prototype_notice': 'Municipal prototype configured for authorized deployment - Nagar Palika Sapotra.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('np_sapotra_lang') as Language) || 'hi';
  });
  const [fontSize, setFontSizeState] = useState<FontSize>('normal');
  const [highContrast, setHighContrastState] = useState<boolean>(false);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('np_sapotra_lang', newLang);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    if (size === 'large') document.documentElement.classList.add('text-base');
    if (size === 'xlarge') document.documentElement.classList.add('text-lg');
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    if (val) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const t = (key: string): string => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
