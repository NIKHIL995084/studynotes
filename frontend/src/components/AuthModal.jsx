import { useState } from 'react';

export default function AuthModal({
  isOpen,
  mode,
  setMode,
  onClose,
  onLoginSuccess,
  onShowToast
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGrade, setRegGrade] = useState('college');

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      onShowToast('⚠️ Please enter email and password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const rawName = loginEmail.split('@')[0];
      const cleanName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      onLoginSuccess({
        name: cleanName,
        email: loginEmail,
        grade: 'College'
      });
      onShowToast(`🚀 Welcome back, ${cleanName}! Signed in successfully.`);
      onClose();
    }, 600);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || regPassword.length < 6) {
      onShowToast('⚠️ Please enter name, valid email, and 6+ char password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onShowToast(`🎉 Welcome ${regName}! Registration complete. Please Sign In.`);
      setLoginEmail(regEmail);
      setMode('login');
    }, 650);
  };

  return (
    <div className="auth-modal-backdrop active" onClick={onClose}>
      <div className="auth-modal-card spot-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
          &times;
        </button>

        <div className="modal-header-block text-center">
          <div className="modal-crest-badge">📚</div>
          <h3 className="modal-main-title">
            {mode === 'login' ? 'Student Sign In' : 'Create Free Account'}
          </h3>
          <p className="modal-subtext">
            {mode === 'login'
              ? 'Access your saved notes, quizzes, and personal vault'
              : 'Start generating instant AI notes & quizzes for free'}
          </p>
        </div>

        <div className="modal-tabs-strip">
          <button
            type="button"
            className={`tab-switch-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab-switch-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Create Account
          </button>
        </div>

        {mode === 'login' ? (
          <form className="auth-form-body" onSubmit={handleLoginSubmit}>
            <div className="input-form-row">
              <label className="form-row-label">Student Email</label>
              <input
                type="email"
                className="form-input-box"
                placeholder="student@example.com"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="input-form-row">
              <div className="label-split-row">
                <label className="form-row-label">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); onShowToast('ℹ️ Password reset link sent if registered.'); }} className="forgot-link">
                  Forgot?
                </a>
              </div>
              <div className="pwd-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input-box"
                  placeholder="Enter password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="pwd-eye-trigger"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-auth-submit" disabled={loading}>
              <span>{loading ? 'Signing In...' : 'Sign In to Study Notes'}</span>
            </button>

            <div className="auth-switch-prompt text-center">
              <span>New student?</span>
              <button
                type="button"
                className="switch-link-accent"
                onClick={() => setMode('register')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Create free account
              </button>
            </div>
          </form>
        ) : (
          <form className="auth-form-body" onSubmit={handleRegisterSubmit}>
            <div className="input-form-row">
              <label className="form-row-label">Full Name</label>
              <input
                type="text"
                className="form-input-box"
                placeholder="e.g. Alex Sharma"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div className="input-form-row">
              <label className="form-row-label">Student Email</label>
              <input
                type="email"
                className="form-input-box"
                placeholder="student@example.com"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div className="input-form-row">
              <label className="form-row-label">Create Password</label>
              <div className="pwd-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input-box"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="pwd-eye-trigger"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="input-form-row">
              <label className="form-row-label">Current Academic Level</label>
              <select
                className="form-input-box"
                value={regGrade}
                onChange={(e) => setRegGrade(e.target.value)}
              >
                <option value="school">High School (Class 9 - 12)</option>
                <option value="college">College / University</option>
                <option value="competitive">Competitive Exams (JEE, NEET, UPSC, GRE)</option>
                <option value="other">Self-Learner</option>
              </select>
            </div>

            <button type="submit" className="btn btn-auth-submit" disabled={loading}>
              <span>{loading ? 'Creating Account...' : 'Create Free Student Account'}</span>
            </button>

            <div className="auth-switch-prompt text-center">
              <span>Already registered?</span>
              <button
                type="button"
                className="switch-link-accent"
                onClick={() => setMode('login')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Sign In here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
