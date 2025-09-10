import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import multer from 'multer';

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
  origin: process.env.FRONTEND_URL || 'https://valentiaacademy.vercel.app',
  credentials: true
}));

// Email transporter configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Translation function for email content
const getTranslations = (language) => {
  const translations = {
    en: {
      applicationReceived: 'Application Received - Valentia Cabin Crew Academy',
      dear: 'Dear',
      thankYou: 'Thank you for your interest in our',
      program: 'program. We have received your application and are excited about your potential to join our aviation training program.',
      applicationSummary: 'Application Summary',
      course: 'Course',
      duration: 'Duration',
      description: 'Description',
      whatHappensNext: 'What Happens Next?',
      reviewApplication: 'Our admissions team will review your application within 24 hours',
      contactYou: 'We will contact you via email or phone to discuss next steps',
      interview: 'You may be invited for an interview or additional assessment',
      enrollment: 'Upon acceptance, you\'ll receive detailed enrollment information',
      importantNote: 'Important Note',
      ensureContact: 'Please ensure your contact information is correct. If you need to update any details, please reply to this email or contact us directly.',
      contact: 'Contact',
      phone: 'Phone',
      website: 'Website',
      followUs: 'Follow us on social media for the latest updates and aviation industry news.',
      bestRegards: 'Best regards,',
      team: 'Valentia Cabin Crew Academy Team'
    },
    zh: {
      applicationReceived: '申请已收到 - Valentia空乘学院',
      dear: '亲爱的',
      thankYou: '感谢您对我们',
      program: '课程的关注。我们已收到您的申请，对您加入我们航空培训项目的潜力感到兴奋。',
      applicationSummary: '申请摘要',
      course: '课程',
      duration: '时长',
      description: '描述',
      whatHappensNext: '接下来会发生什么？',
      reviewApplication: '我们的招生团队将在24小时内审核您的申请',
      contactYou: '我们将通过电子邮件或电话与您联系，讨论下一步',
      interview: '您可能会被邀请参加面试或额外评估',
      enrollment: '一旦被录取，您将收到详细的入学信息',
      importantNote: '重要提示',
      ensureContact: '请确保您的联系信息正确。如果您需要更新任何详细信息，请回复此电子邮件或直接联系我们。',
      contact: '联系方式',
      phone: '电话',
      website: '网站',
      followUs: '关注我们的社交媒体获取最新资讯和航空业新闻。',
      bestRegards: '此致敬礼！',
      team: 'Valentia空乘学院团队'
    },
    ko: {
      applicationReceived: '지원서 접수됨 - Valentia 객실승무원 아카데미',
      dear: '친애하는',
      thankYou: '저희',
      program: '프로그램에 관심을 가져주셔서 감사합니다. 귀하의 지원서를 받았으며 항공 교육 프로그램에 참여할 수 있는 잠재력에 대해 기쁩니다.',
      applicationSummary: '지원서 요약',
      course: '과정',
      duration: '기간',
      description: '설명',
      whatHappensNext: '다음 단계는 무엇인가요?',
      reviewApplication: '저희 입학팀이 24시간 이내에 귀하의 지원서를 검토할 것입니다',
      contactYou: '다음 단계에 대해 논의하기 위해 이메일이나 전화로 연락드릴 것입니다',
      interview: '면접이나 추가 평가에 초대될 수 있습니다',
      enrollment: '합격 시 상세한 등록 정보를 받으실 수 있습니다',
      importantNote: '중요 사항',
      ensureContact: '연락처 정보가 정확한지 확인해 주세요. 세부 정보를 업데이트해야 하는 경우 이 이메일에 회신하거나 직접 연락해 주세요.',
      contact: '연락처',
      phone: '전화',
      website: '웹사이트',
      followUs: '최신 업데이트와 항공업계 뉴스를 위해 소셜미디어를 팔로우해주세요.',
      bestRegards: '감사합니다.',
      team: 'Valentia 객실승무원 아카데미 팀'
    },
    ja: {
      applicationReceived: '申請受付完了 - Valentia キャビンクルーアカデミー',
      dear: '様',
      thankYou: '当校の',
      program: 'プログラムにご関心をお寄せいただき、ありがとうございます。お客様の申請書を受領いたしました。航空訓練プログラムに参加される可能性について大変嬉しく思います。',
      applicationSummary: '申請概要',
      course: 'コース',
      duration: '期間',
      description: '説明',
      whatHappensNext: '今後の流れ',
      reviewApplication: '当校の入学チームが24時間以内にお客様の申請書を審査いたします',
      contactYou: '次のステップについて話し合うため、メールまたは電話でご連絡いたします',
      interview: '面接や追加評価に招待される場合があります',
      enrollment: '合格時には詳細な入学情報をお送りいたします',
      importantNote: '重要事項',
      ensureContact: '連絡先情報が正確であることを確認してください。詳細を更新する必要がある場合は、このメールに返信するか、直接お問い合わせください。',
      contact: 'お問い合わせ',
      phone: '電話',
      website: 'ウェブサイト',
      followUs: '最新の更新情報と航空業界ニュースについては、ソーシャルメディアをフォローしてください。',
      bestRegards: 'よろしくお願いいたします。',
      team: 'Valentia キャビンクルーアカデミーチーム'
    }
  };
  
  return translations[language] || translations.en;
};

// Function to localize HTML content
const localizeHtml = (html, language) => {
  const t = getTranslations(language);
  
  return html
    .replace(/Application Received - Valentia Cabin Crew Academy/g, t.applicationReceived)
    .replace(/Dear/g, t.dear)
    .replace(/Thank you for your interest in our/g, t.thankYou)
    .replace(/program\. We have received your application and are excited about your potential to join our aviation training program\./g, t.program)
    .replace(/Application Summary/g, t.applicationSummary)
    .replace(/Course:/g, t.course + ':')
    .replace(/Duration:/g, t.duration + ':')
    .replace(/Description:/g, t.description + ':')
    .replace(/What Happens Next\?/g, t.whatHappensNext)
    .replace(/Our admissions team will review your application within 24 hours/g, t.reviewApplication)
    .replace(/We will contact you via email or phone to discuss next steps/g, t.contactYou)
    .replace(/You may be invited for an interview or additional assessment/g, t.interview)
    .replace(/Upon acceptance, you'll receive detailed enrollment information/g, t.enrollment)
    .replace(/Important Note/g, t.importantNote)
    .replace(/Please ensure your contact information is correct\. If you need to update any details, please reply to this email or contact us directly\./g, t.ensureContact)
    .replace(/Contact:/g, t.contact + ':')
    .replace(/Phone:/g, t.phone + ':')
    .replace(/Website:/g, t.website + ':')
    .replace(/Follow us on social media for the latest updates and aviation industry news\./g, t.followUs)
    .replace(/Best regards,/g, t.bestRegards)
    .replace(/Valentia Cabin Crew Academy Team/g, t.team);
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, course, language } = req.body;
    
    // Determine language from Accept-Language header or body
    const acceptLanguage = req.headers['accept-language'] || '';
    const resolvedLang = language || 
      (acceptLanguage.includes('zh') ? 'zh' : 
       acceptLanguage.includes('ko') ? 'ko' : 
       acceptLanguage.includes('ja') ? 'ja' : 'en');

    // Send email to company
    const companyEmailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission - ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Course Interest:</strong> ${course}</p>
        <p><strong>Language:</strong> ${resolvedLang}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send auto-reply to customer
    const t = getTranslations(resolvedLang);
    const customerEmailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: t.applicationReceived,
      html: localizeHtml(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e40af;">Application Received - Valentia Cabin Crew Academy</h2>
          <p>Dear ${name},</p>
          <p>Thank you for your interest in our ${course} program. We have received your application and are excited about your potential to join our aviation training program.</p>
          
          <h3 style="color: #1e40af;">Application Summary</h3>
          <ul>
            <li><strong>Course:</strong> ${course}</li>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
          </ul>
          
          <h3 style="color: #1e40af;">What Happens Next?</h3>
          <ul>
            <li>Our admissions team will review your application within 24 hours</li>
            <li>We will contact you via email or phone to discuss next steps</li>
            <li>You may be invited for an interview or additional assessment</li>
            <li>Upon acceptance, you'll receive detailed enrollment information</li>
          </ul>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #92400e; margin-top: 0;">Important Note</h4>
            <p style="margin-bottom: 0;">Please ensure your contact information is correct. If you need to update any details, please reply to this email or contact us directly.</p>
          </div>
          
          <h3 style="color: #1e40af;">Contact</h3>
          <p><strong>Email:</strong> valentiacabincrew.academy@gmail.com</p>
          <p><strong>Phone:</strong> +603-12345678</p>
          <p><strong>Website:</strong> valentiacabincrew.academy</p>
          
          <p>Follow us on social media for the latest updates and aviation industry news.</p>
          
          <p>Best regards,<br>Valentia Cabin Crew Academy Team</p>
        </div>
      `, resolvedLang)
    };

    // Send both emails
    await transporter.sendMail(companyEmailOptions);
    await transporter.sendMail(customerEmailOptions);

    res.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email'
    });
  }
});

// Application form endpoint
app.post('/api/application', upload.array('attachments', 5), async (req, res) => {
  try {
    const { name, email, phone, course, language } = req.body;
    const attachments = req.files || [];
    
    // Determine language
    const acceptLanguage = req.headers['accept-language'] || '';
    const resolvedLang = language || 
      (acceptLanguage.includes('zh') ? 'zh' : 
       acceptLanguage.includes('ko') ? 'ko' : 
       acceptLanguage.includes('ja') ? 'ja' : 'en');

    // Prepare attachments for email
    const emailAttachments = attachments.map(file => ({
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype
    }));

    // Send to company
    const companyEmailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Course Application - ${name} - ${course}`,
      html: `
        <h2>New Course Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Course:</strong> ${course}</p>
        <p><strong>Language:</strong> ${resolvedLang}</p>
        <p><strong>Attachments:</strong> ${attachments.length} files</p>
      `,
      attachments: emailAttachments
    };

    // Send auto-reply to customer
    const t = getTranslations(resolvedLang);
    const customerEmailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: t.applicationReceived,
      html: localizeHtml(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e40af;">Application Received - Valentia Cabin Crew Academy</h2>
          <p>Dear ${name},</p>
          <p>Thank you for your interest in our ${course} program. We have received your application and are excited about your potential to join our aviation training program.</p>
          
          <h3 style="color: #1e40af;">Application Summary</h3>
          <ul>
            <li><strong>Course:</strong> ${course}</li>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
          </ul>
          
          <h3 style="color: #1e40af;">What Happens Next?</h3>
          <ul>
            <li>Our admissions team will review your application within 24 hours</li>
            <li>We will contact you via email or phone to discuss next steps</li>
            <li>You may be invited for an interview or additional assessment</li>
            <li>Upon acceptance, you'll receive detailed enrollment information</li>
          </ul>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #92400e; margin-top: 0;">Important Note</h4>
            <p style="margin-bottom: 0;">Please ensure your contact information is correct. If you need to update any details, please reply to this email or contact us directly.</p>
          </div>
          
          <h3 style="color: #1e40af;">Contact</h3>
          <p><strong>Email:</strong> valentiacabincrew.academy@gmail.com</p>
          <p><strong>Phone:</strong> +603-12345678</p>
          <p><strong>Website:</strong> valentiacabincrew.academy</p>
          
          <p>Follow us on social media for the latest updates and aviation industry news.</p>
          
          <p>Best regards,<br>Valentia Cabin Crew Academy Team</p>
        </div>
      `, resolvedLang)
    };

    await transporter.sendMail(companyEmailOptions);
    await transporter.sendMail(customerEmailOptions);

    res.json({
      success: true,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Error processing application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Export the app for Vercel
export default app;
