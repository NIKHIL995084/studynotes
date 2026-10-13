import { useState, useEffect } from 'react';

export default function Navbar({
  theme,
  toggleTheme,
  session,
  onLogout,
  onOpenAuth,
  onReplayIntro
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.account-dropdown-wrapper')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const initials = session?.name
    ? session.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'ST';

  const firstName = session?.name ? session.name.split(' ')[0] : 'Student';

  return (
    <header className="floating-header" id="mainHeader">
      <div className="header-inner">
        {/* Brand Logo */}
        <a href="#home" className="brand-logo" aria-label="Study Notes Home">
          <div className="logo-crest">
            <span className="crest-text">SN</span>
            <span className="crest-dot"></span>
          </div>
          <div className="brand-naming">
            <span className="brand-prime">
              STUDY<span className="accent-text">NOTES</span>
            </span>
            <span className="brand-badge-tag">AI CORE v3.2</span>
          </div>
        </a>

        {/* Center Nav Links */}
        <nav className="nav-links-center" id="navCenterMenu">
          <a href="#home" className="nav-item active">Home</a>
          <a href="#heroVideoContainer" className="nav-item">AI Neural Stream</a>
          <a href="#generator" className="nav-item">Notes Studio</a>
          <a href="#features" className="nav-item">Features</a>
          <a href="#about" className="nav-item">About</a>
        </nav>

        {/* Right Tools */}
        <div className="header-right-tools">
          <button className="replay-intro-btn" onClick={onReplayIntro} title="Replay Cinematic Intro Video">
            <span>🎬 Intro</span>
          </button>

          <button className="theme-switch-btn" onClick={toggleTheme} title="Toggle Theme">
            <span>{theme === 'dark' ? '🌙' : (theme === 'light' ? '☀️' : '📖')}</span>
          </button>

          {/* Logged Out State */}
          {!session ? (
            <div className="auth-group-logged-out">
              <button className="btn-nav-outline" onClick={() => onOpenAuth('login')}>
                Sign In
              </button>
              <button className="btn-nav-primary" onClick={() => onOpenAuth('register')}>
                Register
              </button>
            </div>
          ) : (
            /* Logged In State with Safe Logout */
            <div className="auth-group-logged-in">
              <div className="account-dropdown-wrapper">
                <button
                  className="account-badge-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                >
                  <span className="avatar-initials">{initials}</span>
                  <span className="avatar-name">{firstName}</span>
                  <span className="caret-arrow">▾</span>
                </button>

                {dropdownOpen && (
                  <div className="account-menu-card active">
                    <div className="menu-user-banner">
                      <div className="banner-avatar">{initials}</div>
                      <div className="banner-text">
                        <strong>{session.name}</strong>
                        <small>{session.email}</small>
                      </div>
                    </div>
                    <div className="menu-divider"></div>
                    <a href="#generator" className="menu-link" onClick={() => setDropdownOpen(false)}>
                      📝 Generate New Notes
                    </a>
                    <a href="#generator" className="menu-link" onClick={() => setDropdownOpen(false)}>
                      💾 Student Notes Vault
                    </a>
                    <a href="#features" className="menu-link" onClick={() => setDropdownOpen(false)}>
                      🎯 Practice Exam Quizzes
                    </a>
                    <div className="menu-divider"></div>
                    <button
                      className="menu-link logout-btn-item"
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                    >
                      <span>🚪</span>
                      <strong>Log Out Safe</strong>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
