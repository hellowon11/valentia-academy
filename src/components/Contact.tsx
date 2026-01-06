import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Building, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { sendContactEmail, ContactFormData } from '../services/emailService';
import GoogleMap from './GoogleMap';

const Contact = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    course: ''
  });
  const [countryCode, setCountryCode] = useState('+60');
  
  const countryCodes = [
    { code: '+60', country: 'MY', name: 'Malaysia' },
    { code: '+65', country: 'SG', name: 'Singapore' },
    { code: '+86', country: 'CN', name: 'China' },
    { code: '+886', country: 'TW', name: 'Taiwan' },
    { code: '+852', country: 'HK', name: 'Hong Kong' },
    { code: '+81', country: 'JP', name: 'Japan' },
    { code: '+82', country: 'KR', name: 'South Korea' },
    { code: '+62', country: 'ID', name: 'Indonesia' },
    { code: '+66', country: 'TH', name: 'Thailand' },
    { code: '+84', country: 'VN', name: 'Vietnam' },
    { code: '+63', country: 'PH', name: 'Philippines' },
    { code: '+91', country: 'IN', name: 'India' },
    { code: '+61', country: 'AU', name: 'Australia' },
    { code: '+64', country: 'NZ', name: 'New Zealand' },
    { code: '+44', country: 'GB', name: 'UK' },
    { code: '+1', country: 'US', name: 'USA/Canada' },
    { code: '+33', country: 'FR', name: 'France' },
    { code: '+49', country: 'DE', name: 'Germany' },
    { code: '+39', country: 'IT', name: 'Italy' },
    { code: '+34', country: 'ES', name: 'Spain' },
    { code: '+971', country: 'AE', name: 'UAE' },
    { code: '+966', country: 'SA', name: 'Saudi Arabia' },
    { code: '+974', country: 'QA', name: 'Qatar' },
  ];

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Email validation helper
  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address (e.g. name@example.com)';
    if (!email.toLowerCase().endsWith('.com')) return 'Email address must end with .com';
    return '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      const error = validateEmail(value);
      if (error) {
        setErrors(prev => ({ ...prev, email: error }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    if (!formData.message.trim()) {
      newErrors.message = t('validation.messageRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setSubmitMessage('');
      
      try {
        const emailData: ContactFormData = {
          ...formData,
          phone: `${countryCode} ${formData.phone}`,
          language: language
        };
        
        const response = await sendContactEmail(emailData);
        
        if (response.success) {
          setIsSubmitted(true);
          setSubmitMessage(t('contact.form.success'));
          setFormData({ name: '', email: '', phone: '', message: '', course: '' });
          setErrors({});
          
          // Hide success message after 2 seconds
          setTimeout(() => {
            setIsSubmitted(false);
            setSubmitMessage('');
          }, 2000);
        } else {
          setSubmitMessage(t('contact.form.error'));
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitMessage(t('contact.form.error'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.address'),
      details: ['Kuala Lumpur City Centre', 'Malaysia, 50088'],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      details: ['+603-12345678'],
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Mail,
      title: t('contact.email'),
      details: ['valentiacabincrew.academy@gmail.com'],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Clock,
      title: t('contact.hours'),
      details: [t('contact.hours.weekdays'), t('contact.hours.saturday')],
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <section id="contact" className="pt-12 pb-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Users className="h-4 w-4 mr-2" />
            {t('contact.getInTouch')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Enhanced Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Building className="h-6 w-6 mr-2 text-blue-600" />
                {t('contact.contactInformation')}
              </h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 group">
                      <div className={`${info.bgColor} ${info.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-600 text-sm">{detail}</p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Google Maps */}
              <div className="mt-8 h-52 sm:h-60 lg:h-52 rounded-xl overflow-hidden border border-gray-200">
                <GoogleMap apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''} />
              </div>
            </div>
          </div>

          {/* Enhanced Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl px-8 pt-8 pb-6 border border-gray-100 relative overflow-hidden">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Send className="h-6 w-6 mr-2 text-blue-600" />
                {t('contact.form.title')}
              </h3>
              
              {(isSubmitted || submitMessage) && (
                <div className="absolute inset-0 bg-white/85 backdrop-blur-sm flex items-center justify-center p-6 z-10">
                  <div className={`w-full max-w-sm text-center rounded-2xl shadow-xl border p-8 animate-[fadeIn_.25s_ease-out] ${
                    isSubmitted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`} aria-live="assertive">
                    {isSubmitted ? (
                      <div className="flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="h-12 w-12 text-green-600 mb-3" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <path d="m22 4-10 10-3-3"/>
                        </svg>
                        <p className="text-lg font-semibold text-green-800 mb-1">{t('contact.form.success')}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="h-12 w-12 text-red-600 mb-3" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                        <p className="text-lg font-semibold text-red-800 mb-1">{t('contact.form.error')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder={t('contact.form.name.placeholder')}
                    />
                    {errors.name && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.name}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.email')} *
                    </label>
                    <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                        onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.email 
                            ? 'border-red-300 bg-red-50 pr-10' 
                            : formData.email && !validateEmail(formData.email)
                              ? 'border-green-300 bg-green-50 pr-10'
                              : 'border-gray-300'
                      }`}
                      placeholder={t('contact.form.email.placeholder')}
                    />
                      {/* Validation Icons */}
                      {formData.email && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          {errors.email ? (
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          ) : !validateEmail(formData.email) ? (
                            <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : null}
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <div className="flex items-center mt-1 text-red-600 text-sm animate-pulse">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <div className="flex">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-28 px-2 py-3 border border-r-0 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.country} ({country.code})
                          </option>
                        ))}
                      </select>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                        className="flex-1 w-full px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors border-gray-300"
                        placeholder="123456789"
                    />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.course.label')}
                    </label>
                    <select
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">{t('contact.form.course.placeholder')}</option>
                      <option value="advanced">{t('contact.form.course.advanced')}</option>
                      <option value="english">{t('contact.form.course.english')}</option>
                      <option value="basic">{t('contact.form.course.basic')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={9}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                      errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder={t('contact.form.message.placeholder')}
                  />
                  {errors.message && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.message}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white transform hover:scale-105 hover:shadow-xl'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      {t('contact.form.submit')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;