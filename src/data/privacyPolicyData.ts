export interface LegalSection {
  id: string;
  number?: string;
  title: string;
  paragraphs?: string[];
  subsections?: {
    subtitle?: string;
    paragraphs?: string[];
    bullets?: string[];
    paragraphsAfter?: string[];
  }[];
  bullets?: string[];
  paragraphsAfter?: string[];
  callout?: string;
}

export interface LegalDocument {
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
    website?: string;
  };
  sections: LegalSection[];
}

export const PRIVACY_POLICY_DATA: LegalDocument = {
  title: "Privacy Policy",
  subtitle: "Yuvaparipalan Foundation – Platform Privacy Commitment & Data Protection Standard",
  effectiveDate: "25 October 2026",
  lastUpdated: "25 October 2026",
  orgDetails: {
    name: "Yuvaparipalan Foundation",
    type: "A Section 8 Not-for-Profit Company incorporated under the Companies Act, 2013",
    cin: "U85500TZ2026NPL039757",
    darpanId: "TN/2026/1152475",
    address: "#3, Sri Mahalakshmi Garden, Saravanampatti, Coimbatore, Tamil Nadu – 641035, India",
    email: "support@yuvaparipalan.org",
    website: "https://yuvaparipalan.org/",
  },
  sections: [
    {
      id: "our-commitment-to-privacy",
      number: "01",
      title: "OUR COMMITMENT TO PRIVACY",
      paragraphs: [
        "Yuvaparipalan Foundation (“Foundation”, “Yuvaparipalan”, “we”, “us” or “our”) is committed to protecting the privacy, confidentiality and security of individuals who access and use our digital platform, mobile applications, websites and related digital services.",
        "This Privacy Policy explains how we collect, receive, use, store, disclose, protect, retain and delete personal data when individuals interact with our digital services.",
        "Our commitment extends to transparent data practices, responsible information handling, appropriate security safeguards and respect for the privacy rights available under applicable law.",
        "Platform: Yuvaparipalan Foundation Youth Empowerment Platform."
      ],
      subsections: [
        {
          subtitle: "Digital Applications and Services Covered",
          paragraphs: [
            "This Policy applies to the following applications and digital services operated by or on behalf of Yuvaparipalan Foundation:"
          ]
        },
        {
          subtitle: "Mobile Applications",
          bullets: [
            "Yuvaparipalan — Community User Application.",
            "Channelpreneur — Channel Partners Mobile Application."
          ]
        },
        {
          subtitle: "Websites, Web Platforms and Related Applications",
          paragraphs: [
            "This Policy also covers Yuvaparipalan Platform websites, web applications, administrative portals, APIs, account services, supporting infrastructure and other related digital applications and services operated by or on behalf of the Foundation.",
            "The information processed may vary depending on the application, user role, features accessed, permissions granted and services used. Not every data category described in this Policy is necessarily collected by every application.",
            "Where a specific feature requires an additional privacy notice, device permission or consent, we will provide the relevant information and obtain consent where required by applicable law or platform policy."
          ]
        }
      ],
      callout: "Yuvaparipalan does not intend to sell personal data in exchange for money. Personal data is handled for disclosed purposes and is shared only in the circumstances described in this Policy or otherwise permitted by applicable law. Where consent is required, use of a website or application does not replace the need to obtain that consent separately."
    },
    {
      id: "information-we-may-collect",
      number: "02",
      title: "INFORMATION WE MAY COLLECT",
      paragraphs: [
        "We collect personal data that individuals voluntarily provide, information generated through the use of our digital services, and technical information processed by our systems or service providers where applicable.",
        "The categories below describe information that may be collected depending on the application and its actual functionality. They do not mean that every application collects every category."
      ],
      subsections: [
        {
          subtitle: "A. Information Provided Voluntarily",
          paragraphs: [
            "Depending on the feature and application context, voluntary information may include:"
          ]
        },
        {
          subtitle: "Personal and Account Information",
          bullets: [
            "Name or display name;",
            "Email address and mobile or telephone number;",
            "Account or user identifier;",
            "Profile information and preferences;",
            "Authentication and account-related information."
          ]
        },
        {
          subtitle: "User-Submitted Information and Content",
          bullets: [
            "Information entered into forms;",
            "Messages, enquiries and support requests;",
            "Photographs, images, documents and files submitted through relevant features;",
            "Other content voluntarily provided through the platform."
          ]
        },
        {
          subtitle: "Transaction and Payment Information",
          paragraphs: [
            "Where transactions or paid services are supported, we may process transaction identifiers, payment status, transaction dates, amounts, purchase history and relevant billing or dispute records.",
            "Payments may be processed through third-party payment providers. The financial information received and retained by the Foundation depends on the payment integration used. We do not claim to store complete payment-card or banking credentials unless this is verified and accurately disclosed."
          ]
        },
        {
          subtitle: "Location Information",
          paragraphs: [
            "Where a specific feature requires location information, we may process approximate or precise location data, subject to the relevant feature, permissions and applicable law."
          ]
        },
        {
          subtitle: "Communications and Preferences",
          paragraphs: [
            "We may process communications submitted to us, support correspondence, notification preferences and records of consent or consent withdrawal."
          ]
        },
        {
          subtitle: "B. Information Collected Automatically",
          paragraphs: [
            "Depending on the application, website and technical configuration, we or our service providers may process:"
          ]
        },
        {
          subtitle: "Technical Device Information",
          bullets: [
            "IP address and network information;",
            "Device type and operating system;",
            "Browser type and application version;",
            "Device or application installation identifiers, where available and permitted;",
            "Language, time-zone and technical settings."
          ]
        },
        {
          subtitle: "Usage and Interaction Information",
          bullets: [
            "Pages or screens accessed;",
            "Features used and application interactions;",
            "Search terms and in-app search history, where enabled;",
            "Technical usage logs and navigation events."
          ]
        },
        {
          subtitle: "Diagnostics and Security Information",
          bullets: [
            "Crash reports and performance diagnostics;",
            "Error logs and technical events;",
            "Authentication attempts and security records;",
            "Information required to detect misuse, troubleshoot failures and maintain platform reliability."
          ]
        },
        {
          subtitle: "C. Device Permissions and Protected Information",
          paragraphs: [
            "Certain applications or features may request access to device functions such as the camera, photos, files, location or notifications.",
            "Information such as contacts, calendar entries, SMS/MMS, call-related information and email content is not assumed to be collected by every application.",
            "If a particular feature requires access to protected device information, we will explain the relevant purpose, request applicable permissions and obtain additional consent where required by law or platform policy. Access and use must be limited to the disclosed, permitted purpose.",
            "This Privacy Policy alone does not authorise access to protected device information."
          ]
        },
        {
          subtitle: "D. Information from Third-Party Services",
          paragraphs: [
            "If you choose to use a third-party sign-in method or integration, we may receive information made available by that provider, such as a name, email address, account identifier or authentication result.",
            "The information received depends on the provider, the permissions granted and the integration's configuration."
          ]
        }
      ]
    },
    {
      id: "information-relating-to-children",
      number: "03",
      title: "INFORMATION RELATING TO CHILDREN",
      paragraphs: [
        "Yuvaparipalan Foundation recognises that some users of its digital services may be children or individuals under the age of 18.",
        "We handle children's personal data in accordance with the applicable legal requirements and the age-related safeguards relevant to each application and service.",
        "Where required, we will implement appropriate age-related notices, parental or guardian consent and verification mechanisms, access restrictions and other safeguards before processing children's personal data.",
        "We will not knowingly process children's personal data in a manner prohibited by applicable law.",
        "If a parent, legal guardian or other authorised individual believes that a child has provided personal data in circumstances that may violate applicable law, they may contact us at [support@yuvaparipalan.org](mailto:support@yuvaparipalan.org) so that we can assess the matter and take appropriate action.",
        "The age limits and safeguards applicable to each application must reflect its intended audience, actual features, applicable law and relevant app-store requirements."
      ]
    },
    {
      id: "how-we-use-information",
      number: "04",
      title: "HOW WE USE INFORMATION",
      paragraphs: [
        "We process personal data for specific purposes connected with operating, maintaining, securing and improving the Yuvaparipalan digital platform.",
        "Subject to applicable law and any required consent, these purposes may include:"
      ],
      bullets: [
        "Creating, authenticating and managing user accounts;",
        "Providing application features, website functionality and requested digital services;",
        "Managing user profiles, preferences and account settings;",
        "Responding to enquiries, support requests and complaints;",
        "Processing and reconciling transactions where applicable;",
        "Sending necessary account, service, security and operational communications;",
        "Maintaining application performance, troubleshooting errors and improving reliability;",
        "Protecting accounts, detecting suspicious activity, preventing misuse and investigating security incidents;",
        "Maintaining technical, transaction and security records;",
        "Conducting analytics and measuring platform performance where appropriate tools are enabled and the processing is permitted;",
        "Managing user preferences, permissions and consent records;",
        "Complying with applicable legal, regulatory, accounting and recordkeeping obligations;",
        "Establishing, exercising or defending legal claims where necessary;",
        "Sending optional promotional communications where permitted by law and subject to applicable consent and opt-out requirements."
      ],
      paragraphsAfter: [
        "We will not use personal data for a materially different or incompatible purpose without an appropriate legal basis and any additional notice or consent required by applicable law."
      ],
      subsections: [
        {
          subtitle: "Legal Basis and Consent",
          paragraphs: [
            "Depending on the processing activity and the law that applies, we may process personal data on the basis of consent, steps taken at an individual's request, performance of an agreement, compliance with legal obligations or another lawful basis available under applicable law.",
            "Where consent is required, it will be obtained through an appropriate mechanism. Individuals may withdraw consent through available application settings, device permissions or by contacting [support@yuvaparipalan.org](mailto:support@yuvaparipalan.org).",
            "Withdrawal of consent does not affect processing lawfully carried out before withdrawal. It may, however, affect a feature that genuinely depends on the relevant information."
          ]
        }
      ]
    },
    {
      id: "sharing-of-information",
      number: "05",
      title: "SHARING OF INFORMATION",
      paragraphs: [
        "Yuvaparipalan Foundation treats personal data confidentially and does not disclose it indiscriminately. Personal data may be shared in the following circumstances, subject to applicable law and any required consent."
      ],
      subsections: [
        {
          subtitle: "A. Service Providers and Technology Partners",
          paragraphs: [
            "We may engage third-party service providers to support:"
          ],
          bullets: [
            "Cloud hosting, databases and technical infrastructure;",
            "Authentication and account security;",
            "Email, SMS and push notifications;",
            "Payment processing;",
            "Diagnostics, crash reporting and technical monitoring;",
            "Analytics and performance measurement;",
            "Customer support and communication systems;",
            "File storage and delivery;",
            "Other services necessary to operate and maintain the platform."
          ],
          paragraphsAfter: [
            "Where a provider processes personal data on our behalf, we will seek appropriate confidentiality, security and data-protection safeguards, including restrictions on use and disclosure where applicable."
          ]
        },
        {
          subtitle: "B. User-Authorised Sharing",
          paragraphs: [
            "We may share information where an individual chooses to use a feature that transmits information to another person or service, or otherwise authorises the disclosure.",
            "Where required, the relevant disclosure will be explained and consent obtained before sharing."
          ]
        },
        {
          subtitle: "C. Legal and Regulatory Requirements",
          paragraphs: [
            "Personal data may be disclosed where required or permitted by applicable law, valid legal process or a lawful request from a competent authority.",
            "We may also disclose information where necessary and legally permitted to protect the rights, safety or security of users, the Foundation or other individuals."
          ]
        },
        {
          subtitle: "D. Organisational Changes",
          paragraphs: [
            "Where a legally relevant restructuring, transfer of operations or similar transaction occurs, personal data may be disclosed or transferred only as permitted by applicable law and subject to appropriate safeguards and notices where required."
          ]
        },
        {
          subtitle: "E. Public Disclosure and Promotional Use",
          paragraphs: [
            "We will not intentionally publish identifiable personal information, photographs, testimonials or other user-submitted content for promotional purposes without obtaining the consent or other lawful authorisation required for the relevant use."
          ]
        },
        {
          subtitle: "F. Sale of Personal Data",
          paragraphs: [
            "Yuvaparipalan Foundation does not intend to sell personal data in exchange for money.",
            "If advertising, attribution, analytics or other third-party technologies are introduced or materially changed, we will assess the associated data practices and update relevant disclosures and consent mechanisms where required."
          ]
        }
      ]
    },
    {
      id: "data-security",
      number: "06",
      title: "DATA SECURITY",
      paragraphs: [
        "Yuvaparipalan Foundation recognises the importance of protecting personal data against unauthorised access, loss, misuse, alteration or disclosure.",
        "We aim to maintain technical, organisational and administrative safeguards proportionate to the nature of the information processed and the risks involved.",
        "Depending on the system and its verified configuration, safeguards may include:"
      ],
      bullets: [
        "Access restrictions and authentication controls;",
        "Encryption in transit where implemented;",
        "Secure system configuration and software maintenance;",
        "Logging and monitoring of relevant security events;",
        "Backup and recovery arrangements;",
        "Incident investigation and response procedures;",
        "Restrictions on access to personal data based on operational need;",
        "Review of relevant service providers and their data-protection practices."
      ],
      paragraphsAfter: [
        "Access to personal data should be limited to authorised personnel and service providers who require it for legitimate operational purposes.",
        "No website, application, network or storage system can be guaranteed to be completely secure. Accordingly, we cannot promise absolute security.",
        "Where a security incident triggers a legal notification obligation, we will notify affected individuals, regulators or other relevant parties within the time and manner required by applicable law.",
        "The specific security measures described in this section must reflect controls actually implemented and verified. This Policy does not, by itself, represent a security certification or independent audit."
      ]
    },
    {
      id: "data-retention",
      number: "07",
      title: "DATA RETENTION",
      paragraphs: [
        "Yuvaparipalan Foundation retains personal data only for as long as reasonably necessary to fulfil the purposes for which it was collected, subject to applicable legal and regulatory requirements.",
        "Retention periods depend on the type of information, the relevant application, the purpose of processing and any applicable legal obligations.",
        "Examples include:"
      ],
      bullets: [
        "Account and profile data: Retained while an account is active and for the period reasonably necessary to complete deletion or resolve outstanding matters.",
        "Transaction and financial records: Retained for the period required by applicable accounting, tax, financial or other laws.",
        "Support and communication records: Retained as needed to resolve enquiries, manage complaints and maintain appropriate records.",
        "Technical and security logs: Retained for a limited period appropriate to troubleshooting, security and legal requirements.",
        "Backups: Retained according to the applicable backup lifecycle, after which residual copies are overwritten or deleted."
      ],
      paragraphsAfter: [
        "When personal data is no longer required and no lawful retention requirement remains, we will delete or irreversibly anonymise it, as appropriate.",
        "Certain information may need to be retained for legal compliance, security, fraud prevention or the establishment or defence of legal claims. Any such retention will be limited to the relevant lawful purpose and necessary period.",
        "The Foundation will maintain an internal retention schedule that records the actual retention periods for relevant data categories, applications and service providers."
      ],
      subsections: [
        {
          subtitle: "Account Deletion",
          paragraphs: [
            "Individuals who create accounts in applicable Yuvaparipalan applications may request account deletion and deletion of associated personal data.",
            "Account deletion request page: [https://yuvaparipalan.org/delete-account](https://yuvaparipalan.org/delete-account)",
            "Email: [support@yuvaparipalan.org](mailto:support@yuvaparipalan.org)",
            "The deletion page must be publicly accessible and operational before it is represented as an available request mechanism.",
            "Where an application supports account creation, the deletion option must also be readily discoverable within the application, in accordance with applicable app-store requirements.",
            "Following a valid request, we will take reasonable steps to verify the request, process it within the applicable legal period and communicate any material delay where required.",
            "We will delete or anonymise personal data that we are not legally required or otherwise lawfully permitted to retain. Where service providers process the relevant information on our behalf, we will take appropriate steps to request deletion from those providers, subject to applicable technical and legal limitations.",
            "Some records may be retained where required by law or where a limited lawful retention need applies. Residual backup copies may remain for a limited period under the applicable backup lifecycle.",
            "Account deletion may not automatically cancel a subscription or payment arrangement managed by an external app store or payment provider. Where applicable, individuals should separately manage or cancel such arrangements with the relevant provider."
          ]
        }
      ]
    },
    {
      id: "cookies-and-website-technologies",
      number: "08",
      title: "COOKIES AND WEBSITE TECHNOLOGIES",
      paragraphs: [
        "Our websites and web applications may use cookies, local storage, session identifiers and similar technologies to support essential functionality, maintain sessions, remember preferences, protect security and measure technical performance where appropriate.",
        "Depending on the website and its configuration, these technologies may be used for:"
      ],
      bullets: [
        "Essential website functions;",
        "Session management and security;",
        "Preference settings;",
        "Technical diagnostics;",
        "Analytics and performance measurement where enabled."
      ],
      paragraphsAfter: [
        "Where required by law, we will obtain consent before using non-essential cookies or similar technologies.",
        "Individuals may manage or disable cookies through their browser settings. Disabling essential cookies may affect certain website features.",
        "Mobile applications may use different technical mechanisms from websites and may require separate disclosures or controls."
      ]
    },
    {
      id: "third-party-websites-and-services",
      number: "09",
      title: "THIRD-PARTY WEBSITES AND SERVICES",
      paragraphs: [
        "Our websites and applications may contain links to external websites, partner services, payment providers or other third-party platforms.",
        "Yuvaparipalan Foundation does not control the independent privacy practices, content or security of third-party services that operate independently of the Foundation.",
        "Where a third party processes information on our behalf, we will seek appropriate safeguards consistent with its role and applicable law. Where a third party independently determines how it processes personal data, its own privacy policy may apply.",
        "If you choose to use an external service, we encourage you to review its privacy policy and terms before providing personal information."
      ],
      subsections: [
        {
          subtitle: "Analytics, Integrations and Artificial Intelligence",
          paragraphs: [
            "Where analytics tools, third-party SDKs or external artificial intelligence services are integrated into our applications, they may process information necessary to provide their functions.",
            "Before personal data is shared with an external service for a particular feature, we will provide appropriate notice and obtain consent where required by applicable law or platform policy.",
            "The Foundation must assess the actual data practices of relevant providers and ensure that the application's permissions, disclosures and store declarations accurately reflect those practices."
          ]
        },
        {
          subtitle: "International Data Transfers",
          paragraphs: [
            "Some service providers or infrastructure may process or store information outside the state or country in which an individual resides.",
            "Where personal data is transferred internationally, we will apply the safeguards, contractual protections, notices, consent requirements or other measures required by applicable law.",
            "We will not represent that all data remains exclusively in India unless that has been verified."
          ]
        }
      ]
    },
    {
      id: "your-privacy-rights",
      number: "10",
      title: "YOUR PRIVACY RIGHTS",
      paragraphs: [
        "Subject to applicable law, individuals may have the right to:"
      ],
      subsections: [
        {
          subtitle: "A. Access and Information",
          paragraphs: [
            "Request information about the personal data processed about them and, where legally available, request access to or a copy of that data."
          ]
        },
        {
          subtitle: "B. Correction and Rectification",
          paragraphs: [
            "Request correction or completion of inaccurate or incomplete personal data."
          ]
        },
        {
          subtitle: "C. Deletion",
          paragraphs: [
            "Request deletion of personal data, subject to applicable legal obligations and lawful retention exceptions."
          ]
        },
        {
          subtitle: "D. Consent Withdrawal",
          paragraphs: [
            "Withdraw consent where processing is based on consent. Withdrawal does not affect the lawfulness of processing carried out before withdrawal."
          ]
        },
        {
          subtitle: "E. Objection, Restriction and Portability",
          paragraphs: [
            "Request restriction of processing, object to certain processing or request portability where these rights are available under the applicable law."
          ]
        },
        {
          subtitle: "F. Marketing Preferences",
          paragraphs: [
            "Opt out of optional promotional communications. Essential account, service and security communications may continue where necessary."
          ]
        },
        {
          subtitle: "G. Complaints",
          paragraphs: [
            "Submit a privacy complaint to the Foundation and, where applicable, lodge a complaint with the relevant regulatory or supervisory authority."
          ]
        },
        {
          subtitle: "How to Exercise Your Rights",
          paragraphs: [
            "To submit a request, contact: [support@yuvaparipalan.org](mailto:support@yuvaparipalan.org)",
            "Please describe the request and provide enough information for us to understand and verify it. We may request proportionate information to verify your identity and prevent unauthorised disclosure.",
            "We will respond within the period required by applicable law. Some requests may be limited where a lawful exception applies, including mandatory record retention or the rights of other individuals. Where we cannot fulfil a request in full, we will explain the reason where required by law.",
            "Individuals may also manage available account settings, notifications and device permissions through the relevant application or device controls."
          ]
        }
      ]
    },
    {
      id: "policy-updates",
      number: "11",
      title: "POLICY UPDATES",
      paragraphs: [
        "Yuvaparipalan Foundation may update this Privacy Policy to reflect changes in its digital services, data-processing practices, service providers, security measures or legal obligations.",
        "When updates are made, the “Last Updated” date at the top of this Policy will be revised.",
        "Where required by law, or where a material change affects how personal data is processed, we will provide appropriate notice and obtain any additional consent required before applying the changed practice.",
        "The current version of this Policy will be published in the Legal Centre on the official Yuvaparipalan Foundation website.",
        "Continued use of a website or application does not replace consent where separate consent is required by applicable law."
      ]
    },
    {
      id: "contact-us",
      number: "12",
      title: "CONTACT US",
      paragraphs: [
        "If you have questions, concerns, requests or complaints regarding this Privacy Policy or our personal data practices, please contact:"
      ],
      paragraphsAfter: [
        "Please do not send passwords, one-time passcodes or unnecessary sensitive information by email.",
        "We will review privacy enquiries and complaints in accordance with applicable law. Where a specific grievance officer or statutory contact is required, the Foundation will publish the verified name and contact details in this Policy or a linked notice."
      ]
    },
    {
      id: "our-privacy-commitment",
      number: "13",
      title: "OUR PRIVACY COMMITMENT",
      paragraphs: [
        "At Yuvaparipalan Foundation, we believe that privacy, transparency and trust are essential to responsible digital services and meaningful social impact.",
        "We are committed to handling personal data responsibly, explaining our data practices clearly, applying appropriate safeguards and respecting the privacy rights available under applicable law.",
        "As our digital platform evolves, we will continue to review our data practices, service-provider arrangements and privacy controls to support responsible and secure use of the Yuvaparipalan Foundation Youth Empowerment Platform."
      ],
      callout: "Yuvaparipalan Foundation — Privacy, Trust and Responsible Data Protection."
    }
  ]
};
