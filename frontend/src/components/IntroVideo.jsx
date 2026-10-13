import { useEffect, useRef, useState } from 'react';

export default function IntroVideo({ onComplete }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Booting Neural Core...');
  const [linesRevealed, setLinesRevealed] = useState([false, false, false, false]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const particles = [];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5,
        color: i % 2 === 0 ? '#6366f1' : '#38bdf8'
      });
    }

    let animId = null;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      }
      animId = requestAnimationFrame(render);
    };
    render();

    // Progress interval
    let currentP = 0;
    const interval = setInterval(() => {
      currentP += 1.8;
      setProgress(Math.min(100, Math.floor(currentP)));

      if (currentP >= 20) setLinesRevealed(prev => [true, prev[1], prev[2], prev[3]]);
      if (currentP >= 45) setLinesRevealed(prev => [true, true, prev[2], prev[3]]);
      if (currentP >= 70) setLinesRevealed(prev => [true, true, true, prev[3]]);
      if (currentP >= 95) setLinesRevealed([true, true, true, true]);

      if (currentP < 35) setStatusText('Booting Neural Core...');
      else if (currentP < 65) setStatusText('Indexing 50k+ Knowledge Bases...');
      else if (currentP < 95) setStatusText('Calibrating Recall Algorithms...');
      else setStatusText('Neural Engine Ready!');

      if (currentP >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }, 40);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className="cinematic-intro-overlay">
      <canvas ref={canvasRef} id="introParticlesCanvas"></canvas>
      <button className="skip-intro-btn" onClick={onComplete} title="Skip Intro">
        Skip Intro ➔
      </button>

      <div className="intro-content-card">
        <div className="intro-emblem-wrap">
          <div className="intro-emblem-glow"></div>
          <div className="intro-emblem-box">SN</div>
        </div>

        <h1 className="intro-brand-title">
          STUDY<span className="intro-highlight">NOTES</span>
        </h1>
        <p className="intro-brand-subtitle">AI ACADEMIC REVISION &amp; REASONING SYSTEM</p>

        <div className="intro-terminal-box">
          <div className={`term-line ${linesRevealed[0] ? 'revealed' : ''}`}>
            <span className="term-dim">[0.00s]</span> Initializing Study Notes Neural Core... <span className="term-ok">OK</span>
          </div>
          <div className={`term-line ${linesRevealed[1] ? 'revealed' : ''}`}>
            <span className="term-dim">[0.45s]</span> Loading 50,000+ Verified Exam Knowledge Bases... <span className="term-ok">LOADED</span>
          </div>
          <div className={`term-line ${linesRevealed[2] ? 'revealed' : ''}`}>
            <span className="term-dim">[0.90s]</span> Calibrating Active Recall &amp; Spaced Learning Models... <span className="term-ok">SYNCED</span>
          </div>
          <div className={`term-line ${linesRevealed[3] ? 'revealed' : ''}`}>
            <span className="term-dim">[1.35s]</span> System Ready. Welcome, Student.
          </div>
        </div>

        <div className="intro-progress-wrapper">
          <div className="intro-progress-track">
            <div className="intro-progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="intro-progress-text">
            <span>{statusText}</span>
            <span>{progress}%</span>
          </div>
        </div>

        {progress >= 100 && (
          <button className="intro-enter-btn" onClick={onComplete}>
            Enter Study Notes Platform ➔
          </button>
        )}
      </div>
    </div>
  );
}
