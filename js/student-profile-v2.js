<<<<<<< HEAD
/**
 * InternTrack — Student Profile Logic
 * Enhanced read-only profile display for interns.
 * Features: hero with completion bar, animated stats, skills, timeline, projects preview.
 */

'use strict';

(() => {
    const session = Auth.requireAuth();
    if (!session) return;

    setupSidebar(session, 'student-profile.html');
    let currentProjectIdx = 0;

    // Topbar badge
    const badge = document.getElementById('topbar-role-badge');
    if (badge) { badge.textContent = 'Intern'; badge.className = 'badge badge-user'; }

    document.getElementById('logout-btn').addEventListener('click', () => Auth.logout());

    // ── Load profile ──
    const loadingEl = document.getElementById('profile-loading');
    const outputEl = document.getElementById('profile-output');

    // Render immediately (script is at end of body)
    if (loadingEl) loadingEl.remove();
    const p = Storage.getProfile(session.userId);

    if (!p) {
        if (outputEl) {
            outputEl.hidden = false;
            outputEl.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">👤</div>
                <div class="empty-title">Profile Not Set Up Yet</div>
                <div class="empty-desc">Your profile data is missing. Please contact your administrator.</div>
            </div>`;
        }
    } else {
        if (outputEl) {
            outputEl.hidden = false;
            outputEl.innerHTML = buildStudentHTML(p, session, currentProjectIdx);
            setupEventListeners(p, session);
        }

        // Animate fill bar
        setTimeout(() => {
            const fill = document.getElementById('completion-fill');
            const pctEl = document.getElementById('completion-pct');
            const pct = computeCompletion(p);
            if (fill) fill.style.width = pct + '%';
            if (pctEl) pctEl.textContent = pct + '%';
        }, 100);

        initReveal();
    }

    // ── Compute profile completion ──
    function computeCompletion(p) {
        const fields = [
            p.name, p.email, p.tagline, p.bio, p.location,
            p.skills?.length > 0,
            p.internship?.company, p.internship?.role,
            p.socialLinks?.github || p.socialLinks?.linkedin
        ];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
    }

    // ── Build HTML ──
    function buildStudentHTML(p, session, currentProjectIdx) {
        const intern = p.internship || {};
        const links = p.socialLinks || {};
        const myProjects = Storage.getProjects().filter(pr => pr.ownerId === session.userId);
        const skillCount = (p.skills || []).length;
        const pct = computeCompletion(p);
        const isActive = intern.endDate ? new Date(intern.endDate) >= new Date() : !!intern.company;
        const stats = [
            { id: 'skill-stat-card', label: 'Skills Listed', value: skillCount, icon: '⚡', color: 'cyan' },
            { id: 'project-stat-card', label: 'Projects', value: myProjects.length, icon: '🗂️', color: 'blue', clickable: true },
            { id: 'intern-stat-card', label: isActive ? 'Active Intern' : 'Intern Status', value: isActive ? '✓' : '—', icon: '🏢', color: 'green' }
        ];

        return `
        <div class="student-profile-wrap">

            <!-- Hero -->
            <div class="student-hero reveal" aria-label="Profile summary">
                <div class="student-hero-banner">
                    <div class="student-orb student-orb-1"></div>
                    <div class="student-orb student-orb-2"></div>
                </div>
                <div class="student-hero-body">
                    <div class="student-avatar-wrap">
                        <div class="student-avatar" aria-label="${p.name || 'Intern'} avatar">
                            ${p.avatar
                ? `<img src="${p.avatar}" alt="${p.name} profile picture">`
                : (p.name || 'J')[0].toUpperCase()}
                        </div>
                        ${isActive ? `<div class="student-status-dot" title="Active Intern" aria-label="Active intern"></div>` : ''}
                    </div>
                    <div class="student-info">
                        <div class="student-display-name">${p.name || 'Your Name'}</div>
                        <div class="student-tagline">${p.tagline || 'Software Engineering Intern'}</div>
                        <div class="student-meta-row">
                            ${p.location ? `<span class="student-meta-item">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                ${p.location}
                            </span>` : ''}
                            ${intern.company ? `<span class="student-meta-item">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                                ${intern.company}
                            </span>` : ''}
                            ${links.github ? `<a class="student-meta-item" href="${links.github}" target="_blank" rel="noopener" aria-label="GitHub">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                                GitHub
                            </a>` : ''}
                            ${links.linkedin ? `<a class="student-meta-item" href="${links.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                LinkedIn
                            </a>` : ''}
                        </div>
                    </div>
                    <div class="student-hero-actions">
                        <a href="projects.html" class="btn btn-secondary btn-sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                            My Projects
                        </a>
                    </div>
                </div>

                <!-- Completion Bar -->
                <div class="completion-bar-wrap">
                    <span class="completion-label">Profile Completion</span>
                    <div class="completion-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Profile completion ${pct}%">
                        <div class="completion-fill" id="completion-fill" style="width:0%"></div>
                    </div>
                    <span class="completion-pct" id="completion-pct">0%</span>
                </div>
            </div>

            <!-- Stats Row -->
            <div class="student-stats-row" role="region" aria-label="Profile stats">
                ${stats.map((s, i) => `
                    <div class="student-stat-card ${s.clickable ? 'clickable-stat' : ''}" ${s.id ? `id="${s.id}"` : ''}>
                        <div class="student-stat-icon" style="background:rgba(${s.color === 'cyan' ? '34,211,238' : s.color === 'blue' ? '79,124,255' : '16,185,129'},.1)" aria-hidden="true">${s.icon}</div>
                        <div class="student-stat-info">
                            <div class="student-stat-value">${s.value}</div>
                            <div class="student-stat-label">${s.label}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Main Grid -->
            <div class="student-main-grid">

                <!-- Left Column -->
                <div>
                    <!-- About -->
                    <section class="student-section reveal anim-d1" aria-label="About">
                        <div class="student-section-head">
                            <div class="student-section-icon" style="background:rgba(79,124,255,.12)" aria-hidden="true">📄</div>
                            <h2 class="student-section-title">About Me</h2>
                        </div>
                        <div class="student-section-body">
                            <p class="bio-text">${p.bio || 'No bio available yet. Your admin will fill this in.'}</p>
                        </div>
                    </section>

                    <!-- Skills -->
                    <section class="student-section reveal anim-d2" aria-label="Skills">
                        <div class="student-section-head">
                            <div class="student-section-icon" style="background:rgba(34,211,238,.1)" aria-hidden="true">⚡</div>
                            <h2 class="student-section-title">Technical Skills</h2>
                            <button class="add-skill-btn" id="add-skill-btn" title="Add new skill" aria-label="Add new skill">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </button>
                        </div>
                        <div class="student-section-body">
                            <div class="inline-form" id="inline-skill-form" ${!(p.skills || []).length ? '' : 'hidden'} style="margin-bottom:var(--sp-4)">
                                <div class="inline-form-row">
                                    <input type="text" id="new-skill-input" class="field-input" placeholder="e.g. React, Python" style="flex:1">
                                    <button class="btn btn-primary btn-sm" id="save-skill-btn">Add</button>
                                    <button class="btn btn-secondary btn-sm" id="cancel-skill-btn">Cancel</button>
                                </div>
                            </div>
                            ${(p.skills || []).length ? `
                            <div class="skills-cloud" role="list" aria-label="Skills list">
                                ${(p.skills).map(s => `<span class="skill-badge" role="listitem">${s}</span>`).join('')}
                            </div>
                            ` : ''}
                        </div>
                    </section>

                    <!-- Project Progress -->
                    <section class="student-section reveal anim-d3" aria-label="Project progress">
                        <div class="student-section-head">
                            <div class="student-section-icon" style="background:rgba(168,85,247,.1)" aria-hidden="true">📊</div>
                            <h2 class="student-section-title">Project Progress</h2>
                            ${myProjects.length > 1 ? `
                            <div class="carousel-nav">
                                <button class="nav-arrow" id="next-proj-btn" title="See Next Project" aria-label="Next Project">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
                                </button>
                            </div>` : ''}
                        </div>
                        <div class="student-section-body">
                            ${myProjects.length > 0 ? (() => {
                try {
                    const idxSource = Number.isFinite(currentProjectIdx) ? currentProjectIdx : 0;
                    const safeIdx = Math.max(0, Math.min(idxSource, myProjects.length - 1));
                    const curr = myProjects[safeIdx];
                    if (!curr) return '<div class="empty-state-mini">Project not found.</div>';

                    const statusRaw = curr.status || 'Ongoing';
                    const statusValue = String(statusRaw);
                    const updates = Array.isArray(curr.updates) ? curr.updates : [];

                    return `
                                <div class="project-progress-card">
                                    <div class="pp-header">
                                        <div>
                                            <div class="pp-title">${curr.title || 'Untitled Project'}</div>
                                            <div class="pp-status-row">
                                                <span class="pp-status-badge ${(statusValue || 'Ongoing').toString().toLowerCase()}">${statusValue}</span>
                                                <span class="pp-date">Started ${fmtDate(curr.createdAt)}</span>
                                            </div>
                                        </div>
                                        ${updates.length > 0 ? `<button class="btn btn-primary btn-xs" id="add-progress-btn">Add Progress</button>` : ''}
                                    </div>
                                    
                                    <div class="inline-form" id="inline-progress-form" ${updates.length ? 'hidden' : ''} style="margin:var(--sp-4) 0">
                                        <textarea id="new-progress-input" class="field-input" rows="2" placeholder="Describe what you achieved today..."></textarea>
                                        <div style="margin-top:8px; display:flex; gap:8px">
                                            <button class="btn btn-primary btn-sm" id="save-progress-btn">Save Update</button>
                                            <button class="btn btn-secondary btn-sm" id="cancel-progress-btn">Cancel</button>
                                        </div>
                                    </div>
                                    
                                    <div class="pp-updates-list">
                                        ${updates.length > 0
                            ? updates.map(u => `
                                            <div class="pp-update-item">
                                                <div class="pp-update-dot"></div>
                                                <div class="pp-update-content">
                                                    <div class="pp-update-time">${fmtDate(u ? u.date : null)}</div>
                                                    <div class="pp-update-text">${u ? u.text : 'Empty update'}</div>
                                                </div>
                                            </div>`).join('')
                            : ''}
                                    </div>
                                </div>`;
                } catch (e) {
                    console.error('Carousel item render error:', e);
                    return `<div class="empty-state-mini">Error rendering project: ${e.message}</div>`;
                }
            })() : '<div class="empty-state-mini">No projects found for this intern.</div>'}
                        </div>
                    </section>
                </div>

                <!-- Right Sidebar -->
                <div>
                    <!-- Contact Details -->
                    <section class="student-section reveal anim-d1" aria-label="Contact details">
                        <div class="student-section-head">
                            <div class="student-section-icon" style="background:rgba(16,185,129,.1)" aria-hidden="true">📋</div>
                            <h2 class="student-section-title">Details</h2>
                        </div>
                        <div class="student-section-body">
                            <div class="info-list">
                                <div class="info-row">
                                    <div class="info-label">Full Name</div>
                                    <div class="info-value">${p.name || '—'}</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Email</div>
                                    <div class="info-value"><a href="mailto:${p.email}">${p.email || '—'}</a></div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Location</div>
                                    <div class="info-value">${p.location || '—'}</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Current Role</div>
                                    <div class="info-value">${intern.role || '—'}</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Company</div>
                                    <div class="info-value">${intern.company || '—'}</div>
                                </div>
                                <div class="divider" style="margin:var(--sp-3) 0"></div>
                                <div class="info-row">
                                    <div class="info-label">GitHub</div>
                                    <div class="info-value">
                                        ${links.github ? `<a href="${links.github}" target="_blank" rel="noopener">View Profile ↗</a>` : '—'}
                                    </div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">LinkedIn</div>
                                    <div class="info-value">
                                        ${links.linkedin ? `<a href="${links.linkedin}" target="_blank" rel="noopener">View Profile ↗</a>` : '—'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div class="student-section reveal anim-d2" style="text-align:center;padding:var(--sp-6)">
                        <div style="font-size:2rem;margin-bottom:var(--sp-3)" aria-hidden="true">🎯</div>
                        <div style="font-weight:var(--fw-semi);margin-bottom:var(--sp-2)">InternTrack Dashboard</div>
                        <div class="text-muted text-sm" style="margin-bottom:var(--sp-4)">Your creative progress, tracked in one place.</div>
                        <a href="dashboard.html" class="btn btn-secondary btn-sm" style="width:100%">Go to Dashboard</a>
                    </div>

                </div>
            </div>

        </div>`;
    }

    function fmtDate(d) {
        if (!d) return '—';
        try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); }
        catch { return d; }
    }

    function initReveal() {
        const els = document.querySelectorAll('.reveal');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
            });
        }, { threshold: 0.08 });
        els.forEach(el => obs.observe(el));
    }

    // ── Event Listeners ──
    function setupEventListeners(p, session) {
        // Projects stat card redirect
        const statCard = document.getElementById('project-stat-card');
        if (statCard) {
            statCard.addEventListener('click', () => {
                window.location.href = 'projects.html';
            });
        }

        // Add skill
        const addSkillBtn = document.getElementById('add-skill-btn');
        const skillForm = document.getElementById('inline-skill-form');
        const saveSkillBtn = document.getElementById('save-skill-btn');
        const cancelSkillBtn = document.getElementById('cancel-skill-btn');
        const skillInput = document.getElementById('new-skill-input');

        if (addSkillBtn && skillForm) {
            addSkillBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                skillForm.hidden = false;
                if (skillInput) skillInput.focus();
                addSkillBtn.hidden = true;
            });
        }

        if (cancelSkillBtn && skillForm) {
            cancelSkillBtn.addEventListener('click', () => {
                skillForm.hidden = true;
                if (skillInput) skillInput.value = '';
                if (addSkillBtn) addSkillBtn.hidden = false;
            });
        }

        if (saveSkillBtn && skillInput) {
            saveSkillBtn.addEventListener('click', () => {
                const newSkill = skillInput.value;
                if (newSkill && newSkill.trim()) {
                    const updatedSkills = [...(p.skills || []), newSkill.trim()];
                    p.skills = updatedSkills;
                    Storage.saveProfile(session.userId, p);
                    refreshView(p, session);
                }
            });
        }

        // Carousel Navigation
        const nextBtn = document.getElementById('next-proj-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const myProjects = Storage.getProjects().filter(pr => pr.ownerId === session.userId);
                if (myProjects.length > 0) {
                    currentProjectIdx = (currentProjectIdx + 1) % myProjects.length;
                    refreshView(p, session);
                }
            });
        }

        // Add Progress
        const addProgressBtn = document.getElementById('add-progress-btn');
        const progressForm = document.getElementById('inline-progress-form');
        const saveProgressBtn = document.getElementById('save-progress-btn');
        const cancelProgressBtn = document.getElementById('cancel-progress-btn');
        const progressInput = document.getElementById('new-progress-input');

        if (addProgressBtn && progressForm) {
            addProgressBtn.addEventListener('click', () => {
                progressForm.hidden = false;
                if (progressInput) progressInput.focus();
                addProgressBtn.hidden = true;
            });
        }

        if (cancelProgressBtn && progressForm) {
            cancelProgressBtn.addEventListener('click', () => {
                progressForm.hidden = true;
                if (progressInput) progressInput.value = '';
                if (addProgressBtn) addProgressBtn.hidden = false;
            });
        }

        if (saveProgressBtn && progressInput) {
            saveProgressBtn.addEventListener('click', () => {
                const myProjects = Storage.getProjects().filter(pr => pr.ownerId === session.userId);
                const curr = myProjects[currentProjectIdx];
                const text = progressInput.value;
                if (text && text.trim()) {
                    if (!curr.updates) curr.updates = [];
                    curr.updates.unshift({ date: new Date().toISOString(), text: text.trim() });
                    Storage.saveProject(curr);
                    refreshView(p, session);
                }
            });
        }
    }

    function refreshView(p, session) {
        const outputEl = document.getElementById('profile-output');
        if (outputEl) {
            outputEl.innerHTML = buildStudentHTML(p, session, currentProjectIdx);
            setupEventListeners(p, session);
            initReveal();
            // Update completion bar
            const pct = computeCompletion(p);
            const fill = document.getElementById('completion-fill');
            const pctEl = document.getElementById('completion-pct');
            if (fill) fill.style.width = pct + '%';
            if (pctEl) pctEl.textContent = pct + '%';
        }
    }

    // ── Sidebar ──
    function setupSidebar(session, activePage) {
        const nav = document.getElementById('sidebar-nav');
        const avatar = document.getElementById('user-avatar-sidebar');
        const nameEl = document.getElementById('user-name-sidebar');
        const roleEl = document.getElementById('user-role-sidebar');

        const isAdmin = session.role === 'admin';
        const p = isAdmin ? (Storage.getAdminProfile ? Storage.getAdminProfile(session.userId) : null) : Storage.getProfile(session.userId);
        const currentName = p?.name || session.displayName;

        if (avatar) avatar.textContent = currentName[0].toUpperCase();
        if (nameEl) nameEl.textContent = currentName;
        if (roleEl) roleEl.textContent = isAdmin ? 'Administrator' : 'Intern';

        const items = [
            { label: 'Dashboard', href: 'dashboard.html', icon: '⊞' },
            { label: 'My Profile', href: 'student-profile.html', icon: '👤', active: true },
            { label: 'My Analytics', href: `student-analytics.html?student=${session.userId}`, icon: '📊' },
            { label: 'Projects', href: 'projects.html', icon: '🗂️' },
        ];

        if (nav) {
            nav.innerHTML = '<div class="nav-section-label">Menu</div>' +
                items.map(item => `
                <a class="nav-item${item.href === activePage ? ' active' : ''}" href="${item.href}" aria-current="${item.href === activePage ? 'page' : 'false'}">
                    <span class="nav-icon" aria-hidden="true">${item.icon}</span>
                    <span>${item.label}</span>
                </a>`).join('');
        }

        const hamburger = document.getElementById('hamburger-btn');
        const sidebar = document.getElementById('app-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (hamburger && sidebar && overlay) {
            hamburger.addEventListener('click', () => {
                const open = sidebar.classList.toggle('open');
                overlay.classList.toggle('visible', open);
                hamburger.setAttribute('aria-expanded', String(open));
            });
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('visible');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        }
    }

})();
=======
/**
 * InternTrack — Student Profile Logic
 * Enhanced read-only profile display for interns.
 * Features: hero with completion bar, animated stats, skills, timeline, projects preview.
 */

'use strict';

(() => {
    const session = Auth.requireAuth();
    if (!session) return;

    setupSidebar(session, 'student-profile.html');
    let currentProjectIdx = 0;

    // Topbar badge
    const badge = document.getElementById('topbar-role-badge');
    if (badge) { badge.textContent = 'Intern'; badge.className = 'badge badge-user'; }

    document.getElementById('logout-btn').addEventListener('click', () => Auth.logout());

    // ── Load profile ──
    const loadingEl = document.getElementById('profile-loading');
    const outputEl = document.getElementById('profile-output');

    // Render immediately (script is at end of body)
    if (loadingEl) loadingEl.remove();
    const p = Storage.getProfile(session.userId);

    if (!p) {
        if (outputEl) {
            outputEl.hidden = false;
            outputEl.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">👤</div>
                <div class="empty-title">Profile Not Set Up Yet</div>
                <div class="empty-desc">Your profile data is missing. Please contact your administrator.</div>
            </div>`;
        }
    } else {
        if (outputEl) {
            outputEl.hidden = false;
            outputEl.innerHTML = buildStudentHTML(p, session, currentProjectIdx);
            setupEventListeners(p, session);
        }

        // Animate fill bar
        setTimeout(() => {
            const fill = document.getElementById('completion-fill');
            const pctEl = document.getElementById('completion-pct');
            const pct = computeCompletion(p);
            if (fill) fill.style.width = pct + '%';
            if (pctEl) pctEl.textContent = pct + '%';
        }, 100);

        initReveal();
    }

    // ── Compute profile completion ──
    function computeCompletion(p) {
        const fields = [
            p.name, p.email, p.tagline, p.bio, p.location,
            p.skills?.length > 0,
            p.internship?.company, p.internship?.role,
            p.socialLinks?.github || p.socialLinks?.linkedin
        ];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
    }

    // ── Build HTML ──
    function buildStudentHTML(p, session, currentProjectIdx) {
        const intern = p.internship || {};
        const links = p.socialLinks || {};
        const myProjects = Storage.getProjects().filter(pr => pr.ownerId === session.userId);
        const skillCount = (p.skills || []).length;
        const pct = computeCompletion(p);
        const isActive = intern.endDate ? new Date(intern.endDate) >= new Date() : !!intern.company;
        const stats = [
            { id: 'skill-stat-card', label: 'Skills Listed', value: skillCount, icon: '⚡', color: 'cyan' },
            { id: 'project-stat-card', label: 'Projects', value: myProjects.length, icon: '🗂️', color: 'blue', clickable: true },
            { id: 'intern-stat-card', label: isActive ? 'Active Intern' : 'Intern Status', value: isActive ? '✓' : '—', icon: '🏢', color: 'green' }
        ];

        return `
        <div class="student-profile-wrap">

            <!-- Hero -->
            <div class="student-hero reveal" aria-label="Profile summary">
                <div class="student-hero-banner">
                    <div class="student-orb student-orb-1"></div>
                    <div class="student-orb student-orb-2"></div>
                </div>
                <div class="student-hero-body">
                    <div class="student-avatar-wrap">
                        <div class="student-avatar" id="student-avatar" aria-label="${p.name || 'Intern'} avatar">
                            ${p.avatar
                ? `<img src="${p.avatar}" alt="${p.name} profile picture" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
                : `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" aria-hidden="true">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                    </svg>`}
                        </div>
                        <label class="avatar-upload-trigger" for="student-avatar-input" title="Change Photo">
                            <div class="student-avatar-overlay">
                                <svg class="camera-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            </div>
                        </label>
                        <input type="file" id="student-avatar-input" accept="image/*" style="display:none">
                        <button type="button" class="avatar-remove-btn" id="avatar-remove-btn" title="Remove Photo">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        ${isActive ? `<div class="student-status-dot" title="Active Intern" aria-label="Active intern"></div>` : ''}
                    </div>
                    <div class="student-info">
                        <div class="student-display-name">
                            <span class="student-name-text">
                                ${p.name || 'Your Name'}
                                ${Storage.getInternRank && Storage.getInternRank(session.userId) === 1 ? '<span class="student-crown-icon" title="Leaderboard #1">👑</span>' : ''}
                            </span>
                            <span class="student-rank-wrapper">
                                ${Storage.getInternRank ? (() => {
                const rank = Storage.getInternRank(session.userId);
                return rank ? `<span class="student-rank-badge" title="Leaderboard Rank">#${rank} Rank</span>` : '';
            })() : ''}
                            </span>
                        </div>
                        <div class="student-tagline">${p.tagline || 'Software Engineering Intern'}</div>
                        <div class="student-meta-row">
                            ${p.location ? `<span class="student-meta-item">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                ${p.location}
                            </span>` : ''}
                            ${intern.company ? `<span class="student-meta-item">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                                ${intern.company}
                            </span>` : ''}
                            ${links.github ? `<a class="student-meta-item" href="${links.github}" target="_blank" rel="noopener" aria-label="GitHub">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                                GitHub
                            </a>` : ''}
                            ${links.linkedin ? `<a class="student-meta-item" href="${links.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                LinkedIn
                            </a>` : ''}
                        </div>
                    </div>
                    <div class="student-hero-actions">
                        <button id="edit-profile-btn" class="btn btn-secondary btn-sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Edit Profile
                        </button>
                        <a href="projects.html" class="btn btn-secondary btn-sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                            My Projects
                        </a>
                    </div>
                </div>

                <!-- Completion Bar -->
                <div class="completion-bar-wrap">
                    <span class="completion-label">Profile Completion</span>
                    <div class="completion-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Profile completion ${pct}%">
                        <div class="completion-fill" id="completion-fill" style="width:0%"></div>
                    </div>
                    <span class="completion-pct" id="completion-pct">0%</span>
                </div>
            </div>

            <!-- Stats Row -->
            <div class="student-stats-row" role="region" aria-label="Profile stats">
                ${stats.map((s, i) => `
                    <div class="student-stat-card ${s.clickable ? 'clickable-stat' : ''}" ${s.id ? `id="${s.id}"` : ''}>
                        <div class="student-stat-icon" style="background:rgba(${s.color === 'cyan' ? '34,211,238' : s.color === 'blue' ? '79,124,255' : '16,185,129'},.1)" aria-hidden="true">${s.icon}</div>
                        <div class="student-stat-info">
                            <div class="student-stat-value">${s.value}</div>
                            <div class="student-stat-label">${s.label}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Main Grid -->
            <div class="student-main-grid">

                <!-- Left Column -->
                <div>
                    <!-- About -->
                    <section class="student-section reveal anim-d1" aria-label="About">
                        <div class="student-section-head">
                            <div class="student-section-icon" style="background:rgba(79,124,255,.12)" aria-hidden="true">📄</div>
                            <h2 class="student-section-title">About Me</h2>
                        </div>
                        <div class="student-section-body">
                            <p class="bio-text">${p.bio || 'No bio available yet. Your admin will fill this in.'}</p>
                        </div>
                    </section>

                    <!-- Skills -->
                    <section class="student-section reveal anim-d2" aria-label="Skills">
                        <div class="student-section-head">
                            <div class="student-section-icon" style="background:rgba(34,211,238,.1)" aria-hidden="true">⚡</div>
                            <h2 class="student-section-title">Technical Skills</h2>
                            <button class="add-skill-btn" id="add-skill-btn" title="Add new skill" aria-label="Add new skill">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </button>
                        </div>
                        <div class="student-section-body">
                            <div class="inline-form" id="inline-skill-form" ${!(p.skills || []).length ? '' : 'hidden'} style="margin-bottom:var(--sp-4)">
                                <div class="inline-form-row">
                                    <input type="text" id="new-skill-input" class="field-input" placeholder="e.g. React, Python" style="flex:1">
                                    <button class="btn btn-primary btn-sm" id="save-skill-btn">Add</button>
                                    <button class="btn btn-secondary btn-sm" id="cancel-skill-btn">Cancel</button>
                                </div>
                            </div>
                            ${(p.skills || []).length ? `
                            <div class="skills-cloud" role="list" aria-label="Skills list">
                                ${(p.skills).map(s => `<span class="skill-badge" role="listitem">${s}</span>`).join('')}
                            </div>
                            ` : ''}
                        </div>
                    </section>

                    <!-- Project Progress -->
                    <section class="student-section reveal anim-d3" aria-label="Project progress">
                        <div class="student-section-head">
                            <div class="student-section-icon" style="background:rgba(168,85,247,.1)" aria-hidden="true">📊</div>
                            <h2 class="student-section-title">Project Progress</h2>
                            ${myProjects.length > 1 ? `
                            <div class="carousel-nav">
                                <button class="nav-arrow" id="next-proj-btn" title="See Next Project" aria-label="Next Project">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
                                </button>
                            </div>` : ''}
                        </div>
                        <div class="student-section-body">
                            ${myProjects.length > 0 ? (() => {
                try {
                    const idxSource = Number.isFinite(currentProjectIdx) ? currentProjectIdx : 0;
                    const safeIdx = Math.max(0, Math.min(idxSource, myProjects.length - 1));
                    const curr = myProjects[safeIdx];
                    if (!curr) return '<div class="empty-state-mini">Project not found.</div>';

                    const statusRaw = curr.status || 'Ongoing';
                    const statusValue = String(statusRaw);
                    const updates = Array.isArray(curr.updates) ? curr.updates : [];

                    return `
                                <div class="project-progress-card">
                                    <div class="pp-header">
                                        <div>
                                            <div class="pp-title">${curr.title || 'Untitled Project'}</div>
                                            <div class="pp-status-row">
                                                <span class="pp-status-badge ${(statusValue || 'Ongoing').toString().toLowerCase()}">${statusValue}</span>
                                                <span class="pp-date">Started ${fmtDate(curr.createdAt)}</span>
                                            </div>
                                        </div>
                                        ${updates.length > 0 ? `<button class="btn btn-primary btn-xs" id="add-progress-btn">Add Progress</button>` : ''}
                                    </div>
                                    
                                    <div class="inline-form" id="inline-progress-form" ${updates.length ? 'hidden' : ''} style="margin:var(--sp-4) 0">
                                        <textarea id="new-progress-input" class="field-input" rows="2" placeholder="Describe what you achieved today..."></textarea>
                                        <div style="margin-top:8px; display:flex; gap:8px">
                                            <button class="btn btn-primary btn-sm" id="save-progress-btn">Save Update</button>
                                            <button class="btn btn-secondary btn-sm" id="cancel-progress-btn">Cancel</button>
                                        </div>
                                    </div>
                                    
                                    <div class="pp-updates-list">
                                        ${updates.length > 0
                            ? updates.map(u => `
                                            <div class="pp-update-item">
                                                <div class="pp-update-dot"></div>
                                                <div class="pp-update-content">
                                                    <div class="pp-update-time">${fmtDate(u ? u.date : null)}</div>
                                                    <div class="pp-update-text">${u ? u.text : 'Empty update'}</div>
                                                </div>
                                            </div>`).join('')
                            : ''}
                                    </div>
                                </div>`;
                } catch (e) {
                    console.error('Carousel item render error:', e);
                    return `<div class="empty-state-mini">Error rendering project: ${e.message}</div>`;
                }
            })() : '<div class="empty-state-mini">No projects found for this intern.</div>'}
                        </div>
                    </section>
                </div>

                <!-- Right Sidebar -->
                <div>
                    <!-- Contact Details -->
                    <section class="student-section reveal anim-d1" aria-label="Contact details">
                        <div class="student-section-head">
                            <div class="student-section-icon" style="background:rgba(16,185,129,.1)" aria-hidden="true">📋</div>
                            <h2 class="student-section-title">Details</h2>
                        </div>
                        <div class="student-section-body">
                            <div class="info-list">
                                <div class="info-row">
                                    <div class="info-label">Full Name</div>
                                    <div class="info-value">${p.name || '—'}</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Email</div>
                                    <div class="info-value"><a href="mailto:${p.email}">${p.email || '—'}</a></div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Location</div>
                                    <div class="info-value">${p.location || '—'}</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Current Role</div>
                                    <div class="info-value">${intern.role || '—'}</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Company</div>
                                    <div class="info-value">${intern.company || '—'}</div>
                                </div>
                                <div class="divider" style="margin:var(--sp-3) 0"></div>
                                <div class="info-row">
                                    <div class="info-label">GitHub</div>
                                    <div class="info-value">
                                        ${links.github ? `<a href="${links.github}" target="_blank" rel="noopener">View Profile ↗</a>` : '—'}
                                    </div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">LinkedIn</div>
                                    <div class="info-value">
                                        ${links.linkedin ? `<a href="${links.linkedin}" target="_blank" rel="noopener">View Profile ↗</a>` : '—'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div class="student-section reveal anim-d2" style="text-align:center;padding:var(--sp-6)">
                        <div style="font-size:2rem;margin-bottom:var(--sp-3)" aria-hidden="true">🎯</div>
                        <div style="font-weight:var(--fw-semi);margin-bottom:var(--sp-2)">InternTrack Dashboard</div>
                        <div class="text-muted text-sm" style="margin-bottom:var(--sp-4)">Your creative progress, tracked in one place.</div>
                        <a href="dashboard.html" class="btn btn-secondary btn-sm" style="width:100%">Go to Dashboard</a>
                    </div>

                </div>
            </div>

            <!-- Account Settings Section (Editable) -->
            <section class="student-section reveal anim-d3" id="account-settings-section" aria-label="Account Settings">
                <div class="student-section-head">
                    <div class="student-section-icon" style="background:rgba(255,255,255,0.05)" aria-hidden="true">⚙️</div>
                    <h2 class="student-section-title">Account Settings</h2>
                </div>
                <div class="student-section-body">
                    <div class="edit-fields-grid">
                        <div class="edit-field-group">
                            <label class="field-label">Display Name</label>
                            <div class="name-edit-wrap">
                                <input type="text" id="name-edit-field" class="field-input" value="${p.name || ''}" placeholder="Your Full Name">
                                <button id="name-save-btn" class="btn btn-primary btn-sm">Save</button>
                            </div>
                        </div>
                        <div class="edit-field-group">
                            <label class="field-label">Profile Tagline</label>
                            <div class="tagline-edit-wrap">
                                <input type="text" id="tagline-edit-field" class="field-input" value="${p.tagline || ''}" placeholder="e.g. Software Engineering Intern">
                                <button id="tagline-save-btn" class="btn btn-primary btn-sm">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>`;
    }

    function fmtDate(d) {
        if (!d) return '—';
        try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); }
        catch { return d; }
    }

    function initReveal() {
        const els = document.querySelectorAll('.reveal');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
            });
        }, { threshold: 0.08 });
        els.forEach(el => obs.observe(el));
    }

    // ── Event Listeners ──
    function setupEventListeners(p, session) {
        // Projects stat card redirect
        const statCard = document.getElementById('project-stat-card');
        if (statCard) {
            statCard.addEventListener('click', () => {
                window.location.href = 'projects.html';
            });
        }

        // Add skill
        const addSkillBtn = document.getElementById('add-skill-btn');
        const skillForm = document.getElementById('inline-skill-form');
        const saveSkillBtn = document.getElementById('save-skill-btn');
        const cancelSkillBtn = document.getElementById('cancel-skill-btn');
        const skillInput = document.getElementById('new-skill-input');

        if (addSkillBtn && skillForm) {
            addSkillBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                skillForm.hidden = false;
                if (skillInput) skillInput.focus();
                addSkillBtn.hidden = true;
            });
        }

        if (cancelSkillBtn && skillForm) {
            cancelSkillBtn.addEventListener('click', () => {
                skillForm.hidden = true;
                if (skillInput) skillInput.value = '';
                if (addSkillBtn) addSkillBtn.hidden = false;
            });
        }

        if (saveSkillBtn && skillInput) {
            saveSkillBtn.addEventListener('click', () => {
                const newSkill = skillInput.value;
                if (newSkill && newSkill.trim()) {
                    const updatedSkills = [...(p.skills || []), newSkill.trim()];
                    p.skills = updatedSkills;
                    Storage.saveProfile(session.userId, p);
                    refreshView(p, session);
                }
            });
        }

        // Carousel Navigation
        const nextBtn = document.getElementById('next-proj-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const myProjects = Storage.getProjects().filter(pr => pr.ownerId === session.userId);
                if (myProjects.length > 0) {
                    currentProjectIdx = (currentProjectIdx + 1) % myProjects.length;
                    refreshView(p, session);
                }
            });
        }

        // Add Progress
        const addProgressBtn = document.getElementById('add-progress-btn');
        const progressForm = document.getElementById('inline-progress-form');
        const saveProgressBtn = document.getElementById('save-progress-btn');
        const cancelProgressBtn = document.getElementById('cancel-progress-btn');
        const progressInput = document.getElementById('new-progress-input');

        if (addProgressBtn && progressForm) {
            addProgressBtn.addEventListener('click', () => {
                progressForm.hidden = false;
                if (progressInput) progressInput.focus();
                addProgressBtn.hidden = true;
            });
        }

        if (cancelProgressBtn && progressForm) {
            cancelProgressBtn.addEventListener('click', () => {
                progressForm.hidden = true;
                if (progressInput) progressInput.value = '';
                if (addProgressBtn) addProgressBtn.hidden = false;
            });
        }

        if (saveProgressBtn && progressInput) {
            saveProgressBtn.addEventListener('click', () => {
                const myProjects = Storage.getProjects().filter(pr => pr.ownerId === session.userId);
                const curr = myProjects[currentProjectIdx];
                const text = progressInput.value;
                if (text && text.trim()) {
                    if (!curr.updates) curr.updates = [];
                    curr.updates.unshift({ date: new Date().toISOString(), text: text.trim() });
                    Storage.saveProject(curr);
                    refreshView(p, session);
                }
            });
        }

        // ── Edit Profile Enhancements ──
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                const accountSection = document.getElementById('account-settings-section');
                if (accountSection) {
                    accountSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const nameField = document.getElementById('name-edit-field');
                    if (nameField) {
                        setTimeout(() => {
                            nameField.focus();
                            nameField.classList.add('anim-pulse');
                            setTimeout(() => nameField.classList.remove('anim-pulse'), 1500);
                        }, 600);
                    }
                }
            });
        }

        // Avatar Upload
        const avatarInput = document.getElementById('student-avatar-input');
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > 2 * 1024 * 1024) {
                    showToast('Image too large. Max 2MB.', 'error');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                    p.avatar = ev.target.result;
                    Storage.saveProfile(session.userId, p);
                    refreshView(p, session);
                    showToast('Profile photo updated!', 'success');
                };
                reader.readAsDataURL(file);
            });
        }

        // Avatar Remove
        const removeAvatarBtn = document.getElementById('avatar-remove-btn');
        if (removeAvatarBtn) {
            removeAvatarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!p.avatar) {
                    showToast('No photo to remove.', 'info');
                    return;
                }
                if (confirm('Remove profile photo?')) {
                    p.avatar = '';
                    Storage.saveProfile(session.userId, p);
                    refreshView(p, session);
                    showToast('Profile photo removed.', 'success');
                }
            });
        }

        // Name Save
        const nameSaveBtn = document.getElementById('name-save-btn');
        const nameField = document.getElementById('name-edit-field');
        if (nameSaveBtn && nameField) {
            nameSaveBtn.addEventListener('click', () => {
                const newName = nameField.value.trim();
                if (!newName) { showToast('Name cannot be empty.', 'error'); return; }
                p.name = newName;
                Storage.saveProfile(session.userId, p);
                refreshView(p, session);
                showToast('Name updated!', 'success');
            });
            nameField.addEventListener('keydown', (e) => { if (e.key === 'Enter') nameSaveBtn.click(); });
        }

        // Tagline Save
        const taglineSaveBtn = document.getElementById('tagline-save-btn');
        const taglineField = document.getElementById('tagline-edit-field');
        if (taglineSaveBtn && taglineField) {
            taglineSaveBtn.addEventListener('click', () => {
                const newTagline = taglineField.value.trim();
                if (!newTagline) { showToast('Tagline cannot be empty.', 'error'); return; }
                p.tagline = newTagline;
                Storage.saveProfile(session.userId, p);
                refreshView(p, session);
                showToast('Tagline updated!', 'success');
            });
            taglineField.addEventListener('keydown', (e) => { if (e.key === 'Enter') taglineSaveBtn.click(); });
        }
    }

    function refreshView(p, session) {
        const outputEl = document.getElementById('profile-output');
        if (outputEl) {
            outputEl.innerHTML = buildStudentHTML(p, session, currentProjectIdx);
            setupEventListeners(p, session);
            setupSidebar(session, 'student-profile.html');
            initReveal();
            // Update completion bar
            const pct = computeCompletion(p);
            const fill = document.getElementById('completion-fill');
            const pctEl = document.getElementById('completion-pct');
            if (fill) fill.style.width = pct + '%';
            if (pctEl) pctEl.textContent = pct + '%';
        }
    }

    // ── Sidebar ──
    function setupSidebar(session, activePage) {
        const nav = document.getElementById('sidebar-nav');
        const avatar = document.getElementById('user-avatar-sidebar');
        const nameEl = document.getElementById('user-name-sidebar');
        const roleEl = document.getElementById('user-role-sidebar');

        const isAdmin = session.role === 'admin';
        const p = isAdmin ? (Storage.getAdminProfile ? Storage.getAdminProfile(session.userId) : null) : Storage.getProfile(session.userId);
        const currentName = p?.name || session.displayName;

        if (avatar) {
            if (p?.avatar) {
                avatar.innerHTML = `<img src="${p.avatar}" alt="${currentName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
            } else {
                avatar.textContent = currentName[0].toUpperCase();
            }
        }
        if (nameEl) nameEl.textContent = currentName;
        if (roleEl) roleEl.textContent = isAdmin ? 'Administrator' : 'Intern';

        const items = [
            { label: 'Dashboard', href: 'dashboard.html', icon: '⊞' },
            { label: 'My Profile', href: 'student-profile.html', icon: '👤', active: true },
            { label: 'Leaderboard', href: 'leaderboard.html', icon: '🏆' },
            { label: 'My Analytics', href: `student-analytics.html?student=${session.userId}`, icon: '📊' },
            { label: 'Projects', href: 'projects.html', icon: '🗂️' },
        ];

        if (nav) {
            nav.innerHTML = '<div class="nav-section-label">Menu</div>' +
                items.map(item => `
                <a class="nav-item${item.href === activePage ? ' active' : ''}" href="${item.href}" aria-current="${item.href === activePage ? 'page' : 'false'}">
                    <span class="nav-icon" aria-hidden="true">${item.icon}</span>
                    <span>${item.label}</span>
                </a>`).join('');
        }

        const hamburger = document.getElementById('hamburger-btn');
        const sidebar = document.getElementById('app-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (hamburger && sidebar && overlay) {
            hamburger.addEventListener('click', () => {
                const open = sidebar.classList.toggle('open');
                overlay.classList.toggle('visible', open);
                hamburger.setAttribute('aria-expanded', String(open));
            });
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('visible');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        }
    }

})();
>>>>>>> 199b10f (added new files)
