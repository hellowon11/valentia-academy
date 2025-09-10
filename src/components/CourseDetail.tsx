import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Award, Users, Plane, Globe, Shield, Heart, CheckCircle, MapPin, Phone, Mail, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
  onCourseSelect?: (courseId: string) => void;
}

const CourseDetail = ({ courseId, onBack, onCourseSelect }: CourseDetailProps) => {
  const { t, language, setLanguage } = useLanguage();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  // 读取URL参数并设置语言
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && ['en', 'zh', 'ko', 'ja'].includes(langParam)) {
      setLanguage(langParam as any);
    }
  }, [setLanguage]);

  // 页面刷新时滚动到顶部
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 在页面刷新前保存滚动位置为0
      sessionStorage.setItem('scrollToTop', 'true');
    };

    const handleLoad = () => {
      // 页面加载后检查是否需要滚动到顶部
      if (sessionStorage.getItem('scrollToTop') === 'true') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        sessionStorage.removeItem('scrollToTop');
      }
    };

    // 监听页面刷新事件
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    // 组件挂载时也滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [appErrors, setAppErrors] = useState<{[key: string]: string}>({});

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage('');

    // Basic validation with .com email enforcement
    const errors: {[key: string]: string} = {};
    if (!applicationData.name.trim()) errors.name = 'Name is required';
    if (!applicationData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(applicationData.email)) {
      errors.email = 'Please enter a valid email';
    } else if (!applicationData.email.toLowerCase().endsWith('.com')) {
      errors.email = t('validation.emailDotCom');
    }
    if (!applicationData.phone.trim()) errors.phone = 'Phone is required';
    if (!applicationData.course.trim()) errors.course = 'Course is required';

    if (Object.keys(errors).length > 0) {
      setAppErrors(errors);
      return;
    }

    setAppErrors({});
    setIsSubmitting(true);
    
    try {
      // 创建FormData对象，包含表单数据和附件
      const formData = new FormData();
      formData.append('name', applicationData.name);
      formData.append('email', applicationData.email);
      formData.append('phone', applicationData.phone);
      formData.append('course', applicationData.course);
      formData.append('message', applicationData.message);
      formData.append('language', language); // 根据当前语言设置
      
      // 添加附件
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });
      
      // 发送到后端API
      const response = await fetch('/api/application', {
        method: 'POST',
        headers: {
          'Accept-Language': language || 'en'
        },
        body: formData
      });
      
      if (response.ok) {
        setSubmitMessage('success');
        setTimeout(() => {
          setShowApplicationForm(false);
          setSubmitMessage('');
          setApplicationData({ name: '', email: '', phone: '', course: '', message: '' });
          setAttachments([]);
        }, 2000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setSubmitMessage('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApplicationData({
      ...applicationData,
      [name]: value
    });
    // Clear error when user edits
    if (appErrors[name]) {
      setAppErrors({ ...appErrors, [name]: '' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const courseDetails = {
    advanced: {
      title: t('courses.advanced.title'),
      subtitle: t('courses.advanced.subtitle'),
      duration: t('courseDuration.1Year'),
      studyWeek: t('courseDetail.studyWeek'),
      intake: t('courseDetail.intakeMonths'),
      overview: t('courses.advanced.overview'),
              modules: {
          iata: [
            t('courses.advanced.modules.iata.1'),
            t('courses.advanced.modules.iata.2'),
            t('courses.advanced.modules.iata.3'),
            t('courses.advanced.modules.iata.4'),
            t('courses.advanced.modules.iata.5'),
            t('courses.advanced.modules.iata.6'),
            t('courses.advanced.modules.iata.7'),
            t('courses.advanced.modules.iata.8')
          ],
          communication: [
            t('courses.advanced.modules.communication.1'),
            t('courses.advanced.modules.communication.2'),
            t('courses.advanced.modules.communication.3')
          ],
          style: [
            t('courses.advanced.modules.style.1'),
            t('courses.advanced.modules.style.2'),
            t('courses.advanced.modules.style.3'),
            t('courses.advanced.modules.style.4')
          ],
          safety: [
            t('courses.advanced.modules.safety.1'),
            t('courses.advanced.modules.safety.2'),
            t('courses.advanced.modules.safety.3'),
            t('courses.advanced.modules.safety.4'),
            t('courses.advanced.modules.safety.5'),
            t('courses.advanced.modules.safety.6')
          ],
          harvard: [
            t('courses.advanced.modules.harvard.1'),
            t('courses.advanced.modules.harvard.2'),
            t('courses.advanced.modules.harvard.3'),
            t('courses.advanced.modules.harvard.4'),
            t('courses.advanced.modules.harvard.5'),
            t('courses.advanced.modules.harvard.6'),
            t('courses.advanced.modules.harvard.7'),
            t('courses.advanced.modules.harvard.8'),
            t('courses.advanced.modules.harvard.9'),
            t('courses.advanced.modules.harvard.10')
          ]
        },
      requirements: {
        academic: [
          t('requirements.academic.1'),
          t('requirements.academic.2')
        ],
        physical: [
          t('requirements.physical.1'),
          t('requirements.physical.2')
        ]
      },
      career: [
        t('career.1'),
        t('career.2'),
        t('career.3'),
        t('career.4'),
        t('career.5'),
        t('career.6'),
        t('career.7'),
        t('career.8'),
        t('career.9'),
        t('career.10'),
        t('career.11'),
        t('career.12'),
        t('career.13')
      ],
      perks: [
        t('perks.1'),
        t('perks.2'),
        t('perks.3'),
        t('perks.4'),
        t('perks.5'),
        t('perks.6'),
        t('perks.7'),
        t('perks.8'),
        t('perks.9'),
        t('perks.10'),
        t('perks.11'),
        t('perks.12'),
        t('perks.13')
      ]
    },
    english: {
      title: t('courses.english.title'),
      subtitle: t('courses.english.subtitle'),
      duration: t('courseDuration.6Months'),
      studyWeek: t('courseDetail.studyWeek'),
      intake: t('courseDetail.intakeMonths'),
      overview: t('courses.english.overview'),
              modules: {
          iata: [
            t('courses.advanced.modules.iata.1'),
            t('courses.advanced.modules.iata.2'),
            t('courses.advanced.modules.iata.3'),
            t('courses.advanced.modules.iata.4'),
            t('courses.advanced.modules.iata.5'),
            t('courses.advanced.modules.iata.6'),
            t('courses.advanced.modules.iata.7'),
            t('courses.advanced.modules.iata.8')
          ],
          communication: [
            t('courses.advanced.modules.communication.1'),
            t('courses.advanced.modules.communication.2'),
            t('courses.advanced.modules.communication.3')
          ],
          style: [
            t('courses.advanced.modules.style.1'),
            t('courses.advanced.modules.style.2'),
            t('courses.advanced.modules.style.3'),
            t('courses.advanced.modules.style.4')
          ],
          safety: [
            t('courses.advanced.modules.safety.1'),
            t('courses.advanced.modules.safety.2'),
            t('courses.advanced.modules.safety.3'),
            t('courses.advanced.modules.safety.4'),
            t('courses.advanced.modules.safety.5'),
            t('courses.advanced.modules.safety.6')
          ]
        },
      requirements: {
        academic: [
          t('requirements.academic.1'),
          t('requirements.academic.2')
        ],
        physical: [
          t('requirements.physical.1'),
          t('requirements.physical.2')
        ]
      },
      career: [
        t('career.1'),
        t('career.2'),
        t('career.3'),
        t('career.4'),
        t('career.5'),
        t('career.6'),
        t('career.7'),
        t('career.8'),
        t('career.9'),
        t('career.10'),
        t('career.11'),
        t('career.12'),
        t('career.13')
      ],
      perks: [
        t('perks.1'),
        t('perks.2'),
        t('perks.3'),
        t('perks.4'),
        t('perks.5'),
        t('perks.6'),
        t('perks.7'),
        t('perks.8'),
        t('perks.9'),
        t('perks.10'),
        t('perks.11'),
        t('perks.12'),
        t('perks.13')
      ]
    },
    basic: {
      title: t('courses.basic.title'),
      subtitle: t('courses.basic.subtitle'),
      duration: t('courseDuration.6Months'),
      studyWeek: t('courseDetail.studyWeek'),
      intake: t('courseDetail.intakeMonths'),
      overview: t('courses.basic.overview'),
              modules: {
          basic: [
            t('courses.basic.modules.basic.1'),
            t('courses.basic.modules.basic.2'),
            t('courses.basic.modules.basic.3'),
            t('courses.basic.modules.basic.4'),
            t('courses.basic.modules.basic.5'),
            t('courses.basic.modules.basic.6'),
            t('courses.basic.modules.basic.7'),
            t('courses.basic.modules.basic.8')
          ],
                  communication: [
            t('courses.advanced.modules.communication.1'),
            t('courses.advanced.modules.communication.2'),
            t('courses.advanced.modules.communication.3')
          ],
          style: [
            t('courses.advanced.modules.style.1'),
            t('courses.advanced.modules.style.2'),
            t('courses.advanced.modules.style.3'),
            t('courses.advanced.modules.style.4')
          ],
          safety: [
            t('courses.advanced.modules.safety.1'),
            t('courses.advanced.modules.safety.2'),
            t('courses.advanced.modules.safety.3'),
            t('courses.advanced.modules.safety.4'),
            t('courses.advanced.modules.safety.5'),
            t('courses.advanced.modules.safety.6')
          ]
        },
      requirements: {
        academic: [
          t('requirements.academic.1'),
          t('requirements.academic.2')
        ],
        physical: [
          t('requirements.physical.1'),
          t('requirements.physical.2')
        ]
      },
      career: [
        t('career.1'),
        t('career.2'),
        t('career.3'),
        t('career.4'),
        t('career.5'),
        t('career.6'),
        t('career.7'),
        t('career.8'),
        t('career.9'),
        t('career.10'),
        t('career.11'),
        t('career.12'),
        t('career.13')
      ],
      perks: [
        t('perks.1'),
        t('perks.2'),
        t('perks.3'),
        t('perks.4'),
        t('perks.5'),
        t('perks.6'),
        t('perks.7'),
        t('perks.8'),
        t('perks.9'),
        t('perks.10'),
        t('perks.11'),
        t('perks.12'),
        t('perks.13')
      ]
    }
  };

  const course = courseDetails[courseId as keyof typeof courseDetails];

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('courseDetail.courseNotFound')}</h2>
          <button
            onClick={onBack}
            className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
          >
            {t('courseDetail.backToCourses')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Mobile Course Switcher - Clean design */}
      <div className="lg:hidden bg-white border-b border-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-center space-x-2">
            {['advanced', 'english', 'basic'].map((id) => (
              <button
                key={id}
                onClick={() => onCourseSelect?.(id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  courseId === id
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t(`courses.${id}.title`).split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Course Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Award className="h-4 w-4 mr-2" />
            {t('courseDetail.iataCertified')}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {course.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            {course.subtitle}
          </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 max-w-2xl mx-auto">
              <div className="flex items-center justify-center sm:justify-start">
                <Clock className="h-4 w-4 mr-4 sm:mr-3 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <div className="font-medium text-gray-900">{t('courseDetail.duration')}</div>
                  <div className="text-gray-600">{course.duration}</div>
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <BookOpen className="h-4 w-4 mr-4 sm:mr-3 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <div className="font-medium text-gray-900">{t('courseDetail.study')}</div>
                  <div className="text-gray-600">{course.studyWeek}</div>
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <Users className="h-4 w-4 mr-4 sm:mr-3 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <div className="font-medium text-gray-900">{t('courseDetail.intake')}</div>
                  <div className="text-gray-600">{course.intake}</div>
                </div>
              </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Mobile CTA Button - Only visible on mobile */}
            <div className="lg:hidden bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">{t('courseDetail.readyToStart')}</h3>
              <p className="text-blue-100 text-sm mb-6">
                {t('courseDetail.joinNextIntake')}
              </p>
              <button 
                onClick={() => setShowApplicationForm(true)}
                className="w-full bg-white text-blue-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {t('courseDetail.applyNow')}
              </button>
            </div>

            {/* Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">{t('courseDetail.overview')}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                {course.overview}
              </p>
            </div>

            {/* Programme Modules */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">{t('courseDetail.programmeModules')}</h2>
              
              {/* IATA Modules */}
              <div className="mb-6 lg:mb-8">
                <h3 className="text-lg lg:text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  {t('courseDetail.iataModules')}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  {'iata' in course.modules && course.modules.iata?.map((module: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm lg:text-base text-gray-700 leading-relaxed">{module}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Communication Skills */}
              <div className="mb-6 lg:mb-8">
                <h3 className="text-lg lg:text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  {t('courseDetail.communicationSkills')}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  {course.modules.communication?.map((module, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm lg:text-base text-gray-700 leading-relaxed">{module}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Style and Image */}
              <div className="mb-6 lg:mb-8">
                <h3 className="text-lg lg:text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  {t('courseDetail.styleAndImage')}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  {course.modules.style?.map((module, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm lg:text-base text-gray-700 leading-relaxed">{module}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aircraft Safety */}
              {course.modules.safety && (
                <div className="mb-6 lg:mb-8">
                  <h3 className="text-lg lg:text-xl font-semibold text-blue-800 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    {t('courseDetail.aircraftSafety')}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                    {course.modules.safety.map((module, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm lg:text-base text-gray-700 leading-relaxed">{module}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Harvard Modules (for Advanced course) */}
              {'harvard' in course.modules && course.modules.harvard && (
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    {t('courseDetail.harvardModules')}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('courseDetail.harvardDescription')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.modules.harvard.map((module: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{module}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Modules (for Basic course) */}
              {'basic' in course.modules && course.modules.basic && (
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    {t('courseDetail.basicModules')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.modules.basic.map((module: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{module}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Entry Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">{t('courseDetail.entryRequirements')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('courseDetail.academicRequirements')}</h3>
                  <div className="space-y-2">
                    {course.requirements.academic.map((req, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('courseDetail.physicalRequirements')}</h3>
                  <div className="space-y-2">
                    {course.requirements.physical.map((req, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Career Opportunities */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">{t('courseDetail.careerOpportunities')}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {course.career.map((career, index) => (
                  <div key={index} className="flex items-start">
                    <Plane className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm lg:text-base text-gray-700 leading-relaxed">{career}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Perks */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">{t('courseDetail.perks')}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {course.perks.map((perk, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm lg:text-base text-gray-700 leading-relaxed">{perk}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">{t('courseDetail.basedOnAirline')}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-5 lg:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('courseDetail.contactInfo')}</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-blue-500 mr-3" />
                  <span className="text-sm text-gray-700">Kuala Lumpur City Centre</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-blue-500 mr-3" />
                  <span className="text-sm text-gray-700">+603-12345678</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-blue-500 mr-3" />
                  <span className="text-sm text-gray-700">valentiacabincrew.academy@gmail.com</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{t('courseDetail.applyNow')}</h3>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleApplicationSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={applicationData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('contact.form.name.placeholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={applicationData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    appErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder={t('contact.form.email.placeholder')}
                />
                {appErrors.email && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">{appErrors.email}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.phone')} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={applicationData.phone}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    appErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder={t('contact.form.phone.placeholder')}
                />
                {appErrors.phone && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">{appErrors.phone}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.course.label')} *
                </label>
                <select
                  name="course"
                  value={applicationData.course}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    appErrors.course ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">{t('contact.form.course.placeholder')}</option>
                  <option value="advanced">{t('contact.form.course.advanced')}</option>
                  <option value="english">{t('contact.form.course.english')}</option>
                  <option value="basic">{t('contact.form.course.basic')}</option>
                </select>
                {appErrors.course && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">{appErrors.course}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  name="message"
                  value={applicationData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('contact.form.message.placeholder')}
                />
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.attachments')} ({t('contact.form.attachments.optional')})
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">
                    {t('contact.form.attachments.hint')}
                  </p>
                  
                  {/* Display uploaded files */}
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">{t('contact.form.attachments.uploaded')}:</p>
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            {t('contact.form.attachments.remove')}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
              </button>
            </form>

            {/* Prominent Success/Error Overlay */}
            {submitMessage && (
              <div className="absolute inset-0 bg-white/85 backdrop-blur-sm flex items-center justify-center p-6">
                <div className={`w-full max-w-sm text-center rounded-2xl shadow-xl border p-8 animate-[fadeIn_.25s_ease-out] ${
                  submitMessage === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`} aria-live="assertive">
                  {submitMessage === 'success' ? (
                    <div className="flex flex-col items-center">
                      <svg viewBox="0 0 24 24" className="h-12 w-12 text-green-600 mb-3" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <path d="m22 4-10 10-3-3"/>
                      </svg>
                      <p className="text-lg font-semibold text-green-800 mb-1">{t('contact.form.success')}</p>
                      <p className="text-sm text-green-700">{t('contact.form.thanks') || 'We will contact you shortly.'}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg viewBox="0 0 24 24" className="h-12 w-12 text-red-600 mb-3" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                      </svg>
                      <p className="text-lg font-semibold text-red-800 mb-1">{t('contact.form.error')}</p>
                      <button onClick={() => setSubmitMessage('')} className="mt-2 px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700">OK</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
