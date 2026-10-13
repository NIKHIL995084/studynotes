/**
 * Verified Academic Previous Year Questions (PYQ) Bank
 * Real Exam Tags: CBSE Class 12, JEE Main, NEET, University B.Tech, UPSC CSE
 */

const pyqBank = [
    {
        id: "pyq_phys_01",
        subject: "Physics",
        topic: "Newton's Laws of Motion",
        exam: "JEE Main 2023",
        year: 2023,
        question: "A body of mass 5 kg is acted upon by two perpendicular forces of 8 N and 6 N. Find the magnitude and direction of acceleration of the body.",
        markingScheme: "+4 marks for correct acceleration & angle; -1 for incorrect.",
        verifiedAnswer: "Resultant Force F = √(8² + 6²) = √(64 + 36) = √100 = 10 N. Acceleration a = F / m = 10 / 5 = 2.0 m/s². Direction θ = arctan(6/8) = arctan(0.75) ≈ 36.87° relative to the 8 N force vector.",
        difficulty: "Intermediate",
        highYieldConcept: "Vector superposition of collinear and perpendicular force vectors."
    },
    {
        id: "pyq_phys_02",
        subject: "Physics",
        topic: "Thermodynamics",
        exam: "NEET 2022",
        year: 2022,
        question: "A Carnot engine has an efficiency of 50% when its sink temperature is at 300 K. By how much must its source temperature be increased so that its efficiency becomes 60%?",
        markingScheme: "+4 for exact temperature difference in Kelvin; -1 for wrong.",
        verifiedAnswer: "Initial efficiency: η₁ = 1 - (T_sink / T_source) = 0.5 ➔ 0.5 = 300 / T₁ ➔ T₁ = 600 K. For target efficiency η₂ = 0.6: 1 - (300 / T₂) = 0.6 ➔ 300 / T₂ = 0.4 ➔ T₂ = 750 K. Source temperature must be increased by ΔT = 750 K - 600 K = 150 K.",
        difficulty: "Advanced",
        highYieldConcept: "Carnot thermodynamic cycle efficiency relationship: η = 1 - (T_C / T_H)."
    },
    {
        id: "pyq_chem_01",
        subject: "Chemistry",
        topic: "Organic Chemistry",
        exam: "CBSE Class 12 Board 2024",
        year: 2024,
        question: "Explain why haloarenes are extremely less reactive towards nucleophilic substitution reactions compared to haloalkanes.",
        markingScheme: "3 Marks: 1 mark for resonance stabilization, 1 mark for sp² hybridisation, 1 mark for instability of phenyl cation.",
        verifiedAnswer: "Haloarenes exhibit extreme inertness towards nucleophilic attack due to four factors: (1) Resonance effect: Lone pair electrons on halogen delocalize into the aromatic ring, giving the C-X bond partial double-bond character (shorter and stronger). (2) Carbon hybridisation: In haloarenes, carbon is sp² hybridized (higher s-character, holds bond tightly) vs sp³ in haloalkanes. (3) Instability of phenyl cation: C-X cleavage generates unstable phenyl cation. (4) Electronic repulsion between approaching nucleophile and electron-rich aromatic π-cloud.",
        difficulty: "Intermediate",
        highYieldConcept: "Aromatic resonance stability and bond length shortening."
    },
    {
        id: "pyq_bio_01",
        subject: "Biology",
        topic: "Photosynthesis",
        exam: "NEET 2023",
        year: 2023,
        question: "How many molecules of ATP and NADPH are consumed during the synthesis of one molecule of glucose in the Calvin cycle?",
        markingScheme: "+4 marks for correct count (18 ATP and 12 NADPH); -1 for incorrect.",
        verifiedAnswer: "Fixation of 1 CO₂ requires 3 ATP (2 in reduction of 3-PGA to G3P and 1 in regeneration of RuBP) and 2 NADPH. To synthesize 1 molecule of glucose (6 carbons), 6 turns of the Calvin cycle are required: Total ATP = 6 × 3 = 18 ATP molecules. Total NADPH = 6 × 2 = 12 NADPH molecules.",
        difficulty: "Intermediate",
        highYieldConcept: "Calvin cycle stoichiometric stoichiometry per hexose synthesized."
    },
    {
        id: "pyq_cs_01",
        subject: "Computer Science",
        topic: "Data Structures & Python",
        exam: "GATE CSE 2023",
        year: 2023,
        question: "What is the worst-case time complexity of searching for an element in an open-addressing hash table with linear probing if n elements are inserted in a table of size m?",
        markingScheme: "2 Marks for exact Big-O derivation.",
        verifiedAnswer: "Worst-case time complexity is O(n). When catastrophic clustering occurs (primary clustering where all keys hash to the same bucket index), all probes collide, reducing the hash search to a linear sequential traversal through the entire table.",
        difficulty: "Advanced",
        highYieldConcept: "Hash table collision resolution and primary clustering degradation."
    },
    {
        id: "pyq_math_01",
        subject: "Mathematics",
        topic: "Calculus & Derivatives",
        exam: "CBSE Class 12 Board 2023",
        year: 2023,
        question: "Find the maximum and minimum values of the function f(x) = 2x³ - 15x² + 36x + 11 on the closed interval [1, 5].",
        markingScheme: "5 Marks: 1 mark for f'(x), 1 mark for critical points, 2 marks for boundary evaluation, 1 mark for absolute extrema.",
        verifiedAnswer: "f'(x) = 6x² - 30x + 36 = 6(x² - 5x + 6) = 6(x - 2)(x - 3). Critical points: x = 2, x = 3 (both in [1, 5]). Evaluate f(x): f(1) = 34, f(2) = 39 (local max), f(3) = 38 (local min), f(5) = 66 (boundary). Therefore, Absolute Maximum value = 66 at x = 5; Absolute Minimum value = 34 at x = 1.",
        difficulty: "Intermediate",
        highYieldConcept: "Extreme Value Theorem on compact closed intervals."
    }
];

function searchPyq(query = "", examFilter = "", subjectFilter = "") {
    const q = (query || "").trim().toLowerCase();
    const e = (examFilter || "").trim().toLowerCase();
    const s = (subjectFilter || "").trim().toLowerCase();

    return pyqBank.filter(item => {
        const matchesQuery = !q || 
            item.topic.toLowerCase().includes(q) || 
            item.question.toLowerCase().includes(q) ||
            item.highYieldConcept.toLowerCase().includes(q);

        const matchesExam = !e || item.exam.toLowerCase().includes(e);
        const matchesSubject = !s || item.subject.toLowerCase().includes(s);

        return matchesQuery && matchesExam && matchesSubject;
    });
}

module.exports = {
    pyqBank,
    searchPyq
};
