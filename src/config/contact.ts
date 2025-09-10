export const contactConfig = {
  whatsapp: {
    phone: '+60123456789', // 您的WhatsApp号码
    defaultMessage: 'Hi! I\'m interested in your cabin crew training courses. Can you provide more information?',
    // 不同语言的预设消息
    messages: {
      en: 'Hi! I\'m interested in your cabin crew training courses. Can you provide more information?',
      zh: '您好！我对您的空乘培训课程很感兴趣。能否提供更多信息？',
      ko: '안녕하세요! 객실승무원 교육 과정에 관심이 있습니다. 더 많은 정보를 제공해 주실 수 있나요?',
      ja: 'こんにちは！客室乗務員トレーニングコースに興味があります。詳細情報をいただけますか？'
    }
  },
  email: 'valentiacabincrew.academy@gmail.com',
  phone: '+603-12345678',
  address: 'Kuala Lumpur City Centre, Malaysia, 50088'
};

// 生成WhatsApp链接的函数
export const generateWhatsAppUrl = (language: string = 'en', customMessage?: string) => {
  const phone = contactConfig.whatsapp.phone.replace(/[^0-9]/g, ''); // 移除所有非数字字符
  const message = customMessage || contactConfig.whatsapp.messages[language as keyof typeof contactConfig.whatsapp.messages] || contactConfig.whatsapp.messages.en;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};
