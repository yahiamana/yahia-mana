import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * sendMail - Reusable SMTP helper
 */
export async function sendMail({ to, subject, text, html }: MailOptions) {
  // If SMTP isn't configured, just log and skip in development
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP credentials missing in production environment");
    }
    console.log("📨 [Mail Mock]", { to, subject, text });
    return;
  }

  return await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Portfolio" <noreply@yahiamana.com>',
    to,
    subject,
    text,
    html: html || text,
  });
}

/**
 * sendContactNotification - Notify admin of new message
 */
export async function sendContactNotification(data: { name: string; email: string; subject?: string; message: string }) {
  const adminEmail = process.env.CONTACT_EMAIL || "mana.yahia@gmail.com";
  
  await sendMail({
    to: adminEmail,
    subject: `New Portfolio Message: ${data.subject || "No Subject"}`,
    text: `You have a new message from ${data.name} (${data.email}):\n\n${data.message}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f4f4f4; padding: 1rem; border-left: 4px solid #ccc;">
        ${data.message.replace(/\n/g, "<br>")}
      </blockquote>
    `,
  });
}

/**
 * sendPasswordResetEmail - Send reset link to admin
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await sendMail({
    to: email,
    subject: "Password Reset Request - Portfolio Admin",
    text: `You requested a password reset. Click the link below to continue:\n\n${resetUrl}\n\nThis link expires in 1 hour.`,
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
      <a href="${resetUrl}" style="display: inline-block; background: #000; color: #fff; padding: 1rem 2rem; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}
