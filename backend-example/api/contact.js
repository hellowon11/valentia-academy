// Backend API example for handling contact form submissions
// This is a Node.js/Express.js example

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'valentiacabincrew.academy@gmail.com',
    pass: 'your-app-password' // Use App Password for Gmail
  }
});

// Auto-reply templates
const getAutoReplyTemplate = (language, name) => {
  const templates = {
    en: {
      subject: 'Thank you for your inquiry - Valentia Cabin Crew Academy',
      html: `
        <h2>Dear ${name},</h2>
        <p>Thank you for your inquiry regarding our cabin crew training programs at <strong>Valentia Cabin Crew Academy</strong>.</p>
        <p>We have received your message and will respond within 24 hours. Our team of experts will review your inquiry and provide you with detailed information about our courses.</p>
        
        <h3>Our Training Programs:</h3>
        <ul>
          <li><strong>Advanced Cabin Crew Diploma</strong> (1 Year)</li>
          <li><strong>English Language Proficiency</strong> (6 Months)</li>
          <li><strong>Basic Cabin Crew Training</strong> (6 Months)</li>
        </ul>
        
        <p>Best regards,<br>
        <strong>Valentia Cabin Crew Academy Team</strong><br>
        Email: valentiacabincrew.academy@gmail.com<br>
        Website: www.valentiacabincrew.academy</p>
        
        <p><em>Follow us on social media for the latest updates and aviation industry news.</em></p>
      `
    },
    zh: {
      subject: '感谢您的咨询 - Valentia空乘学院',
      html: `
        <h2>亲爱的${name}，</h2>
        <p>感谢您对<strong>Valentia空乘学院</strong>培训课程的咨询。</p>
        <p>我们已收到您的消息，将在24小时内回复。我们的专家团队将审核您的咨询并为您提供详细的课程信息。</p>
        
        <h3>我们的培训课程：</h3>
        <ul>
          <li><strong>高级空乘文凭课程</strong>（1年）</li>
          <li><strong>英语能力提升课程</strong>（6个月）</li>
          <li><strong>基础空乘培训课程</strong>（6个月）</li>
        </ul>
        
        <p>此致<br>
        敬礼！<br><br>
        <strong>Valentia空乘学院团队</strong><br>
        邮箱：valentiacabincrew.academy@gmail.com<br>
        网站：www.valentiacabincrew.academy</p>
        
        <p><em>关注我们的社交媒体获取最新资讯和航空业新闻。</em></p>
      `
    },
    ko: {
      subject: '문의해 주셔서 감사합니다 - Valentia 객실승무원 아카데미',
      html: `
        <h2>친애하는 ${name}님,</h2>
        <p><strong>Valentia 객실승무원 아카데미</strong> 교육 프로그램에 대한 문의를 해주셔서 감사합니다.</p>
        <p>귀하의 메시지를 받았으며 24시간 이내에 답변드리겠습니다. 저희 전문가 팀이 귀하의 문의를 검토하고 과정에 대한 자세한 정보를 제공해드릴 것입니다.</p>
        
        <h3>저희 교육 프로그램:</h3>
        <ul>
          <li><strong>고급 객실승무원 디플로마</strong> (1년)</li>
          <li><strong>영어 능력 향상 과정</strong> (6개월)</li>
          <li><strong>기본 객실승무원 교육</strong> (6개월)</li>
        </ul>
        
        <p>감사합니다.<br><br>
        <strong>Valentia 객실승무원 아카데미 팀</strong><br>
        이메일: valentiacabincrew.academy@gmail.com<br>
        웹사이트: www.valentiacabincrew.academy</p>
        
        <p><em>최신 업데이트와 항공업계 뉴스를 위해 소셜미디어를 팔로우해주세요.</em></p>
      `
    },
    ja: {
      subject: 'お問い合わせありがとうございます - Valentia キャビンクルーアカデミー',
      html: `
        <h2>${name}様</h2>
        <p><strong>Valentia キャビンクルーアカデミー</strong>の訓練プログラムについてお問い合わせいただき、ありがとうございます。</p>
        <p>お客様のメッセージを受信いたしました。24時間以内にご返信いたします。当校の専門チームがお客様のお問い合わせを検討し、コースの詳細情報をご提供いたします。</p>
        
        <h3>当校の訓練プログラム:</h3>
        <ul>
          <li><strong>上級キャビンクルーディプロマ</strong>（1年）</li>
          <li><strong>英語能力向上コース</strong>（6ヶ月）</li>
          <li><strong>基本キャビンクルー訓練</strong>（6ヶ月）</li>
        </ul>
        
        <p>よろしくお願いいたします。<br><br>
        <strong>Valentia キャビンクルーアカデミーチーム</strong><br>
        メール: valentiacabincrew.academy@gmail.com<br>
        ウェブサイト: www.valentiacabincrew.academy</p>
        
        <p><em>最新の更新情報と航空業界ニュースについては、ソーシャルメディアをフォローしてください。</em></p>
      `
    }
  };
  
  return templates[language] || templates.en;
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, course, language } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Send email to company
    const companyEmailOptions = {
      from: 'valentiacabincrew.academy@gmail.com',
      to: 'valentiacabincrew.academy@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Interested Course:</strong> ${course || 'Not specified'}</p>
        <p><strong>Language:</strong> ${language}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        
        <hr>
        <p><em>This message was sent from the contact form on valentiacabincrew.academy website.</em></p>
      `
    };
    
    // Send auto-reply to customer
    const autoReply = getAutoReplyTemplate(language, name);
    const customerEmailOptions = {
      from: 'valentiacabincrew.academy@gmail.com',
      to: email,
      subject: autoReply.subject,
      html: autoReply.html
    };
    
    // Send both emails
    await Promise.all([
      transporter.sendMail(companyEmailOptions),
      transporter.sendMail(customerEmailOptions)
    ]);
    
    res.json({
      success: true,
      message: 'Emails sent successfully'
    });
    
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emails'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

/*
To set up this backend:

1. Install dependencies:
   npm install express nodemailer cors

2. Set up Gmail App Password:
   - Go to Google Account settings
   - Enable 2-factor authentication
   - Generate an App Password for the application
   - Use this App Password instead of regular password

3. Environment variables (.env file):
   EMAIL_USER=valentiacabincrew.academy@gmail.com
   EMAIL_PASS=your-app-password
   PORT=3001

4. Update the frontend emailService.ts to call this API:
   const response = await fetch('http://localhost:3001/api/contact', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(emailData)
   });
*/
