/**
 * InternTrack — Intern Analytics Dashboard
 * Renders Apexify-style analytics for an individual intern.
 * Entry URL: student-analytics.html?student=<userId>
 */

'use strict';

(() => {
    // ── Auth Guard (admin or intern) ──
    const session = Auth.requireAuth(['admin', 'user']);
    if (!session) return;

    const isAdmin = session.role === 'admin';

    setupSidebar(session);
    document.getElementById('logout-btn').addEventListener('click', () => Auth.logout());

    // ── Get target intern ──
    const params = new URLSearchParams(location.search);
    let targetUid = params.get('student');

    // If intern, they can ONLY see their own data
    if (!isAdmin) {
        targetUid = session.userId;
    }

    const loadingEl = document.getElementById('analytics-loading');
    const outputEl = document.getElementById('analytics-output');

    if (!targetUid) {
        showError('No intern specified. Return to Intern Roster and click "Analytics".');
        return;
    }

    const profile = Storage.getProfile(targetUid);
    if (!profile) {
        showError('Intern profile not found. They may not have a profile built yet.');
        return;
    }

    const allProjects = Storage.getProjects();
    const myProjects = allProjects.filter(p => p.ownerId === targetUid);

    // ── Update topbar title ──
    const topbarTitle = document.getElementById('topbar-title');
    if (topbarTitle) {
        topbarTitle.textContent = isAdmin ? `${profile.name || 'Intern'}'s Analytics` : 'My Analytics';
    }

    // ── Update role badge ──
    const roleBadge = document.getElementById('topbar-role-badge');
    if (roleBadge) {
        roleBadge.textContent = isAdmin ? 'Admin' : 'Intern';
        roleBadge.className = isAdmin ? 'badge badge-admin' : 'badge badge-user';
    }
    // ── Compute analytics values ──
    const skillCount = (profile.skills || []).length;
    const projectCount = myProjects.length;
    const completionPct = computeCompletion(profile);
    const overallScore = computeScore(profile, myProjects);
    const intern = profile.internship || {};
    const isActive = intern.endDate ? new Date(intern.endDate) >= new Date() : !!intern.company;

    // ── Render everything ──
    try {
        if (loadingEl) loadingEl.remove();
        outputEl.hidden = false;
        outputEl.innerHTML = buildDashHTML(profile, myProjects || []);

        // Post-render: animate stats + charts
        setTimeout(() => {
            try { animateCounters(); } catch (e) { console.warn('Counter animation failed', e); }
            try {
                if (myProjects && myProjects.length > 0) {
                    renderLineChart(myProjects);
                }
            } catch (e) { console.warn('Line chart failed', e); }
            try { renderBarChart(profile.skills || []); } catch (e) { console.warn('Bar chart failed', e); }

            // Critical: Always reveal content
            initReveal();
        }, 80);
    } catch (err) {
        console.error('Analytics render failed', err);
        showError('Encountered an error while rendering your dashboard. Please check your profile data.');
    }

    // ────────────────────────────────────────────────────────
    // HTML BUILDER
    // ────────────────────────────────────────────────────────
    function buildDashHTML(p, projects) {
        const intern = p.internship || {};
        const links = p.socialLinks || {};

        // Status for projects (mock realistic statuses)
        const statusPool = ['success', 'success', 'processing', 'pending', 'declined'];

        const internObj2 = p.internship || {};
        const periodStr = internObj2.startDate
            ? `${fmtDate(internObj2.startDate)} — ${internObj2.endDate ? fmtDate(internObj2.endDate) : 'Present'}`
            : 'Internship Period';

        return `
        <!-- ═══ INTERN PROFILE BANNER ═══ -->
        <div class="role-banner ${isAdmin ? 'admin' : 'user'} reveal anim-d1" style="margin-bottom:var(--sp-8)">
            <span class="role-banner-icon" aria-hidden="true">${p.avatar ? `<img src="${p.avatar}" alt="${p.name}" style="width:40px;height:40px;border-radius:50%;object-fit:cover">` : '📊'}</span>
            <div class="role-banner-text">
                <div class="role-banner-title">${p.name || 'Intern'}</div>
                <div class="role-banner-sub">${internObj2.role || 'Intern'} ${internObj2.company ? '· ' + internObj2.company : ''} · ${periodStr}</div>
            </div>
            <span class="badge ${isAdmin ? 'badge-admin' : 'badge-user'}">${isAdmin ? 'Admin View' : 'My Stats'}</span>
        </div>

        <!-- ═══ STATS ROW ═══ -->
        <div class="stats-row">

            <div class="stat-card reveal anim-d1">
                <div class="stat-card-head">
                    <div class="stat-card-label">Overall Score</div>
                    <div class="stat-card-icon" style="background:rgba(139,92,246,.12)" aria-hidden="true">⭐</div>
                </div>
                <div class="stat-card-value counter-num" data-target="${overallScore}" data-suffix="%">0%</div>
                <div class="stat-card-trend ${overallScore >= 70 ? 'up' : overallScore >= 50 ? 'neutral' : 'down'}">
                    ${overallScore >= 70 ? arrowUp() : overallScore >= 50 ? '—' : arrowDown()}
                    <span>${overallScore >= 70 ? '+' : ''}${overallScore - 50}%</span>
                    <span class="trend-label">vs base target</span>
                </div>
                ${sparklineSVG()}
            </div>

            <div class="stat-card reveal anim-d2">
                <div class="stat-card-head">
                    <div class="stat-card-label">Skills Listed</div>
                    <div class="stat-card-icon" style="background:rgba(34,211,238,.12)" aria-hidden="true">⚡</div>
                </div>
                <div class="stat-card-value counter-num" data-target="${skillCount}">0</div>
                <div class="stat-card-trend ${skillCount > 0 ? 'up' : 'neutral'}">
                    ${skillCount > 0 ? arrowUp() : '—'}
                    <span>${skillCount} skill${skillCount !== 1 ? 's' : ''} recorded</span>
                </div>
                ${sparklineSVG('#22d3ee')}
            </div>

            <div class="stat-card reveal anim-d3">
                <div class="stat-card-head">
                    <div class="stat-card-label">Projects Submitted</div>
                    <div class="stat-card-icon" style="background:rgba(16,185,129,.1)" aria-hidden="true">🗂️</div>
                </div>
                <div class="stat-card-value counter-num" data-target="${projectCount}">0</div>
                <div class="stat-card-trend ${projectCount > 0 ? 'up' : 'neutral'}">
                    ${projectCount > 0 ? arrowUp() : '—'}
                    <span>${projectCount > 0 ? 'Active submissions' : 'No projects yet'}</span>
                </div>
                ${sparklineSVG('#10b981')}
            </div>

            <div class="stat-card reveal anim-d4">
                <div class="stat-card-head">
                    <div class="stat-card-label">Profile Completion</div>
                    <div class="stat-card-icon" style="background:rgba(245,158,11,.1)" aria-hidden="true">📋</div>
                </div>
                <div class="stat-card-value counter-num" data-target="${completionPct}" data-suffix="%">0%</div>
                <div class="stat-card-trend ${completionPct >= 80 ? 'up' : completionPct >= 50 ? 'neutral' : 'down'}">
                    ${completionPct >= 60 ? arrowUp() : arrowDown()}
                    <span>${completionPct}% complete</span>
                </div>
                ${sparklineSVG('#f59e0b')}
            </div>

<<<<<<< HEAD
=======
            <div class="stat-card reveal anim-d5">
                <div class="stat-card-head">
                    <div class="stat-card-label">Leaderboard Rank</div>
                    <div class="stat-card-icon" style="background:rgba(255,215,0,.12)" aria-hidden="true">🏆</div>
                </div>
                <div class="stat-card-value counter-num" data-target="${Storage.getInternRank ? Storage.getInternRank(p.userId) : 0}" data-prefix="#">#0</div>
                <div class="stat-card-trend up">
                    ${arrowUp()}
                    <span>Rank among peers</span>
                </div>
                ${sparklineSVG('#FFD700')}
            </div>

>>>>>>> 199b10f (added new files)
        </div>

        <!-- ═══ CHARTS ROW ═══ -->
        <div class="charts-row">

            <!-- Line Chart: Performance Growth -->
            <div class="chart-widget reveal anim-d1">
                <div class="chart-widget-head">
                    <div>
                        <div class="chart-widget-title">Analytic Overview</div>
                        <div class="chart-widget-meta">Performance &amp; Score growth across key metrics</div>
                    </div>
                    <div class="chart-controls">
                        <button class="chart-tab active" onclick="switchTab(this,'growth')">Growth</button>
                        <button class="chart-tab" onclick="switchTab(this,'skills')">Skills</button>
                        <button class="chart-tab" onclick="switchTab(this,'projects')">Projects</button>
                    </div>
                </div>
                <div class="line-chart-wrap" id="line-chart-wrap" aria-label="Performance line chart">
                    <!-- SVG injected by JS -->
                </div>
                <div class="chart-axes" id="chart-x-labels" aria-hidden="true"></div>
                <div class="chart-legend">
                    <div class="legend-item">
                        <div class="legend-dot" style="background:#8b5cf6"></div>
                        <span>Score</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot" style="background:#22d3ee"></div>
                        <span>Target</span>
                    </div>
                </div>
            </div>

            <!-- Bar Chart: Skill Distribution -->
            <div class="chart-widget reveal anim-d2">
                <div class="chart-widget-head">
                    <div>
                        <div class="chart-widget-title">Skill Distribution</div>
                        <div class="chart-widget-meta">Top technical competencies</div>
                    </div>
                    <button class="more-dots-btn" aria-label="More options">⋯</button>
                </div>
                <div class="bar-chart-wrap" id="bar-chart-wrap" aria-label="Skill bar chart">
                    <!-- Bars injected by JS -->
                </div>
            </div>

        </div>

        <!-- ═══ HISTORICAL TRACK TABLE ═══ -->
        <div class="history-section reveal anim-d2">
            <div class="history-head">
                <div class="history-title">Performance Log</div>
                <div class="history-actions">
<<<<<<< HEAD
                    ${isAdmin ? `<a href="students.html" class="btn btn-secondary btn-sm">← Back to Interns</a>` : ''}
                    <a href="profile-builder.html?student=${p.userId}" class="btn btn-primary btn-sm">✏️ Edit Profile</a>
=======
                    ${isAdmin ? `<a href="students.html" class="btn btn-secondary btn-sm">← Back to Interns</a>` : `
                    <a href="projects.html" class="btn btn-primary btn-sm">✏️ Edit Project</a>`}
>>>>>>> 199b10f (added new files)
                </div>
            </div>
            ${projects.length === 0 ? `
            <div class="empty-state">
                <div class="empty-state-icon">🗂️</div>
                <div class="empty-state-title">No projects yet</div>
                <div class="empty-state-desc">This intern hasn't submitted any projects yet.</div>
            </div>` : `
            <table class="history-table" aria-label="Project history">
                <thead>
                    <tr>
                        <th><input type="checkbox" class="row-checkbox" aria-label="Select all"></th>
                        <th>Project Details</th>
                        <th>Performance</th>
                        <th>Submitted</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${projects.map((proj, i) => {
            const status = statusPool[i % statusPool.length];
            const stackArr = (proj.techStack || []).slice(0, 3);
            const initials = (proj.ownerName || profile.name || 'I')[0].toUpperCase();
            return `
                    <tr>
                        <td><input type="checkbox" class="row-checkbox" aria-label="Select ${proj.title}"></td>
                        <td>
                            <div class="proj-col-main">
                                <span class="proj-name">${proj.title}</span>
                                <span class="proj-sub">${proj.description ? proj.description.slice(0, 55) + (proj.description.length > 55 ? '…' : '') : 'No description'}</span>
                                ${stackArr.length ? `<div class="proj-stack-chips">${stackArr.map(t => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
                            </div>
                        </td>
                        <td>
                            ${proj.rating ? `
                                <div class="rating-display">
                                    <div class="stars" style="color:var(--clr-amber)">${'★'.repeat(proj.rating)}${'☆'.repeat(5 - proj.rating)}</div>
                                    <div class="rating-label">${proj.rating}/5 Score</div>
                                </div>
                            ` : `<span class="text-muted">No rating</span>`}
                        </td>
                        <td class="date-col">${proj.createdAt ? fmtDateShort(proj.createdAt) : 'N/A'}</td>
                        <td><span class="status-pill pill-${status}">${capitalize(status)}</span></td>
                        <td>
                            <div class="owner-cell">
                                <div class="owner-avatar-sm">${initials}</div>
                                <div class="owner-info">
                                    <span class="owner-name">Intern</span>
                                    <span class="owner-email">${profile.email || '—'}</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            ${proj.liveLink ? `<a href="${proj.liveLink}" target="_blank" rel="noopener" class="more-btn">Live ↗</a>` : `<button class="more-btn">Details</button>`}
                        </td>
                    </tr>`;
        }).join('')}
                </tbody>
            </table>`}
        </div>`;
    }

    // ────────────────────────────────────────────────────────
    // CHART: SVG LINE CHART
    // ────────────────────────────────────────────────────────
    function renderLineChart(projects) {
        const wrap = document.getElementById('line-chart-wrap');
        if (!wrap) return;

        const W = wrap.clientWidth || 600;
        const H = 200;
        const pad = { top: 16, right: 20, bottom: 8, left: 36 };
        const cW = W - pad.left - pad.right;
        const cH = H - pad.top - pad.bottom;

        // Generate 8 month data points from internship start or last 8 months
        const points = generateTrendData(overallScore, 8);
        const targetPoints = points.map((_, i) => 65 + i * 1.5);
        const labels = getLast8Months();

        const xScale = (i) => pad.left + (i / (points.length - 1)) * cW;
        const yScale = (v) => pad.top + cH - ((v - 40) / 60) * cH;

        const toPath = (arr) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)} ${yScale(v).toFixed(1)}`).join(' ');
        const toArea = (arr) => `${toPath(arr)} L ${xScale(arr.length - 1).toFixed(1)} ${(pad.top + cH).toFixed(1)} L ${xScale(0).toFixed(1)} ${(pad.top + cH).toFixed(1)} Z`;

        // X labels
        const xLabels = document.getElementById('chart-x-labels');
        if (xLabels) xLabels.innerHTML = labels.map(l => `<span>${l}</span>`).join('');

        // Y grid lines
        const gridLines = [50, 60, 70, 80, 90, 100].map(v => {
            const y = yScale(v).toFixed(1);
            return `
            <line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
            <text x="${pad.left - 6}" y="${y}" fill="#5a5a6a" font-size="9" text-anchor="end" dominant-baseline="middle">${v}</text>`;
        }).join('');

        // Final SVG
        wrap.innerHTML = `<svg id="line-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:${H}px;cursor:crosshair">
            <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.12"/>
                    <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
                </linearGradient>
            </defs>
            ${gridLines}
            <line id="guide-line" x1="0" y1="${pad.top}" x2="0" y2="${pad.top + cH}" stroke="var(--clr-purple)" stroke-width="1" stroke-dasharray="4 2" style="display:none" />
            <!-- Target area -->
            <path d="${toArea(targetPoints)}" fill="url(#areaGrad2)" />
            <path d="${toPath(targetPoints)}" fill="none" stroke="#22d3ee" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.4"/>
            <!-- Score area -->
            <path d="${toArea(points)}" fill="url(#areaGrad)" class="chart-area-path"/>
            <path d="${toPath(points)}" fill="none" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))" class="chart-line-path"/>
            <!-- Data points -->
            ${points.map((v, i) => `<circle class="chart-dot" data-idx="${i}" data-val="${v}" data-target="${targetPoints[i].toFixed(1)}" cx="${xScale(i).toFixed(1)}" cy="${yScale(v).toFixed(1)}" r="4" fill="#8b5cf6" stroke="#fff" stroke-width="${i === points.length - 1 ? '2.5' : '1.5'}" style="filter:drop-shadow(0 0 4px rgba(139, 92, 246, 0.4))"/>`).join('')}
        </svg>
        <div id="chart-tooltip" class="chart-tooltip" style="display:none;position:absolute;pointer-events:none;z-index:100;backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);background:rgba(10,12,20,0.8);box-shadow:0 10px 30px rgba(0,0,0,0.5)"></div>`
            ;

        // Interaction Logic
        const svg = document.getElementById('line-svg');
        const guide = document.getElementById('guide-line');
        const tooltip = document.getElementById('chart-tooltip');

        svg.addEventListener('mousemove', (e) => {
            const rect = svg.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const xRel = (mouseX / rect.width) * W;

            // Find closest point
            let closestIdx = 0;
            let minDist = Infinity;
            points.forEach((_, i) => {
                const dx = Math.abs(xScale(i) - xRel);
                if (dx < minDist) {
                    minDist = dx;
                    closestIdx = i;
                }
            });

            const px = xScale(closestIdx);
            const py = yScale(points[closestIdx]);

            guide.setAttribute('x1', px);
            guide.setAttribute('x2', px);
            guide.style.display = 'block';

            tooltip.style.display = 'block';
            tooltip.style.left = (px + 10) + 'px';
            tooltip.style.top = (py - 40) + 'px';
            tooltip.innerHTML = `
                <div style="font-weight:700;color:#fff">${labels[closestIdx]}</div>
                <div style="color:var(--clr-purple-light)">Score: ${points[closestIdx]}%</div>
                <div style="color:var(--clr-cyan);font-size:10px">Target: ${targetPoints[closestIdx].toFixed(0)}%</div>
            `;

            // Highlight dot
            document.querySelectorAll('.chart-dot').forEach((dot, idx) => {
                dot.setAttribute('r', idx === closestIdx ? '6' : '3.5');
                dot.style.opacity = idx === closestIdx ? '1' : '0.6';
            });
        });

        svg.addEventListener('mouseleave', () => {
            guide.style.display = 'none';
            tooltip.style.display = 'none';
            document.querySelectorAll('.chart-dot').forEach(dot => {
                dot.setAttribute('r', '3.5');
                dot.style.opacity = '1';
            });
        });
    }

    // ────────────────────────────────────────────────────────
    // CHART: BAR CHART
    // ────────────────────────────────────────────────────────
    function renderBarChart(skills) {
        const wrap = document.getElementById('bar-chart-wrap');
        if (!wrap) return;

        const colors = ['#7c5cfc', '#22d3ee', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'];

        const categories = skills.length > 0
            ? skills.map((s, i) => ({ label: s, pct: Math.min(95, 45 + (i === 0 ? 50 : Math.floor(75 - i * 8 + Math.random() * 10))), color: colors[i % colors.length] }))
            : [
                { label: 'Communication', pct: 85, color: colors[0] },
                { label: 'Problem Solving', pct: 72, color: colors[1] },
                { label: 'Teamwork', pct: 68, color: colors[2] },
                { label: 'Adaptability', pct: 55, color: colors[3] },
            ];

        wrap.innerHTML = categories.slice(0, 7).map(c => `
            <div class="bar-row">
                <span class="bar-label" title="${c.label}">${c.label}</span>
                <div class="bar-track" role="progressbar" aria-valuenow="${c.pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${c.label}: ${c.pct}%">
                    <div class="bar-fill" style="--bar-color:${c.color}" data-pct="${c.pct}"></div>
                </div>
                <span class="bar-value" style="color:${c.color}">${c.pct}%</span>
            </div>`).join('');

        // Animate bars after render
        setTimeout(() => {
            document.querySelectorAll('.bar-fill').forEach((bar, i) => {
                setTimeout(() => {
                    bar.style.width = bar.dataset.pct + '%';
                }, i * 100);
            });
        }, 300);
    }


    // ── Chart tab switching ──
    window.switchTab = function (el, mode) {
        document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
        el.classList.add('active');

        // Re-render with different data
        const allP = Storage.getProjects();
        const myP = allP.filter(p => p.ownerId === targetUid);
        if (mode === 'growth') renderLineChart(myP);
        else if (mode === 'skills') {
            const skillData = (profile.skills || []).map((_, i) => 45 + Math.round(50 - i * 5 + Math.random() * 10));
            renderLineChartRaw(skillData, '#22d3ee', '#10b981');
        } else {
            const projData = Array.from({ length: 8 }, (_, i) => i < myP.length ? (i + 1) * 10 : 0);
            renderLineChartRaw(projData, '#f59e0b', '#ec4899');
        }
    };

    function renderLineChartRaw(points, color1, color2) {
        const wrap = document.getElementById('line-chart-wrap');
        if (!wrap) return;
        const W = wrap.clientWidth || 600;
        const H = 200;
        const pad = { top: 16, right: 20, bottom: 8, left: 36 };
        const cW = W - pad.left - pad.right;
        const cH = H - pad.top - pad.bottom;
        const max = Math.max(...points, 10);
        const min = 0;

        const xScale = (i) => pad.left + (i / (points.length - 1)) * cW;
        const yScale = (v) => pad.top + cH - ((v - min) / (max - min)) * cH;
        const toPath = (arr) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)} ${yScale(v).toFixed(1)}`).join(' ');
        const toArea = (arr) => `${toPath(arr)} L ${xScale(arr.length - 1).toFixed(1)} ${(pad.top + cH).toFixed(1)} L ${xScale(0).toFixed(1)} ${(pad.top + cH).toFixed(1)} Z`;

        wrap.innerHTML = `<svg id="line-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:${H}px;cursor:crosshair">
            <defs>
                <linearGradient id="areaGrad3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${color1}" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="${color1}" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <line id="guide-line" x1="0" y1="${pad.top}" x2="0" y2="${pad.top + cH}" stroke="${color1}" stroke-width="1" stroke-dasharray="4 2" style="display:none" />
            <path d="${toArea(points)}" fill="url(#areaGrad3)"/>
            <path d="${toPath(points)}" fill="none" stroke="${color1}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 8px ${color1}80)"/>
            ${points.map((v, i) => `<circle class="chart-dot" data-idx="${i}" data-val="${v}" cx="${xScale(i).toFixed(1)}" cy="${yScale(v).toFixed(1)}" r="4" fill="${color1}" stroke="#fff" stroke-width="1.5"/>`).join('')}
        </svg>
        <div id="chart-tooltip" class="chart-tooltip" style="display:none;position:absolute;pointer-events:none;z-index:100;backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);background:rgba(10,12,20,0.8);box-shadow:0 10px 30px rgba(0,0,0,0.5)"></div>`
            ;

        const svg = document.getElementById('line-svg');
        const guide = document.getElementById('guide-line');
        const tooltip = document.getElementById('chart-tooltip');
        const labels = getLast8Months();

        svg.addEventListener('mousemove', (e) => {
            const rect = svg.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const xRel = (mouseX / rect.width) * W;

            let closestIdx = 0;
            let minDist = Infinity;
            points.forEach((_, i) => {
                const dx = Math.abs(xScale(i) - xRel);
                if (dx < minDist) {
                    minDist = dx;
                    closestIdx = i;
                }
            });

            const px = xScale(closestIdx);
            const py = yScale(points[closestIdx]);

            guide.setAttribute('x1', px);
            guide.setAttribute('x2', px);
            guide.style.display = 'block';

            tooltip.style.display = 'block';
            tooltip.style.left = (px + 10) + 'px';
            tooltip.style.top = (py - 40) + 'px';
            tooltip.innerHTML = `
                <div style="font-weight:700;color:#fff">${labels[closestIdx]}</div>
                <div style="color:${color1}">Value: ${points[closestIdx]}</div>
            `;

            document.querySelectorAll('.chart-dot').forEach((dot, idx) => {
                dot.setAttribute('r', idx === closestIdx ? '6' : '3');
                dot.style.opacity = idx === closestIdx ? '1' : '0.6';
            });
        });

        svg.addEventListener('mouseleave', () => {
            guide.style.display = 'none';
            tooltip.style.display = 'none';
            document.querySelectorAll('.chart-dot').forEach(dot => {
                dot.setAttribute('r', '3');
                dot.style.opacity = '1';
            });
        });
    }

    // ────────────────────────────────────────────────────────
    // ANIMATED COUNTERS
    // ────────────────────────────────────────────────────────
    function animateCounters() {
        document.querySelectorAll('.counter-num').forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
<<<<<<< HEAD
=======
            const prefix = el.dataset.prefix || '';
>>>>>>> 199b10f (added new files)
            const dur = 900;
            const start = performance.now();
            const step = (now) => {
                const prog = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - prog, 3);
<<<<<<< HEAD
                el.textContent = Math.floor(eased * target) + suffix;
                if (prog < 1) requestAnimationFrame(step);
                else el.textContent = target + suffix;
=======
                el.textContent = prefix + Math.floor(eased * target) + suffix;
                if (prog < 1) requestAnimationFrame(step);
                else el.textContent = prefix + target + suffix;
>>>>>>> 199b10f (added new files)
            };
            requestAnimationFrame(step);
        });
    }

    // ────────────────────────────────────────────────────────
    // HELPERS
    // ────────────────────────────────────────────────────────
    function computeCompletion(p) {
        const fields = [
            p.name, p.email, p.tagline, p.bio, p.location,
            p.skills?.length > 0,
            p.internship?.company, p.internship?.role,
            p.socialLinks?.github || p.socialLinks?.linkedin,
        ];
        return Math.round((fields.filter(Boolean).length / fields.length) * 100);
    }

    function computeScore(p, projects) {
        let s = 40; // Base score
        if (p.skills?.length) s += Math.min(p.skills.length * 2, 10);

        // Primary weight: Project Ratings
        if (projects?.length) {
            const ratedProjects = projects.filter(proj => proj.rating);
            if (ratedProjects.length > 0) {
                const totalRating = ratedProjects.reduce((sum, pr) => sum + pr.rating, 0);
                const avgRating = totalRating / ratedProjects.length; // 0-5
                s += (avgRating / 5) * 40; // Max 40 points for perfect ratings
            }
            s += Math.min(projects.length * 2, 10); // Volume bonus
        }

        if (p.avatar) s += 2;
        if (p.socialLinks?.github) s += 2;

        return Math.min(s, 99);
    }

    function generateTrendData(finalScore, count) {
        const points = [];
        const start = Math.max(40, finalScore - 30);
        for (let i = 0; i < count; i++) {
            const prog = i / (count - 1);
            const noise = (Math.random() - 0.5) * 8;
            points.push(Math.min(99, Math.max(30, Math.round(start + (finalScore - start) * prog + noise))));
        }
        points[points.length - 1] = finalScore;
        return points;
    }

    function getLast8Months() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        const result = [];
        for (let i = 7; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            result.push(months[d.getMonth()]);
        }
        return result;
    }

    function fmtDate(d) {
        if (!d) return '—';
        try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); }
        catch { return d; }
    }

    function fmtDateShort(d) {
        if (!d) return '—';
        try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
        catch { return d; }
    }

    function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

    function arrowUp() {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`;
    }
    function arrowDown() {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`;
    }

    function sparklineSVG(color = '#8b5cf6') {
        const h = [30, 55, 42, 70, 65, 80, 72, 90];
        const max = Math.max(...h); const min = Math.min(...h);
        const pts = h.map((v, i) => `${(i / (h.length - 1)) * 100},${100 - ((v - min) / (max - min)) * 100}`).join(' ');
        return `<svg class="stat-sparkline" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }

    function showError(msg) {
        const loadingEl = document.getElementById('analytics-loading');
        if (loadingEl) loadingEl.remove();
        const outputEl = document.getElementById('analytics-output');
        if (outputEl) {
            outputEl.hidden = false;
            outputEl.innerHTML = `<div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <div class="empty-state-title">Cannot Load Analytics</div>
                <div class="empty-state-desc">${msg}</div>
                ${isAdmin ? `<a href="students.html" class="btn btn-secondary btn-sm" style="margin-top:20px">← Go to Intern Roster</a>` : ''}
            </div>`;
        }
    }

    function initReveal() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
            });
        }, { threshold: 0.06 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }

    // ────────────────────────────────────────────────────────
    // SIDEBAR
    // ────────────────────────────────────────────────────────
    function setupSidebar(session) {
        const avatar = document.getElementById('user-avatar-sidebar');
        const nameEl = document.getElementById('user-name-sidebar');
        const roleEl = document.getElementById('user-role-sidebar');

        const p = isAdmin ? (Storage.getAdminProfile ? Storage.getAdminProfile(session.userId) : null) : Storage.getProfile(session.userId);
        const currentName = p?.name || session.displayName;

<<<<<<< HEAD
        if (avatar) avatar.textContent = currentName[0].toUpperCase();
        if (nameEl) nameEl.textContent = currentName;
        if (roleEl) roleEl.textContent = isAdmin ? 'Administrator' : 'Intern';
=======
        if (avatar) {
            if (p?.avatar) {
                avatar.innerHTML = `<img src="${p.avatar}" alt="${currentName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
            } else {
                avatar.textContent = currentName[0].toUpperCase();
            }
        }
        if (nameEl) nameEl.textContent = currentName;
        if (roleEl) roleEl.textContent = isAdmin ? (p?.role || 'Administrator') : 'Intern';
>>>>>>> 199b10f (added new files)

        const nav = document.getElementById('sidebar-nav');
        const items = [
            { label: 'Dashboard', href: 'dashboard.html', icon: '⊞' },
            { label: 'My Profile', href: isAdmin ? 'admin-profile.html' : 'student-profile.html', icon: '👤' },
<<<<<<< HEAD
            ...(isAdmin ? [{ label: 'Interns', href: 'students.html', icon: '👥', active: true }] : [{ label: 'My Analytics', href: `student-analytics.html?student=${session.userId}`, icon: '📊', active: true }]),
=======
            ...(isAdmin
                ? [{ label: 'Interns', href: 'students.html', icon: '👥', active: true }]
                : [
                    { label: 'Leaderboard', href: 'leaderboard.html', icon: '🏆' },
                    { label: 'My Analytics', href: `student-analytics.html?student=${session.userId}`, icon: '📊', active: true }
                ]
            ),
>>>>>>> 199b10f (added new files)
            { label: 'Projects', href: 'projects.html', icon: '🗂️' },
        ];

        if (nav) {
            nav.innerHTML = '<div class="nav-section-label">Menu</div>' +
                items.map(item => `
                <a class="nav-item${item.active ? ' active' : ''}" href="${item.href}" aria-current="${item.active ? 'page' : 'false'}">
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
