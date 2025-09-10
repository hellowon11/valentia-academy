// Email service for handling contact form submissions
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  course: string;
  language: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
}

// Auto-reply templates in different languages
export const getAutoReplyTemplate = (language: string, name: string) => {
  const templates = {
    en: {
      subject: 'Thank you for your inquiry - Valentia Cabin Crew Academy',
      body: `Dear ${name},

Thank you for your inquiry regarding our cabin crew training programs at Valentia Cabin Crew Academy.

We have received your message and will respond within 24 hours. Our team of experts will review your inquiry and provide you with detailed information about our courses.

In the meantime, feel free to explore our website for more information about our training programs:
- Advanced Cabin Crew Diploma (1 Year)
- English Language Proficiency (6 Months) 
- Basic Cabin Crew Training (6 Months)

Best regards,
Valentia Cabin Crew Academy Team
Email: valentiacabincrew.academy@gmail.com
Website: www.valentiacabincrew.academy

Follow us on social media for the latest updates and aviation industry news.`
    },
    zh: {
      subject: '感谢您的咨询 - Valentia空乘学院',
      body: `亲爱的${name}，

感谢您对Valentia空乘学院培训课程的咨询。

我们已收到您的消息，将在24小时内回复。我们的专家团队将审核您的咨询并为您提供详细的课程信息。

与此同时，欢迎您浏览我们的网站了解更多培训课程信息：
- 高级空乘文凭课程（1年）
- 英语能力提升课程（6个月）
- 基础空乘培训课程（6个月）

此致
敬礼！

Valentia空乘学院团队
邮箱：valentiacabincrew.academy@gmail.com
网站：www.valentiacabincrew.academy

关注我们的社交媒体获取最新资讯和航空业新闻。`
    },
    ko: {
      subject: '문의해 주셔서 감사합니다 - Valentia 객실승무원 아카데미',
      body: `친애하는 ${name}님,

Valentia 객실승무원 아카데미 교육 프로그램에 대한 문의를 해주셔서 감사합니다.

귀하의 메시지를 받았으며 24시간 이내에 답변드리겠습니다. 저희 전문가 팀이 귀하의 문의를 검토하고 과정에 대한 자세한 정보를 제공해드릴 것입니다.

그동안 저희 웹사이트에서 더 많은 교육 프로그램 정보를 확인해보세요：
- 고급 객실승무원 디플로마 (1년)
- 영어 능력 향상 과정 (6개월)
- 기본 객실승무원 교육 (6개월)

감사합니다.

Valentia 객실승무원 아카데미 팀
이메일: valentiacabincrew.academy@gmail.com
웹사이트: www.valentiacabincrew.academy

최신 업데이트와 항공업계 뉴스를 위해 소셜미디어를 팔로우해주세요.`
    },
    ja: {
      subject: 'お問い合わせありがとうございます - Valentia キャビンクルーアカデミー',
      body: `${name}様

Valentia キャビンクルーアカデミーの訓練プログラムについてお問い合わせいただき、ありがとうございます。

お客様のメッセージを受信いたしました。24時間以内にご返信いたします。当校の専門チームがお客様のお問い合わせを検討し、コースの詳細情報をご提供いたします。

その間、当校のウェブサイトで訓練プログラムの詳細をご覧ください：
- 上級キャビンクルーディプロマ（1年）
- 英語能力向上コース（6ヶ月）
- 基本キャビンクルー訓練（6ヶ月）

よろしくお願いいたします。

Valentia キャビンクルーアカデミーチーム
メール: valentiacabincrew.academy@gmail.com
ウェブサイト: www.valentiacabincrew.academy

最新の更新情報と航空業界ニュースについては、ソーシャルメディアをフォローしてください。`
    }
  };

  return templates[language as keyof typeof templates] || templates.en;
};

// Send email function - connects to backend API
export const sendContactEmail = async (data: ContactFormData): Promise<EmailResponse> => {
  try {
    console.log('Sending email with data:', data);
    
    // Call the backend API
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': data.language || 'en'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      return {
        success: true,
        message: result.message || 'Email sent successfully'
      };
    } else {
      return {
        success: false,
        message: result.message || 'Failed to send email'
      };
    }
    
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: 'Failed to connect to server. Please try again later.'
    };
  }
};

// Backend API endpoint structure (for reference)
/*
POST /api/contact
Body: {
  name: string,
  email: string,
  phone: string,
  message: string,
  course: string,
  language: string
}

Backend should:
1. Send email to valentiacabincrew.academy@gmail.com with inquiry details
2. Send auto-reply to customer email based on language
3. Return success/error response
*/
