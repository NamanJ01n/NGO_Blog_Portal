// Mirrors com.ngoportal.backend.service.EmailService
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS, not implicit TLS -- matches spring.mail.properties.mail.smtp.starttls.enable=true
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});

const fromAddress = process.env.MAIL_USERNAME;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const backendPort = process.env.PORT || "8080";
const backendUrl = process.env.BACKEND_URL || `http://localhost:${backendPort}`;

async function sendVerificationEmail(toEmail, name, token) {
  // Link to backend API which will verify and redirect to frontend.
  // NOTE: kept exactly as in the Java version -- this always points at
  // localhost regardless of where the backend is actually deployed.
  const link = `${backendUrl}/api/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: fromAddress,
    to: toEmail,
    subject: "Verify your NGO Portal account",
    text:
      `Hi ${name},\n\n` +
      `Please verify your email to activate your NGO Portal account:\n${link}\n\n` +
      `This link expires in 24 hours. If you did not request this, ignore this email.\n\n` +
      `- NGO Portal Team`,
  });
}

async function sendNewCommentNotification(authorEmail, authorName, blogTitle, studentName, commentText, blogId) {
  const link = `${frontendUrl}/blogs/${blogId}`;

  await transporter.sendMail({
    from: fromAddress,
    to: authorEmail,
    subject: `New question on your blog post: ${blogTitle}`,
    text:
      `Hi ${authorName},\n\n` +
      `${studentName} commented on your blog post "${blogTitle}":\n\n` +
      `"${commentText}"\n\n` +
      `Reply here: ${link}\n\n` +
      `- NGO Portal`,
  });
}

async function sendCommentReplyNotification(studentEmail, studentName, adminName, replyText, blogId) {
  const link = `${frontendUrl}/blogs/${blogId}`;

  await transporter.sendMail({
    from: fromAddress,
    to: studentEmail,
    subject: "You got a reply to your question",
    text:
      `Hi ${studentName},\n\n` +
      `${adminName} replied to your question:\n\n` +
      `"${replyText}"\n\n` +
      `View it here: ${link}\n\n` +
      `- NGO Portal`,
  });
}

async function sendPasswordResetEmail(toEmail, name, token) {
  // This one links to the frontend (a form to enter a new password),
  // unlike the verification link which hits the backend directly.
  const link = `${frontendUrl}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: fromAddress,
    to: toEmail,
    subject: "Reset your NGO Portal password",
    text:
      `Hi ${name},\n\n` +
      `We received a request to reset your password. Click the link below to choose a new one:\n${link}\n\n` +
      `This link expires in 1 hour. If you did not request this, you can safely ignore this email ` +
      `and your password will remain unchanged.\n\n` +
      `- NGO Portal Team`,
  });
}

module.exports = {
  sendVerificationEmail,
  sendNewCommentNotification,
  sendCommentReplyNotification,
  sendPasswordResetEmail,
};
