import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TeamMembersProps {
  isStandalone?: boolean;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ isStandalone = false }) => {
  const { t } = useLanguage();

  const teamMembers = [
    {
      id: 1,
      name: 'Jimmy Hao',
      position: t('team.ceo.title'),
      image: '/images/valentia- ceo.png',
      description: t('team.ceo.description'),
      experience: t('team.ceo.experience'),
      expertise: t('team.ceo.expertise'),
      email: 'jimmy.tee@valentiaacademy.com'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      position: t('team.instructor1.title'),
      image: '/images/valentia-%20sarah.png',
      description: t('team.instructor1.description'),
      experience: t('team.instructor1.experience'),
      expertise: t('team.instructor1.expertise'),
      email: 'sarah.chen@valentiaacademy.com'
    },
    {
      id: 3,
      name: 'Michael Wong',
      position: t('team.instructor2.title'),
      image: '/images/valentia-%20michael%20wong.png',
      description: t('team.instructor2.description'),
      experience: t('team.instructor2.experience'),
      expertise: t('team.instructor2.expertise'),
      email: 'michael.wong@valentiaacademy.com'
    }
  ];

  return (
    <div className={`bg-gradient-to-br from-slate-50 to-blue-50 ${isStandalone ? 'pt-24 pb-16' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className={`text-center ${isStandalone ? 'mb-16' : 'mb-8'}`}>
          <h2 className={`font-bold text-gray-900 mb-6 ${isStandalone ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'}`}>
            {t('team.title')}
          </h2>
          <p className={`text-gray-600 max-w-3xl mx-auto leading-relaxed ${isStandalone ? 'text-xl md:text-2xl' : 'text-xl'}`}>
            {t('team.subtitle')}
          </p>
        </div>

        {/* Team Members Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${isStandalone ? 'gap-10 lg:gap-16' : 'gap-8 lg:gap-12'}`}>
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
                             {/* Member Image */}
               <div className={`relative overflow-hidden ${isStandalone ? 'h-96' : 'h-80'}`}>
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-center"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Position Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {member.position}
                  </span>
                </div>
              </div>

              {/* Member Info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {member.description}
                </p>

                {/* Experience */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    {t('team.experience')}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {member.experience}
                  </p>
                </div>

                {/* Expertise */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    {t('team.expertise')}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {member.expertise}
                  </p>
                </div>

                {/* Contact */}
                <div className="border-t border-gray-200 pt-4">
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {t('team.contact')}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default TeamMembers;
