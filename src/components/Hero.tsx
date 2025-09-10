import React from 'react';
import { ArrowRight, Star, Award, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onExploreCourses?: () => void;
  onCourseSelect?: (courseId: string) => void;
}

const Hero = ({ onCourseSelect }: HeroProps) => {
  const { t, language } = useLanguage();

  // Handle middle mouse button click for opening in new tab
  const handleMiddleClick = (e: React.MouseEvent, action: () => void) => {
    if (e.button === 1) { // Middle mouse button
      e.preventDefault();
      action();
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-6"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-24 md:py-28 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-6 lg:space-y-8">
            <div className="space-y-8 sm:space-y-4">
              {/* Mobile: Two badges side by side, Desktop: Single badge */}
              <div className="flex flex-row sm:block gap-4 sm:gap-0">
                <div className="inline-flex items-center sm:bg-gold-500/10 sm:border sm:border-gold-500/20 sm:rounded-full sm:px-4 sm:py-2">
                  <Star className="h-4 w-4 sm:h-4 sm:w-4 text-yellow-400 mr-2" />
                  <span className="text-sm sm:text-sm font-medium text-yellow-300">{t('hero.premier')}</span>
                </div>
                {/* IATA badge - only visible on mobile, no background/border */}
                <div className="sm:hidden inline-flex items-center">
                  <Award className="h-4 w-4 text-white mr-2" />
                  <span className="text-sm font-medium text-white">{t('hero.iata.title')}</span>
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {t('hero.title')}
                </span>
              </h1>
              
              <p className="text-lg sm:text-lg md:text-xl lg:text-2xl font-light text-blue-100">
                {t('hero.subtitle')}
              </p>
              
              <p className="text-base sm:text-base md:text-lg text-blue-200 leading-relaxed max-w-xl sm:leading-8">
                {t('hero.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
              <button 
                onClick={() => onCourseSelect?.('advanced')}
                onMouseDown={(e) => handleMiddleClick(e, () => {
                  const currentUrl = window.location.origin;
                  const courseDetailUrl = `${currentUrl}/course/advanced?lang=${language}`;
                  window.open(courseDetailUrl, '_blank');
                })}
                className="inline-flex items-center bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
              >
                {t('hero.cta')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-4 md:gap-6 lg:gap-8 pt-6 sm:pt-6 lg:pt-8 border-t border-blue-700/50">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-400" />
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold">500+</div>
                <div className="text-xs sm:text-sm text-blue-200 leading-tight">{t('hero.stats.graduates')}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-400" />
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold">95%</div>
                <div className="text-xs sm:text-sm text-blue-200 leading-tight">{t('hero.stats.crewPlacement')}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-400" />
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold">4.9/5</div>
                <div className="text-xs sm:text-sm text-blue-200 leading-tight">{t('hero.stats.studentRating')}</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/images/valentia- first page picutre.png"
                alt="Valentia Cabin Crew Academy - Professional Aviation Training"
                className="rounded-2xl shadow-2xl object-cover w-full h-[380px] sm:h-[480px] md:h-[600px] object-[55%_center]"
              />
              
              {/* Floating Cards */}
              <div className="hidden sm:block absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-800" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900">{t('hero.iata.title')}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{t('hero.iata.subtitle')}</div>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900">{t('hero.expert.title')}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{t('hero.expert.subtitle')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;