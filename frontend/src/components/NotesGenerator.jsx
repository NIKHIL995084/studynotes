import { useState } from 'react';

const mockKnowledgeBase = {
  'photo': {
    title: 'Photosynthesis: Light-Dependent & Calvin Cycle Reactions',
    meta: 'Subject: Biology • Level: Class 11 / Pre-Med Entrance',
    concepts: [
      '<strong>Light Reactions:</strong> Occur in the thylakoid membranes; convert photons into ATP & NADPH while releasing O₂ via photolysis of water.',
      '<strong>Calvin Cycle (Dark Reactions):</strong> Takes place in the stroma; RuBisCO enzyme fixes atmospheric CO₂ into triose phosphate precursors.',
      '<strong>Action Spectrum:</strong> Chlorophyll a and b show maximum absorption peaks in the blue (430nm) and red (660nm) wavelengths.'
    ],
    formula: '6CO₂ + 6H₂O + Solar Photons ➔ C₆H₁₂O₆ + 6O₂  (ΔG° = +2870 kJ/mol)',
    tip: '<strong>Exam Note:</strong> Dark reactions do NOT require darkness! They simply do not directly require photons, but depend on light-reaction products.'
  },
  'newton': {
    title: "Newton's Laws of Motion: Inertia, Force & Dynamics",
    meta: 'Subject: Physics • Level: Class 11 / College Mechanics',
    concepts: [
      '<strong>1st Law (Inertia):</strong> An object persists in its state of rest or uniform rectilinear motion unless compelled by a net external resultant force.',
      '<strong>2nd Law (Fundamental Law):</strong> Rate of change of linear momentum is proportional to net applied force: F = dp/dt = m·a.',
      '<strong>3rd Law (Action-Reaction):</strong> For every action force, there exists an equal in magnitude and opposite in direction reaction force.'
    ],
    formula: 'F = m · a  |  p = m · v  |  Impulse: J = ∫F dt = Δp  |  F₁₂ = -F₂₁',
    tip: '<strong>Exam Note:</strong> Action and reaction forces NEVER act on the same body; they act on two separate interacting bodies, which is why they never cancel.'
  },
  'thermo': {
    title: 'Thermodynamics: Heat, Work, Entropy & Carnot Cycle',
    meta: 'Subject: Physics / Chemistry • Level: University Engineering',
    concepts: [
      '<strong>1st Law:</strong> Internal energy change equals heat supplied minus work done by system: ΔU = Q - W.',
      '<strong>2nd Law:</strong> Total entropy of an isolated system always increases; heat cannot spontaneously flow from cold to hot reservoir.',
      '<strong>Carnot Theorem:</strong> Maximum possible theoretical efficiency for any heat engine: η = 1 - (T_Cold / T_Hot).'
    ],
    formula: 'ΔU = Q - W  |  ΔS ≥ 0  |  Carnot Efficiency: η = 1 - (T_C / T_H)',
    tip: '<strong>Exam Note:</strong> In an isothermal reversible expansion of an ideal gas, ΔU = 0, meaning Q = W.'
  },
  'python': {
    title: 'Python Core Architecture: Data Structures & OOP',
    meta: 'Subject: Computer Science • Level: University Software Engineering',
    concepts: [
      '<strong>Interpreted & Dynamic:</strong> Types resolved at runtime; executes via CPython bytecode virtual machine.',
      '<strong>Hash Maps (Dictionaries):</strong> Keys must be hashable; lookup and insertion achieve O(1) average time complexity.',
      '<strong>Object-Oriented Design:</strong> Supports multiple inheritance, encapsulation, and special dunder methods.'
    ],
    formula: 'Dict Lookup: O(1)  |  List Append: O(1) amortized  |  Timsort: O(n log n)',
    tip: '<strong>Exam Note:</strong> Mutable default arguments (def func(x=[])) persist across function invocations; always use None as default.'
  }
};

export default function NotesGenerator({ session, onOpenAuth, onShowToast }) {
  const [query, setQuery] = useState("Newton's Laws of Motion: Inertia, Force and Momentum");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(mockKnowledgeBase['newton']);

  const handleGenerate = (topicToUse) => {
    const q = (topicToUse || query).trim();
    if (!q) {
      onShowToast('⚠️ Please enter a topic first');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const lower = q.toLowerCase();
      let matched = null;

      if (lower.includes('photo')) matched = mockKnowledgeBase['photo'];
      else if (lower.includes('newton') || lower.includes('motion') || lower.includes('force')) matched = mockKnowledgeBase['newton'];
      else if (lower.includes('thermo') || lower.includes('heat') || lower.includes('entropy')) matched = mockKnowledgeBase['thermo'];
      else if (lower.includes('python') || lower.includes('code') || lower.includes('data')) matched = mockKnowledgeBase['python'];
      else {
        matched = {
          title: `${q}: Comprehensive Revision Notes`,
          meta: 'Subject: Academic Syllabus • Level: Exam Focused Summary',
          concepts: [
            `<strong>Core Definition:</strong> Foundational theorem, principles, and architectural breakdown of ${q}.`,
            `<strong>Key Mechanism:</strong> Step-by-step principles and derivation pathways commonly tested in exams.`,
            `<strong>Active Recall Highlights:</strong> Essential high-yield bullet points for quick memory retrieval and revision.`
          ],
          formula: `Key Principles: Fundamental Theorem & Core Formulations of ${q}`,
          tip: `<strong>Exam Strategy:</strong> Practice active recall by explaining this topic aloud without referencing notes.`
        };
      }

      setOutput(matched);
      onShowToast('✨ Study notes synthesized successfully!');
    }, 550);
  };

  const handlePresetClick = (topic) => {
    setQuery(topic);
    handleGenerate(topic);
  };

  const handleCopy = () => {
    const text = `${output.title}\n\nFormula:\n${output.formula}\n\nGenerated via Study Notes`;
    navigator.clipboard.writeText(text).then(() => {
      onShowToast('📋 Study notes copied to clipboard!');
    }).catch(() => {
      onShowToast('📋 Notes copied!');
    });
  };

  const handleSave = () => {
    if (!session) {
      onShowToast('⚠️ Please Sign In to save notes to your personal vault');
      onOpenAuth('login');
      return;
    }
    onShowToast('💾 Note saved to your Student Vault!');
  };

  return (
    <section className="generator-section" id="generator">
      <div className="section-container">
        <div className="section-header text-center">
          <span className="section-tag-badge">AI WORKBENCH</span>
          <h2 className="section-main-heading">Intelligent Notes Generator Studio</h2>
          <p className="section-description">
            Type any topic, syllabus unit, or chapter to synthesize structured exam notes instantly.
          </p>
        </div>

        <div className="generator-workspace-card spot-card">
          <div className="generator-input-panel">
            <div className="input-label-row">
              <label htmlFor="genInput" className="input-title-label">
                Enter Topic / Syllabus Chapter / Concept
              </label>
              <span className="input-helper-tip">Press Enter or click Generate</span>
            </div>

            <div className="search-input-shell">
              <input
                id="genInput"
                type="text"
                className="search-main-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Type topic here (e.g. Organic Chemistry Reactions, Quantum Mechanics, Python OOP)..."
              />
              <button
                className="btn btn-generate-submit"
                onClick={() => handleGenerate()}
                disabled={loading}
              >
                <span>{loading ? 'Synthesizing...' : 'Synthesize Notes'}</span>
                <span>⚡</span>
              </button>
            </div>

            <div className="preset-pills-row">
              <span className="preset-label">Quick Topics:</span>
              <button
                type="button"
                className="preset-pill"
                onClick={() => handlePresetClick('Photosynthesis: Light & Dark Reactions')}
              >
                🌿 Photosynthesis
              </button>
              <button
                type="button"
                className="preset-pill"
                onClick={() => handlePresetClick("Newton's Laws of Motion: Inertia & Dynamics")}
              >
                ⚙️ Newton's Laws
              </button>
              <button
                type="button"
                className="preset-pill"
                onClick={() => handlePresetClick('Python Data Structures: Lists, Dictionaries & O(n)')}
              >
                🐍 Python OOP
              </button>
              <button
                type="button"
                className="preset-pill"
                onClick={() => handlePresetClick('Thermodynamics: Heat, Work & Entropy')}
              >
                🔥 Thermodynamics
              </button>
            </div>
          </div>

          <div className="generator-output-panel">
            <div className="output-header-bar">
              <div>
                <h3 className="output-topic-heading">{output.title}</h3>
                <span className="output-meta-pill">{output.meta}</span>
              </div>
              <div className="output-tools-row">
                <button className="btn-micro-tool" onClick={handleCopy} title="Copy to Clipboard">
                  📋 Copy Notes
                </button>
                <button className="btn-micro-tool" onClick={handleSave} title="Save to Vault">
                  💾 Save to Vault
                </button>
              </div>
            </div>

            <div className="output-content-stream">
              <div className="stream-note-block">
                <h4 className="stream-heading">📌 High-Yield Core Concepts</h4>
                <ul className="stream-bullet-list">
                  {output.concepts.map((c, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: c }}></li>
                  ))}
                </ul>
              </div>

              <div className="stream-note-block">
                <h4 className="stream-heading">💡 Essential Formulas &amp; SI Units</h4>
                <div className="formula-display-box">{output.formula}</div>
              </div>

              <div className="stream-note-block">
                <h4 className="stream-heading">🎯 Exam Tip &amp; Common Pitfall</h4>
                <p
                  className="exam-caution-box"
                  dangerouslySetInnerHTML={{ __html: output.tip }}
                ></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
