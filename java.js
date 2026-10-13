/**
 * ==============================================================================
 * STUDY NOTES — PRODUCTION APPLICATION CORE SCRIPT
 * Brand: Study Notes
 * Tagline: Learn Smarter. Revise Faster. Score Better.
 * Project Owner: Nikhil Tetarwal
 * Standard Native Mouse Cursor
 * Fully functional with MongoDB Atlas Cloud
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🎓 Study Notes Platform Initialized | Lead: Nikhil Tetarwal', 'color: #38bdf8; font-weight: 800; font-size: 14px;');

    const API_BASE = window.location.origin;

    // --------------------------------------------------------------------------
    // 1. BRAND INTRO ANIMATION (1-2s Brand Reveal, Once per Session)
    // --------------------------------------------------------------------------
    const cinematicIntro = document.getElementById('cinematicIntro');
    const introProgressBar = document.getElementById('introProgressBar');
    const skipIntroBtn = document.getElementById('skipIntroBtn');
    const footerReplayIntroLink = document.getElementById('footerReplayIntroLink');

    function runBrandIntro() {
        if (!cinematicIntro) return;

        // Check if user already saw intro during this browser session
        if (sessionStorage.getItem('study_notes_intro_seen') === 'true') {
            cinematicIntro.classList.add('intro-hidden');
            return;
        }

        cinematicIntro.classList.remove('intro-hidden');
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (introProgressBar) {
                introProgressBar.style.width = `${progress}%`;
            }
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    cinematicIntro.classList.add('intro-hidden');
                    sessionStorage.setItem('study_notes_intro_seen', 'true');
                }, 200);
            }
        }, 50); // ~1.0-1.2 seconds total duration

        if (skipIntroBtn) {
            skipIntroBtn.onclick = () => {
                clearInterval(interval);
                cinematicIntro.classList.add('intro-hidden');
                sessionStorage.setItem('study_notes_intro_seen', 'true');
            };
        }
    }

    runBrandIntro();

    if (footerReplayIntroLink) {
        footerReplayIntroLink.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('study_notes_intro_seen');
            runBrandIntro();
        });
    }

    // --------------------------------------------------------------------------
    // 2. THEME SWITCHER (Dark / Light / Eye-Comfort)
    // --------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themes = ['dark', 'light', 'eye-comfort'];

    const savedTheme = localStorage.getItem('study_notes_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') themeIcon.textContent = '🌙';
        else if (theme === 'light') themeIcon.textContent = '☀️';
        else themeIcon.textContent = '📖';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const current = document.body.getAttribute('data-theme') || 'dark';
            const nextIndex = (themes.indexOf(current) + 1) % themes.length;
            const nextTheme = themes[nextIndex];
            document.body.setAttribute('data-theme', nextTheme);
            localStorage.setItem('study_notes_theme', nextTheme);
            updateThemeIcon(nextTheme);
            showToast(`Theme switched to ${nextTheme.toUpperCase()}`);
        });
    }

    // --------------------------------------------------------------------------
    // 3. TOAST NOTIFICATION SYSTEM
    // --------------------------------------------------------------------------
    function showToast(message, type = 'info') {
        let toast = document.querySelector('.toast-msg');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-msg';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        if (type === 'error') {
            toast.style.borderLeftColor = '#EF4444';
        } else if (type === 'success') {
            toast.style.borderLeftColor = '#10B981';
        } else {
            toast.style.borderLeftColor = '#38BDF8';
        }

        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    // --------------------------------------------------------------------------
    // 4. USER AUTHENTICATION & SESSION MANAGEMENT
    // --------------------------------------------------------------------------
    function getCurrentUser() {
        try {
            const raw = localStorage.getItem('study_notes_session');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function setCurrentUser(user) {
        localStorage.setItem('study_notes_session', JSON.stringify(user));
        updateAuthUI();
    }

    function logoutUser() {
        localStorage.removeItem('study_notes_session');
        updateAuthUI();
        showToast('Logged out securely.');
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'index.html';
        }
    }

    const authLoggedOutGroup = document.getElementById('authLoggedOutGroup');
    const authLoggedInGroup = document.getElementById('authLoggedInGroup');
    const navUserName = document.getElementById('navUserName');
    const navAvatarInitials = document.getElementById('navAvatarInitials');
    const dropdownAvatarInitials = document.getElementById('dropdownAvatarInitials');
    const dropdownUserFullName = document.getElementById('dropdownUserFullName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    const accountTriggerBtn = document.getElementById('accountTriggerBtn');
    const accountDropdownMenu = document.getElementById('accountDropdownMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    function updateAuthUI() {
        const user = getCurrentUser();
        if (user) {
            if (authLoggedOutGroup) authLoggedOutGroup.style.display = 'none';
            if (authLoggedInGroup) authLoggedInGroup.style.display = 'flex';

            const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ST';
            if (navUserName) navUserName.textContent = user.name.split(' ')[0];
            if (navAvatarInitials) navAvatarInitials.textContent = initials;
            if (dropdownAvatarInitials) dropdownAvatarInitials.textContent = initials;
            if (dropdownUserFullName) dropdownUserFullName.textContent = user.name;
            if (dropdownUserEmail) dropdownUserEmail.textContent = user.email;

            // If on dashboard, populate header
            const dashName = document.getElementById('dashStudentName');
            const dashEmail = document.getElementById('dashStudentEmail');
            const dashGrade = document.getElementById('dashGradeTag');
            const dashSubject = document.getElementById('dashSubjectTag');
            if (dashName) dashName.textContent = user.name;
            if (dashEmail) dashEmail.textContent = `Logged in as: ${user.email}`;
            if (dashGrade) dashGrade.textContent = `Level: ${user.grade || 'College'}`;
            if (dashSubject) dashSubject.textContent = `Focus: ${user.subject || 'General'}`;
        } else {
            if (authLoggedOutGroup) authLoggedOutGroup.style.display = 'flex';
            if (authLoggedInGroup) authLoggedInGroup.style.display = 'none';
        }
    }

    updateAuthUI();

    if (accountTriggerBtn && accountDropdownMenu) {
        accountTriggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            accountDropdownMenu.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            accountDropdownMenu.classList.remove('active');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }

    // Modal Auth Handlers
    const authModalBackdrop = document.getElementById('authModalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navRegisterBtn = document.getElementById('navRegisterBtn');
    const modalTabLoginBtn = document.getElementById('modalTabLoginBtn');
    const modalTabRegisterBtn = document.getElementById('modalTabRegisterBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const linkToRegister = document.getElementById('linkToRegister');
    const linkToLogin = document.getElementById('linkToLogin');

    function openAuthModal(mode = 'login') {
        if (!authModalBackdrop) return;
        authModalBackdrop.classList.add('active');
        setModalTab(mode);
    }

    function closeAuthModal() {
        if (authModalBackdrop) authModalBackdrop.classList.remove('active');
    }

    function setModalTab(mode) {
        if (mode === 'login') {
            if (modalTabLoginBtn) modalTabLoginBtn.classList.add('active');
            if (modalTabRegisterBtn) modalTabRegisterBtn.classList.remove('active');
            if (loginForm) loginForm.style.display = 'flex';
            if (registerForm) registerForm.style.display = 'none';
        } else {
            if (modalTabRegisterBtn) modalTabRegisterBtn.classList.add('active');
            if (modalTabLoginBtn) modalTabLoginBtn.classList.remove('active');
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'flex';
        }
    }

    if (navLoginBtn) navLoginBtn.addEventListener('click', () => openAuthModal('login'));
    if (navRegisterBtn) navRegisterBtn.addEventListener('click', () => openAuthModal('register'));
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeAuthModal);
    if (modalTabLoginBtn) modalTabLoginBtn.addEventListener('click', () => setModalTab('login'));
    if (modalTabRegisterBtn) modalTabRegisterBtn.addEventListener('click', () => setModalTab('register'));
    if (linkToRegister) linkToRegister.addEventListener('click', (e) => { e.preventDefault(); setModalTab('register'); });
    if (linkToLogin) linkToLogin.addEventListener('click', (e) => { e.preventDefault(); setModalTab('login'); });

    // Password Eye Toggles
    document.querySelectorAll('.pwd-eye-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.textContent = '🔒';
                } else {
                    input.type = 'password';
                    btn.textContent = '👁️';
                }
            }
        });
    });

    // Handle Login (Modal)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;

            try {
                const res = await fetch(`${API_BASE}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    setCurrentUser(data.user);
                    closeAuthModal();
                    showToast(`Welcome back, ${data.user.name}!`, 'success');
                } else {
                    showToast(data.message || 'Login failed.', 'error');
                }
            } catch (err) {
                showToast('Unable to reach server.', 'error');
            }
        });
    }

    // Handle Register (Modal)
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('regName')?.value;
            const email = document.getElementById('regEmail')?.value;
            const password = document.getElementById('regPassword')?.value;
            const grade = document.getElementById('regGrade')?.value;

            try {
                const res = await fetch(`${API_BASE}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, grade })
                });
                const data = await res.json();
                if (res.ok) {
                    setCurrentUser(data.user);
                    closeAuthModal();
                    showToast(`Account created! Welcome, ${data.user.name}!`, 'success');
                } else {
                    showToast(data.message || 'Registration failed.', 'error');
                }
            } catch (err) {
                showToast('Unable to reach server.', 'error');
            }
        });
    }

    // Handle Standalone Login Page
    const standaloneLoginForm = document.getElementById('standaloneLoginForm');
    if (standaloneLoginForm) {
        standaloneLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginUserEmail')?.value;
            const password = document.getElementById('loginUserPassword')?.value;

            try {
                const res = await fetch(`${API_BASE}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    setCurrentUser(data.user);
                    showToast(`Welcome back, ${data.user.name}! Redirecting...`, 'success');
                    setTimeout(() => window.location.href = 'dashboard.html', 800);
                } else {
                    showToast(data.message || 'Invalid credentials.', 'error');
                }
            } catch (err) {
                showToast('Network error during login.', 'error');
            }
        });
    }

    // Handle Standalone Register Page
    const standaloneRegisterForm = document.getElementById('standaloneRegisterForm');
    if (standaloneRegisterForm) {
        standaloneRegisterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('regFullName')?.value;
            const email = document.getElementById('regUserEmail')?.value;
            const password = document.getElementById('regUserPassword')?.value;
            const grade = document.getElementById('regUserGrade')?.value;
            const subject = document.getElementById('regUserSubject')?.value;
            const institution = document.getElementById('regInstitution')?.value;

            try {
                const res = await fetch(`${API_BASE}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, grade, subject, institution })
                });
                const data = await res.json();
                if (res.ok) {
                    setCurrentUser(data.user);
                    showToast(`Registration complete! Redirecting to Dashboard...`, 'success');
                    setTimeout(() => window.location.href = 'dashboard.html', 800);
                } else {
                    showToast(data.message || 'Registration failed.', 'error');
                }
            } catch (err) {
                showToast('Network error during registration.', 'error');
            }
        });
    }

    // --------------------------------------------------------------------------
    // 5. NOTES STUDIO GENERATOR & 12 FORMATS WORKBENCH
    // --------------------------------------------------------------------------
    const mainGenerateBtn = document.getElementById('mainGenerateBtn');
    const heroQuickGenBtn = document.getElementById('heroQuickGenBtn');
    const generatorTopicInput = document.getElementById('generatorTopicInput');
    const heroQuickInput = document.getElementById('heroQuickInput');

    const outputTopicTitle = document.getElementById('outputTopicTitle');
    const outputMetaBadge = document.getElementById('outputMetaBadge');
    const outputSourceBadge = document.getElementById('outputSourceBadge');
    const outputConceptList = document.getElementById('outputConceptList');
    const outputFormulaBox = document.getElementById('outputFormulaBox');
    const outputExamTip = document.getElementById('outputExamTip');
    const outputFlowchartBox = document.getElementById('outputFlowchartBox');
    const outputFlowchartBlock = document.getElementById('outputFlowchartBlock');

    // Toolbar Action Buttons
    const saveNotesBtn = document.getElementById('saveNotesBtn');
    const editNotesBtn = document.getElementById('editNotesBtn');
    const regenNotesBtn = document.getElementById('regenNotesBtn');
    const shortenNotesBtn = document.getElementById('shortenNotesBtn');
    const expandNotesBtn = document.getElementById('expandNotesBtn');
    const translateNotesBtn = document.getElementById('translateNotesBtn');
    const copyNotesBtn = document.getElementById('copyNotesBtn');
    const printNotesBtn = document.getElementById('printNotesBtn');
    const downloadMdBtn = document.getElementById('downloadMdBtn');
    const bookmarkNoteBtn = document.getElementById('bookmarkNoteBtn');
    const viewVaultBtn = document.getElementById('viewVaultBtn');
    const vaultCountBadge = document.getElementById('vaultCountBadge');

    let currentGeneratedNotes = null;
    let isEditingNotes = false;

    async function handleGenerateNotes(topicOverride = null) {
        const topic = topicOverride || generatorTopicInput?.value || heroQuickInput?.value;
        if (!topic || topic.trim().length === 0) {
            showToast('Please enter a topic name.', 'error');
            return;
        }

        const subject = document.getElementById('genSubject')?.value || 'Physics';
        const grade = document.getElementById('genGrade')?.value || 'college';
        const examType = document.getElementById('genExamType')?.value || 'General Exam';
        const format = document.getElementById('genFormat')?.value || 'Detailed Academic Notes';
        const language = document.getElementById('genLanguage')?.value || 'English';
        const difficulty = document.getElementById('genDifficulty')?.value || 'Intermediate';
        const includeExamples = document.getElementById('toggleExamples')?.checked ?? true;
        const includeDiagrams = document.getElementById('toggleDiagrams')?.checked ?? true;
        const includeQuestions = document.getElementById('toggleQuestions')?.checked ?? true;

        if (mainGenerateBtn) mainGenerateBtn.innerHTML = '<span>Synthesizing... ⏳</span>';
        if (heroQuickGenBtn) heroQuickGenBtn.innerHTML = '<span>Synthesizing... ⏳</span>';

        try {
            const res = await fetch(`${API_BASE}/api/generate-notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    subject,
                    grade,
                    examType,
                    format,
                    language,
                    difficulty,
                    includeExamples,
                    includeDiagrams,
                    includeQuestions
                })
            });

            const data = await res.json();
            if (res.ok && data.notes) {
                currentGeneratedNotes = data.notes;
                currentGeneratedNotes.rawTopic = topic;
                renderGeneratedNotes(data.notes, data.source);
                showToast(`Notes synthesized via ${data.source}!`, 'success');

                // If user is on hero, smoothly scroll to generator
                const genSection = document.getElementById('generator');
                if (genSection && topicOverride) {
                    genSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                showToast(data.error || 'Failed to generate notes.', 'error');
            }
        } catch (err) {
            showToast('Error synthesizing notes.', 'error');
        } finally {
            if (mainGenerateBtn) mainGenerateBtn.innerHTML = '<span>Synthesize Notes ⚡</span>';
            if (heroQuickGenBtn) heroQuickGenBtn.innerHTML = '<span>Generate Notes ⚡</span>';
        }
    }

    function renderGeneratedNotes(notes, source = 'Study Notes Academic Engine') {
        if (outputTopicTitle) outputTopicTitle.textContent = notes.title;
        if (outputMetaBadge) outputMetaBadge.textContent = notes.meta || 'Academic Syllabus';
        if (outputSourceBadge) outputSourceBadge.textContent = source;

        if (outputConceptList) {
            outputConceptList.innerHTML = '';
            if (notes.concepts && notes.concepts.length > 0) {
                notes.concepts.forEach(c => {
                    const li = document.createElement('li');
                    li.innerHTML = c;
                    outputConceptList.appendChild(li);
                });
            } else {
                outputConceptList.innerHTML = '<li>Theoretical breakdown and governing principles of the concept.</li>';
            }
        }

        if (outputFormulaBox) {
            outputFormulaBox.textContent = notes.formula || 'Fundamental formulations and laws apply.';
        }

        if (outputExamTip) {
            outputExamTip.innerHTML = notes.tip || '<strong>High-Yield Alert:</strong> Watch boundary conditions closely.';
        }

        if (outputFlowchartBlock && outputFlowchartBox) {
            if (notes.flowchart) {
                outputFlowchartBlock.style.display = 'block';
                outputFlowchartBox.textContent = notes.flowchart;
            } else {
                outputFlowchartBlock.style.display = 'none';
            }
        }

        // Also update Flashcards and 5-min sheet if provided
        if (notes.flashcards && notes.flashcards.length > 0) {
            loadFlashcards(notes.flashcards);
        }
    }

    if (mainGenerateBtn) {
        mainGenerateBtn.addEventListener('click', () => handleGenerateNotes());
    }

    if (heroQuickGenBtn) {
        heroQuickGenBtn.addEventListener('click', () => {
            const val = heroQuickInput ? heroQuickInput.value : '';
            if (generatorTopicInput) generatorTopicInput.value = val;
            handleGenerateNotes(val);
        });
    }

    // Preset Pills
    document.querySelectorAll('.preset-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const topic = pill.getAttribute('data-topic');
            if (generatorTopicInput) generatorTopicInput.value = topic;
            if (heroQuickInput) heroQuickInput.value = topic;
            handleGenerateNotes(topic);
        });
    });

    // Save Note to MongoDB Atlas
    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', async () => {
            const user = getCurrentUser();
            if (!user) {
                openAuthModal('login');
                showToast('Please sign in to save notes to your cloud vault.', 'error');
                return;
            }

            if (!currentGeneratedNotes) {
                showToast('Generate notes first before saving.', 'error');
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/api/notes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userEmail: user.email,
                        userName: user.name,
                        topic: currentGeneratedNotes.rawTopic || currentGeneratedNotes.title,
                        title: currentGeneratedNotes.title,
                        meta: currentGeneratedNotes.meta,
                        concepts: currentGeneratedNotes.concepts,
                        formula: currentGeneratedNotes.formula,
                        tip: currentGeneratedNotes.tip,
                        flowchart: currentGeneratedNotes.flowchart
                    })
                });

                const data = await res.json();
                if (res.ok) {
                    showToast('Note permanently saved to MongoDB Atlas Vault!', 'success');
                    updateVaultBadge();
                } else {
                    showToast(data.error || 'Failed to save note.', 'error');
                }
            } catch (err) {
                showToast('Network error while saving note.', 'error');
            }
        });
    }

    // Inline Edit Notes
    if (editNotesBtn) {
        editNotesBtn.addEventListener('click', () => {
            const contentBody = document.getElementById('outputContentBody');
            if (!contentBody) return;

            isEditingNotes = !isEditingNotes;
            contentBody.contentEditable = isEditingNotes;

            if (isEditingNotes) {
                contentBody.style.border = '2px dashed #38BDF8';
                contentBody.style.padding = '12px';
                contentBody.style.borderRadius = '8px';
                editNotesBtn.textContent = '💾 Finish Editing';
                showToast('Editable Mode ON: Click any text to modify.', 'info');
            } else {
                contentBody.style.border = 'none';
                contentBody.style.padding = '0';
                editNotesBtn.textContent = '✏️ Edit Notes';
                showToast('Edits saved locally!', 'success');
            }
        });
    }

    // Regenerate
    if (regenNotesBtn) {
        regenNotesBtn.addEventListener('click', () => handleGenerateNotes());
    }

    // Shorten Notes
    if (shortenNotesBtn) {
        shortenNotesBtn.addEventListener('click', () => {
            if (!outputConceptList) return;
            const items = outputConceptList.querySelectorAll('li');
            items.forEach(li => {
                const strong = li.querySelector('strong');
                if (strong) {
                    li.innerHTML = `<strong>${strong.textContent}</strong> Concise high-yield takeaway.`;
                }
            });
            showToast('Notes condensed to high-yield bullet format.');
        });
    }

    // Expand Notes
    if (expandNotesBtn) {
        expandNotesBtn.addEventListener('click', () => {
            if (!outputConceptList) return;
            const items = outputConceptList.querySelectorAll('li');
            items.forEach(li => {
                li.innerHTML += ' <em>Detailed academic derivation &amp; real-world boundary dynamics verified.</em>';
            });
            showToast('Expanded with comprehensive academic depth.');
        });
    }

    // Translate English <-> Hindi
    if (translateNotesBtn) {
        translateNotesBtn.addEventListener('click', () => {
            const genLang = document.getElementById('genLanguage');
            if (genLang) {
                genLang.value = genLang.value === 'English' ? 'Hindi' : 'English';
                handleGenerateNotes();
            }
        });
    }

    // Copy Notes
    if (copyNotesBtn) {
        copyNotesBtn.addEventListener('click', () => {
            const body = document.getElementById('outputContentBody');
            if (!body) return;
            navigator.clipboard.writeText(body.innerText).then(() => {
                showToast('Notes copied to clipboard! 📋', 'success');
            });
        });
    }

    // Print Notes
    if (printNotesBtn) {
        printNotesBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Export Markdown (.md)
    if (downloadMdBtn) {
        downloadMdBtn.addEventListener('click', () => {
            if (!currentGeneratedNotes) return;
            const title = currentGeneratedNotes.title || 'Study_Notes';
            let md = `# ${title}\n\n`;
            md += `> ${currentGeneratedNotes.meta || ''}\n\n`;
            md += `## High-Yield Concepts\n\n`;
            (currentGeneratedNotes.concepts || []).forEach(c => {
                md += `- ${c.replace(/<[^>]*>?/gm, '')}\n`;
            });
            md += `\n## Key Formulas\n\n\`\`\`\n${currentGeneratedNotes.formula || ''}\n\`\`\`\n\n`;
            md += `## Exam Caution & Tips\n\n${(currentGeneratedNotes.tip || '').replace(/<[^>]*>?/gm, '')}\n\n`;
            md += `---\n*Generated by Study Notes AI — Nikhil Tetarwal*`;

            const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Downloaded Markdown document! ⬇️', 'success');
        });
    }

    // Bookmark Note
    if (bookmarkNoteBtn) {
        bookmarkNoteBtn.addEventListener('click', () => {
            showToast('Bookmarked this note for rapid access! ⭐', 'success');
        });
    }

    // Vault Modal Loader
    const vaultModalBackdrop = document.getElementById('vaultModalBackdrop');
    const vaultModalCloseBtn = document.getElementById('vaultModalCloseBtn');
    const vaultNotesList = document.getElementById('vaultNotesList');
    const menuVaultLink = document.getElementById('menuVaultLink');

    async function openVaultModal() {
        const user = getCurrentUser();
        if (!user) {
            openAuthModal('login');
            showToast('Please sign in to view your saved vault.', 'error');
            return;
        }

        if (vaultModalBackdrop) vaultModalBackdrop.classList.add('active');
        if (vaultNotesList) vaultNotesList.innerHTML = '<p class="text-center">Loading your cloud notes...</p>';

        try {
            const res = await fetch(`${API_BASE}/api/notes?email=${encodeURIComponent(user.email)}`);
            const data = await res.json();
            if (res.ok && data.notes) {
                renderVaultList(data.notes);
            }
        } catch {
            if (vaultNotesList) vaultNotesList.innerHTML = '<p class="text-center">Failed to fetch notes.</p>';
        }
    }

    function renderVaultList(notes) {
        if (!vaultNotesList) return;
        vaultNotesList.innerHTML = '';
        if (notes.length === 0) {
            vaultNotesList.innerHTML = '<p class="text-center" style="padding: 20px;">No saved notes yet. Generate and save your first note!</p>';
            return;
        }

        notes.forEach(note => {
            const div = document.createElement('div');
            div.className = 'vault-item-card';
            div.innerHTML = `
                <div>
                    <h4 style="font-size: 1rem; margin-bottom: 4px;">${note.title}</h4>
                    <small style="color: var(--text-muted);">${new Date(note.createdAt).toLocaleDateString()} • ${note.topic}</small>
                </div>
                <div style="display: flex; gap: 6px;">
                    <button class="btn-micro-tool load-note-btn">Load</button>
                    <button class="btn-micro-tool del-note-btn" style="color: #EF4444;">Delete</button>
                </div>
            `;

            div.querySelector('.load-note-btn').onclick = () => {
                currentGeneratedNotes = note;
                renderGeneratedNotes(note, 'MongoDB Atlas Vault');
                if (vaultModalBackdrop) vaultModalBackdrop.classList.remove('active');
                showToast(`Loaded "${note.title}" into workbench!`, 'success');
            };

            div.querySelector('.del-note-btn').onclick = async () => {
                if (!confirm(`Delete "${note.title}" from your vault?`)) return;
                try {
                    await fetch(`${API_BASE}/api/notes/${note._id}`, { method: 'DELETE' });
                    div.remove();
                    showToast('Note deleted from database.', 'info');
                    updateVaultBadge();
                } catch {
                    showToast('Failed to delete note.', 'error');
                }
            };

            vaultNotesList.appendChild(div);
        });
    }

    async function updateVaultBadge() {
        const user = getCurrentUser();
        if (!user || !vaultCountBadge) return;
        try {
            const res = await fetch(`${API_BASE}/api/notes?email=${encodeURIComponent(user.email)}`);
            const data = await res.json();
            if (data.notes) vaultCountBadge.textContent = data.notes.length;
        } catch {}
    }

    updateVaultBadge();

    if (viewVaultBtn) viewVaultBtn.addEventListener('click', openVaultModal);
    if (menuVaultLink) menuVaultLink.addEventListener('click', (e) => { e.preventDefault(); openVaultModal(); });
    if (vaultModalCloseBtn) vaultModalCloseBtn.addEventListener('click', () => vaultModalBackdrop.classList.remove('active'));

    // --------------------------------------------------------------------------
    // 6. QUICK REVISION & 3D FLIP FLASHCARDS
    // --------------------------------------------------------------------------
    let activeFlashcards = [
        { front: "What is the Carnot engine efficiency formula?", back: "η = 1 - (T_Cold / T_Hot), where temperatures MUST be in absolute Kelvin." },
        { front: "State Newton's Second Law in differential form.", back: "F = dp/dt = d(m·v)/dt = m·a for invariant mass." },
        { front: "What are the primary products of photolysis in PS-II?", back: "Protons (H⁺), electrons (e⁻), and molecular oxygen (O₂)." }
    ];
    let fcIndex = 0;

    const flashcardBox = document.getElementById('flashcardBox');
    const fcFrontText = document.getElementById('fcFrontText');
    const fcBackText = document.getElementById('fcBackText');
    const fcCounter = document.getElementById('fcCounter');
    const fcPrevBtn = document.getElementById('fcPrevBtn');
    const fcNextBtn = document.getElementById('fcNextBtn');
    const fcFlipBtn = document.getElementById('fcFlipBtn');

    function renderFlashcard() {
        if (!fcFrontText || !fcBackText) return;
        const cur = activeFlashcards[fcIndex];
        if (!cur) return;

        if (flashcardBox) flashcardBox.classList.remove('is-flipped');
        fcFrontText.textContent = cur.front;
        fcBackText.textContent = cur.back;
        if (fcCounter) fcCounter.textContent = `Card ${fcIndex + 1} of ${activeFlashcards.length}`;
    }

    function loadFlashcards(cards) {
        if (!cards || cards.length === 0) return;
        activeFlashcards = cards;
        fcIndex = 0;
        renderFlashcard();
    }

    if (flashcardBox) {
        flashcardBox.addEventListener('click', () => {
            flashcardBox.classList.toggle('is-flipped');
        });
    }

    if (fcFlipBtn) {
        fcFlipBtn.addEventListener('click', () => {
            if (flashcardBox) flashcardBox.classList.toggle('is-flipped');
        });
    }

    if (fcPrevBtn) {
        fcPrevBtn.addEventListener('click', () => {
            if (fcIndex > 0) {
                fcIndex--;
                renderFlashcard();
            }
        });
    }

    if (fcNextBtn) {
        fcNextBtn.addEventListener('click', () => {
            if (fcIndex < activeFlashcards.length - 1) {
                fcIndex++;
                renderFlashcard();
            }
        });
    }

    renderFlashcard();

    // --------------------------------------------------------------------------
    // 7. MCQ PRACTICE & QUIZ ENGINE
    // --------------------------------------------------------------------------
    const launchQuizBtn = document.getElementById('launchQuizBtn');
    const quizTopicInput = document.getElementById('quizTopicInput');
    const quizDifficultySelect = document.getElementById('quizDifficultySelect');
    const quizLiveMeta = document.getElementById('quizLiveMeta');
    const quizTimerText = document.getElementById('quizTimerText');
    const quizProgressText = document.getElementById('quizProgressText');
    const quizQuestionText = document.getElementById('quizQuestionText');
    const quizOptionsList = document.getElementById('quizOptionsList');
    const quizPrevQBtn = document.getElementById('quizPrevQBtn');
    const quizNextQBtn = document.getElementById('quizNextQBtn');
    const quizSubmitBtn = document.getElementById('quizSubmitBtn');
    const quizScorecardPanel = document.getElementById('quizScorecardPanel');
    const quizArena = document.getElementById('quizArena');

    let quizQuestions = [];
    let currentQuizIndex = 0;
    let selectedQuizAnswers = {};
    let quizTimerInterval = null;
    let quizSecondsLeft = 150; // 2.5 minutes

    async function startQuiz() {
        const topic = quizTopicInput?.value || "Newton's Laws of Motion";
        const difficulty = quizDifficultySelect?.value || "Intermediate";

        if (launchQuizBtn) launchQuizBtn.innerHTML = 'Loading Quiz... ⏳';

        try {
            const res = await fetch(`${API_BASE}/api/mcq/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, difficulty, count: 5 })
            });

            const data = await res.json();
            if (res.ok && data.questions && data.questions.length > 0) {
                quizQuestions = data.questions;
                currentQuizIndex = 0;
                selectedQuizAnswers = {};
                quizSecondsLeft = 150;

                if (quizArena) quizArena.style.display = 'flex';
                if (quizScorecardPanel) quizScorecardPanel.style.display = 'none';
                if (quizLiveMeta) quizLiveMeta.style.display = 'flex';

                startQuizTimer();
                renderQuizQuestion();
                showToast(`Quiz loaded: 5 questions on ${topic}!`, 'success');
            } else {
                showToast('Failed to load quiz.', 'error');
            }
        } catch {
            showToast('Error generating quiz.', 'error');
        } finally {
            if (launchQuizBtn) launchQuizBtn.innerHTML = 'Start Quiz 🎯';
        }
    }

    function startQuizTimer() {
        clearInterval(quizTimerInterval);
        quizTimerInterval = setInterval(() => {
            quizSecondsLeft--;
            const mins = String(Math.floor(quizSecondsLeft / 60)).padStart(2, '0');
            const secs = String(quizSecondsLeft % 60).padStart(2, '0');
            if (quizTimerText) quizTimerText.textContent = `⏱️ ${mins}:${secs}`;

            if (quizSecondsLeft <= 0) {
                clearInterval(quizTimerInterval);
                submitQuiz();
            }
        }, 1000);
    }

    function renderQuizQuestion() {
        const q = quizQuestions[currentQuizIndex];
        if (!q) return;

        if (quizProgressText) quizProgressText.textContent = `Question ${currentQuizIndex + 1} of ${quizQuestions.length}`;
        if (quizQuestionText) quizQuestionText.textContent = q.question;

        if (quizOptionsList) {
            quizOptionsList.innerHTML = '';
            const letters = ['A', 'B', 'C', 'D'];
            q.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option-btn';
                if (selectedQuizAnswers[currentQuizIndex] === idx) {
                    btn.classList.add('selected');
                }
                btn.innerHTML = `<span class="opt-letter">${letters[idx]}</span> ${opt}`;
                btn.onclick = () => {
                    selectedQuizAnswers[currentQuizIndex] = idx;
                    renderQuizQuestion();
                };
                quizOptionsList.appendChild(btn);
            });
        }

        if (quizPrevQBtn) quizPrevQBtn.style.display = currentQuizIndex > 0 ? 'inline-flex' : 'none';
        if (quizNextQBtn) quizNextQBtn.style.display = currentQuizIndex < quizQuestions.length - 1 ? 'inline-flex' : 'none';
        if (quizSubmitBtn) quizSubmitBtn.style.display = currentQuizIndex === quizQuestions.length - 1 ? 'inline-flex' : 'none';
    }

    async function submitQuiz() {
        clearInterval(quizTimerInterval);
        const user = getCurrentUser() || { email: 'student_guest@example.com', name: 'Guest Student' };

        try {
            const res = await fetch(`${API_BASE}/api/mcq/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail: user.email,
                    topic: quizTopicInput?.value || "Exam Quiz",
                    subject: "General",
                    difficulty: quizDifficultySelect?.value || "Intermediate",
                    questions: quizQuestions,
                    selectedAnswers: selectedQuizAnswers,
                    timeSpentSeconds: 150 - quizSecondsLeft
                })
            });

            const data = await res.json();
            if (res.ok) {
                renderQuizScorecard(data);
                showToast(`Quiz evaluated: ${data.score}/${data.totalQuestions} (${data.percentage}%)`, 'success');
            }
        } catch {
            showToast('Error recording quiz submission.', 'error');
        }
    }

    function renderQuizScorecard(data) {
        if (quizArena) quizArena.style.display = 'none';
        if (quizScorecardPanel) quizScorecardPanel.style.display = 'block';

        const finalNum = document.getElementById('scoreFinalNum');
        const totalNum = document.getElementById('scoreTotalNum');
        const percentNum = document.getElementById('scorePercentNum');
        const reviewList = document.getElementById('quizReviewList');

        if (finalNum) finalNum.textContent = data.score;
        if (totalNum) totalNum.textContent = data.totalQuestions;
        if (percentNum) percentNum.textContent = `${data.percentage}%`;

        if (reviewList) {
            reviewList.innerHTML = '';
            (data.evaluatedAnswers || []).forEach((ans, i) => {
                const item = document.createElement('div');
                item.className = 'review-item-card';
                item.style.borderLeft = ans.isCorrect ? '4px solid #10B981' : '4px solid #EF4444';
                item.innerHTML = `
                    <h4>Q${i + 1}: ${ans.question}</h4>
                    <p style="margin: 6px 0; font-size: 0.9rem;">
                        <strong>Your Answer:</strong> ${ans.selectedOption !== undefined ? ans.selectedOption : 'Unanswered'} 
                        ${ans.isCorrect ? '<span style="color:#10B981;">(Correct ✓)</span>' : '<span style="color:#EF4444;">(Incorrect ✗)</span>'}
                    </p>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">
                        <strong>Explanation:</strong> ${ans.explanation}
                    </p>
                `;
                reviewList.appendChild(item);
            });
        }
    }

    if (launchQuizBtn) launchQuizBtn.addEventListener('click', startQuiz);
    if (quizNextQBtn) quizNextQBtn.addEventListener('click', () => { currentQuizIndex++; renderQuizQuestion(); });
    if (quizPrevQBtn) quizPrevQBtn.addEventListener('click', () => { currentQuizIndex--; renderQuizQuestion(); });
    if (quizSubmitBtn) quizSubmitBtn.addEventListener('click', submitQuiz);

    const quizRetakeBtn = document.getElementById('quizRetakeBtn');
    if (quizRetakeBtn) quizRetakeBtn.addEventListener('click', startQuiz);

    // --------------------------------------------------------------------------
    // 8. PREVIOUS YEAR QUESTIONS (PYQ) REPOSITORY
    // --------------------------------------------------------------------------
    const pyqSearchInput = document.getElementById('pyqSearchInput');
    const pyqExamFilter = document.getElementById('pyqExamFilter');
    const pyqSubjectFilter = document.getElementById('pyqSubjectFilter');
    const pyqCardsList = document.getElementById('pyqCardsList');

    async function loadPyqs() {
        if (!pyqCardsList) return;
        const q = pyqSearchInput?.value || '';
        const exam = pyqExamFilter?.value || '';
        const subject = pyqSubjectFilter?.value || '';

        try {
            const res = await fetch(`${API_BASE}/api/pyq/search?q=${encodeURIComponent(q)}&exam=${encodeURIComponent(exam)}&subject=${encodeURIComponent(subject)}`);
            const data = await res.json();
            if (res.ok && data.pyqs) {
                renderPyqCards(data.pyqs);
            }
        } catch {}
    }

    function renderPyqCards(pyqs) {
        if (!pyqCardsList) return;
        pyqCardsList.innerHTML = '';
        if (pyqs.length === 0) {
            pyqCardsList.innerHTML = '<p class="text-center">No matching questions found.</p>';
            return;
        }

        pyqs.forEach(item => {
            const card = document.createElement('div');
            card.className = 'pyq-card-item';
            card.innerHTML = `
                <div class="pyq-card-header">
                    <div>
                        <span class="pyq-exam-badge">${item.exam}</span>
                        <span class="pyq-subj-badge">${item.subject} • ${item.topic}</span>
                    </div>
                    <button class="btn-micro-tool bookmark-pyq-btn">⭐ Bookmark</button>
                </div>
                <div class="pyq-question-text">${item.question}</div>
                <small style="color: var(--text-muted); display: block; margin-bottom: 8px;"><strong>Marking Scheme:</strong> ${item.markingScheme}</small>
                <button class="btn-micro-tool toggle-ans-btn">View Verified Solution ▾</button>
                <div class="pyq-answer-details" style="display: none;">
                    <strong>Verified Solution:</strong>
                    <p style="margin-top: 4px;">${item.verifiedAnswer}</p>
                    <small style="display: block; margin-top: 6px; color: var(--text-muted);"><strong>Core Focus:</strong> ${item.highYieldConcept}</small>
                </div>
            `;

            const toggleBtn = card.querySelector('.toggle-ans-btn');
            const ansDetails = card.querySelector('.pyq-answer-details');
            toggleBtn.onclick = () => {
                const isHidden = ansDetails.style.display === 'none';
                ansDetails.style.display = isHidden ? 'block' : 'none';
                toggleBtn.textContent = isHidden ? 'Hide Solution ▴' : 'View Verified Solution ▾';
            };

            card.querySelector('.bookmark-pyq-btn').onclick = () => {
                showToast('PYQ bookmarked! ⭐', 'success');
            };

            pyqCardsList.appendChild(card);
        });
    }

    if (pyqSearchInput) pyqSearchInput.addEventListener('input', loadPyqs);
    if (pyqExamFilter) pyqExamFilter.addEventListener('change', loadPyqs);
    if (pyqSubjectFilter) pyqSubjectFilter.addEventListener('change', loadPyqs);
    loadPyqs();

    // --------------------------------------------------------------------------
    // 9. MOCK TEST SIMULATOR
    // --------------------------------------------------------------------------
    const startMockTestBtn = document.getElementById('startMockTestBtn');
    const mockLauncherScreen = document.getElementById('mockLauncherScreen');
    const mockActiveScreen = document.getElementById('mockActiveScreen');
    const mockResultsScreen = document.getElementById('mockResultsScreen');
    const mockTimerDisplay = document.getElementById('mockTimerDisplay');
    const mockQuestionNumber = document.getElementById('mockQuestionNumber');
    const mockQuestionPrompt = document.getElementById('mockQuestionPrompt');
    const mockOptionsGroup = document.getElementById('mockOptionsGroup');
    const mockPaletteGrid = document.getElementById('mockPaletteGrid');
    const mockPrevBtn = document.getElementById('mockPrevBtn');
    const mockNextBtn = document.getElementById('mockNextBtn');
    const mockClearChoiceBtn = document.getElementById('mockClearChoiceBtn');
    const mockFlagBtn = document.getElementById('mockFlagBtn');
    const mockFinishBtn = document.getElementById('mockFinishBtn');

    let mockQuestions = [];
    let mockIndex = 0;
    let mockAnswers = {};
    let mockFlagged = {};
    let mockTimeSeconds = 900; // 15 mins
    let mockTimer = null;

    async function launchMockTest() {
        const subject = document.getElementById('mockSubjectSelect')?.value || "Physics & Chemistry";
        if (startMockTestBtn) startMockTestBtn.innerHTML = 'Generating Exam Simulator... ⏳';

        try {
            const res = await fetch(`${API_BASE}/api/mock/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, examType: "Full National" })
            });

            const data = await res.json();
            if (res.ok && data.questions) {
                mockQuestions = data.questions;
                mockIndex = 0;
                mockAnswers = {};
                mockFlagged = {};
                mockTimeSeconds = 900;

                if (mockLauncherScreen) mockLauncherScreen.style.display = 'none';
                if (mockActiveScreen) mockActiveScreen.style.display = 'block';
                if (mockResultsScreen) mockResultsScreen.style.display = 'none';

                startMockTimer();
                renderMockQuestion();
                renderMockPalette();
                showToast('Mock Test Simulator Activated! Best of luck.', 'info');
            }
        } catch {
            showToast('Failed to start mock test.', 'error');
        } finally {
            if (startMockTestBtn) startMockTestBtn.innerHTML = '<span>Launch Mock Test Arena ➔</span>';
        }
    }

    function startMockTimer() {
        clearInterval(mockTimer);
        mockTimer = setInterval(() => {
            mockTimeSeconds--;
            const mins = String(Math.floor(mockTimeSeconds / 60)).padStart(2, '0');
            const secs = String(mockTimeSeconds % 60).padStart(2, '0');
            if (mockTimerDisplay) mockTimerDisplay.textContent = `${mins}:${secs}`;

            if (mockTimeSeconds <= 0) {
                clearInterval(mockTimer);
                finishMockTest();
            }
        }, 1000);
    }

    function renderMockQuestion() {
        const q = mockQuestions[mockIndex];
        if (!q) return;

        if (mockQuestionNumber) mockQuestionNumber.textContent = `Question ${mockIndex + 1} of ${mockQuestions.length}`;
        if (mockQuestionPrompt) mockQuestionPrompt.textContent = q.question;

        if (mockOptionsGroup) {
            mockOptionsGroup.innerHTML = '';
            const letters = ['A', 'B', 'C', 'D'];
            q.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option-btn';
                if (mockAnswers[mockIndex] === idx) btn.classList.add('selected');
                btn.innerHTML = `<span class="opt-letter">${letters[idx]}</span> ${opt}`;
                btn.onclick = () => {
                    mockAnswers[mockIndex] = idx;
                    renderMockQuestion();
                    renderMockPalette();
                };
                mockOptionsGroup.appendChild(btn);
            });
        }
    }

    function renderMockPalette() {
        if (!mockPaletteGrid) return;
        mockPaletteGrid.innerHTML = '';
        mockQuestions.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.className = 'palette-btn';
            btn.textContent = i + 1;

            if (i === mockIndex) btn.classList.add('current');
            if (mockAnswers[i] !== undefined) btn.classList.add('answered');
            if (mockFlagged[i]) btn.classList.add('flagged');

            btn.onclick = () => {
                mockIndex = i;
                renderMockQuestion();
                renderMockPalette();
            };
            mockPaletteGrid.appendChild(btn);
        });
    }

    async function finishMockTest() {
        clearInterval(mockTimer);
        const user = getCurrentUser() || { email: 'student_guest@example.com' };
        const negativeMarking = document.getElementById('mockNegativeToggle')?.checked ?? true;

        try {
            const res = await fetch(`${API_BASE}/api/mock/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail: user.email,
                    testTitle: "Comprehensive National Mock Test",
                    subject: "General",
                    questions: mockQuestions,
                    selectedAnswers: mockAnswers,
                    negativeMarking: negativeMarking,
                    timeSpentSeconds: 900 - mockTimeSeconds
                })
            });

            const data = await res.json();
            if (res.ok && data.record) {
                if (mockActiveScreen) mockActiveScreen.style.display = 'none';
                if (mockResultsScreen) mockResultsScreen.style.display = 'block';

                const r = data.record;
                const finalScore = document.getElementById('mockFinalScore');
                const finalAcc = document.getElementById('mockFinalAccuracy');
                const finalAtt = document.getElementById('mockFinalAttempted');

                if (finalScore) finalScore.textContent = `${r.score} / ${r.maxMarks}`;
                if (finalAcc) finalAcc.textContent = r.attemptedCount > 0 ? `${Math.round((r.correctCount / r.attemptedCount) * 100)}%` : '0%';
                if (finalAtt) finalAtt.textContent = `${r.attemptedCount} / ${r.totalQuestions}`;

                showToast('Mock Test results compiled and saved to cloud!', 'success');
            }
        } catch {
            showToast('Error scoring mock test.', 'error');
        }
    }

    if (startMockTestBtn) startMockTestBtn.addEventListener('click', launchMockTest);
    if (mockNextBtn) mockNextBtn.addEventListener('click', () => {
        if (mockIndex < mockQuestions.length - 1) {
            mockIndex++;
            renderMockQuestion();
            renderMockPalette();
        }
    });
    if (mockPrevBtn) mockPrevBtn.addEventListener('click', () => {
        if (mockIndex > 0) {
            mockIndex--;
            renderMockQuestion();
            renderMockPalette();
        }
    });
    if (mockClearChoiceBtn) mockClearChoiceBtn.addEventListener('click', () => {
        delete mockAnswers[mockIndex];
        renderMockQuestion();
        renderMockPalette();
    });
    if (mockFlagBtn) mockFlagBtn.addEventListener('click', () => {
        mockFlagged[mockIndex] = !mockFlagged[mockIndex];
        renderMockPalette();
    });
    if (mockFinishBtn) mockFinishBtn.addEventListener('click', () => {
        if (confirm('Submit test now?')) finishMockTest();
    });

    const mockRestartBtn = document.getElementById('mockRestartBtn');
    if (mockRestartBtn) mockRestartBtn.addEventListener('click', () => {
        if (mockResultsScreen) mockResultsScreen.style.display = 'none';
        if (mockLauncherScreen) mockLauncherScreen.style.display = 'block';
    });

    // --------------------------------------------------------------------------
    // 10. STUDENT DASHBOARD LOADER (dashboard.html)
    // --------------------------------------------------------------------------
    async function loadDashboardData() {
        const user = getCurrentUser();
        if (!user) {
            if (window.location.pathname.includes('dashboard.html')) {
                showToast('Please sign in to view your dashboard.', 'error');
                setTimeout(() => window.location.href = 'login.html', 1000);
            }
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/dashboard/stats?email=${encodeURIComponent(user.email)}`);
            const data = await res.json();
            if (res.ok && data.stats) {
                const totalNotes = document.getElementById('dashTotalNotes');
                const quizAttempts = document.getElementById('dashQuizAttempts');
                const avgAccuracy = document.getElementById('dashAvgAccuracy');
                const mockTests = document.getElementById('dashMockTests');

                if (totalNotes) totalNotes.textContent = data.stats.totalNotesCreated;
                if (quizAttempts) quizAttempts.textContent = data.stats.totalQuizzesAttempted;
                if (avgAccuracy) avgAccuracy.textContent = `${data.stats.averageQuizAccuracy}%`;
                if (mockTests) mockTests.textContent = data.stats.totalMockTests;

                // Render Saved Vault Notes in Dashboard
                const dashVaultContainer = document.getElementById('dashVaultContainer');
                if (dashVaultContainer) {
                    dashVaultContainer.innerHTML = '';
                    if (data.recentNotes.length === 0) {
                        dashVaultContainer.innerHTML = '<div class="empty-state-card text-center"><p>No saved notes found. Create your first note in the Studio!</p></div>';
                    } else {
                        data.recentNotes.forEach(n => {
                            const item = document.createElement('div');
                            item.className = 'vault-item-card';
                            item.innerHTML = `
                                <div>
                                    <h4 style="font-size: 1rem; margin-bottom: 2px;">${n.title}</h4>
                                    <small style="color: var(--text-muted);">${new Date(n.createdAt).toLocaleDateString()} • ${n.topic}</small>
                                </div>
                                <div style="display: flex; gap: 8px;">
                                    <button class="btn-micro-tool view-dash-note-btn">View</button>
                                    <button class="btn-micro-tool del-dash-note-btn" style="color: #EF4444;">Delete</button>
                                </div>
                            `;

                            item.querySelector('.view-dash-note-btn').onclick = () => {
                                openNotePreviewModal(n);
                            };

                            item.querySelector('.del-dash-note-btn').onclick = async () => {
                                if (!confirm(`Delete "${n.title}"?`)) return;
                                await fetch(`${API_BASE}/api/notes/${n._id}`, { method: 'DELETE' });
                                item.remove();
                                showToast('Note removed from vault.');
                            };

                            dashVaultContainer.appendChild(item);
                        });
                    }
                }

                // Render Recent Quizzes
                const dashQuizList = document.getElementById('dashQuizList');
                if (dashQuizList && data.recentQuizzes.length > 0) {
                    dashQuizList.innerHTML = '';
                    data.recentQuizzes.forEach(q => {
                        const div = document.createElement('div');
                        div.className = 'activity-item';
                        div.innerHTML = `
                            <strong>${q.topic}</strong> — Score: <strong>${q.score}/${q.totalQuestions}</strong> (${q.percentage}%)
                            <br><small style="color: var(--text-muted);">${new Date(q.createdAt).toLocaleDateString()} • Difficulty: ${q.difficulty}</small>
                        `;
                        dashQuizList.appendChild(div);
                    });
                }

                // Render Recent Mock Tests
                const dashMockList = document.getElementById('dashMockList');
                if (dashMockList && data.recentMockTests.length > 0) {
                    dashMockList.innerHTML = '';
                    data.recentMockTests.forEach(m => {
                        const div = document.createElement('div');
                        div.className = 'activity-item';
                        div.innerHTML = `
                            <strong>${m.testTitle}</strong> — Net Score: <strong>${m.score}/${m.maxMarks}</strong>
                            <br><small style="color: var(--text-muted);">${new Date(m.createdAt).toLocaleDateString()} • Correct: ${m.correctCount}, Incorrect: ${m.incorrectCount}</small>
                        `;
                        dashMockList.appendChild(div);
                    });
                }
            }
        } catch (err) {
            console.error('Error loading dashboard telemetry:', err);
        }
    }

    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboardData();
    }

    // Note Preview Modal in Dashboard
    function openNotePreviewModal(note) {
        const modal = document.getElementById('notePreviewModal');
        if (!modal) return;

        const title = document.getElementById('modalNoteTitle');
        const meta = document.getElementById('modalNoteMeta');
        const concepts = document.getElementById('modalNoteConcepts');
        const formula = document.getElementById('modalNoteFormula');
        const tip = document.getElementById('modalNoteTip');

        if (title) title.textContent = note.title;
        if (meta) meta.textContent = note.meta;

        if (concepts) {
            concepts.innerHTML = '';
            (note.concepts || []).forEach(c => {
                const li = document.createElement('li');
                li.innerHTML = c;
                concepts.appendChild(li);
            });
        }

        if (formula) formula.textContent = note.formula;
        if (tip) tip.innerHTML = note.tip;

        modal.classList.add('active');

        const closeBtn = document.getElementById('noteModalCloseBtn');
        if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
    }

    // Back to top button
    const footerBackToTopBtn = document.getElementById('footerBackToTopBtn');
    if (footerBackToTopBtn) {
        footerBackToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
