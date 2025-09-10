import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Courses from './components/Courses';
import TeamMembers from './components/TeamMembers';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import CourseDetail from './components/CourseDetail';
import PlaneAnimation from './components/PlaneAnimation';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showPlaneAnimation, setShowPlaneAnimation] = useState(false);

  // Check if this is the first visit and show plane animation
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('valentia-visited');
    if (!hasVisited) {
      setShowPlaneAnimation(true);
      sessionStorage.setItem('valentia-visited', 'true');
    }
  }, []);

  // Handle URL routing and browser history
  useEffect(() => {
    const path = window.location.pathname;
    
    // Handle course detail pages
    if (path.startsWith('/course/')) {
      const courseId = path.split('/course/')[1];
      if (courseId && ['advanced', 'english', 'basic'].includes(courseId)) {
        setSelectedCourse(courseId);
        setActiveSection('course-detail');
        return;
      }
    }
    
    // Handle other routes
    if (path === '/about') {
      setActiveSection('about');
    } else if (path === '/courses') {
      setActiveSection('courses');
    } else if (path === '/team') {
      setActiveSection('team');
    } else if (path === '/contact') {
      setActiveSection('contact');
    } else {
      setActiveSection('home');
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      
      if (path.startsWith('/course/')) {
        const courseId = path.split('/course/')[1];
        if (courseId && ['advanced', 'english', 'basic'].includes(courseId)) {
          setSelectedCourse(courseId);
          setActiveSection('course-detail');
          // Scroll to top when returning to course detail page
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        }
      } else if (path === '/about') {
        setActiveSection('about');
        setSelectedCourse(null);
        // Scroll to top when returning to about page
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else if (path === '/courses') {
        setActiveSection('courses');
        setSelectedCourse(null);
        // Scroll to top when returning to courses page
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else if (path === '/team') {
        setActiveSection('team');
        setSelectedCourse(null);
        // Scroll to top when returning to team page
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else if (path === '/contact') {
        setActiveSection('contact');
        setSelectedCourse(null);
        // Scroll to top when returning to contact page
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        setActiveSection('home');
        setSelectedCourse(null);
        // Scroll to top when returning to home page
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle Footer navigation events
  useEffect(() => {
    const handleFooterNavigation = (event: CustomEvent) => {
      const { section } = event.detail;
      setActiveSection(section);
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('navigateToSection', handleFooterNavigation as EventListener);

    return () => {
      window.removeEventListener('navigateToSection', handleFooterNavigation as EventListener);
    };
  }, []);


  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setActiveSection('courses');
    // Update URL back to courses
    window.history.pushState({}, '', '/courses');
    // Scroll to top of page when going back to courses
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaneAnimationComplete = () => {
    setShowPlaneAnimation(false);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setSelectedCourse(null);
    
    // Update URL based on section
    if (section === 'home') {
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', `/${section}`);
    }
    
    // Scroll to top of page when navigating to a new section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <LanguageProvider>
      {/* Plane Animation */}
      {showPlaneAnimation && (
        <PlaneAnimation onComplete={handlePlaneAnimationComplete} />
      )}
      
      <div className="min-h-screen bg-white">
        <Header 
          activeSection={activeSection} 
          setActiveSection={handleSectionChange} 
          selectedCourse={selectedCourse}
        />
        
        {activeSection === 'home' && (
          <>
            <Hero onExploreCourses={() => handleSectionChange('courses')} />
                          <Courses isStandalone={false} />
              <AboutUs isStandalone={false} />
            <TeamMembers isStandalone={false} />
            <Contact />
          </>
        )}
        
        {activeSection === 'about' && <AboutUs isStandalone={true} />}
        {activeSection === 'courses' && <Courses isStandalone={true} />}
        {activeSection === 'team' && <TeamMembers isStandalone={true} />}
        {activeSection === 'contact' && <Contact />}
        {activeSection === 'course-detail' && selectedCourse && (
          <CourseDetail courseId={selectedCourse} onBack={handleBackToCourses} />
        )}
        
        <Footer />
        {/* Mobile floating WhatsApp button */}
        <FloatingWhatsApp />
      </div>
    </LanguageProvider>
  );
}

export default App;