import React from 'react';
import { Target, Eye, Award, Users, Globe, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AboutUsProps {
  isStandalone?: boolean;
}

const AboutUs: React.FC<AboutUsProps> = ({ isStandalone = false }) => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Award,
      title: t('about.features.iata.title'),
      description: t('about.features.iata.description'),
    },
    {
      icon: Users,
      title: t('about.features.expert.title'),
      description: t('about.features.expert.description'),
    },
    {
      icon: Globe,
      title: t('about.features.global.title'),
      description: t('about.features.global.description'),
    },
    {
      icon: BookOpen,
      title: t('about.features.curriculum.title'),
      description: t('about.features.curriculum.description'),
    },
  ];

  return (
    <section className={`bg-gray-50 ${isStandalone ? 'pt-24 pb-20' : 'py-20'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center ${isStandalone ? 'mb-20' : 'mb-16'}`}>
          <h2 className={`font-bold text-gray-900 mb-6 ${isStandalone ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'}`}>
            {t('about.title')}
          </h2>
          <p className={`text-gray-600 max-w-3xl mx-auto ${isStandalone ? 'text-xl md:text-2xl' : 'text-xl'}`}>
            {t('about.subtitle')}
          </p>
        </div>

        {/* Main Content */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 items-center ${isStandalone ? 'gap-20 mb-24' : 'gap-16 mb-20'}`}>
          {/* Left - Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/images/valentia-intro picture.png"
                alt="Valentia Academy Campus"
                className={`rounded-2xl shadow-2xl object-cover w-full ${isStandalone ? 'h-[600px]' : 'h-[500px]'}`}
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl"></div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('about.description1')}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('about.description2')}
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Target className="h-6 w-6 text-blue-800" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{t('about.mission')}</h3>
                </div>
                <p className="text-gray-700">
                  {t('about.missionText')}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                    <Eye className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{t('about.vision')}</h3>
                </div>
                <p className="text-gray-700">
                  {t('about.visionText')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group h-full">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col justify-between">
                  <div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-blue-800" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;