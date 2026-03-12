import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const from = process.env.SMTP_FROM || 'noreply@phuketinternationalchurch.com';

  await transporter.sendMail({
    from: `Phuket International Church <${from}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const adminEmail = process.env.SMTP_USER || 'admin@phuketinternationalchurch.com';
  await sendEmail({
    to: adminEmail,
    subject: `New Contact Form: ${data.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${data.name} &lt;${data.email}&gt;</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    `,
  });
}

export async function sendNewsletterConfirmation(email: string, token: string, locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
  const confirmUrl = `${baseUrl}/api/newsletter/confirm?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Confirm your subscription — Phuket International Church',
    html: `
      <h2>Thanks for subscribing!</h2>
      <p>Please click the link below to confirm your subscription to updates from Phuket International Church.</p>
      <p><a href="${confirmUrl}" style="background:#437086;color:white;padding:12px 24px;border-radius:4px;text-decoration:none;display:inline-block;">Confirm Subscription</a></p>
      <p>If you didn't subscribe, you can ignore this email.</p>
    `,
    text: `Confirm your subscription: ${confirmUrl}`,
  });
}
