import React from 'react';
import { ArrowRight, Star, Award, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onExploreCourses?: () => void;
}

const Hero = ({ onExploreCourses }: HeroProps) => {
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
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-2">
                <Star className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium text-yellow-300">{t('hero.premier')}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {t('hero.title')}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl font-light text-blue-100">
                {t('hero.subtitle')}
              </p>
              
              <p className="text-lg text-blue-200 leading-relaxed max-w-xl sm:leading-8">
                {t('hero.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onExploreCourses}
                onMouseDown={(e) => handleMiddleClick(e, () => {
                  const currentUrl = window.location.origin;
                  const coursesUrl = `${currentUrl}/#courses?lang=${language}`;
                  window.open(coursesUrl, '_blank');
                })}
                className="inline-flex items-center bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
              >
                {t('hero.cta')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-blue-700/50">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-blue-200">{t('hero.stats.graduates')}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm text-blue-200">{t('hero.stats.crewPlacement')}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold">4.9/5</div>
                <div className="text-sm text-blue-200">{t('hero.stats.studentRating')}</div>
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