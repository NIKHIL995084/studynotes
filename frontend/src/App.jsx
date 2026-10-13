import { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import IntroVideo from './components/IntroVideo';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NotesGenerator from './components/NotesGenerator';
import Features from './components/Features';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('study_notes_theme') || 'dark';
  });

  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('study_notes_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [introActive, setIntroActive] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [toast, setToast] = useState(null);

  // Apply theme to document body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('study_notes_theme', theme);
  }, [theme]);

  // Toast Helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast((current) => (current === msg ? null : current));
    }, 2800);
  };

  const toggleTheme = () => {
    const themes = ['dark', 'light', 'eye-comfort'];
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(next);
    showToast(`Switched to ${next === 'dark' ? 'Dark Mode 🌙' : (next === 'light' ? 'Light Mode ☀️' : 'Eye-Comfort Mode 📖')}`);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setSession(userData);
    localStorage.setItem('study_notes_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('study_notes_session');
    showToast('🚪 Logged out safely. See you soon!');
  };

  const handleIntroComplete = () => {
    setIntroActive(false);
    // If not logged in, prompt sign in / register gateway modal!
    if (!session) {
      setTimeout(() => {
        handleOpenAuth('login');
        showToast('👋 Welcome! Please Sign In or Register to continue');
      }, 350);
    } else {
      showToast('🚀 Welcome back! Neural Engine Ready');
    }
  };

  // Mouse-following 3D spotlight effect on .spot-card elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.spot-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (
          e.clientX >= rect.left - 50 &&
          e.clientX <= rect.right + 50 &&
          e.clientY >= rect.top - 50 &&
          e.clientY <= rect.bottom + 50
        ) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -3.5;
          const rotateY = ((x - centerX) / centerX) * 3.5;
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        } else {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Custom IIT Tech Cursor */}
      <CustomCursor />

      {/* Cinematic Fullscreen Intro Video */}
      {introActive && <IntroVideo onComplete={handleIntroComplete} />}

      {/* Floating Frosted Glass Header */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        session={session}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        onReplayIntro={() => setIntroActive(true)}
      />

      {/* Main Experience */}
      <main>
        <Hero onOpenAuth={handleOpenAuth} onShowToast={showToast} />
        <NotesGenerator
          session={session}
          onOpenAuth={handleOpenAuth}
          onShowToast={showToast}
        />
        <Features />

        {/* Mission Section */}
        <section className="about-section" id="about">
          <div className="section-container">
            <div className="about-card-box spot-card">
              <span className="section-tag-badge">OUR CREED</span>
              <h2 className="section-main-heading">Built to Make Quality Education Effortless</h2>
              <p className="about-narrative">
                Traditional study methods waste dozens of hours on manual summarizing. Study Notes combines educational science with artificial intelligence to extract core concepts so you spend time mastering the material, not drowning in notes.
              </p>
              <div className="about-guarantee-pills">
                <span className="guarantee-pill">✓ 100% Free for Students</span>
                <span className="guarantee-pill">✓ CBSE, ICSE, University &amp; Competitive Exam Ready</span>
                <span className="guarantee-pill">✓ Private &amp; Secure Cloud Storage</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Smart Footer */}
      <Footer
        onOpenAuth={handleOpenAuth}
        onReplayIntro={() => setIntroActive(true)}
      />

      {/* Auth Gateway Modal */}
      <AuthModal
        isOpen={authOpen}
        mode={authMode}
        setMode={setAuthMode}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onShowToast={showToast}
      />

      {/* Universal Toast Alert */}
      {toast && <div className="toast-msg show">{toast}</div>}
    </>
  );
}
