import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Plane, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CoursesProps {
  isStandalone?: boolean;
}

const Courses = ({ isStandalone = false }: CoursesProps) => {
  const { t, language } = useLanguage();

  // Handle middle mouse button click for opening in new tab
  const handleMiddleClick = (e: React.MouseEvent, action: () => void) => {
    if (e.button === 1) { // Middle mouse button
      e.preventDefault();
      action();
    }
  };
  const [currentCourse, setCurrentCourse] = useState(0);
  // Touch swipe state for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  // Mobile features expansion state
  const [showAllFeaturesMobile, setShowAllFeaturesMobile] = useState(false);

  const courses = [
    {
      id: 'advanced',
      image: '/images/advanced-cabin-crew.png',
      highlights: ['Leadership Development', 'Crew Resource Management', 'International Standards', 'Advanced Safety Training', 'Emergency Procedures', 'Customer Service Excellence'],
      modules: 18,
      duration: t('courseDuration.1Year'),
      level: t('courseLevel.advanced'),
      price: 'RM 25,000',
      features: ['features.iata', 'features.harvard', 'features.jobplacement', 'features.airlines', 'features.practical', 'features.leadership']
    },
    {
      id: 'english',
      image: '/images/valentia- english language proficiency.png',
      highlights: ['Aviation English Terminology', 'Communication Skills', 'ICAO Language Proficiency', 'Professional Presentation', 'Cultural Awareness', 'Interview Preparation'],
      modules: 12,
      duration: t('courseDuration.6Months'),
      level: t('courseLevel.englishPlus'),
      price: 'RM 12,000',
      features: ['features.icao', 'features.interviews', 'features.pronunciation', 'features.vocabulary', 'features.speaking', 'features.practical']
    },
    {
      id: 'basic',
      image: '/images/valentia- basic cabin crew training.png',
      highlights: ['Basic Safety Procedures', 'Customer Service Fundamentals', 'Aviation Regulations', 'Health & Hygiene', 'Teamwork Skills', 'Professional Grooming'],
      modules: 6,
      duration: t('courseDuration.6Months'),
      level: t('courseLevel.beginner'),
      price: 'RM 6,000',
      features: ['features.basic', 'features.foundation', 'features.introduction', 'features.guidance', 'features.practical', 'features.support']
    }
  ];

  const nextCourse = () => {
    setCurrentCourse((prev) => {
      const next = (prev + 1) % courses.length;
      // Collapse mobile features when switching course
      setShowAllFeaturesMobile(false);
      return next;
    });
  };

  const prevCourse = () => {
    setCurrentCourse((prev) => {
      const next = (prev - 1 + courses.length) % courses.length;
      setShowAllFeaturesMobile(false);
      return next;
    });
  };

  const currentCourseData = courses[currentCourse];


  return (
    <section className={`bg-white ${isStandalone ? 'pt-20 sm:pt-24 pb-6 sm:pb-8' : 'pt-8 sm:pt-12 pb-2'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className={`text-center ${isStandalone ? 'mb-8 sm:mb-12' : 'mb-4 sm:mb-6'}`}>
          <h2 className={`font-bold text-gray-900 mb-6 ${isStandalone ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'}`}>
            {t('courses.title')}
          </h2>
          <p className={`text-gray-600 max-w-3xl mx-auto ${isStandalone ? 'text-xl md:text-2xl' : 'text-xl'}`}>
            {t('courses.subtitle')}
          </p>
        </div>

        {/* Optimized Course Slider */}
        <div className={`relative ${isStandalone ? 'mb-6 sm:mb-8' : 'mb-3 sm:mb-4'}`}>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100 group">
            <div className={`grid grid-cols-1 lg:grid-cols-3 ${isStandalone ? 'h-[700px] sm:h-[750px] lg:h-[500px]' : 'h-[650px] sm:h-[700px] lg:h-[450px]'}`}>
              {/* Course Image - Takes 1/3 of the space */}
              <div
                className="relative h-64 sm:h-72 lg:h-full lg:col-span-1 overflow-hidden bg-gray-100"
                onTouchStart={(e) => {
                  // Save initial touch position
                  const t0 = e.touches[0];
                  setTouchStartX(t0.clientX);
                  setTouchStartY(t0.clientY);
                }}
                onTouchEnd={(e) => {
                  if (touchStartX === null || touchStartY === null) return;
                  const t1 = e.changedTouches[0];
                  const dx = t1.clientX - touchStartX;
                  const dy = t1.clientY - touchStartY;
                  // Only trigger horizontal swipe if movement is mostly horizontal
                  const absDx = Math.abs(dx);
                  const absDy = Math.abs(dy);
                  const threshold = 40; // px
                  if (absDx > absDy && absDx > threshold) {
                    if (dx < 0) {
                      nextCourse();
                    } else {
                      prevCourse();
                    }
                  }
                  setTouchStartX(null);
                  setTouchStartY(null);
                }}
              >
                <img
                  src={currentCourseData.image}
                  alt={t(`courses.${currentCourseData.id}.title`)}
                  className={`w-full h-full transform transition-transform duration-700 group-hover:scale-105 object-cover ${
                    currentCourseData.id === 'advanced' 
                      ? 'object-top' 
                      : currentCourseData.id === 'basic'
                      ? 'object-center'
                      : 'object-center'
                  }`}
                  style={{
                    objectPosition: currentCourseData.id === 'advanced' 
                      ? 'center 30%' 
                      : currentCourseData.id === 'basic'
                      ? 'center center'
                      : 'center center'
                  }}
                  />
                  {/* Subtle overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none"></div>
                  
                  {/* Professional overlay for the advanced course */}
                  {currentCourseData.id === 'advanced' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-transparent"></div>
                  )}
                
                {/* Enhanced Course Level Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm transition-all duration-300 ${
                    currentCourseData.level === 'Advanced' ? 'bg-gradient-to-r from-red-100/95 to-red-200/95 text-red-800 border border-red-300 shadow-red-200/50' :
                    currentCourseData.level === 'Intermediate' ? 'bg-yellow-100/95 text-yellow-800 border border-yellow-200' :
                    'bg-green-100/95 text-green-800 border border-green-200'
                  }`}>
                    {currentCourseData.level === 'Advanced' && (
                      <span className="mr-1">⭐</span>
                    )}
                    {currentCourseData.level}
                  </span>
                </div>

                {/* Info button removed per request */}
                
                {/* Enhanced Course Navigation - Better positioned */}
                <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-6">
                  <button
                    onClick={prevCourse}
                    className="bg-white/95 hover:bg-white p-2 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 backdrop-blur-sm transform -translate-x-2 sm:-translate-x-4 hover:shadow-blue-200/50"
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-gray-800" />
                  </button>
                  <button
                    onClick={nextCourse}
                    className="bg-white/95 hover:bg-white p-2 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 backdrop-blur-sm transform translate-x-2 sm:translate-x-4 hover:shadow-blue-200/50"
                  >
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-800" />
                  </button>
                </div>
                
                {/* Enhanced Course Indicators with Labels */}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-2 sm:space-x-4">
                    {courses.map((course, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentCourse(index);
                          setShowAllFeaturesMobile(false);
                        }}
                        className={`flex flex-col items-center transition-all duration-300 ${
                          index === currentCourse ? 'scale-110' : 'hover:scale-105'
                        }`}
                      >
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mb-0.5 sm:mb-1 transition-all duration-300 ${
                          index === currentCourse ? 'bg-white scale-125 shadow-lg' : 'bg-white/50 hover:bg-white/75'
                        }`} />
                        <span className={`text-xs font-semibold transition-all duration-300 ${
                          index === currentCourse ? 'text-white opacity-100' : 'text-white/70 opacity-80'
                        }`}>
                          {course.level}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Optimized Course Details - Takes 2/3 of the space */}
              <div className="p-3 sm:p-4 lg:p-6 lg:col-span-2 flex flex-col h-full overflow-y-auto">
                <div className="flex-1 space-y-3 sm:space-y-4">
                  <div>
                    <div className="mb-3 sm:mb-4">
                      <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 ${
                        currentCourseData.id === 'advanced' 
                          ? 'bg-gradient-to-r from-red-800 via-red-700 to-red-600 bg-clip-text text-transparent' 
                          : 'text-gray-900'
                      }`}>
                        {currentCourseData.id === 'advanced' && (
                          <span className="inline-block mr-2 sm:mr-3">🎓</span>
                        )}
                      {t(`courses.${currentCourseData.id}.title`)}
                    </h3>
                      <div className="flex items-center text-blue-800 font-semibold text-sm sm:text-base mb-2 sm:mb-3">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                        {currentCourseData.duration}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                    <span className="block sm:hidden">
                      {t(`courses.${currentCourseData.id}.description`).length > 100 
                        ? t(`courses.${currentCourseData.id}.description`).substring(0, 100) + '...'
                        : t(`courses.${currentCourseData.id}.description`)
                      }
                    </span>
                    <span className="hidden sm:block">
                      {t(`courses.${currentCourseData.id}.description`)}
                    </span>
                  </p>

                  {/* Enhanced Course Features - 2 columns for compact view */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-blue-500" />
                      {t('courses.features')}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1.5 sm:gap-y-2">
                      {currentCourseData.features.map((feature, index) => (
                        <div key={index} className={`flex items-center group ${index >= 4 && !showAllFeaturesMobile ? 'hidden sm:flex' : ''}`}>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 group-hover:scale-125 transition-transform duration-200"></div>
                          <span className="text-xs sm:text-sm text-gray-700 group-hover:text-blue-700 transition-colors duration-200">{t(feature)}</span>
                        </div>
                      ))}
                      {currentCourseData.features.length > 4 && (
                        <div className="sm:hidden mt-1">
                          {!showAllFeaturesMobile ? (
                            <button
                              type="button"
                              onClick={() => setShowAllFeaturesMobile(true)}
                              className="flex items-center text-xs text-gray-700 hover:text-blue-700"
                            >
                              <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                              +{currentCourseData.features.length - 4} {t('mobile.moreFeatures')}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowAllFeaturesMobile(false)}
                              className="text-xs text-blue-700 underline"
                            >
                              {t('mobile.showLess')}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price display removed */}

                </div>

                {/* Enhanced CTA Button - Stick to bottom on mobile to avoid layout shift */}
                <div className="mt-auto sticky bottom-0 z-10 pt-3 sm:pt-4 bg-white/95 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-0 border-t border-gray-200 sm:border-0">
                  <button 
                    onClick={() => {
                      // Open course detail in new tab with language parameter
                      const currentUrl = window.location.origin;
                      const courseDetailUrl = `${currentUrl}/course/${currentCourseData.id}?lang=${language}`;
                      window.open(courseDetailUrl, '_blank');
                    }}
                    onMouseDown={(e) => handleMiddleClick(e, () => {
                      const currentUrl = window.location.origin;
                      const courseDetailUrl = `${currentUrl}/course/${currentCourseData.id}?lang=${language}`;
                      window.open(courseDetailUrl, '_blank');
                    })}
                    className="w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group text-sm sm:text-lg"
                  >
                    <Plane className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 group-hover:animate-bounce" />
                    {t('courses.learnMoreAndApply')}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Overview Section Removed - Using only the main slider for better UX */}
      </div>
    </section>
  );
};

export default Courses;