import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();

  const handleNavigation = (section: string, courseId?: string) => {
    if (courseId && ['advanced', 'basic', 'english'].includes(courseId)) {
      // 如果是课程导航，在新标签页打开课程详情页面
      const courseUrl = `/course/${courseId}`;
      window.open(courseUrl, '_blank');
    } else {
      // 如果是普通页面导航，触发页面切换事件
      const event = new CustomEvent('navigateToSection', { detail: { section } });
      window.dispatchEvent(event);
    }
  };

  // Handle middle mouse button click for opening in new tab
  const handleMiddleClick = (e: React.MouseEvent, action: () => void) => {
    if (e.button === 1) { // Middle mouse button
      e.preventDefault();
      action();
    }
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/jie.hao.14/', color: 'hover:text-blue-600' },
    { icon: Instagram, href: 'https://www.instagram.com/jiehao_08/', color: 'hover:text-pink-500' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/jie-hao-tee-4aa753290/', color: 'hover:text-blue-700' },
    { 
      icon: null, 
      href: 'https://wa.me/60102568641', 
      color: 'hover:text-green-500',
      customIcon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      )
    },
  ];

  const quickLinks = [
    { name: t('nav.about'), href: '#about', section: 'about' },
    { name: t('nav.courses'), href: '#courses', section: 'courses' },
    { name: t('nav.team'), href: '#team', section: 'team' },
    { name: t('nav.contact'), href: '#contact', section: 'contact' },
  ];

  const courses = [
    { name: t('courses.advanced.title'), href: '#advanced', section: 'advanced', courseId: 'advanced' },
    { name: t('courses.basic.title'), href: '#basic', section: 'basic', courseId: 'basic' },
    { name: t('courses.english.title'), href: '#english', section: 'english', courseId: 'english' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4 sm:mb-6">
              <div className="flex-shrink-0">
                <img 
                  src="/images/valentia-logo.png" 
                  alt="Valentia Logo" 
                  className="h-10 w-auto sm:h-12"
                />
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-lg sm:text-xl font-bold">Valentia</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Cabin Crew Academy</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base text-center lg:text-left">
              {t('footer.description')}
            </p>
            
            <div className="flex justify-center lg:justify-start space-x-3 sm:space-x-4">
              {socialLinks.map((social, index) => {
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-colors ${social.color}`}
                  >
                    {social.customIcon ? (
                      <div className="h-4 w-4 sm:h-5 sm:w-5">
                        {social.customIcon}
                      </div>
                    ) : (
                      <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="pt-4 lg:pt-0 lg:pl-20">
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-center lg:text-left">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index} className="text-center lg:text-left">
                  <button
                    onClick={() => handleNavigation(link.section)}
                    onMouseDown={(e) => handleMiddleClick(e, () => {
                      const currentUrl = window.location.origin;
                      const sectionUrl = link.section === 'home' ? currentUrl : `${currentUrl}/#${link.section}?lang=${language}`;
                      window.open(sectionUrl, '_blank');
                    })}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base cursor-pointer hover:underline w-full lg:w-auto py-2 px-2"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div className="pt-4 lg:pt-0">
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-center lg:text-left">{t('footer.ourCourses')}</h4>
            <ul className="space-y-2 sm:space-y-3">
              {courses.map((course, index) => (
                <li key={index} className="text-center lg:text-left">
                  <button
                    onClick={() => handleNavigation(course.section, course.courseId)}
                    onMouseDown={(e) => handleMiddleClick(e, () => {
                      const currentUrl = window.location.origin;
                      const courseDetailUrl = `${currentUrl}/course/${course.courseId}?lang=${language}`;
                      window.open(courseDetailUrl, '_blank');
                    })}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base cursor-pointer hover:underline w-full lg:w-auto py-2 px-2"
                    title={`在新标签页打开 ${course.name}`}
                  >
                    {course.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="pt-4 lg:pt-0">
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-center lg:text-left">{t('footer.contactInfo')}</h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3 justify-center lg:justify-start">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm sm:text-base text-gray-400 text-center lg:text-left">
                  <p>Kuala Lumpur City Centre</p>
                  <p>Malaysia, 50088</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 justify-center lg:justify-start">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                <p className="text-sm sm:text-base text-gray-400 text-center lg:text-left">+603-12345678</p>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3 justify-center lg:justify-start">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm sm:text-base text-gray-400 text-center lg:text-left">
                  <p>valentiacabincrew.academy</p>
                  <p>@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Valentia Cabin Crew Academy. {t('footer.rights')}
            </p>
            <div className="flex space-x-4 sm:space-x-6 mt-3 md:mt-0">
              <a href="#privacy" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                {t('footer.privacyPolicy')}
              </a>
              <a href="#terms" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                {t('footer.termsOfService')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;