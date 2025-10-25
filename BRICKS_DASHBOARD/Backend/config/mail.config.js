import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

// Validate configuration on startup
console.log('=== SendGrid Configuration ===');
console.log('API Key exists:', !!process.env.SENDGRID_API_KEY);
console.log('API Key starts with SG.:', process.env.SENDGRID_API_KEY?.startsWith('SG.'));
console.log('API Key length:', process.env.SENDGRID_API_KEY?.length);
console.log('Email User:', process.env.EMAIL_USER);
console.log('==============================');

if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ CRITICAL: SENDGRID_API_KEY is not set!');
}

if (!process.env.SENDGRID_API_KEY?.startsWith('SG.')) {
  console.error('❌ WARNING: SENDGRID_API_KEY format looks incorrect. Should start with "SG."');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async (mail) => {
  try {
    console.log('\n📧 [SENDMAIL] Attempting to send email...');
    console.log('📧 [SENDMAIL] To:', mail.to);
    console.log('📧 [SENDMAIL] From:', mail.from);
    console.log('📧 [SENDMAIL] Subject:', mail.subject);
    
    const result = await sgMail.send(mail);
    
    console.log('✅ [SENDMAIL] Email sent successfully!');
    console.log('✅ [SENDMAIL] Status code:', result[0]?.statusCode);
    console.log('✅ [SENDMAIL] Message ID:', result[0]?.headers?.['x-message-id']);
    
    return result;
  } catch (error) {
    console.error("\n❌ [SENDMAIL] ERROR DETAILS:");
    console.error("❌ Error code:", error.code);
    console.error("❌ Error message:", error.message);
    
    if (error.response) {
      console.error("❌ Status code:", error.response.statusCode);
      console.error("❌ Response body:", JSON.stringify(error.response.body, null, 2));
      
      // Specific error handling
      if (error.response.statusCode === 401 || error.response.statusCode === 403) {
        console.error("❌ AUTHENTICATION ERROR: Your SendGrid API key is invalid or expired!");
        console.error("❌ Please generate a new API key from SendGrid dashboard");
      }
      
      if (error.response.body?.errors?.[0]?.message?.includes('does not match')) {
        console.error("❌ SENDER VERIFICATION ERROR: Email address not verified in SendGrid!");
        console.error("❌ Please verify", mail.from, "in SendGrid dashboard");
      }
    }
    
    throw error;
  }
};
