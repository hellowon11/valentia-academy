const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, PNG, DOC, DOCX files are allowed.'), false);
    }
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Function to get course information based on language and course type
const getCourseInfo = (language, course) => {
  const courseInfo = {
    en: {
      advanced: {
        title: 'Advanced Cabin Crew Diploma',
        duration: '1 Year',
        description: 'Comprehensive training for international airlines'
      },
      english: {
        title: 'English Language Proficiency',
        duration: '6 Months',
        description: 'Aviation English and communication skills'
      },
      basic: {
        title: 'Basic Cabin Crew Training',
        duration: '6 Months',
        description: 'Foundation course for aviation career'
      }
    },
    zh: {
      advanced: {
        title: '高级空乘文凭',
        duration: '1年',
        description: '国际航空公司综合培训'
      },
      english: {
        title: '英语语言能力提升',
        duration: '6个月',
        description: '航空英语和沟通技巧'
      },
      basic: {
        title: '基础空乘培训',
        duration: '6个月',
        description: '航空职业基础课程'
      }
    },
    ko: {
      advanced: {
        title: '고급 객실승무원 디플로마',
        duration: '1년',
        description: '국제 항공사 종합 교육'
      },
      english: {
        title: '영어 능력 향상 과정',
        duration: '6개월',
        description: '항공 영어 및 커뮤니케이션 기술'
      },
      basic: {
        title: '기본 객실승무원 교육',
        duration: '6개월',
        description: '항공 경력 기초 과정'
      }
    },
    ja: {
      advanced: {
        title: '上級キャビンクルーディプロマ',
        duration: '1年',
        description: '国際航空会社向け総合訓練'
      },
      english: {
        title: '英語能力向上コース',
        duration: '6ヶ月',
        description: '航空英語とコミュニケーションスキル'
      },
      basic: {
        title: '基本キャビンクルー訓練',
        duration: '6ヶ月',
        description: '航空キャリア基礎コース'
      }
    }
  };
  
  return courseInfo[language]?.[course] || courseInfo.en[course] || courseInfo.en.basic;
};

// Auto-reply templates in different languages
const getAutoReplyTemplate = (language, name, userMessage, course) => {
  const templates = {
    en: {
      subject: 'Thank you for your inquiry - Valentia Cabin Crew Academy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Valentia Cabin Crew Academy</title>
          <style>
            @media only screen and (max-width: 600px) {
              .email-container {
                width: 100% !important;
                max-width: 380px !important;
                border-radius: 20px !important;
                box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
                overflow: hidden !important;
                margin: 0 auto !important;
              }
              .email-header {
                background: linear-gradient(135deg, #1a252f 0%, #2c3e50 50%, #34495e 100%) !important;
                padding: 36px 20px !important;
                position: relative !important;
              }
              .email-header::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background: linear-gradient(45deg, rgba(52, 152, 219, 0.1) 0%, rgba(155, 89, 182, 0.1) 100%) !important;
                pointer-events: none !important;
              }
              .logo-container {
                width: 80px !important;
                height: 80px !important;
                line-height: 80px !important;
                border: 4px solid rgba(255,255,255,0.2) !important;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
                position: relative !important;
                z-index: 1 !important;
              }
              .logo-text {
                font-size: 32px !important;
                font-weight: 700 !important;
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
              }
              .header-title {
                font-size: 26px !important;
                font-weight: 700 !important;
                letter-spacing: 2px !important;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
                position: relative !important;
                z-index: 1 !important;
              }
              .header-subtitle {
                font-size: 14px !important;
                font-weight: 500 !important;
                margin: 8px 0 0 0 !important;
                color: #ecf0f1 !important;
                letter-spacing: 1px !important;
                position: relative !important;
                z-index: 1 !important;
              }
              .header-tagline {
                font-size: 12px !important;
                letter-spacing: 1.5px !important;
                font-weight: 600 !important;
                margin: 16px 0 0 0 !important;
                color: #bdc3c7 !important;
                text-transform: uppercase !important;
                position: relative !important;
                z-index: 1 !important;
              }
              .email-content {
                padding: 28px 20px !important;
                background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%) !important;
              }
              .content-title {
                font-size: 30px !important;
                font-weight: 700 !important;
                margin-bottom: 24px !important;
                color: #2c3e50 !important;
                letter-spacing: 0.5px !important;
              }
              .content-text {
                margin-bottom: 20px !important;
                line-height: 1.7 !important;
                font-size: 19px !important;
                color: #34495e !important;
              }
              .content-text-large {
                margin-bottom: 28px !important;
                line-height: 1.7 !important;
                font-size: 19px !important;
                color: #34495e !important;
              }
              .section-container {
                margin: 28px 0 !important;
                border-radius: 12px !important;
                background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
                box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
                border: 1px solid #e9ecef !important;
              }
              .section-content {
                padding: 24px !important;
              }
              .section-title {
                font-size: 24px !important;
                font-weight: 700 !important;
                margin-bottom: 16px !important;
                color: #2c3e50 !important;
                letter-spacing: 0.5px !important;
              }
              .section-box {
                padding: 20px !important;
                border-radius: 10px !important;
                background: #ffffff !important;
                border: 1px solid #e9ecef !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
                font-size: 18px !important;
                line-height: 1.6 !important;
              }
              .inquiry-section {
                border-left: 5px solid #3498db !important;
                background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%) !important;
              }
              .course-section {
                border-left: 5px solid #27ae60 !important;
                background: linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 100%) !important;
              }
              .contact-container {
                margin: 32px 0 !important;
              }
              .contact-button {
                padding: 18px 28px !important;
                border: 2px solid !important;
                border-radius: 14px !important;
                font-size: 20px !important;
                font-weight: 700 !important;
                min-width: 140px !important;
                margin: 0 10px 20px 10px !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                background: #ffffff !important;
              }
              .contact-button:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
              }
              .email-button {
                border-color: #3498db !important;
                color: #3498db !important;
              }
              .website-button {
                border-color: #27ae60 !important;
                color: #27ae60 !important;
              }
              .social-container {
                margin: 28px 0 !important;
              }
              .social-text {
                margin-bottom: 20px !important;
                font-size: 18px !important;
                color: #7f8c8d !important;
                font-style: italic !important;
                font-weight: 500 !important;
              }
              .social-icon {
                width: 60px !important;
                height: 60px !important;
                border-radius: 18px !important;
                line-height: 60px !important;
                margin: 0 10px !important;
                box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
                transition: all 0.3s ease !important;
                position: relative !important;
                overflow: hidden !important;
              }
              .social-icon::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%) !important;
                pointer-events: none !important;
              }
              .social-icon:hover {
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
              }
              .social-icon-text {
                font-size: 24px !important;
                font-weight: 700 !important;
                position: relative !important;
                z-index: 1 !important;
              }
              .social-icon-text-small {
                font-size: 22px !important;
                font-weight: 700 !important;
                position: relative !important;
                z-index: 1 !important;
              }
              .email-footer {
                padding: 28px 20px !important;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
                border-top: 1px solid #dee2e6 !important;
              }
              .footer-title {
                font-weight: 700 !important;
                font-size: 20px !important;
                margin: 6px 0 !important;
                color: #2c3e50 !important;
                letter-spacing: 0.5px !important;
              }
              .footer-text {
                margin: 6px 0 !important;
                color: #6c757d !important;
                font-size: 17px !important;
                font-style: italic !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #2c3e50; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="text-align: center;">
                            <div class="logo-container" style="width: 80px; height: 80px; background-color: #ffffff; border-radius: 50%; margin: 0 auto 20px auto; display: inline-block; line-height: 80px; text-align: center; border: 3px solid #bdc3c7;">
                              <span class="logo-text" style="font-size: 32px; font-weight: bold; color: #2c3e50;">V</span>
                            </div>
                            <h1 class="header-title" style="margin: 0; font-size: 28px; font-weight: 300; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">Valentia</h1>
                            <p class="header-subtitle" style="margin: 8px 0 0 0; font-size: 14px; color: #bdc3c7; font-style: italic; letter-spacing: 1px;">Cabin Crew Academy</p>
                            <p class="header-tagline" style="margin: 15px 0 0 0; font-size: 12px; color: #95a5a6; text-transform: uppercase; letter-spacing: 1px;">Excellence in Aviation Training</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td class="email-content" style="padding: 40px 30px;">
                      <h2 class="content-title" style="color: #2c3e50; margin-bottom: 25px; font-size: 22px; font-weight: 400;">Dear ${name},</h2>
                      
                      <p class="content-text" style="line-height: 1.6; color: #34495e; font-size: 15px; margin-bottom: 20px;">
                        Thank you for your interest in <strong>Valentia Cabin Crew Academy</strong>. We are delighted to assist you in pursuing your aviation career aspirations.
                      </p>
                      
                      <p class="content-text-large" style="line-height: 1.6; color: #34495e; font-size: 15px; margin-bottom: 30px;">
                        We have received your inquiry and our dedicated team of aviation professionals will review your request and provide you with comprehensive information within <strong>24 hours</strong>.
                      </p>
                      
                      <!-- User Inquiry Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" class="section-container inquiry-section" style="background-color: #f8f9fa; border-left: 4px solid #95a5a6; margin: 30px 0;">
                        <tr>
                          <td class="section-content" style="padding: 25px;">
                            <h3 class="section-title" style="color: #2c3e50; margin-top: 0; font-size: 18px; margin-bottom: 15px; font-weight: 400;">Your Inquiry</h3>
                            <div class="section-box" style="color: #34495e; line-height: 1.6; font-size: 14px; margin: 0; padding: 15px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                              ${userMessage.replace(/\n/g, '<br>')}
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Training Programs Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" class="section-container course-section" style="background-color: #f8f9fa; border-left: 4px solid #95a5a6; margin: 30px 0;">
                        <tr>
                          <td class="section-content" style="padding: 25px;">
                            <h3 class="section-title" style="color: #2c3e50; margin-top: 0; font-size: 18px; margin-bottom: 15px; font-weight: 400;">Your Selected Course</h3>
                            <div class="section-box" style="color: #34495e; line-height: 1.6; font-size: 14px; margin: 0; padding: 15px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                              <strong>${getCourseInfo(language, course).title}</strong> (${getCourseInfo(language, course).duration}) - ${getCourseInfo(language, course).description}
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="line-height: 1.6; color: #34495e; font-size: 15px; margin-bottom: 35px;">
                        While you wait, please explore our website to learn more about our world-class training facilities, experienced instructors, and successful alumni network.
                      </p>
                      
                      <!-- Contact Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" class="contact-container" style="margin: 35px 0;">
                        <tr>
                          <td style="text-align: center;">
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                              <tr>
                                <td style="padding: 0 15px;">
                                  <a href="mailto:valentiacabincrew.academy@gmail.com" class="contact-button email-button" style="text-decoration: none; color: #2c3e50; font-size: 14px; display: inline-block; padding: 15px 25px; border: 1px solid #bdc3c7; border-radius: 8px; background-color: #f8f9fa;">
                                    <span style="display: block; font-size: 24px; margin-bottom: 8px;">✉</span>
                                    <span style="font-weight: 500;">Send Email</span>
                                  </a>
                                </td>
                                <td style="padding: 0 15px;">
                                  <a href="https://www.valentiacabincrew.academy" class="contact-button website-button" style="text-decoration: none; color: #2c3e50; font-size: 14px; display: inline-block; padding: 15px 25px; border: 1px solid #bdc3c7; border-radius: 8px; background-color: #f8f9fa;">
                                    <span style="display: block; font-size: 24px; margin-bottom: 8px;">🌐</span>
                                    <span style="font-weight: 500;">Visit Website</span>
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Social Media -->
                      <table width="100%" cellpadding="0" cellspacing="0" class="social-container" style="margin: 30px 0;">
                        <tr>
                          <td style="text-align: center;">
                            <p class="social-text" style="color: #7f8c8d; font-size: 13px; margin-bottom: 20px; font-style: italic;">Follow us for the latest updates and aviation industry insights</p>
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                              <tr>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.instagram.com/jiehao_08/" class="social-icon" style="text-decoration: none; display: inline-block; width: 50px; height: 50px; background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); border-radius: 12px; text-align: center; line-height: 50px;">
                                    <span class="social-icon-text" style="font-size: 20px; color: white; font-weight: bold;">IG</span>
                                  </a>
                                </td>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.linkedin.com/in/jie-hao-tee-4aa753290/" class="social-icon" style="text-decoration: none; display: inline-block; width: 50px; height: 50px; background-color: #0077b5; border-radius: 12px; text-align: center; line-height: 50px;">
                                    <span class="social-icon-text-small" style="font-size: 18px; color: white; font-weight: bold;">in</span>
                                  </a>
                                </td>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.facebook.com/jie.hao.14/" class="social-icon" style="text-decoration: none; display: inline-block; width: 50px; height: 50px; background-color: #1877f2; border-radius: 12px; text-align: center; line-height: 50px;">
                                    <span class="social-icon-text" style="font-size: 20px; color: white; font-weight: bold;">f</span>
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                                      <!-- Footer -->
                    <tr>
                      <td class="email-footer" style="text-align: center; color: #7f8c8d; padding: 30px; border-top: 1px solid #ecf0f1; border-radius: 0 0 8px 8px;">
                        <p class="footer-title" style="margin: 5px 0; font-weight: 400; color: #2c3e50;">Valentia Cabin Crew Academy</p>
                        <p class="footer-text" style="margin: 5px 0; font-size: 12px; font-style: italic;">Your journey to aviation excellence begins here</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    },
    zh: {
      subject: '感谢您的咨询 - Valentia空乘学院',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Valentia空乘学院</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #2c3e50; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="text-align: center;">
                            <div class="logo-container" style="width: 80px; height: 80px; background-color: #ffffff; border-radius: 50%; margin: 0 auto 20px auto; display: inline-block; line-height: 80px; text-align: center; border: 3px solid #bdc3c7;">
                              <span class="logo-text" style="font-size: 32px; font-weight: bold; color: #2c3e50;">V</span>
                            </div>
                            <h1 class="header-title" style="margin: 0; font-size: 28px; font-weight: 300; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">Valentia</h1>
                            <p class="header-subtitle" style="margin: 8px 0 0 0; font-size: 14px; color: #bdc3c7; font-style: italic; letter-spacing: 1px;">空乘学院</p>
                            <p class="header-tagline" style="margin: 15px 0 0 0; font-size: 12px; color: #95a5a6; text-transform: uppercase; letter-spacing: 1px;">航空培训卓越典范</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td class="email-content" style="padding: 40px 30px;">
                      <h2 class="content-title" style="color: #2c3e50; margin-bottom: 25px; font-size: 22px; font-weight: 400;">亲爱的${name}，</h2>
                      
                      <p class="content-text" style="line-height: 1.6; color: #34495e; font-size: 15px; margin-bottom: 20px;">
                        感谢您对<strong>Valentia空乘学院</strong>的关注。我们很荣幸能够协助您追求航空事业理想。
                      </p>
                      
                      <p class="content-text-large" style="line-height: 1.6; color: #34495e; font-size: 15px; margin-bottom: 30px;">
                        我们已收到您的咨询，我们的专业航空团队将审核您的需求并在<strong>24小时内</strong>为您提供全面的信息。
                      </p>
                       
                       <!-- User Inquiry Section -->
                       <table width="100%" cellpadding="0" cellspacing="0" class="section-container inquiry-section" style="background-color: #f8f9fa; border-left: 4px solid #95a5a6; margin: 30px 0;">
                         <tr>
                           <td class="section-content" style="padding: 25px;">
                             <h3 class="section-title" style="color: #2c3e50; margin-top: 0; font-size: 18px; margin-bottom: 15px; font-weight: 400;">您的咨询</h3>
                             <div class="section-box" style="color: #34495e; line-height: 1.6; font-size: 14px; margin: 0; padding: 15px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                               ${userMessage.replace(/\n/g, '<br>')}
                             </div>
                           </td>
                         </tr>
                       </table>
                       
                       <!-- Training Programs Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" class="section-container course-section" style="background-color: #f8f9fa; border-left: 4px solid #95a5a6; margin: 30px 0;">
                        <tr>
                          <td class="section-content" style="padding: 25px;">
                            <h3 class="section-title" style="color: #2c3e50; margin-top: 0; font-size: 18px; margin-bottom: 15px; font-weight: 400;">您选择的课程</h3>
                            <div class="section-box" style="color: #34495e; line-height: 1.6; font-size: 14px; margin: 0; padding: 15px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                              <strong>${getCourseInfo(language, course).title}</strong> (${getCourseInfo(language, course).duration}) - ${getCourseInfo(language, course).description}
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="line-height: 1.6; color: #34495e; font-size: 15px; margin-bottom: 35px;">
                        在等待我们回复期间，欢迎您浏览我们的网站，了解我们的世界级培训设施、经验丰富的讲师和成功的校友网络。
                      </p>
                      
                      <!-- Contact Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" class="contact-container" style="margin: 35px 0;">
                        <tr>
                          <td style="text-align: center;">
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                              <tr>
                                <td style="padding: 0 15px;">
                                  <a href="mailto:valentiacabincrew.academy@gmail.com" class="contact-button email-button" style="text-decoration: none; color: #2c3e50; font-size: 14px; display: inline-block; padding: 15px 25px; border: 1px solid #bdc3c7; border-radius: 8px; background-color: #f8f9fa;">
                                    <span style="display: block; font-size: 24px; margin-bottom: 8px;">✉</span>
                                    <span style="font-weight: 500;">发送邮件</span>
                                  </a>
                                </td>
                                <td style="padding: 0 15px;">
                                  <a href="https://www.valentiacabincrew.academy" class="contact-button website-button" style="text-decoration: none; color: #2c3e50; font-size: 14px; display: inline-block; padding: 15px 25px; border: 1px solid #bdc3c7; border-radius: 8px; background-color: #f8f9fa;">
                                    <span style="display: block; font-size: 24px; margin-bottom: 8px;">🌐</span>
                                    <span style="font-weight: 500;">访问网站</span>
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                                            <!-- Social Media -->
                      <table width="100%" cellpadding="0" cellspacing="0" class="social-container" style="margin: 30px 0;">
                        <tr>
                          <td style="text-align: center;">
                            <p class="social-text" style="color: #7f8c8d; font-size: 13px; margin-bottom: 20px; font-style: italic;">关注我们获取最新资讯和航空业洞察</p>
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                              <tr>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.instagram.com/jiehao_08/" class="social-icon" style="text-decoration: none; display: inline-block; width: 50px; height: 50px; background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); border-radius: 12px; text-align: center; line-height: 50px;">
                                    <span class="social-icon-text" style="font-size: 20px; color: white; font-weight: bold;">IG</span>
                                  </a>
                                </td>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.linkedin.com/in/jie-hao-tee-4aa753290/" class="social-icon" style="text-decoration: none; display: inline-block; width: 50px; height: 50px; background-color: #0077b5; border-radius: 12px; text-align: center; line-height: 50px;">
                                    <span class="social-icon-text-small" style="font-size: 18px; color: white; font-weight: bold;">in</span>
                                  </a>
                                </td>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.facebook.com/jie.hao.14/" class="social-icon" style="text-decoration: none; display: inline-block; width: 50px; height: 50px; background-color: #1877f2; border-radius: 12px; text-align: center; line-height: 50px;">
                                    <span class="social-icon-text" style="font-size: 20px; color: white; font-weight: bold;">f</span>
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="text-align: center; color: #7f8c8d; padding: 30px; border-top: 1px solid #ecf0f1; border-radius: 0 0 8px 8px;">
                      <p style="margin: 5px 0; font-weight: 400; color: #2c3e50;">Valentia空乘学院</p>
                      <p style="margin: 5px 0; font-size: 12px; font-style: italic;">您的航空卓越之旅从这里开始</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    },
    ko: {
      subject: '문의해 주셔서 감사합니다 - Valentia 객실승무원 아카데미',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Valentia 객실승무원 아카데미</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #2c3e50; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="text-align: center;">
                            <div class="logo-container" style="width: 80px; height: 80px; background-color: #ffffff; border-radius: 50%; margin: 0 auto 20px auto; display: inline-block; line-height: 80px; text-align: center; border: 3px solid #bdc3c7;">
                              <span class="logo-text" style="font-size: 32px; font-weight: bold; color: #2c3e50;">V</span>
                            </div>
                            <h1 class="header-title" style="margin: 0; font-size: 28px; font-weight: 300; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">Valentia</h1>
                            <p class="header-subtitle" style="margin: 8px 0 0 0; font-size: 14px; color: #bdc3c7; font-style: italic; letter-spacing: 1px;">객실승무원 아카데미</p>
                            <p class="header-tagline" style="margin: 15px 0 0 0; font-size: 12px; color: #95a5a6; text-transform: uppercase; letter-spacing: 1px;">항공 교육의 우수성</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td class="email-content" style="padding: 40px 30px;">
                      <h2 class="content-title" style="color: #2c3e50; margin-bottom: 25px; font-size: 22px; font-weight: 400;">친애하는 ${name}님,</h2>
                      
                      <p class="content-text" style="line-height: 1.6; color: #34495e; font-size: 15px; margin-bottom: 20px;">
                        <strong>Valentia 객실승무원 아카데미</strong>에 관심을 가져주셔서 감사합니다. 항공 경력 여정을 시작하는 데 도움을 드릴 수 있어 기쁩니다.
                      </p>
                      
                      <p class="content-text-large" style="line-height: 1.6; color: #34495e; font-size: 15px; margin-bottom: 30px;">
                        귀하의 문의를 받았으며, 저희 전담 항공 전문가 팀이 귀하의 요청을 검토하고 <strong>24시간 이내</strong>에 맞춤형 정보를 제공해드릴 것입니다.
                      </p>
                      
                      <!-- User Inquiry Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" class="section-container inquiry-section" style="background-color: #f8f9fa; border-left: 4px solid #95a5a6; margin: 30px 0;">
                        <tr>
                          <td class="section-content" style="padding: 25px;">
                            <h3 class="section-title" style="color: #2c3e50; margin-top: 0; font-size: 18px; margin-bottom: 15px; font-weight: 400;">귀하의 문의</h3>
                            <div class="section-box" style="color: #34495e; line-height: 1.6; font-size: 14px; margin: 0; padding: 15px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                              ${userMessage.replace(/\n/g, '<br>')}
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                                             <!-- Training Programs Section -->
                       <table width="100%" cellpadding="0" cellspacing="0" class="section-container course-section" style="background-color: #f8f9fa; border-left: 4px solid #95a5a6; margin: 30px 0;">
                         <tr>
                           <td class="section-content" style="padding: 25px;">
                             <h3 class="section-title" style="color: #2c3e50; margin-top: 0; font-size: 18px; margin-bottom: 15px; font-weight: 400;">선택하신 과정</h3>
                             <div class="section-box" style="color: #34495e; line-height: 1.6; font-size: 14px; margin: 0; padding: 15px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                               <strong>${getCourseInfo(language, course).title}</strong> (${getCourseInfo(language, course).duration}) - ${getCourseInfo(language, course).description}
                             </div>
                           </td>
                         </tr>
                       </table>
                      
                      <p style="line-height: 1.6; color: #34495e; font-size: 15px; margin-bottom: 35px;">
                        기다리는 동안 저희 웹사이트를 탐색하여 세계적 수준의 교육 시설, 경험丰富的한 강사진, 성공한 동문 네트워크에 대해 더 알아보세요.
                      </p>
                      
                      <!-- Contact Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" class="contact-container" style="margin: 35px 0;">
                        <tr>
                          <td style="text-align: center;">
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                              <tr>
                                <td style="padding: 0 15px;">
                                  <a href="mailto:valentiacabincrew.academy@gmail.com" class="contact-button email-button" style="text-decoration: none; color: #2c3e50; font-size: 14px; display: inline-block; padding: 15px 25px; border: 1px solid #bdc3c7; border-radius: 8px; background-color: #f8f9fa;">
                                    <span style="display: block; font-size: 24px; margin-bottom: 8px;">✉</span>
                                    <span style="font-weight: 500;">이메일 보내기</span>
                                  </a>
                                </td>
                                <td style="padding: 0 15px;">
                                  <a href="https://www.valentiacabincrew.academy" class="contact-button website-button" style="text-decoration: none; color: #2c3e50; font-size: 14px; display: inline-block; padding: 15px 25px; border: 1px solid #bdc3c7; border-radius: 8px; background-color: #f8f9fa;">
                                    <span style="display: block; font-size: 24px; margin-bottom: 8px;">🌐</span>
                                    <span style="font-weight: 500;">웹사이트 방문</span>
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Social Media -->
                      <table width="100%" cellpadding="0" cellspacing="0" class="social-container" style="margin: 30px 0;">
                        <tr>
                          <td style="text-align: center;">
                            <p class="social-text" style="color: #7f8c8d; font-size: 13px; margin-bottom: 20px; font-style: italic;">최신 업데이트와 항공업계 뉴스를 위해 소셜미디어를 팔로우해주세요</p>
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                              <tr>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.instagram.com/jiehao_08/" style="text-decoration: none; display: inline-block; width: 50px; height: 50px; background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); border-radius: 12px; text-align: center; line-height: 50px;">
                                    <span style="font-size: 20px; color: white; font-weight: bold;">IG</span>
                                  </a>
                                </td>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.linkedin.com/in/jie-hao-tee-4aa753290/" style="text-decoration: none; display: inline-block; width: 50px; height: 50px; background-color: #0077b5; border-radius: 12px; text-align: center; line-height: 50px;">
                                    <span style="font-size: 18px; color: white; font-weight: bold;">in</span>
                                  </a>
                                </td>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.facebook.com/jie.hao.14/" style="text-decoration: none; display: inline-block; width: 50px; height: 50px; background-color: #1877f2; border-radius: 12px; text-align: center; line-height: 50px;">
                                    <span style="font-size: 20px; color: white; font-weight: bold;">f</span>
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td class="email-footer" style="text-align: center; color: #7f8c8d; padding: 30px; border-top: 1px solid #ecf0f1; border-radius: 0 0 8px 8px;">
                      <p class="footer-title" style="margin: 5px 0; font-weight: 400; color: #2c3e50;">Valentia 객실승무원 아카데미</p>
                      <p class="footer-text" style="margin: 5px 0; font-size: 12px; font-style: italic;">항공 우수성으로 가는 여정이 여기서 시작됩니다</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    },
    ja: {
      subject: 'お問い合わせありがとうございます - Valentia キャビンクルーアカデミー',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Valentia キャビンクルーアカデミー</title>
          <style>
            @media only screen and (max-width: 600px) {
              .email-container {
                width: 100% !important;
                max-width: 380px !important;
                border-radius: 20px !important;
                box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
                overflow: hidden !important;
                margin: 0 auto !important;
              }
              .email-header {
                background: linear-gradient(135deg, #1a252f 0%, #2c3e50 50%, #34495e 100%) !important;
                padding: 36px 20px !important;
                position: relative !important;
              }
              .email-header::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background: linear-gradient(45deg, rgba(52, 152, 219, 0.1) 0%, rgba(155, 89, 182, 0.1) 100%) !important;
                pointer-events: none !important;
              }
              .logo-container {
                width: 80px !important;
                height: 80px !important;
                line-height: 80px !important;
                border: 4px solid rgba(255,255,255,0.2) !important;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
                position: relative !important;
                z-index: 1 !important;
              }
              .logo-text {
                font-size: 32px !important;
                font-weight: 700 !important;
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
              }
              .header-title {
                font-size: 26px !important;
                font-weight: 700 !important;
                letter-spacing: 2px !important;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
                position: relative !important;
                z-index: 1 !important;
              }
              .header-subtitle {
                font-size: 14px !important;
                font-weight: 500 !important;
                margin: 8px 0 0 0 !important;
                color: #ecf0f1 !important;
                letter-spacing: 1px !important;
                position: relative !important;
                z-index: 1 !important;
              }
              .header-tagline {
                font-size: 12px !important;
                letter-spacing: 1.5px !important;
                font-weight: 600 !important;
                margin: 16px 0 0 0 !important;
                color: #bdc3c7 !important;
                text-transform: uppercase !important;
                position: relative !important;
                z-index: 1 !important;
              }
              .email-content {
                padding: 28px 20px !important;
                background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%) !important;
              }
              .content-title {
                font-size: 30px !important;
                font-weight: 700 !important;
                margin-bottom: 24px !important;
                color: #2c3e50 !important;
                letter-spacing: 0.5px !important;
              }
              .content-text {
                margin-bottom: 20px !important;
                line-height: 1.7 !important;
                font-size: 19px !important;
                color: #34495e !important;
              }
              .content-text-large {
                margin-bottom: 28px !important;
                line-height: 1.7 !important;
                font-size: 19px !important;
                color: #34495e !important;
              }
              .section-container {
                margin: 28px 0 !important;
                border-radius: 12px !important;
                background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
                box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
                border: 1px solid #e9ecef !important;
              }
              .section-content {
                padding: 24px !important;
              }
              .section-title {
                font-size: 24px !important;
                font-weight: 700 !important;
                margin-bottom: 16px !important;
                color: #2c3e50 !important;
                letter-spacing: 0.5px !important;
              }
              .section-box {
                padding: 20px !important;
                border-radius: 10px !important;
                background: #ffffff !important;
                border: 1px solid #e9ecef !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
                font-size: 18px !important;
                line-height: 1.6 !important;
              }
              .inquiry-section {
                border-left: 5px solid #3498db !important;
                background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%) !important;
              }
              .course-section {
                border-left: 5px solid #27ae60 !important;
                background: linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 100%) !important;
              }
              .contact-container {
                margin: 32px 0 !important;
              }
              .contact-button {
                padding: 18px 28px !important;
                border: 2px solid !important;
                border-radius: 14px !important;
                font-size: 20px !important;
                font-weight: 700 !important;
                min-width: 140px !important;
                margin: 0 10px 20px 10px !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                background: #ffffff !important;
              }
              .contact-button:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
              }
              .email-button {
                border-color: #3498db !important;
                color: #3498db !important;
              }
              .website-button {
                border-color: #27ae60 !important;
                color: #27ae60 !important;
              }
              .social-container {
                margin: 28px 0 !important;
              }
              .social-text {
                margin-bottom: 20px !important;
                font-size: 18px !important;
                color: #7f8c8d !important;
                font-style: italic !important;
                font-weight: 500 !important;
              }
              .social-icon {
                width: 60px !important;
                height: 60px !important;
                border-radius: 18px !important;
                line-height: 60px !important;
                margin: 0 10px !important;
                box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
                transition: all 0.3s ease !important;
                position: relative !important;
                overflow: hidden !important;
              }
              .social-icon::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%) !important;
                pointer-events: none !important;
              }
              .social-icon:hover {
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
              }
              .social-icon-text {
                font-size: 24px !important;
                font-weight: 700 !important;
                position: relative !important;
                z-index: 1 !important;
              }
              .social-icon-text-small {
                font-size: 22px !important;
                font-weight: 700 !important;
                position: relative !important;
                z-index: 1 !important;
              }
              .email-footer {
                padding: 28px 20px !important;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
                border-top: 1px solid #dee2e6 !important;
              }
              .footer-title {
                font-weight: 700 !important;
                font-size: 20px !important;
                margin: 6px 0 !important;
                color: #2c3e50 !important;
                letter-spacing: 0.5px !important;
              }
              .footer-text {
                margin: 6px 0 !important;
                color: #6c757d !important;
                font-size: 17px !important;
                font-style: italic !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table width="600" cellpadding="0" cellspacing="0" class="email-container" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td class="email-header" style="background-color: #2c3e50; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="text-align: center;">
                            <div class="logo-container" style="width: 80px; height: 80px; background-color: #ffffff; border-radius: 50%; margin: 0 auto 20px auto; display: inline-block; line-height: 80px; text-align: center; border: 3px solid #bdc3c7;">
                              <span class="logo-text" style="font-size: 32px; font-weight: bold; color: #2c3e50;">V</span>
                            </div>
                            <h1 class="header-title" style="margin: 0; font-size: 28px; font-weight: 300; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">Valentia</h1>
                            <p class="header-subtitle" style="margin: 8px 0 0 0; font-size: 14px; color: #bdc3c7; font-style: italic; letter-spacing: 1px;">キャビンクルーアカデミー</p>
                            <p class="header-tagline" style="margin: 15px 0 0 0; font-size: 12px; color: #95a5a6; text-transform: uppercase; letter-spacing: 1px;">航空訓練の卓越性</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td class="email-content" style="padding: 40px 30px;">
                      <h2 class="content-title" style="color: #2c3e50; margin-bottom: 25px; font-size: 22px; font-weight: 400;">${name}様</h2>
                      
                      <p class="content-text" style="line-height: 1.6; color: #34495e; font-size: 15px; margin-bottom: 20px;">
                        <strong>Valentia キャビンクルーアカデミー</strong>にご興味をお持ちいただき、ありがとうございます。航空キャリアの旅を始めるお手伝いができることを嬉しく思います。
                      </p>
                      
                      <p class="content-text-large" style="line-height: 1.6; color: #34495e; font-size: 15px; margin-bottom: 30px;">
                        お客様のお問い合わせを受信いたしました。当校の専任航空専門家チームがお客様のご要望を検討し、<strong>24時間以内</strong>にパーソナライズされた詳細情報をご提供いたします。
                      </p>
                      
                      <!-- User Inquiry Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" class="section-container inquiry-section" style="background-color: #f8f9fa; border-left: 4px solid #95a5a6; margin: 30px 0;">
                        <tr>
                          <td class="section-content" style="padding: 25px;">
                            <h3 class="section-title" style="color: #2c3e50; margin-top: 0; font-size: 18px; margin-bottom: 15px; font-weight: 400;">お客様のお問い合わせ</h3>
                            <div class="section-box" style="color: #34495e; line-height: 1.6; font-size: 14px; margin: 0; padding: 15px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                              ${userMessage.replace(/\n/g, '<br>')}
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                                             <!-- Training Programs Section -->
                       <table width="100%" cellpadding="0" cellspacing="0" class="section-container course-section" style="background-color: #f8f9fa; border-left: 4px solid #95a5a6; margin: 30px 0;">
                         <tr>
                           <td class="section-content" style="padding: 25px;">
                             <h3 class="section-title" style="color: #2c3e50; margin-top: 0; font-size: 18px; margin-bottom: 15px; font-weight: 400;">お客様が選択されたコース</h3>
                             <div class="section-box" style="color: #34495e; line-height: 1.6; font-size: 14px; margin: 0; padding: 15px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                               <strong>${getCourseInfo(language, course).title}</strong> (${getCourseInfo(language, course).duration}) - ${getCourseInfo(language, course).description}
                             </div>
                           </td>
                         </tr>
                       </table>
                      
                      <p style="line-height: 1.6; color: #34495e; font-size: 15px; margin-bottom: 35px;">
                        お待ちいただいている間、当校のウェブサイトをご覧いただき、世界クラスの訓練施設、経験豊富な講師陣、成功した卒業生ネットワークについて詳しくご覧ください。
                      </p>
                      
                      <!-- Contact Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" class="contact-container" style="margin: 35px 0;">
                        <tr>
                          <td style="text-align: center;">
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                              <tr>
                                <td style="padding: 0 15px;">
                                  <a href="mailto:valentiacabincrew.academy@gmail.com" class="contact-button email-button" style="text-decoration: none; color: #2c3e50; font-size: 14px; display: inline-block; padding: 15px 25px; border: 1px solid #bdc3c7; border-radius: 8px; background-color: #f8f9fa;">
                                    <span style="display: block; font-size: 24px; margin-bottom: 8px;">✉</span>
                                    <span style="font-weight: 500;">メール送信</span>
                                  </a>
                                </td>
                                <td style="padding: 0 15px;">
                                  <a href="https://www.valentiacabincrew.academy" class="contact-button website-button" style="text-decoration: none; color: #2c3e50; font-size: 14px; display: inline-block; padding: 15px 25px; border: 1px solid #bdc3c7; border-radius: 8px; background-color: #f8f9fa;">
                                    <span style="display: block; font-size: 24px; margin-bottom: 8px;">🌐</span>
                                    <span style="font-weight: 500;">ウェブサイト訪問</span>
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Social Media -->
                      <table width="100%" cellpadding="0" cellspacing="0" class="social-container" style="margin: 30px 0;">
                        <tr>
                          <td style="text-align: center;">
                            <p class="social-text" style="color: #7f8c8d; font-size: 13px; margin-bottom: 20px; font-style: italic;">最新の更新情報と航空業界ニュースについては、ソーシャルメディアをフォローしてください</p>
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                              <tr>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.instagram.com/jiehao_08/" style="text-decoration: none; display: inline-block; width: 50px; height: 50px; background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); border-radius: 12px; text-align: center; line-height: 50px;">
                                    <span style="font-size: 20px; color: white; font-weight: bold;">IG</span>
                                  </a>
                                </td>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.linkedin.com/in/jie-hao-tee-4aa753290/" style="text-decoration: none; display: inline-block; width: 50px; height: 50px; background-color: #0077b5; border-radius: 12px; text-align: center; line-height: 50px;">
                                    <span style="font-size: 18px; color: white; font-weight: bold;">in</span>
                                  </a>
                                </td>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.facebook.com/jie.hao.14/" style="text-decoration: none; display: inline-block; width: 50px; height: 50px; background-color: #1877f2; border-radius: 12px; text-align: center; line-height: 50px;">
                                    <span style="font-size: 20px; color: white; font-weight: bold;">f</span>
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td class="email-footer" style="text-align: center; color: #7f8c8d; padding: 30px; border-top: 1px solid #ecf0f1; border-radius: 0 0 8px 8px;">
                      <p class="footer-title" style="margin: 5px 0; font-weight: 400; color: #2c3e50;">Valentia キャビンクルーアカデミー</p>
                      <p class="footer-text" style="margin: 5px 0; font-size: 12px; font-style: italic;">航空卓越性への旅がここから始まります</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    }
  };
  
  return templates[language] || templates.en;
};

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Valentia Backend Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, course, language } = req.body;
    
    console.log('📧 Received contact form submission:', { name, email, course, language });
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, and message are required'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Send email to company
    const companyEmailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `🆕 New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">🆕 New Contact Form Submission</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Valentia Cabin Crew Academy Website</p>
          </div>
          
          <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold; width: 30%;">👤 Name:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold;">📧 Email:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold;">📱 Phone:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold;">🎓 Course:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${course || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold;">🌐 Language:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${language}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px;">
              <h3 style="color: #374151; margin-bottom: 10px;">💬 Message:</h3>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <hr style="border: none; height: 1px; background: #e5e7eb; margin: 30px 0;">
            
            <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0;">
              📅 <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
              🌐 <strong>Source:</strong> valentiacabincrew.academy website
            </p>
          </div>
        </div>
      `
    };
    
         // Send auto-reply to customer
     const autoReply = getAutoReplyTemplate(language, name, message, course);
    const customerEmailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: autoReply.subject,
      html: autoReply.html
    };
    
    // Send both emails
    console.log('📤 Sending emails...');
    await Promise.all([
      transporter.sendMail(companyEmailOptions),
      transporter.sendMail(customerEmailOptions)
    ]);
    
    console.log('✅ Both emails sent successfully');
    
    res.json({
      success: true,
      message: 'Emails sent successfully'
    });
    
  } catch (error) {
    console.error('❌ Error sending emails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emails. Please try again later.'
    });
  }
});

// Handle course application submissions
app.post('/api/application', upload.array('attachments', 5), async (req, res) => {
  try {
    // Parse multipart form data
    const { name, email, phone, course, message, language } = req.body;
    const attachments = req.files || [];
    
    console.log('📝 New course application received:');
    console.log('👤 Name:', name);
    console.log('📧 Email:', email);
    console.log('📱 Phone:', phone);
    console.log('🎓 Course:', course);
    console.log('🌐 Language:', language);
    console.log('📎 Attachments:', attachments.length);
    
    // Validate required fields
    if (!name || !email || !phone || !course) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Resolve language (prefer header), fallback to body
    const langHeader = (req.get('Accept-Language') || '').toLowerCase();
    const resolvedLang = (['en','zh','ko','ja'].includes((langHeader || '').slice(0,2))
      ? (langHeader || '').slice(0,2)
      : (language || 'en')).toLowerCase();

    // Get course information
    const courseInfo = getCourseInfo(resolvedLang || 'en', course);
    
    // Prepare company notification email with attachments
    const companyEmailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to company email
      subject: `🎓 New Course Application: ${courseInfo.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎓 New Course Application</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Valentia Cabin Crew Academy</p>
          </div>
          
          <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e7eb;">
            <h2 style="color: #1e40af; margin-bottom: 20px;">📋 Application Details</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold; width: 30%;">👤 Name:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold;">📧 Email:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold;">📱 Phone:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold;">🎓 Course:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${courseInfo.title} (${courseInfo.duration})</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold;">🌐 Language:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${language || 'en'}</td>
              </tr>
            </table>
            
            ${message ? `
            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin-bottom: 10px;">💬 Self Introduction:</h3>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            ` : ''}
            
            ${attachments.length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin-bottom: 10px;">📎 Attachments (${attachments.length}):</h3>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                ${attachments.map(file => `<div style="margin-bottom: 5px;">📄 ${file.originalname} (${(file.size / 1024).toFixed(1)} KB)</div>`).join('')}
                <p style="margin-top: 10px; color: #6b7280; font-size: 12px;">
                  💡 <strong>Note:</strong> Attachments are included below this email and can be downloaded.
                </p>
              </div>
            </div>
            ` : ''}
            
            <hr style="border: none; height: 1px; background: #e5e7eb; margin: 30px 0;">
            
            <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0;">
              📅 <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
              🌐 <strong>Source:</strong> Course Application Form
            </p>
          </div>
        </div>
      `,
      attachments: attachments.map(file => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype
      }))
    };
    
    // i18n labels for customer confirmation (design unchanged)
    const i18n = {
      subject: {
        en: 'Application Received',
        zh: '申请已收到',
        ko: '신청 접수',
        ja: '申込受付'
      },
      dear: { en: 'Dear', zh: '尊敬的', ko: '안녕하세요', ja: 'Dear' },
      introPrefix: {
        en: 'Thank you for your interest in our',
        zh: '感谢您对我们',
        ko: '다음 프로그램에 관심을 가져 주셔서 감사합니다:',
        ja: '当校の'
      },
      introSuffix: {
        en: 'program. We have received your application and are excited about your potential to join our aviation training program.',
        zh: '项目的关注。我们已收到您的申请，期待您加入我们的航空培训项目。',
        ko: '프로그램에 지원해 주셔서 감사합니다. 귀하의 지원서를 접수했습니다.',
        ja: 'プログラムにご関心をお寄せいただきありがとうございます。お申し込みを受け付けました。'
      },
      summary: { en: 'Application Summary', zh: '申请摘要', ko: '신청 요약', ja: '申込概要' },
      course: { en: 'Course', zh: '课程', ko: '코스', ja: 'コース' },
      duration: { en: 'Duration', zh: '时长', ko: '기간', ja: '期間' },
      description: { en: 'Description', zh: '简介', ko: '설명', ja: '説明' },
      nextTitle: { en: 'What Happens Next?', zh: '下一步', ko: '다음 단계', ja: '次のステップ' },
      next: {
        en: [
          'Our admissions team will review your application within 24 hours',
          'We will contact you via email or phone to discuss next steps',
          'You may be invited for an interview or additional assessment',
          "Upon acceptance, you'll receive detailed enrollment information"
        ],
        zh: [
          '招生团队将在24小时内审核您的申请',
          '我们将通过邮箱或电话与您联系，告知下一步',
          '您可能会被邀请参加面试或额外评估',
          '录取后您将收到详细的入学指南'
        ],
        ko: [
          '입학팀이 24시간 이내에 지원서를 검토합니다',
          '이메일 또는 전화로 다음 절차를 안내드립니다',
          '면접 또는 추가 평가가 있을 수 있습니다',
          '합격 시 상세 등록 안내를 받게 됩니다'
        ],
        ja: [
          '当校のアドミッションチームが24時間以内に申込内容を確認します',
          'メールまたはお電話で次の手順をご案内いたします',
          '面接または追加の評価にご案内する場合があります',
          '合格後、詳細な入学案内をお送りします'
        ]
      },
      important: { en: 'Important Note', zh: '重要提示', ko: '중요 안내', ja: '重要なお知らせ' },
      importantText: {
        en: 'Please ensure your contact information is correct. If you need to update any details, please reply to this email or contact us directly.',
        zh: '请确保您的联系方式正确。如需更新信息，请直接回复此邮件或与我们联系。',
        ko: '연락처 정보가 정확한지 확인해 주세요. 변경이 필요하면 이 메일에 회신하거나 직접 문의해 주세요.',
        ja: 'ご連絡先が正しいかご確認ください。修正が必要な場合は本メールへご返信いただくか、直接ご連絡ください。'
      },
      contact: { en: 'Contact', zh: '联系邮箱', ko: '이메일', ja: '連絡先' },
      phone:   { en: 'Phone', zh: '电话', ko: '電話', ja: '電話' },
      website: { en: 'Website', zh: '网站', ko: '웹サイト', ja: 'ウェブサイト' }
    };

    // Prepare customer confirmation email with attachments
    const customerEmailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `🎓 ${i18n.subject[resolvedLang]} - ${courseInfo.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎓 ${i18n.subject[resolvedLang]}</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Valentia Cabin Crew Academy</p>
          </div>
          
          <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e7eb;">
            <h2 style="color: #1e40af; margin-bottom: 20px;">${i18n.dear[resolvedLang]} ${name},</h2>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              ${i18n.introPrefix[resolvedLang]} <strong>${courseInfo.title}</strong> ${i18n.introSuffix[resolvedLang]}
            </p>
            
            <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #0c4a6e; margin: 0 0 15px 0;">📋 ${i18n.summary[resolvedLang]}</h3>
              <p style="margin: 0; color: #0c4a6e;"><strong>${i18n.course[resolvedLang]}:</strong> ${courseInfo.title}</p>
              <p style="margin: 0; color: #0c4a6e;"><strong>${i18n.duration[resolvedLang]}:</strong> ${courseInfo.duration}</p>
              <p style="margin: 0; color: #0c4a6e;"><strong>${i18n.description[resolvedLang]}:</strong> ${courseInfo.description}</p>
            </div>
            
            ${attachments.length > 0 ? `
            <div style="background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #374151; margin: 0 0 15px 0;">📎 ${resolvedLang==='zh'?'您提交的文件':resolvedLang==='ko'?'제출하신 문서':resolvedLang==='ja'?'提出された書類':'Your Submitted Documents'}</h3>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">${resolvedLang==='zh'?'我们已收到以下随申请提交的文件：':resolvedLang==='ko'?'아래 문서를 접수했습니다:':resolvedLang==='ja'?'以下の書類を受領しました。':'We have received the following documents with your application:'}</p>
              <div style="margin-top: 10px;">
                ${attachments.map(file => `<div style="margin-bottom: 5px;">📄 ${file.originalname} (${(file.size / 1024).toFixed(1)} KB)</div>`).join('')}
              </div>
              <p style="margin-top: 10px; color: #6b7280; font-size: 12px;">💡 <strong>${resolvedLang==='zh'?'备注':'Note'}:</strong> ${resolvedLang==='zh'?'以下文件附在本邮件底部以供参考。':resolvedLang==='ko'?'해당 문서는 이메일 하단에 첨부되어 있습니다.':resolvedLang==='ja'?'これらの書類は本メールの下部に添付されています。':'These documents are included below this email for your reference.'}</p>
            </div>
            ` : ''}
            
            <h3 style="color: #374151; margin-bottom: 15px;">📅 ${i18n.nextTitle[resolvedLang]}</h3>
            <ol style="color: #374151; line-height: 1.6; padding-left: 20px;">
              ${i18n.next[resolvedLang].map(item => `<li>${item}</li>`).join('')}
            </ol>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #92400e; margin: 0 0 10px 0;">⚠️ ${i18n.important[resolvedLang]}</h3>
              <p style="margin: 0; color: #92400e; font-size: 14px;">${i18n.importantText[resolvedLang]}</p>
            </div>
            
            <hr style="border: none; height: 1px; background: #e5e7eb; margin: 30px 0;">
            
            <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0;">
              📧 <strong>${i18n.contact[resolvedLang]}:</strong> valentiacabincrew.academy@gmail.com<br>
              📱 <strong>${i18n.phone[resolvedLang]}:</strong> +603-12345678<br>
              🌐 <strong>${i18n.website[resolvedLang]}:</strong> valentiacabincrew.academy
            </p>
          </div>
        </div>
      `,
      attachments: attachments.map(file => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype
      }))
    };
    
    // Send both emails
    console.log('📤 Sending application emails...');
    await Promise.all([
      transporter.sendMail(companyEmailOptions),
      transporter.sendMail(customerEmailOptions)
    ]);
    
    console.log('✅ Application emails sent successfully');
    
    res.json({
      success: true,
      message: 'Application submitted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error processing application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again later.'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Valentia Backend Server is running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔗 Test API: http://localhost:${PORT}/api/test\n`);
});
