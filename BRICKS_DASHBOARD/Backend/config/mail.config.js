import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async (mail) => {
  try {
    await sgMail.send(mail);
    console.log(`✅ Email sent to ${mail.to}`);
  } catch (error) {
    console.error("❌ Mail error:", error.response?.body || error);
  }
};
