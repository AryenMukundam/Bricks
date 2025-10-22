import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

class OTPService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendOTP(email , otp , studentName){
        try {
            const mailOptions = {
                from: `"BRICKS Education" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Password Change OTP - BRICKS Dashboard',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                            .otp-box { background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
                            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>BRICKS Dashboard</h1>
                                <p>Password Change Verification</p>
                            </div>
                            <div class="content">
                                <h2>Hello ${studentName}!</h2>
                                <p>You have requested to change your password. Please use the OTP below to verify your identity:</p>
                                
                                <div class="otp-box">
                                    <p style="margin: 0; color: #666;">Your OTP Code</p>
                                    <div class="otp-code">${otp}</div>
                                    <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Valid for 10 minutes</p>
                                </div>
                                
                                <div class="warning">
                                    <strong>⚠️ Security Notice:</strong>
                                    <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                                        <li>Never share this OTP with anyone</li>
                                        <li>BRICKS staff will never ask for your OTP</li>
                                        <li>If you didn't request this, please contact support immediately</li>
                                    </ul>
                                </div>
                                
                                <p>If you didn't request this password change, please ignore this email or contact our support team.</p>
                            </div>
                            <div class="footer">
                                <p>© ${new Date().getFullYear()} BRICKS Dashboard. All rights reserved.</p>
                                <p>This is an automated email, please do not reply.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };

            await this.transporter.sendMail(mailOptions);
            return { success: true };
        } catch (error) {
            console.error('Email sending error:', error);
            return { success: false, error: error.message };
        }
    }

    async sendPasswordChangeConfirmation(email, studentName) {
        try {
            const mailOptions = {
                from: `"BRICKS Education" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Password Changed Successfully - BRICKS Dashboard',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                            .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
                            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>BRICKS Dashboard</h1>
                                <p>Password Changed Successfully</p>
                            </div>
                            <div class="content">
                                <h2>Hello ${studentName}!</h2>
                                <div class="success-box">
                                    <strong>✅ Success!</strong>
                                    <p style="margin: 10px 0 0 0;">Your password has been changed successfully.</p>
                                </div>
                                <p>You can now login with your new password. If you didn't make this change, please contact our support team immediately.</p>
                                <p style="margin-top: 30px;">Happy learning!</p>
                            </div>
                            <div class="footer">
                                <p>© ${new Date().getFullYear()} BRICKS Dashboard. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };

            await this.transporter.sendMail(mailOptions);
            return { success: true };
        } catch (error) {
            console.error('Email sending error:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new OTPService();