import dotenv from "dotenv";
dotenv.config();
import studentModel from "../models/student.model.js";
import { sendMail } from "../config/mail.config.js";

class NotificationService {
  async getStudentsByBatch(batch) {
    try {
      return await studentModel.find({ batch }).select("email fullname");
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  }

  formatDate(date) {
    return new Date(date).toLocaleString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  }

  // Calculate hours until class
  getHoursUntilClass(scheduledAt) {
    return Math.round((new Date(scheduledAt) - new Date()) / (1000 * 60 * 60));
  }

  // Send class scheduled notification
  async sendClassScheduledNotification(batch, classData, instructorName) {
    try {
      const students = await this.getStudentsByBatch(batch);

      if (students.length === 0) {
        console.log("No students found in batch:", batch);
        return { success: true, emailsSent: 0 };
      }

      const {
        className,
        description,
        scheduledAt,
        duration,
        googleMeetLink,
        preReadLinks,
      } = classData;
      const formattedDate = this.formatDate(scheduledAt);

      // Generate pre-read links HTML
      const preReadLinksHtml =
        preReadLinks && preReadLinks.length > 0
          ? `
                    <div style="margin: 20px 0;">
                        <h3 style="color: #667eea; margin-bottom: 15px;">📚 Pre-Read Materials</h3>
                        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e0e0e0;">
                            ${preReadLinks
                              .map(
                                (link) => `
                                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
                                    <a href="${
                                      link.url
                                    }" style="color: #667eea; text-decoration: none; font-weight: bold; font-size: 16px; display: block; margin-bottom: 5px;">
                                        🔗 ${link.title}
                                    </a>
                                    ${
                                      link.description
                                        ? `<p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${link.description}</p>`
                                        : ""
                                    }
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                `
          : "";
      await Promise.all(
        students.map(async (student) => {
          const mailOptions = {
            from: `"BRICKS Education" <${process.env.EMAIL_USER}>`,
            to: student.email,
            subject: `New Class Scheduled: ${className} - BRICKS Dashboard`,
            html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
                                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                .content { background: white; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                                .class-card { background: #f9f9f9; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
                                .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
                                .info-label { color: #667eea; font-weight: bold; display: inline-block; width: 120px; }
                                .meet-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
                                .reminder-box { background: #e8f4f8; border-left: 4px solid #17a2b8; padding: 15px; margin: 20px 0; border-radius: 5px; }
                                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; padding: 20px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1 style="margin: 0;">🧱 BRICKS Dashboard</h1>
                                    <p style="font-size: 18px; margin: 10px 0 0 0;">New Class Scheduled</p>
                                </div>
                                <div class="content">
                                    <h2 style="color: #333;">Hello ${
                                      student.fullname.firstname
                                    }! 👋</h2>
                                    <p style="color: #666; font-size: 16px;">A new class has been scheduled for your batch. Mark your calendar!</p>
                                    
                                    <div class="class-card">
                                        <h2 style="margin-top: 0; color: #667eea;">📖 ${className}</h2>
                                        ${
                                          description
                                            ? `<p style="color: #666; margin: 10px 0;">${description}</p>`
                                            : ""
                                        }
                                        
                                        <div class="info-row">
                                            <span class="info-label">👨‍🏫 Instructor:</span>
                                            <span>${instructorName}</span>
                                        </div>
                                        
                                        <div class="info-row">
                                            <span class="info-label">🎯 Batch:</span>
                                            <span>${batch}</span>
                                        </div>
                                        
                                        <div class="info-row">
                                            <span class="info-label">📅 Date & Time:</span>
                                            <span>${formattedDate}</span>
                                        </div>
                                        
                                        <div class="info-row">
                                            <span class="info-label">⏱️ Duration:</span>
                                            <span>${duration} minutes</span>
                                        </div>
                                    </div>

                                    ${preReadLinksHtml}

                                    <div style="text-align: center; margin: 30px 0;">
                                        <a href="${googleMeetLink}" class="meet-button" style="color: white;">
                                            🎥 Join Google Meet
                                        </a>
                                        <p style="color: #666; font-size: 14px; margin-top: 10px;">
                                            Save this link to join the class at scheduled time
                                        </p>
                                    </div>

                                    <div class="reminder-box">
                                        <strong>💡 Reminder:</strong>
                                        <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #666;">
                                            <li>Review the pre-read materials before class</li>
                                            <li>Join the class on time</li>
                                            <li>Keep your questions ready</li>
                                            <li>Ensure stable internet connection</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="footer">
                                    <p style="margin: 5px 0;">© ${new Date().getFullYear()} BRICKS Dashboard. All rights reserved.</p>
                                    <p style="margin: 5px 0;">This is an automated notification. Please do not reply to this email.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
          };

          await sendMail(mailOptions);
        })
      );
      return { success: true, emailsSent: students.length };
    } catch (error) {
      console.error("Class scheduled notification error:", error);
      return { success: false, error: error.message };
    }
  }

  // Send class updated notification
  async sendClassUpdatedNotification(
    batch,
    classData,
    instructorName,
    updatedFields
  ) {
    try {
      const students = await this.getStudentsByBatch(batch);

      if (students.length === 0) {
        console.log("No students found in batch:", batch);
        return { success: true, emailsSent: 0 };
      }

      const { className, description, scheduledAt, duration, googleMeetLink } =
        classData;
      const formattedDate = this.formatDate(scheduledAt);

      // Generate changes list
      const changesHtml =
        updatedFields && updatedFields.length > 0
          ? `
                    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <strong style="color: #856404;">⚠️ What Changed:</strong>
                        <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #856404;">
                            ${updatedFields
                              .map((field) => `<li>${field}</li>`)
                              .join("")}
                        </ul>
                    </div>
                `
          : "";
      await Promise.all(
        students.map(async (student) => {
          const mailOptions = {
            from: `"BRICKS Education" <${process.env.EMAIL_USER}>`,
            to: student.email,
            subject: `Class Updated: ${className} - BRICKS Dashboard`,
            html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
                                .header { background: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                .content { background: white; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                                .class-card { background: #f9f9f9; border-left: 4px solid #ff9a56; padding: 20px; margin: 20px 0; border-radius: 5px; }
                                .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
                                .info-label { color: #ff9a56; font-weight: bold; display: inline-block; width: 120px; }
                                .meet-button { display: inline-block; background: #ff9a56; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
                                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; padding: 20px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1 style="margin: 0;">🧱 BRICKS Dashboard</h1>
                                    <p style="font-size: 18px; margin: 10px 0 0 0;">⚠️ Class Updated</p>
                                </div>
                                <div class="content">
                                    <h2 style="color: #333;">Hello ${
                                      student.fullname.firstname
                                    }! 👋</h2>
                                    <p style="color: #666; font-size: 16px;">Important update about your upcoming class:</p>
                                    
                                    ${changesHtml}

                                    <div class="class-card">
                                        <h2 style="margin-top: 0; color: #ff9a56;">📖 ${className}</h2>
                                        ${
                                          description
                                            ? `<p style="color: #666; margin: 10px 0;">${description}</p>`
                                            : ""
                                        }
                                        
                                        <div class="info-row">
                                            <span class="info-label">👨‍🏫 Instructor:</span>
                                            <span>${instructorName}</span>
                                        </div>
                                        
                                        <div class="info-row">
                                            <span class="info-label">🎯 Batch:</span>
                                            <span>${batch}</span>
                                        </div>
                                        
                                        <div class="info-row">
                                            <span class="info-label">📅 Date & Time:</span>
                                            <span>${formattedDate}</span>
                                        </div>
                                        
                                        <div class="info-row">
                                            <span class="info-label">⏱️ Duration:</span>
                                            <span>${duration} minutes</span>
                                        </div>
                                    </div>

                                    <div style="text-align: center; margin: 30px 0;">
                                        <a href="${googleMeetLink}" class="meet-button" style="color: white;">
                                            🎥 Join Google Meet
                                        </a>
                                    </div>

                                    <div style="background: #e8f4f8; border-left: 4px solid #17a2b8; padding: 15px; margin: 20px 0; border-radius: 5px;">
                                        <strong style="color: #0c5460;">💡 Note:</strong>
                                        <p style="margin: 10px 0 0 0; color: #0c5460;">Please note the updated details and adjust your schedule accordingly.</p>
                                    </div>
                                </div>
                                <div class="footer">
                                    <p style="margin: 5px 0;">© ${new Date().getFullYear()} BRICKS Dashboard. All rights reserved.</p>
                                    <p style="margin: 5px 0;">This is an automated notification. Please do not reply to this email.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
          };

          await sendMail(mailOptions);
        })
      );
      return { success: true, emailsSent: students.length };
    } catch (error) {
      console.error("Class updated notification error:", error);
      return { success: false, error: error.message };
    }
  }

  // Send class cancelled notification
  async sendClassCancelledNotification(
    batch,
    classData,
    instructorName,
    reason = null
  ) {
    try {
      const students = await this.getStudentsByBatch(batch);

      if (students.length === 0) {
        console.log("No students found in batch:", batch);
        return { success: true, emailsSent: 0 };
      }

      const { className, scheduledAt } = classData;
      const formattedDate = this.formatDate(scheduledAt);

      await Promise.all(
        students.map(async (student) => {
          const mailOptions = {
            from: `"BRICKS Education" <${process.env.EMAIL_USER}>`,
            to: student.email,
            subject: `Class Cancelled: ${className} - BRICKS Dashboard`,
            html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
                                .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                .content { background: white; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                                .class-card { background: #f9f9f9; border-left: 4px solid #dc3545; padding: 20px; margin: 20px 0; border-radius: 5px; }
                                .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
                                .info-label { color: #dc3545; font-weight: bold; display: inline-block; width: 120px; }
                                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; padding: 20px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1 style="margin: 0;">🧱 BRICKS Dashboard</h1>
                                    <p style="font-size: 18px; margin: 10px 0 0 0;">❌ Class Cancelled</p>
                                </div>
                                <div class="content">
                                    <h2 style="color: #333;">Hello ${
                                      student.fullname.firstname
                                    }! 👋</h2>
                                    
                                    <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px;">
                                        <strong style="color: #721c24;">⚠️ Important Notice:</strong>
                                        <p style="margin: 10px 0 0 0; color: #721c24;">The following class has been cancelled.</p>
                                    </div>

                                    <div class="class-card">
                                        <h2 style="margin-top: 0; color: #dc3545;">📖 ${className}</h2>
                                        
                                        <div class="info-row">
                                            <span class="info-label">👨‍🏫 Instructor:</span>
                                            <span>${instructorName}</span>
                                        </div>
                                        
                                        <div class="info-row">
                                            <span class="info-label">🎯 Batch:</span>
                                            <span>${batch}</span>
                                        </div>
                                        
                                        <div class="info-row">
                                            <span class="info-label">📅 Was Scheduled:</span>
                                            <span>${formattedDate}</span>
                                        </div>

                                        ${
                                          reason
                                            ? `
                                            <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 5px; border: 1px solid #e0e0e0;">
                                                <strong style="color: #dc3545;">Reason:</strong>
                                                <p style="margin: 10px 0 0 0; color: #666;">${reason}</p>
                                            </div>
                                        `
                                            : ""
                                        }
                                    </div>

                                    <div style="background: #e8f4f8; border-left: 4px solid #17a2b8; padding: 15px; margin: 20px 0; border-radius: 5px;">
                                        <strong style="color: #0c5460;">💡 What's Next:</strong>
                                        <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #0c5460;">
                                            <li>Check your dashboard for any rescheduled classes</li>
                                            <li>Contact your instructor if you have questions</li>
                                            <li>Stay tuned for further updates</li>
                                        </ul>
                                    </div>

                                    <p style="color: #666; text-align: center; margin-top: 30px;">We apologize for any inconvenience caused. If this class is rescheduled, you will receive another notification.</p>
                                </div>
                                <div class="footer">
                                    <p style="margin: 5px 0;">© ${new Date().getFullYear()} BRICKS Dashboard. All rights reserved.</p>
                                    <p style="margin: 5px 0;">This is an automated notification. Please do not reply to this email.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
          };

          await sendMail(mailOptions);
        })
      );

      return { success: true, emailsSent: students.length };
    } catch (error) {
      console.error("Class cancelled notification error:", error);
      return { success: false, error: error.message };
    }
  }

  // Send class reminder (can be called 24 hours before class)
  async sendClassReminderNotification(batch, classData, instructorName) {
    try {
      const students = await this.getStudentsByBatch(batch);

      if (students.length === 0) {
        console.log("No students found in batch:", batch);
        return { success: true, emailsSent: 0 };
      }

      const { className, scheduledAt, duration, googleMeetLink, preReadLinks } =
        classData;
      const formattedDate = this.formatDate(scheduledAt);
      const hoursUntil = this.getHoursUntilClass(scheduledAt);

      await Promise.all(
        students.map(async (student) => {
          const mailOptions = {
            from: `"BRICKS Education" <${process.env.EMAIL_USER}>`,
            to: student.email,
            subject: `Reminder: ${className} starts in ${hoursUntil} hours - BRICKS Dashboard`,
            html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
                                .header { background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                .content { background: white; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                                .reminder-badge { background: #ffc107; color: #333; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold; margin: 20px 0; }
                                .class-card { background: #f9f9f9; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 5px; }
                                .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
                                .info-label { color: #ffc107; font-weight: bold; display: inline-block; width: 120px; }
                                .meet-button { display: inline-block; background: #ffc107; color: #333; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
                                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; padding: 20px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1 style="margin: 0;">🧱 BRICKS Dashboard</h1>
                                    <p style="font-size: 18px; margin: 10px 0 0 0;">⏰ Class Reminder</p>
                                </div>
                                <div class="content">
                                    <h2 style="color: #333;">Hello ${
                                      student.fullname.firstname
                                    }! 👋</h2>
                                    
                                    <div style="text-align: center;">
                                        <div class="reminder-badge">
                                            ⏰ Starting in ${hoursUntil} hours
                                        </div>
                                    </div>

                                    <p style="color: #666; font-size: 16px; text-align: center;">Don't forget about your upcoming class!</p>

                                    <div class="class-card">
                                        <h2 style="margin-top: 0; color: #ffc107;">📖 ${className}</h2>
                                        
                                        <div class="info-row">
                                            <span class="info-label">👨‍🏫 Instructor:</span>
                                            <span>${instructorName}</span>
                                        </div>
                                        
                                        <div class="info-row">
                                            <span class="info-label">📅 Date & Time:</span>
                                            <span>${formattedDate}</span>
                                        </div>
                                        
                                        <div class="info-row">
                                            <span class="info-label">⏱️ Duration:</span>
                                            <span>${duration} minutes</span>
                                        </div>
                                    </div>

                                    ${
                                      preReadLinks && preReadLinks.length > 0
                                        ? `
                                        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
                                            <strong style="color: #856404;">📚 Last Chance:</strong>
                                            <p style="margin: 10px 0 0 0; color: #856404;">Don't forget to review the pre-read materials before class!</p>
                                        </div>
                                    `
                                        : ""
                                    }

                                    <div style="text-align: center; margin: 30px 0;">
                                        <a href="${googleMeetLink}" class="meet-button" style="color: #333;">
                                            🎥 Join Google Meet
                                        </a>
                                    </div>

                                    <div style="background: #e8f4f8; border-left: 4px solid #17a2b8; padding: 15px; margin: 20px 0; border-radius: 5px;">
                                        <strong style="color: #0c5460;">✅ Quick Checklist:</strong>
                                        <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #0c5460;">
                                            <li>Review pre-read materials</li>
                                            <li>Test your internet connection</li>
                                            <li>Keep your questions ready</li>
                                            <li>Join 5 minutes early</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="footer">
                                    <p style="margin: 5px 0;">© ${new Date().getFullYear()} BRICKS Dashboard. All rights reserved.</p>
                                    <p style="margin: 5px 0;">This is an automated reminder. Please do not reply to this email.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
          };

          await sendMail(mailOptions);
        })
      );
      return { success: true, emailsSent: students.length };
    } catch (error) {
      console.error("Class reminder notification error:", error);
      return { success: false, error: error.message };
    }
  }
}

export default new NotificationService();
