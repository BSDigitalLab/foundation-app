export interface LegalDocumentCard {
  id: string;
  title: string;
  category: 'GOVERNANCE' | 'PRIVACY' | 'SAFEGUARDING' | 'ACCOUNT_RIGHTS';
  badge: string;
  description: string;
  path: string;
  effectiveDate: string;
  lastUpdated: string;
  iconName: 'Scale' | 'ShieldCheck' | 'HeartHandshake' | 'Users' | 'FileCode' | 'Trash2' | 'MailCheck';
}

export interface GovernanceCommitteeDetails {
  committeeName: string;
  headLabel: string;
  headName: string;
  contactEmail: string;
  scopeDescription: string;
}

export interface LegalCentreCatalog {
  title: string;
  subtitle: string;
  effectiveDate: string;
  lastUpdated: string;
  orgDetails: {
    name: string;
    type: string;
    cin: string;
    darpanId: string;
    address: string;
    email: string;
    website: string;
  };
  governanceCommittee: GovernanceCommitteeDetails;
  categories: {
    key: string;
    label: string;
    description: string;
  }[];
  documents: LegalDocumentCard[];
}

export const LEGAL_CENTRE_DATA: LegalCentreCatalog = {
  title: "Legal Centre & Institutional Governance",
  subtitle: "Yuvaparipalan Foundation – Official Platform Policies, Data Protection Commitments & Safeguarding Standards",
  effectiveDate: "October 25, 2026",
  lastUpdated: "October 25, 2026",
  orgDetails: {
    name: "Yuvaparipalan Foundation",
    type: "A Section 8 Not-for-Profit Company incorporated under the Companies Act, 2013",
    cin: "U85500TZ2026NPL039757",
    darpanId: "TN/2026/1152475",
    address: "#3, Sri Mahalakshmi Garden, Saravanampatti, Coimbatore, Tamil Nadu – 641035, India",
    email: "support@yuvaparipalan.org",
    website: "https://yuvaparipalan.org/",
  },
  governanceCommittee: {
    committeeName: "Yuvaparipalan Foundation Governance and Safeguarding Committee",
    headLabel: "Committee Head",
    headName: "Biju Sivanand",
    contactEmail: "bijusivanand@gmail.com",
    scopeDescription: "Institutional policy governance, minor safeguarding oversight, and compliance auditing.",
  },
  categories: [
    {
      key: "ALL",
      label: "All Documents",
      description: "Complete institutional governance catalog and policy framework."
    },
    {
      key: "GOVERNANCE",
      label: "Platform Governance",
      description: "Terms of service, acceptable use rules, and institutional agreements."
    },
    {
      key: "PRIVACY",
      label: "Data Protection & Privacy",
      description: "Platform privacy standards, technical safeguards, and personal data rights."
    },
    {
      key: "SAFEGUARDING",
      label: "Safeguarding & Ethics",
      description: "Child protection, minor welfare protocols, and workplace anti-harassment standards."
    },
    {
      key: "ACCOUNT_RIGHTS",
      label: "User Rights & Controls",
      description: "Self-service account deletion, data erasure portals, and communication preferences."
    }
  ],
  documents: [
    {
      id: "terms-and-conditions",
      title: "Terms & Conditions",
      category: "GOVERNANCE",
      badge: "Core Agreement",
      description: "Governing contract establishing user rights, platform eligibility, scholarship criteria, volunteer code, and limitation of liability.",
      path: "/terms-and-conditions",
      effectiveDate: "October 25, 2026",
      lastUpdated: "October 25, 2026",
      iconName: "Scale"
    },
    {
      id: "privacy-policy",
      title: "Privacy Policy",
      category: "PRIVACY",
      badge: "DPDP & IT Act Standard",
      description: "Comprehensive transparency standard detailing personal data collection, processing, third-party disclosures, retention schedules, and statutory rights.",
      path: "/privacy-policy",
      effectiveDate: "October 25, 2026",
      lastUpdated: "October 25, 2026",
      iconName: "ShieldCheck"
    },
    {
      id: "child-safeguarding",
      title: "Child Protection & Safeguarding Policy",
      category: "SAFEGUARDING",
      badge: "POCSO Compliance Standard",
      description: "Institutional protocol ensuring the physical, emotional, and digital safety of minors under 18 across all scholarships, bootcamps, and virtual mentorship.",
      path: "/child-safeguarding",
      effectiveDate: "October 25, 2026",
      lastUpdated: "October 25, 2026",
      iconName: "HeartHandshake"
    },
    {
      id: "posh-policy",
      title: "Prevention of Sexual Harassment (POSH) Policy",
      category: "SAFEGUARDING",
      badge: "POSH Act 2013 Standard",
      description: "Statutory workplace dignity policy prohibiting sexual harassment, providing a confidential inquiry framework, and protecting all women personnel.",
      path: "/posh",
      effectiveDate: "October 25, 2026",
      lastUpdated: "October 25, 2026",
      iconName: "Users"
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use Policy (AUP)",
      category: "GOVERNANCE",
      badge: "Platform Security Rules",
      description: "Operational rules prohibiting data scraping, security probing, credential sharing, malware distribution, academic fraud, and behavioral misconduct.",
      path: "/acceptable-use",
      effectiveDate: "October 25, 2026",
      lastUpdated: "October 25, 2026",
      iconName: "FileCode"
    },
    {
      id: "account-deletion",
      title: "Account Deletion & Data Erasure Portal",
      category: "ACCOUNT_RIGHTS",
      badge: "Self-Service Portal",
      description: "Operational self-service portal to request permanent account termination and eligible personal data erasure in compliance with app-store rules.",
      path: "/delete-account",
      effectiveDate: "October 25, 2026",
      lastUpdated: "October 25, 2026",
      iconName: "Trash2"
    },
    {
      id: "unsubscribe-preferences",
      title: "Communication Preferences & Unsubscribe",
      category: "ACCOUNT_RIGHTS",
      badge: "Preference Engine",
      description: "Fine-grained preference center to manage promotional email/SMS notifications with anti-scanner security protection.",
      path: "/unsubscribe",
      effectiveDate: "October 25, 2026",
      lastUpdated: "October 25, 2026",
      iconName: "MailCheck"
    }
  ]
};
