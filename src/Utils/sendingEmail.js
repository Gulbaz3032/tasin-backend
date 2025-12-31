import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendingEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const sendEmail = async () => {
    try {
      const info = await transporter.sendMail({
        from: `"Campus HR" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: `${process.env.BASE_URL}/api/v1/users/${options.route}/${options.token}`,
        html: "<h2>Hello!</h2><p>This email was sent using Nodemailer.</p>",
      });

      console.log("Email sent:", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // sendEmail();
};

// const options = {
//     email,
//     subject,
//     route,
//     token
// }

