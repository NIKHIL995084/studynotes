import { useEffect, useRef, useState } from 'react';

const demoTopics = [
  {
    title: "Thermodynamics: Laws, Entropy & Carnot Engine",
    teaser: "<strong>1st Law:</strong> ΔU = Q - W (Conservation of Energy) • <strong>2nd Law:</strong> Total entropy of isolated system increases (ΔS ≥ 0). Carnot Efficiency: η = 1 - (T_C / T_H)."
  },
  {
    title: "Newton's Laws of Motion: Inertia, Force & Momentum",
    teaser: "<strong>Fundamental Law:</strong> F = dp/dt = m·a • <strong>Action-Reaction:</strong> Forces occur in equal and opposite pairs acting on different bodies."
  },
  {
    title: "Photosynthesis: Light Reactions & Calvin Cycle",
    teaser: "<strong>Light Harvesting:</strong> Photons excite thylakoid electrons generating ATP and NADPH. <strong>Dark Reaction:</strong> Stroma fixes CO₂ into glucose."
  },
  {
    title: "Python Data Structures: Hash Maps & Big-O Complexity",
    teaser: "<strong>Dictionary Lookup:</strong> O(1) average time via hash collisions resolution. <strong>Lists:</strong> O(n) search, O(1) amortized append."
  }
];

export default function Hero({ onOpenAuth, onShowToast }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [topicIndex, setTopicIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const viewport = canvas.parentElement;
    canvas.width = viewport.clientWidth * window.devicePixelRatio;
    canvas.height = viewport.clientHeight * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = viewport.clientWidth;
    const height = viewport.clientHeight;

    const particles = [];
    for (let i = 0; i < 48; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2.5 + 1.5,
        color: i % 3 === 0 ? '#6366f1' : (i % 3 === 1 ? '#38bdf8' : '#f59e0b')
      });
    }

    let corePulse = 0;
    let animId = null;
    let progress = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Core pulse
      corePulse = (corePulse + 0.35) % 80;
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, corePulse, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(99, 102, 241, ${Math.max(0, 0.45 - corePulse / 80)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Laser lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.45 * (1 - dist / 110)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (isPlaying) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
      }

      // Timeline Scrubber
      if (isPlaying) {
        progress = (progress + 0.22) % 100;
        setProgressWidth(progress);

        if (progress < 0.25) {
          setTopicIndex((prev) => (prev + 1) % demoTopics.length);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    onShowToast(isPlaying ? '⏸️ Video playback paused' : '▶️ Video playback resumed');
  };

  const handleReset = () => {
    setProgressWidth(0);
    onShowToast('🔄 Video simulation reset');
  };

  return (
    <section className="hero-section" id="home">
      <div className="hero-container">
        <div className="hero-badge-pill">
          <span className="badge-signal"></span>
          <span>IIT &amp; Global Academic Standard AI Engine</span>
        </div>

        <h1 className="hero-title">
          Master Any Syllabus With <span className="gradient-text">Precision AI Notes</span>
        </h1>
        <p className="hero-subtext">
          Engineered for high school, university, and competitive exam toppers. Turn raw textbooks, lectures, and formulas into crystal-clear study sheets, flashcards, and quizzes.
        </p>

        <div className="hero-buttons-row">
          <a href="#generator" className="btn btn-hero-primary">
            <span>Launch Notes Studio</span>
            <span>⚡</span>
          </a>
          <button className="btn btn-hero-secondary" onClick={() => onOpenAuth('register')}>
            <span>Create Student Account</span>
          </button>
        </div>

        {/* 60 FPS LIVE ANIMATED VIDEO CANVAS */}
        <div className="video-player-container spot-card" id="heroVideoContainer">
          <div className="video-top-control-bar">
            <div className="video-indicator-cluster">
              <span className="rec-dot"></span>
              <span className="video-mode-title">STUDY NOTES NEURAL STREAM • 60 FPS REALTIME</span>
            </div>
            <div className="video-actions-cluster">
              <button className="video-btn-tool" onClick={togglePlay} title="Play / Pause">
                <span>{isPlaying ? '⏸️' : '▶️'}</span>
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button className="video-btn-tool" onClick={handleReset} title="Reset">
                <span>🔄 Reset</span>
              </button>
            </div>
          </div>

          <div className="video-canvas-viewport">
            <canvas ref={canvasRef} id="neuralCanvas"></canvas>

            <div className="video-hud-overlay">
              <div className="hud-topic-card">
                <span className="hud-label">CURRENT NEURAL FOCUS:</span>
                <div className="hud-topic-title">{demoTopics[topicIndex].title}</div>
              </div>

              <div className="hud-metric-pill metric-accuracy">
                <span className="metric-icon">✓</span>
                <span>Exam Alignment: <strong>99.8%</strong></span>
              </div>

              <div className="hud-metric-pill metric-speed">
                <span className="metric-icon">⚡</span>
                <span>Latency: <strong>0.42s</strong></span>
              </div>

              <div className="hud-output-teaser">
                <div className="teaser-header">
                  <span className="teaser-tag">INSTANT SYNTHESIS TEASER</span>
                  <span className="teaser-grade">Class 11 / 12 • College</span>
                </div>
                <p
                  className="teaser-body"
                  dangerouslySetInnerHTML={{ __html: demoTopics[topicIndex].teaser }}
                ></p>
              </div>
            </div>
          </div>

          <div className="video-progress-strip">
            <div className="video-progress-fill" style={{ width: `${progressWidth}%` }}></div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card spot-card">
            <strong className="metric-num">150,000+</strong>
            <span className="metric-title">Notes Generated</span>
          </div>
          <div className="metric-card spot-card">
            <strong className="metric-num">99.8%</strong>
            <span className="metric-title">Exam Accuracy</span>
          </div>
          <div className="metric-card spot-card">
            <strong className="metric-num">3.5x</strong>
            <span className="metric-title">Faster Revision</span>
          </div>
          <div className="metric-card spot-card">
            <strong className="metric-num">100% Free</strong>
            <span className="metric-title">For All Students</span>
          </div>
        </div>
      </div>
    </section>
  );
}
