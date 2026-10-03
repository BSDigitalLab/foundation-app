import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USERNAME = process.env.SMTP_USERNAME || 'brandingsparrowdl@gmail.com';
const SMTP_PASSWORD = (process.env.SMTP_PASSWORD || '').replace(/\s+/g, '');
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'brandingsparrowdl@gmail.com';
const SMTP_FROM_NAME = (process.env.SMTP_FROM_NAME || 'Yuvaparipalan Foundation').replace(/"/g, '');

// Create reusable Nodemailer transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for 587
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Helper to format field values into clean HTML table rows
function renderDataRows(data: Record<string, any>) {
  return Object.entries(data)
    .map(([key, value]) => {
      if (value === undefined || value === null || value === '') return '';
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
      
      const displayVal = Array.isArray(value) ? value.join(', ') : String(value);

      return `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b; width: 35%; background-color: #f8fafc;">
            ${formattedKey}
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #334155; line-height: 1.5;">
            ${displayVal}
          </td>
        </tr>
      `;
    })
    .join('');
}

// Generate Confirmation HTML Email Template for Submitting Person
function buildUserConfirmationHTML(formType: string, formData: Record<string, any>) {
  let title = 'Thank You for Contacting Yuvaparipalan Foundation!';
  let leadText = `Dear <strong>${formData.fullName || formData.contactPerson || 'Supporter'}</strong>,<br/><br/>Thank you for reaching out to Yuvaparipalan Foundation. We have successfully received your submission. Our team is reviewing your details and will get back to you shortly.`;

  if (formType === 'volunteer') {
    title = 'Volunteer Registration Confirmed!';
    leadText = `Dear <strong>${formData.fullName}</strong>,<br/><br/>Welcome to the National Volunteer Movement! Your volunteer registration has been successfully received. Our District Volunteer Coordinator will reach out to you via Email and WhatsApp shortly.`;
  } else if (formType === 'partner') {
    title = 'Institutional Partnership Application Received!';
    leadText = `Dear <strong>${formData.contactPerson}</strong> (${formData.organizationName}),<br/><br/>Thank you for initiating an institutional synergy with Yuvaparipalan Foundation. Our Corporate Relations team will connect with your organization within 24-48 business hours.`;
  } else if (formType === 'changepreneur') {
    title = 'Changepreneur Circle Membership Application Received!';
    leadText = `Dear <strong>${formData.fullName}</strong>,<br/><br/>Thank you for applying to join the prestigious <strong>Changepreneur Circle</strong> of Yuvaparipalan Foundation. Your application has been logged. Our membership committee will review your details and connect with you directly with official onboarding instructions and payment coordination.`;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #334155;">
      <div style="max-w: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #0f2d1e 0%, #15803d 100%); padding: 30px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">YUVAPARIPALAN FOUNDATION</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #bbf7d0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Empowering Youth & Building Nation</p>
        </div>

        <!-- Content Body -->
        <div style="padding: 32px 28px;">
          <h2 style="color: #0f2d1e; font-size: 20px; margin-top: 0; font-weight: 700;">${title}</h2>
          <p style="font-size: 15px; color: #475569; line-height: 1.6;">${leadText}</p>

          <!-- Summary Table -->
          <div style="margin: 24px 0; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #0f2d1e; color: #ffffff; padding: 10px 14px; font-size: 14px; font-weight: 700;">
              Summary of Submitted Information
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tbody>
                ${renderDataRows(formData)}
              </tbody>
            </table>
          </div>

          <p style="font-size: 14px; color: #64748b; line-height: 1.5;">
            If you have any urgent queries, please feel free to call our helpline at <strong>+91 95628 58868</strong> or email us at <strong>hello@yuvaparipalan.org</strong>.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          <p style="margin: 0 0 4px 0;"><strong>Yuvaparipalan Foundation Headquarters</strong></p>
          <p style="margin: 0 0 4px 0;">Kannur (Kerala) & Coimbatore (Tamil Nadu), India</p>
          <p style="margin: 8px 0 0 0; color: #94a3b8;">© ${new Date().getFullYear()} Yuvaparipalan Foundation. All rights reserved.</p>
        </div>

      </div>
    </body>
    </html>
  `;
}

// Generate Admin Intimation HTML Email Template
function buildAdminIntimationHTML(formType: string, formData: Record<string, any>) {
  const formTypeName = 
    formType === 'volunteer' ? 'VOLUNTEER REGISTRATION' :
    formType === 'partner' ? 'CSR / INSTITUTIONAL PARTNER APPLICATION' :
    formType === 'changepreneur' ? 'CHANGEPRENEUR CIRCLE MEMBERSHIP APPLICATION' : 'GENERAL CONTACT INQUIRY';

  const submitterName = formData.fullName || formData.contactPerson || 'Anonymous User';
  const submitterEmail = formData.email || 'N/A';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>[NEW ${formTypeName}] Submission Received</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #334155;">
      <div style="max-w: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
        
        <!-- Header Banner -->
        <div style="background-color: #0f2d1e; padding: 24px; color: #ffffff;">
          <span style="background-color: #166534; color: #bbf7d0; text-transform: uppercase; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; letter-spacing: 1px;">Admin Intimation Notification</span>
          <h2 style="margin: 10px 0 0 0; font-size: 20px; font-weight: 800;">New ${formTypeName}</h2>
        </div>

        <!-- Content Body -->
        <div style="padding: 28px;">
          <p style="font-size: 14px; color: #334155; margin-top: 0;">
            A new submission has been captured on the website from <strong>${submitterName}</strong> (&lt;a href="mailto:${submitterEmail}" style="color: #15803d; text-decoration: none;"&gt;${submitterEmail}&lt;/a&gt;).
          </p>

          <!-- Summary Table -->
          <div style="margin: 20px 0; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #f1f5f9; color: #0f2d1e; padding: 10px 14px; font-size: 13px; font-weight: 700; border-bottom: 1px solid #cbd5e1;">
              Complete Form Submission Data
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tbody>
                ${renderDataRows(formData)}
              </tbody>
            </table>
          </div>

          <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #065f46;">
            <strong>Action Required:</strong> Please assign a team representative to respond to <strong>${submitterEmail}</strong>.
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          Automated Intimation Dispatch • Yuvaparipalan Foundation Web Application
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Sends both Confirmation Email to user & Intimation Email to Admin
 */
export async function sendFormSubmissionEmails(formType: string, formData: Record<string, any>) {
  const recipientEmail = formData.email;
  if (!recipientEmail) {
    throw new Error('No user email address provided in form submission data.');
  }

  const submitterName = formData.fullName || formData.contactPerson || 'User';

  // 1. Send Confirmation Email to Submitting Person
  const userMailOptions = {
    from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
    to: recipientEmail,
    subject: 
      formType === 'volunteer' ? `Volunteer Registration Received - Yuvaparipalan Foundation` :
      formType === 'partner' ? `Partnership Inquiry Received - Yuvaparipalan Foundation` :
      `Thank you for contacting Yuvaparipalan Foundation`,
    html: buildUserConfirmationHTML(formType, formData),
  };

  // 2. Send Admin Intimation Email to Admin
  const adminMailOptions = {
    from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
    to: SMTP_FROM_EMAIL,
    replyTo: recipientEmail,
    subject: `[WEBSITE SUBMISSION] New ${formType.toUpperCase()} request from ${submitterName}`,
    html: buildAdminIntimationHTML(formType, formData),
  };

  try {
    // Dispatch both emails in parallel
    const [userResult, adminResult] = await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    return { success: true, userResult, adminResult };
  } catch (error: any) {
    console.error(`[SMTP ERROR] Failed to dispatch emails for ${formType}:`, error?.message || error);
    return { success: false, error: error?.message || 'SMTP Error' };
  }
}
