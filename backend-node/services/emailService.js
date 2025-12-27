// Email service for sending notifications
// Note: Requires nodemailer package: npm install nodemailer

/**
 * Send email notification
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 * @param {string} text - Email plain text content (optional)
 */
export const sendEmail = async (to, subject, html, text = null) => {
  try {
    // Check if email service is configured
    if (!process.env.EMAIL_SERVICE_ENABLED || process.env.EMAIL_SERVICE_ENABLED !== 'true') {
      console.log(`[Email Service Disabled] Would send email to ${to}: ${subject}`);
      return { success: true, message: 'Email service disabled (mock mode)' };
    }

    // Dynamic import to avoid errors if nodemailer is not installed
    const nodemailer = await import('nodemailer');

    // Create transporter
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: to,
      subject: subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      html: html,
    });

    console.log(`Email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send alert notification email
 * @param {Object} user - User object with email
 * @param {Object} alert - Alert object
 * @param {Object} subscription - Subscription object (optional)
 */
export const sendAlertEmail = async (user, alert, subscription = null) => {
  if (!user || !user.email) {
    console.error('Cannot send email: user email not provided');
    return { success: false, error: 'User email not provided' };
  }

  let subject = '';
  let html = '';

  if (alert.type === 'budget') {
    subject = 'Budget Alert - Action Required';
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">Budget Alert</h2>
        <p>Hello ${user.name || 'User'},</p>
        <p>This is an automated notification regarding your budget.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Alert Type:</strong> Budget ${alert.severity || 'Warning'}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(alert.dueDate).toLocaleString()}</p>
        </div>
        <p>Please review your budget settings and spending to ensure you stay within your limits.</p>
        <p>Best regards,<br>Subscription Management System</p>
      </div>
    `;
  } else if (alert.type === 'renewal') {
    const subscriptionName = subscription?.name || 'Subscription';
    const renewalDate = subscription?.nextRenewalDate 
      ? new Date(subscription.nextRenewalDate).toLocaleDateString()
      : 'Unknown';
    
    subject = `Renewal Reminder - ${subscriptionName}`;
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">Subscription Renewal Reminder</h2>
        <p>Hello ${user.name || 'User'},</p>
        <p>This is a reminder that your subscription is due for renewal soon.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Subscription:</strong> ${subscriptionName}</p>
          <p style="margin: 5px 0;"><strong>Renewal Date:</strong> ${renewalDate}</p>
        </div>
        <p>Please ensure your payment method is up to date to avoid service interruption.</p>
        <p>Best regards,<br>Subscription Management System</p>
      </div>
    `;
  } else {
    subject = 'New Alert Notification';
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">New Alert</h2>
        <p>Hello ${user.name || 'User'},</p>
        <p>You have a new alert in your subscription management system.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Type:</strong> ${alert.type}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(alert.dueDate).toLocaleString()}</p>
        </div>
        <p>Please log in to your dashboard to view more details.</p>
        <p>Best regards,<br>Subscription Management System</p>
      </div>
    `;
  }

  return await sendEmail(user.email, subject, html);
};

export default {
  sendEmail,
  sendAlertEmail,
};

