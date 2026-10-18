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

// Generate Industry-Standard Payment & Membership Tax Invoice HTML
function buildPaymentConfirmationHTML(formData: Record<string, any>) {
  const memberName = formData.fullName || 'Valued Member';
  const orderCode = formData.orderCode || formData.order_code || 'ORD-UNKNOWN';
  const paymentId = formData.paymentId || formData.gateway_payment_id || 'PAY-VERIFIED';
  const subscriptionId = formData.subscriptionId || formData.subscription_id || 'SUB-ACTIVATED';
  const transactionDate = formData.transactionDate || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'long', timeStyle: 'short' });
  const paymentMethod = formData.paymentMethod || 'Razorpay Enterprise Gateway (UPI / NetBanking / Cards)';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Receipt & Official Membership Confirmation - Changepreneur Circle</title>
    </head>
    <body style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px; color: #1e293b;">
      <div style="max-width: 680px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 35px rgba(15, 45, 30, 0.12); border: 1px solid #e2e8f0;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%); padding: 36px 30px; text-align: center; color: #ffffff;">
          <div style="display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 9999px; padding: 6px 16px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px;">
            Official Tax Invoice & Membership Receipt
          </div>
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">YUVAPARIPALAN FOUNDATION</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #a7f3d0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Changepreneur Circle • Governing Secretariat</p>
        </div>

        <!-- Success Hero -->
        <div style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
          <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px;">
            <div style="color: #065f46; font-size: 16px; font-weight: 800; margin-bottom: 4px;">
              ✓ Payment Verified & Membership Officially Activated
            </div>
            <div style="color: #047857; font-size: 13px; line-height: 1.5;">
              Dear <strong>${memberName}</strong>, your membership enrollment transaction has been cryptographically confirmed and reconciled in the Foundation's commercial ledger. Welcome to the Changepreneur Circle!
            </div>
          </div>

          <!-- Transaction Summary Cards -->
          <table style="width: 100%; border-collapse: separate; border-spacing: 10px 0; margin-bottom: 24px;">
            <tr>
              <td style="width: 50%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px;">
                <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">Order Reference</div>
                <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 4px; font-family: monospace;">${orderCode}</div>
              </td>
              <td style="width: 50%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px;">
                <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">Razorpay Payment ID</div>
                <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 4px; font-family: monospace;">${paymentId}</div>
              </td>
            </tr>
          </table>

          <!-- Tax Invoice Schedule -->
          <div style="border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; margin-bottom: 26px;">
            <div style="background: #0f2d1e; color: #ffffff; padding: 12px 18px; font-size: 13px; font-weight: 700;">
              Invoice & Financial Settlement Summary
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tbody>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 11px 18px; color: #64748b; width: 45%;">Program & Tier</td>
                  <td style="padding: 11px 18px; font-weight: 700; color: #0f172a;">Changepreneur Circle Annual Membership (CCPM100)</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
                  <td style="padding: 11px 18px; color: #64748b;">Member Name</td>
                  <td style="padding: 11px 18px; font-weight: 600; color: #0f172a;">${memberName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 11px 18px; color: #64748b;">Contact Details</td>
                  <td style="padding: 11px 18px; color: #0f172a;">${formData.email || 'N/A'} • ${formData.phone || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
                  <td style="padding: 11px 18px; color: #64748b;">Transaction Timestamp</td>
                  <td style="padding: 11px 18px; color: #0f172a;">${transactionDate}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 11px 18px; color: #64748b;">Subscription Reference ID</td>
                  <td style="padding: 11px 18px; font-family: monospace; color: #0f172a;">${subscriptionId}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
                  <td style="padding: 11px 18px; color: #64748b;">Payment Method / Gateway</td>
                  <td style="padding: 11px 18px; color: #0f172a;">${paymentMethod}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 11px 18px; color: #64748b;">Taxable Base Value</td>
                  <td style="padding: 11px 18px; color: #0f172a;">₹25,423.73</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0; background: #fafafa;">
                  <td style="padding: 11px 18px; color: #64748b;">Integrated GST (18% / CGST 9% + SGST 9%)</td>
                  <td style="padding: 11px 18px; color: #0f172a;">₹4,576.27</td>
                </tr>
                <tr style="background: #ecfdf5; font-size: 15px; font-weight: 800;">
                  <td style="padding: 14px 18px; color: #065f46;">Total Gross Amount Paid</td>
                  <td style="padding: 14px 18px; color: #065f46;">₹30,000.00 (INR)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Allocated Entitlements Box -->
          <div style="background: #fdfdfd; border: 1px solid #cbd5e1; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
            <div style="font-size: 14px; font-weight: 800; color: #064e3b; margin-bottom: 12px;">
              ★ Your Activated Changepreneur Circle Privileges:
            </div>
            <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px; line-height: 1.8;">
              <li><strong>10 Student Annual Sponsorships:</strong> Allocated in your name for underprivileged tech scholars.</li>
              <li><strong>CAERING Smart Ring VIP Launch:</strong> Pre-reservation confirmed with complimentary sizing kit.</li>
              <li><strong>Neurosync BCI 180-Day Pass:</strong> Full cognitive analytics & neuroscience lab access.</li>
              <li><strong>₹5,000 Event Voucher:</strong> Credited for National Impact Summits & Workshops.</li>
              <li><strong>Mastermind Syndicate:</strong> Direct access to the exclusive Changepreneur Circle private channel.</li>
            </ul>
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 0;">
            This electronic document serves as an authentic payment receipt and tax invoice issued by Yuvaparipalan Foundation. If you need any assistance regarding your onboarding or student allocation, reach out directly to the Secretariat at <strong>secretariat@yuvaparipalan.org</strong> or <strong>+91 95628 58868</strong>.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 22px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 4px 0; font-weight: 700; color: #334155;">Yuvaparipalan Foundation (Section 8 Non-Profit Organization)</p>
          <p style="margin: 0 0 6px 0;">CIN: U85300TZ2021NPL035824 • Registered Offices: Coimbatore, TN & Kannur, KL, India</p>
          <p style="margin: 0; color: #94a3b8;">© ${new Date().getFullYear()} Yuvaparipalan Foundation. All rights reserved.</p>
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
  const isPaymentConfirmed = formType === 'changepreneur_payment_confirmed' || formType === 'membership_payment_confirmed';
  const orderRef = formData.orderCode || formData.order_code || '';

  // 1. Send Confirmation Email to Submitting Person
  const userMailOptions = {
    from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
    to: recipientEmail,
    subject: isPaymentConfirmed
      ? `Payment Confirmed & Membership Activated - Changepreneur Circle (${orderRef || '₹30,000'})`
      : formType === 'volunteer'
      ? `Volunteer Registration Received - Yuvaparipalan Foundation`
      : formType === 'partner'
      ? `Partnership Inquiry Received - Yuvaparipalan Foundation`
      : `Thank you for contacting Yuvaparipalan Foundation`,
    html: isPaymentConfirmed
      ? buildPaymentConfirmationHTML(formData)
      : buildUserConfirmationHTML(formType, formData),
  };

  // 2. Send Admin Intimation Email to Admin
  const adminMailOptions = {
    from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
    to: SMTP_FROM_EMAIL,
    replyTo: recipientEmail,
    subject: isPaymentConfirmed
      ? `[PAYMENT CONFIRMED] ₹30,000 Changepreneur Circle Membership - ${submitterName} (${orderRef})`
      : `[WEBSITE SUBMISSION] New ${formType.toUpperCase()} request from ${submitterName}`,
    html: isPaymentConfirmed
      ? buildPaymentConfirmationHTML(formData)
      : buildAdminIntimationHTML(formType, formData),
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

