import React from 'react';
import { Menu, X, Globe, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './Logo';
import { generateWhatsAppUrl } from '../config/contact';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  selectedCourse?: string | null;
  onCourseSelect?: (courseId: string) => void;
}

const Header = ({ activeSection, setActiveSection, selectedCourse, onCourseSelect }: HeaderProps) => {
  const { language, setLanguage, t } = useLanguage();

  // Handle middle mouse button click for opening in new tab
  const handleMiddleClick = (e: React.MouseEvent, action: () => void) => {
    if (e.button === 1) { // Middle mouse button
      e.preventDefault();
      action();
    }
  };
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Enhanced Logo */}
          <div 
            className="cursor-pointer group" 
            onClick={() => setActiveSection('home')}
            onMouseDown={(e) => handleMiddleClick(e, () => {
              const currentUrl = window.location.origin;
              window.open(currentUrl, '_blank');
            })}
          >
            <Logo size="medium" showText={true} className="group-hover:scale-105 transition-transform duration-300" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {activeSection === 'course-detail' ? (
              // Course navigation for course detail page
              <>
                <button
                  onClick={() => onCourseSelect && onCourseSelect('advanced')}
                  onMouseDown={(e) => handleMiddleClick(e, () => {
                    const currentUrl = window.location.origin;
                    const courseDetailUrl = `${currentUrl}/course/advanced?lang=${language}`;
                    window.open(courseDetailUrl, '_blank');
                  })}
                  className={`font-medium transition-all duration-300 relative group text-center max-w-32 ${
                    selectedCourse === 'advanced'
                      ? 'text-blue-800 border-b-2 border-blue-800 pb-1'
                      : 'text-gray-600 hover:text-blue-800'
                  }`}
                >
                  <div className="leading-tight">
                    {t('courses.advanced.title')}
                  </div>
                </button>
                <button
                  onClick={() => onCourseSelect && onCourseSelect('english')}
                  onMouseDown={(e) => handleMiddleClick(e, () => {
                    const currentUrl = window.location.origin;
                    const courseDetailUrl = `${currentUrl}/course/english?lang=${language}`;
                    window.open(courseDetailUrl, '_blank');
                  })}
                  className={`font-medium transition-all duration-300 relative group text-center max-w-32 ${
                    selectedCourse === 'english'
                      ? 'text-blue-800 border-b-2 border-blue-800 pb-1'
                      : 'text-gray-600 hover:text-blue-800'
                  }`}
                >
                  <div className="leading-tight">
                    {t('courses.english.title')}
                  </div>
                </button>
                <button
                  onClick={() => onCourseSelect && onCourseSelect('basic')}
                  onMouseDown={(e) => handleMiddleClick(e, () => {
                    const currentUrl = window.location.origin;
                    const courseDetailUrl = `${currentUrl}/course/basic?lang=${language}`;
                    window.open(courseDetailUrl, '_blank');
                  })}
                  className={`font-medium transition-all duration-300 relative group text-center max-w-32 ${
                    selectedCourse === 'basic'
                      ? 'text-blue-800 border-b-2 border-blue-800 pb-1'
                      : 'text-gray-600 hover:text-blue-800'
                  }`}
                >
                  <div className="leading-tight">
                    {t('courses.basic.title')}
                  </div>
                </button>
              </>
            ) : (
              // Regular navigation for other pages
              ['home', 'about', 'courses', 'team', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  onMouseDown={(e) => handleMiddleClick(e, () => {
                    const currentUrl = window.location.origin;
                    const sectionUrl = section === 'home' ? currentUrl : `${currentUrl}/#${section}?lang=${language}`;
                    window.open(sectionUrl, '_blank');
                  })}
                  className={`font-medium transition-all duration-300 relative group ${
                    activeSection === section
                      ? 'text-blue-800 border-b-2 border-blue-800 pb-1'
                      : 'text-gray-700 hover:text-blue-800'
                  }`}
                >
                  {t(`nav.${section}`)}
                </button>
              ))
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
          {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">
                  {languages.find(lang => lang.code === language)?.flag} {languages.find(lang => lang.code === language)?.name}
                </span>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsLangOpen(false);
                      }}
                      className={`flex items-center w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                        language === lang.code ? 'bg-blue-50 text-blue-800' : 'text-gray-700'
                      }`}
                    >
                      <span className="mr-3">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Button */}
            <button 
              onClick={() => {
                const whatsappUrl = generateWhatsAppUrl(language);
                window.open(whatsappUrl, '_blank');
              }}
              onMouseDown={(e) => handleMiddleClick(e, () => {
                const whatsappUrl = generateWhatsAppUrl(language);
                window.open(whatsappUrl, '_blank');
              })}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Phone className="h-4 w-4 mr-2" />
              {t('header.contactUs')}
            </button>
          </div>

          {/* Mobile actions: quick language + menu */}
          <div className="lg:hidden flex items-center space-x-2 relative">
            <button
              aria-label="Change language"
              onClick={() => setIsLangOpen((v) => !v)}
              className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-blue-800 hover:bg-gray-100 transition-colors"
            >
              <Globe className="h-4 w-4 mr-2" />
              <span className="text-xs font-medium">
                {languages.find(lang => lang.code === language)?.code.toUpperCase() || 'EN'}
              </span>
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-blue-800 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile language popover */}
            {isLangOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setIsLangOpen(false);
                    }}
                    className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      language === lang.code ? 'bg-blue-50 text-blue-800' : 'text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-6 bg-white/95 backdrop-blur-md">
            <nav className="space-y-3 mb-6">
              {activeSection === 'course-detail' ? (
                // Course navigation for course detail page
                <>
                  <button
                    onClick={() => {
                      onCourseSelect && onCourseSelect('advanced');
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 font-medium transition-colors ${
                      selectedCourse === 'advanced'
                        ? 'text-blue-800 border-l-4 border-blue-800 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="leading-tight">
                      {t('courses.advanced.title')}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onCourseSelect && onCourseSelect('english');
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 font-medium transition-colors ${
                      selectedCourse === 'english'
                        ? 'text-blue-800 border-l-4 border-blue-800 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="leading-tight">
                      {t('courses.english.title')}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onCourseSelect && onCourseSelect('basic');
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 font-medium transition-colors ${
                      selectedCourse === 'basic'
                        ? 'text-blue-800 border-l-4 border-blue-800 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="leading-tight">
                      {t('courses.basic.title')}
                    </div>
                  </button>
                </>
              ) : (
                // Regular navigation for other pages
                ['home', 'about', 'courses', 'team', 'contact'].map((section) => (
                  <button
                    key={section}
                    onClick={() => {
                      setActiveSection(section);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 font-medium transition-colors ${
                      activeSection === section
                        ? 'text-blue-800 border-l-4 border-blue-800 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-800 hover:bg-gray-50'
                    }`}
                  >
                    {t(`nav.${section}`)}
                  </button>
                ))
              )}
            </nav>
            
            {/* Mobile Language Selector removed; use globe button in the header */}

            {/* Mobile Contact Button */}
            <div className="mt-6 px-4">
              <button 
                onClick={() => {
                  const whatsappUrl = generateWhatsAppUrl(language);
                  window.open(whatsappUrl, '_blank');
                }}
                className="w-full inline-flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Phone className="h-4 w-4 mr-2" />
                {t('header.contactUs')}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;