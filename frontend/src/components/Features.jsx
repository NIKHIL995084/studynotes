export default function Features() {
  const featuresList = [
    {
      icon: "📝",
      title: "Chapter Summaries",
      desc: "Condense lengthy 80-page textbook units into clean, digestible 5-minute study sheets with zero fluff."
    },
    {
      icon: "⚡",
      title: "Rapid Flashcards",
      desc: "Generate high-yield key terms and definition cards for last-minute revision before entering the exam hall."
    },
    {
      icon: "🎯",
      title: "Practice Quizzes",
      desc: "Test your understanding with automated multiple-choice questions complete with instant explanations."
    },
    {
      icon: "🔒",
      title: "Student Notes Vault",
      desc: "Save your generated notes directly to your personal account so you can review them on any device."
    },
    {
      icon: "📖",
      title: "Eye-Comfort Mode",
      desc: "Designed specifically for long night study sessions with soft warm lighting that eliminates eye fatigue."
    },
    {
      icon: "🚀",
      title: "Instant Export",
      desc: "One-click copy, save, and printable output formatting ready for classroom revision or group study."
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="section-container">
        <div className="section-header text-center">
          <span className="section-tag-badge">PLATFORM ARSENAL</span>
          <h2 className="section-main-heading">Engineered for Academic Superiority</h2>
          <p className="section-description">
            Everything you need to master your syllabus in a fraction of the time.
          </p>
        </div>

        <div className="features-cards-grid">
          {featuresList.map((f, i) => (
            <div className="feature-card spot-card" key={i}>
              <div className="feature-card-icon">{f.icon}</div>
              <h3 className="feature-card-title">{f.title}</h3>
              <p className="feature-card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
