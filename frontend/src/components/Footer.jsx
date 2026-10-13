export default function Footer({ onOpenAuth, onReplayIntro }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="modern-footer">
      <div className="footer-top-strip">
        <button className="footer-scroll-top-btn" onClick={scrollToTop}>
          ▲ Back to Top
        </button>
      </div>

      <div className="footer-main-grid">
        <div className="footer-col brand-col">
          <div className="brand-logo footer-brand">
            <div className="logo-crest">
              <span className="crest-text">SN</span>
            </div>
            <span className="brand-prime">
              STUDY<span className="accent-text">NOTES</span>
            </span>
          </div>
          <p className="footer-mission-text">
            Next-generation academic intelligence infrastructure. Empowering students worldwide with automated notes, flashcards, and exam preparation.
          </p>
          <div className="system-telemetry-badge">
            <span className="telemetry-dot"></span>
            <span>AI Engine Status: <strong>Optimal (99.98% Uptime)</strong></span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links-list">
            <li><a href="#home">Home Overview</a></li>
            <li><a href="#heroVideoContainer">Live AI Neural Stream</a></li>
            <li><a href="#generator">Notes Studio</a></li>
            <li><a href="#features">Platform Arsenal</a></li>
            <li><a href="#about">About Our Mission</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Student Access</h4>
          <ul className="footer-links-list">
            <li>
              <a href="#auth" onClick={(e) => { e.preventDefault(); onOpenAuth('login'); }}>
                Student Sign In
              </a>
            </li>
            <li>
              <a href="#auth" onClick={(e) => { e.preventDefault(); onOpenAuth('register'); }}>
                Create Free Account
              </a>
            </li>
            <li><a href="#generator">Notes Vault Access</a></li>
            <li>
              <a href="#replay" onClick={(e) => { e.preventDefault(); onReplayIntro(); }}>
                Replay Intro Video
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Supported Curricula</h4>
          <ul className="footer-links-list">
            <li><span>Physics, Chemistry &amp; Math</span></li>
            <li><span>Biology &amp; Medical Sciences</span></li>
            <li><span>Computer Science &amp; Coding</span></li>
            <li><span>History &amp; Social Sciences</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-watermark-title">STUDY NOTES</div>

      <div className="footer-bottom-bar">
        <div className="bottom-bar-inner">
          <p>&copy; 2026 Study Notes Inc. All academic rights reserved.</p>
          <div className="bottom-legal-group">
            <span>Privacy Protocol</span>
            <span>&bull;</span>
            <span>Terms of Academic Use</span>
            <span>&bull;</span>
            <span>Student Data Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
