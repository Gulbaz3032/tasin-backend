import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendingEmail = async ({ email, subject, token }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Campus HR" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below:</p>
        <a href="${process.env.BASE_URL}/api/v1/verify/${token}">
          Verify Email
        </a>
      `,
    });

    console.log("✅ Email sent");
  } catch (err) {
    console.error("❌ Email error:", err);
  }
};
