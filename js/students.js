<<<<<<< HEAD
/**
 * InternTrack — Students Page Logic
 * Shows all intern student cards with expandable details.
 */

'use strict';

(() => {
  // Guard: admin only
  const session = Auth.requireAuth();
  if (!session) return;

  if (session.role !== 'admin') {
    window.location.href = 'dashboard.html';
    return;
  }

  // ── DOM refs ──
  const sidebarNav = document.getElementById('sidebar-nav');
  const userAvatarSb = document.getElementById('user-avatar-sidebar');
  const userNameSb = document.getElementById('user-name-sidebar');
  const userRoleSb = document.getElementById('user-role-sidebar');
  const welcome = document.getElementById('welcome-title');
  const welcomeSub = document.getElementById('welcome-sub');
  const roleBanner = document.getElementById('role-banner');
  const roleBadgeMain = document.getElementById('role-badge-main');
  const topbarRoleBadge = document.getElementById('topbar-role-badge');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const appSidebar = document.getElementById('app-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const logoutBtn = document.getElementById('logout-btn');
  const studentsContainer = document.getElementById('students-container');
  const studentsCountEl = document.getElementById('students-count');
  const projectIndices = {}; // Track current project index per student

  // ── User info ──
  const adminProfile = Storage.getAdminProfile ? Storage.getAdminProfile(session.userId) : null;
  const currentName = adminProfile?.name || session.displayName;

  userAvatarSb.textContent = currentName[0].toUpperCase();
  userNameSb.textContent = currentName;
  userRoleSb.textContent = 'Administrator';

  welcome.textContent = `Intern Roster`;
  welcomeSub.textContent = 'Review intern profiles, performance metrics, and project contributions.';
  roleBanner.classList.add('admin');

  ['badge-admin', 'badge-user'].forEach(c => {
    roleBadgeMain.classList.remove(c);
    topbarRoleBadge.classList.remove(c);
  });
  roleBadgeMain.textContent = 'Admin';
  roleBadgeMain.className = 'badge badge-admin';
  topbarRoleBadge.textContent = 'Admin';
  topbarRoleBadge.className = 'badge badge-admin';

  // ── Sidebar nav ──
  const NAV = [
    { label: 'Dashboard', href: 'dashboard.html', icon: '⊞' },
    { label: 'My Profile', href: 'admin-profile.html', icon: '👤' },
    { label: 'Interns', href: 'students.html', icon: '👥', active: true },
    { label: 'Projects', href: 'projects.html', icon: '🗂️' },
  ];

  let navHTML = `<div class="nav-section-label">Menu</div>`;
  NAV.forEach(item => {
    navHTML += `
      <a class="nav-item${item.active ? ' active' : ''}" href="${item.href}" aria-current="${item.active ? 'page' : 'false'}">
        <span class="nav-icon" aria-hidden="true">${item.icon}</span>
        <span>${item.label}</span>
      </a>`;
  });
  sidebarNav.innerHTML = navHTML;

  // ── Load data ──
  const profiles = Storage.getProfiles();
  const allProjects = Storage.getProjects();
  const profileList = Object.values(profiles);

  studentsCountEl.textContent = `${profileList.length} intern${profileList.length !== 1 ? 's' : ''}`;

  // ── Helpers ──
  function computeScore(profile) {
    let score = 50;
    if (profile.skills && profile.skills.length) score += Math.min(profile.skills.length * 3, 20);
    if (profile.bio && profile.bio.length > 40) score += 10;
    if (profile.internship && profile.internship.company) score += 10;
    if (profile.avatar) score += 5;
    if (profile.socialLinks) {
      if (profile.socialLinks.github) score += 2;
      if (profile.socialLinks.linkedin) score += 3;
    }
    return Math.min(score, 100);
  }

  function computeRating(score) {
    return (score / 20).toFixed(1);
  }

  function renderStars(rating) {
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.3 && rating - full < 0.8;
    const empty = 5 - full - (hasHalf ? 1 : 0);
    return [
      ...Array(full).fill('<span class="star filled">★</span>'),
      ...(hasHalf ? ['<span class="star half">★</span>'] : []),
      ...Array(empty).fill('<span class="star empty">☆</span>'),
    ].join('');
  }

  function getProjectsForStudent(profile) {
    // Projects don't have userId tied, so show all (demo data).
    // In a real app you'd filter by userId.
    return allProjects.slice(0, 3);
  }

  function getProgress(profile) {
    let filled = 0;
    const fields = ['name', 'email', 'tagline', 'bio', 'location', 'avatar'];
    fields.forEach(f => { if (profile[f]) filled++; });
    if (profile.skills && profile.skills.length > 0) filled++;
    if (profile.internship && profile.internship.company) filled++;
    if (profile.socialLinks && (profile.socialLinks.github || profile.socialLinks.linkedin)) filled++;
    return Math.round((filled / (fields.length + 3)) * 100);
  }

  // ── Render cards ──
  function renderAllCards() {
    const profileList = Object.values(Storage.getProfiles());
    if (profileList.length === 0) {
      studentsContainer.innerHTML = `
        <div class="students-empty">
          <div class="students-empty-icon">👥</div>
          <p>No intern profiles found. Add an intern using the button above.</p>
        </div>`;
    } else {
      studentsContainer.innerHTML = profileList.map((profile, i) => buildStudentCardHTML(profile, i)).join('');
    }
  }

  function buildStudentCardHTML(profile, i) {
    const score = computeScore(profile);
    const rating = computeRating(score);
    const progress = getProgress(profile);
    const projects = getProjectsForStudent(profile);
    const scoreDeg = Math.round((score / 100) * 360);
    const initial = (profile.name || profile.userId || '?')[0].toUpperCase();
    const hasPic = !!profile.avatar;

    return `
      <div class="student-card anim-fadeInUp ${projectIndices[profile.userId] !== undefined ? 'expanded' : ''}" 
           style="animation-delay: ${i * 80}ms" id="card-${profile.userId}" data-uid="${profile.userId}">
        <!-- Summary row -->
        <div class="student-summary" role="button" tabindex="0" aria-expanded="false" aria-controls="details-${profile.userId}"
             onclick="toggleCard('${profile.userId}')">

          <!-- Avatar -->
          <div class="student-avatar" aria-hidden="true">
            ${hasPic
        ? `<img src="${profile.avatar}" alt="${profile.name || 'Student'} avatar">`
        : `<span class="student-avatar-initials">${initial}</span>`}
          </div>

          <!-- Name + role -->
          <div class="student-identity">
            <div class="student-name">${profile.name || 'Unnamed Intern'}</div>
            <div class="student-role-tag">${profile.internship?.role || 'Intern'} ${profile.internship?.company ? '@ ' + profile.internship.company : ''}</div>
          </div>

          <!-- Star Rating -->
          <div class="student-rating" aria-label="Rating ${rating} out of 5">
            <div class="stars">${renderStars(parseFloat(rating))}</div>
            <span class="rating-value">${rating}</span>
          </div>

          <!-- Score ring -->
          <div class="student-score" aria-label="Overall score ${score}">
            <div class="score-ring" style="--score-deg: ${scoreDeg}deg">
              <span class="score-num">${score}%</span>
            </div>
          </div>

          <!-- Expand arrow -->
          <button class="expand-btn" aria-label="Expand student details" tabindex="-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <!-- Expanded details panel -->
        <div class="student-details" id="details-${profile.userId}" ${projectIndices[profile.userId] !== undefined ? '' : 'aria-hidden="true"'}>
          <div class="student-details-inner">
            <div class="student-details-body">

              <!-- Left: Profile info + Progress -->
              <div class="detail-section">
                <div class="detail-section-title">Profile Info</div>
                <div class="meta-badges-vertical">
                  ${profile.location ? `
                  <div class="hero-meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    ${profile.location}
                  </div>` : ''}
                  ${profile.email ? `
                  <div class="hero-meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    ${profile.email}
                  </div>` : ''}
                  ${profile.socialLinks?.github ? `
                  <a class="hero-meta-item" href="${profile.socialLinks.github}" target="_blank" rel="noopener">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    GitHub Profile
                  </a>` : ''}
                  ${profile.socialLinks?.linkedin ? `
                  <a class="hero-meta-item" href="${profile.socialLinks.linkedin}" target="_blank" rel="noopener">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn Profile
                  </a>` : ''}
                </div>

                <!-- Profile progress -->
                <div class="progress-wrap">
                  <div class="progress-label">
                    <span>Profile Completion</span>
                    <span>${progress}%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" style="width:${progress}%"></div>
                  </div>
                </div>

                <!-- Skills -->
                ${profile.skills && profile.skills.length ? `
                <div class="detail-section-title" style="margin-top:var(--sp-3)">Skills</div>
                <div class="skills-chips">
                  ${profile.skills.map(s => `<span class="skill-chip">${s}</span>`).join('')}
                </div>` : ''}
              </div>

              <!-- Right: Projects Progress -->
              <div class="detail-section">
                <div class="detail-section-title" style="display:flex;justify-content:space-between;align-items:center">
                  Project Progress
                  ${projects.length > 1 ? `
                  <button class="nav-arrow nav-arrow-sm" onclick="event.stopPropagation(); nextAdminProj('${profile.userId}')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>` : ''}
                </div>
                
                ${projects.length > 0 ? (() => {
        const idx = projectIndices[profile.userId] || 0;
        const curr = projects[idx];
        const updates = curr.updates || [];
        return `
                  <div class="project-progress-card admin-view">
                    <div class="pp-header">
                      <div>
                        <div class="pp-title" style="font-size:var(--fs-sm)">${curr.title}</div>
                        <div class="pp-status-row">
                          <span class="pp-status-badge ${(curr.status || 'Ongoing').toLowerCase()}">${curr.status || 'Ongoing'}</span>
                          <span class="pp-date">Started ${new Date(curr.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div class="pp-updates-list" style="max-height:180px;overflow-y:auto">
                      ${updates.length > 0
            ? updates.map(u => `
                        <div class="pp-update-item">
                          <div class="pp-update-dot"></div>
                          <div class="pp-update-content">
                            <div class="pp-update-time" style="font-size:9px">${new Date(u.date).toLocaleDateString()}</div>
                            <div class="pp-update-text" style="font-size:var(--fs-xs)">${u.text}</div>
                          </div>
                        </div>`).join('')
            : '<div class="text-muted text-xs">No progress updates.</div>'}
                    </div>
                  </div>`;
      })() : '<p class="text-muted text-xs">No projects yet.</p>'}
              </div>

                <!-- Overall score display -->
                <div class="progress-wrap" style="margin-top:var(--sp-4)">
                  <div class="progress-label">
                    <span>Overall Score</span>
                    <span>${score}%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" style="width:${score}%"></div>
                  </div>
                </div>

                <!-- Task rating -->
                <div class="detail-section-title" style="margin-top:var(--sp-4)">Task Rating</div>
                <div class="detail-row">
                  <span class="detail-row-label">Rating</span>
                  <div class="student-rating">
                    <div class="stars">${renderStars(parseFloat(rating))}</div>
                    <span class="rating-value">${rating} / 5</span>
                  </div>
                </div>
              </div>

              <!-- Edit Profile + Analytics buttons -->
              <div class="detail-edit-row" style="display:flex;gap:8px;flex-wrap:wrap">
                <a href="profile-builder.html?student=${profile.userId}"
                   class="btn btn-primary btn-sm edit-profile-btn"
                   aria-label="Edit profile for ${profile.name || 'this student'}">
                  ✏️ Edit Profile
                </a>
                <a href="student-analytics.html?student=${profile.userId}"
                   class="btn btn-secondary btn-sm"
                   aria-label="View analytics for ${profile.name || 'this student'}">
                  📊 Analytics
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>`;
  }

  renderAllCards();

  // ── Toggle expand/collapse ──
  window.toggleCard = function (uid) {
    const card = document.getElementById(`card-${uid}`);
    const details = document.getElementById(`details-${uid}`);
    const summary = card.querySelector('.student-summary');

    const isExpanded = card.classList.contains('expanded');
    card.classList.toggle('expanded', !isExpanded);
    details.setAttribute('aria-hidden', String(isExpanded));
  };

  window.nextAdminProj = function (uid) {
    const studentProjects = Storage.getProjects().filter(p => p.ownerId === uid);
    if (!studentProjects.length) return;

    projectIndices[uid] = ((projectIndices[uid] || 0) + 1) % studentProjects.length;

    // Re-render all cards to update the project display for the specific student
    renderAllCards();
  };

  // Keyboard support
  document.querySelectorAll('.student-summary').forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  // ── Sidebar toggle ──
  function openSidebar() {
    appSidebar.classList.add('open');
    sidebarOverlay.classList.add('visible');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    appSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('visible');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
  hamburgerBtn.addEventListener('click', () => {
    appSidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  sidebarOverlay.addEventListener('click', closeSidebar);

  // ── Logout ──
  logoutBtn.addEventListener('click', () => Auth.logout());

})();
=======
/**
 * InternTrack — Students Page Logic
 * Shows all intern student cards with expandable details.
 */

'use strict';

(() => {
  // Guard: admin only
  const session = Auth.requireAuth();
  if (!session) return;

  if (session.role !== 'admin') {
    window.location.href = 'dashboard.html';
    return;
  }

  // ── DOM refs ──
  const sidebarNav = document.getElementById('sidebar-nav');
  const userAvatarSb = document.getElementById('user-avatar-sidebar');
  const userNameSb = document.getElementById('user-name-sidebar');
  const userRoleSb = document.getElementById('user-role-sidebar');
  const welcome = document.getElementById('welcome-title');
  const welcomeSub = document.getElementById('welcome-sub');
  const roleBanner = document.getElementById('role-banner');
  const roleBadgeMain = document.getElementById('role-badge-main');
  const topbarRoleBadge = document.getElementById('topbar-role-badge');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const appSidebar = document.getElementById('app-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const logoutBtn = document.getElementById('logout-btn');
  const studentsContainer = document.getElementById('students-container');
  const studentsCountEl = document.getElementById('students-count');
  const projectIndices = {}; // Track current project index per student

  // ── User info ──
  const adminProfile = Storage.getAdminProfile ? Storage.getAdminProfile(session.userId) : null;
  const currentName = adminProfile?.name || session.displayName;

  if (adminProfile?.avatar) {
    userAvatarSb.innerHTML = `<img src="${adminProfile.avatar}" alt="${currentName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  } else {
    userAvatarSb.textContent = currentName[0].toUpperCase();
  }
  userNameSb.textContent = currentName;
  userRoleSb.textContent = adminProfile?.role || 'Administrator';

  welcome.textContent = `Intern Roster`;
  welcomeSub.textContent = 'Review intern profiles, performance metrics, and project contributions.';
  roleBanner.classList.add('admin');

  ['badge-admin', 'badge-user'].forEach(c => {
    roleBadgeMain.classList.remove(c);
    topbarRoleBadge.classList.remove(c);
  });
  roleBadgeMain.textContent = 'Admin';
  roleBadgeMain.className = 'badge badge-admin';
  topbarRoleBadge.textContent = 'Admin';
  topbarRoleBadge.className = 'badge badge-admin';

  // ── Sidebar nav ──
  const NAV = [
    { label: 'Dashboard', href: 'dashboard.html', icon: '⊞' },
    { label: 'My Profile', href: 'admin-profile.html', icon: '👤' },
    { label: 'Interns', href: 'students.html', icon: '👥', active: true },
    { label: 'Projects', href: 'projects.html', icon: '🗂️' },
  ];

  let navHTML = `<div class="nav-section-label">Menu</div>`;
  NAV.forEach(item => {
    navHTML += `
      <a class="nav-item${item.active ? ' active' : ''}" href="${item.href}" aria-current="${item.active ? 'page' : 'false'}">
        <span class="nav-icon" aria-hidden="true">${item.icon}</span>
        <span>${item.label}</span>
      </a>`;
  });
  sidebarNav.innerHTML = navHTML;

  // ── Load data ──
  const profiles = Storage.getProfiles();
  const allProjects = Storage.getProjects();
  const profileList = Object.values(profiles);

  studentsCountEl.textContent = `${profileList.length} intern${profileList.length !== 1 ? 's' : ''}`;

  // ── Helpers ──
  function computeScore(profile) {
    let score = 50;
    if (profile.skills && profile.skills.length) score += Math.min(profile.skills.length * 3, 20);
    if (profile.bio && profile.bio.length > 40) score += 10;
    if (profile.internship && profile.internship.company) score += 10;
    if (profile.avatar) score += 5;
    if (profile.socialLinks) {
      if (profile.socialLinks.github) score += 2;
      if (profile.socialLinks.linkedin) score += 3;
    }
    return Math.min(score, 100);
  }

  function computeRating(score) {
    return (score / 20).toFixed(1);
  }

  function renderStars(rating) {
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.3 && rating - full < 0.8;
    const empty = 5 - full - (hasHalf ? 1 : 0);
    return [
      ...Array(full).fill('<span class="star filled">★</span>'),
      ...(hasHalf ? ['<span class="star half">★</span>'] : []),
      ...Array(empty).fill('<span class="star empty">☆</span>'),
    ].join('');
  }

  function getProjectsForStudent(profile) {
    // Projects don't have userId tied, so show all (demo data).
    // In a real app you'd filter by userId.
    return allProjects.slice(0, 3);
  }

  function getProgress(profile) {
    let filled = 0;
    const fields = ['name', 'email', 'tagline', 'bio', 'location', 'avatar'];
    fields.forEach(f => { if (profile[f]) filled++; });
    if (profile.skills && profile.skills.length > 0) filled++;
    if (profile.internship && profile.internship.company) filled++;
    if (profile.socialLinks && (profile.socialLinks.github || profile.socialLinks.linkedin)) filled++;
    return Math.round((filled / (fields.length + 3)) * 100);
  }

  // ── Render cards ──
  function renderAllCards() {
    const profileList = Object.values(Storage.getProfiles());
    if (profileList.length === 0) {
      studentsContainer.innerHTML = `
        <div class="students-empty">
          <div class="students-empty-icon">👥</div>
          <p>No intern profiles found. Add an intern using the button above.</p>
        </div>`;
    } else {
      studentsContainer.innerHTML = profileList.map((profile, i) => buildStudentCardHTML(profile, i)).join('');
    }
  }

  function buildStudentCardHTML(profile, i) {
    const score = computeScore(profile);
    const rating = computeRating(score);
    const progress = getProgress(profile);
    const projects = getProjectsForStudent(profile);
    const scoreDeg = Math.round((score / 100) * 360);
    const initial = (profile.name || profile.userId || '?')[0].toUpperCase();
    const hasPic = !!profile.avatar;
    const now = Date.now();
    const isSuspended = profile.suspendedUntil && profile.suspendedUntil > now;

    return `
      <div class="student-card anim-fadeInUp ${projectIndices[profile.userId] !== undefined ? 'expanded' : ''} ${isSuspended ? 'suspended' : ''}" 
           style="animation-delay: ${i * 80}ms" id="card-${profile.userId}" data-uid="${profile.userId}">
        <!-- Summary row -->
        <div class="student-summary" role="button" tabindex="0" aria-expanded="false" aria-controls="details-${profile.userId}"
             onclick="toggleCard('${profile.userId}')">

          <!-- Name + role -->
          <div class="student-identity">
            <div class="student-name">
              ${profile.name || 'Unnamed Intern'}
              ${Storage.getInternRank ? (() => {
        const rank = Storage.getInternRank(profile.userId);
        return rank ? `<span class="intern-rank-badge">#${rank}</span>` : '';
      })() : ''}
            </div>
            <div class="student-role-tag">${profile.internship?.role || 'Intern'} ${profile.internship?.company ? '@ ' + profile.internship.company : ''}</div>
          </div>

          ${isSuspended ? `<div class="suspended-badge">Suspended</div>` : ''}

          <!-- Star Rating -->
          <div class="student-rating" aria-label="Rating ${rating} out of 5">
            <div class="stars">${renderStars(parseFloat(rating))}</div>
            <span class="rating-value">${rating}</span>
          </div>

          <!-- Score ring -->
          <div class="student-score" aria-label="Overall score ${score}">
            <div class="score-ring" style="--score-deg: ${scoreDeg}deg">
              <span class="score-num">${score}%</span>
            </div>
          </div>

          <!-- Expand arrow -->
          <button class="expand-btn" aria-label="Expand student details" tabindex="-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <!-- Expanded details panel -->
        <div class="student-details" id="details-${profile.userId}" ${projectIndices[profile.userId] !== undefined ? '' : 'aria-hidden="true"'}>
          <div class="student-details-inner">
            <div class="student-details-body">

              <!-- Left Column -->
              <div class="detail-column">
                <div class="detail-group">
                  <div class="detail-section-title">Profile Info</div>
                  <div class="meta-badges-vertical">
                    ${profile.location ? `
                    <div class="hero-meta-item">
                      <span class="meta-icon">📍</span>
                      <span class="meta-text">${profile.location}</span>
                    </div>` : ''}
                    ${profile.email ? `
                    <div class="hero-meta-item">
                      <span class="meta-icon">✉️</span>
                      <span class="meta-text">${profile.email}</span>
                    </div>` : ''}
                    ${profile.socialLinks?.github ? `
                    <a class="hero-meta-item clickable" href="${profile.socialLinks.github}" target="_blank">
                      <span class="meta-icon">🔗</span>
                      <span class="meta-text">GitHub Profile</span>
                    </a>` : ''}
                    ${profile.socialLinks?.linkedin ? `
                    <a class="hero-meta-item clickable" href="${profile.socialLinks.linkedin}" target="_blank">
                      <span class="meta-icon">💼</span>
                      <span class="meta-text">LinkedIn Profile</span>
                    </a>` : ''}
                  </div>
                </div>

                <div class="detail-group">
                  <div class="detail-section-title">Profile Completion</div>
                  <div class="progress-wrap">
                    <div class="progress-label">
                      <span>Completion Status</span>
                      <span class="count-up" data-target="${progress}">${progress}%</span>
                    </div>
                    <div class="progress-track">
                      <div class="progress-fill" style="width:${progress}%"></div>
                    </div>
                  </div>
                </div>

                ${profile.skills?.length ? `
                <div class="detail-group">
                  <div class="detail-section-title">Skills</div>
                  <div class="skills-chips">
                    ${profile.skills.map(s => `<span class="skill-chip">${s}</span>`).join('')}
                  </div>
                </div>` : ''}

                <div class="detail-group">
                  <div class="detail-section-title">Overall Score</div>
                  <div class="progress-wrap">
                    <div class="progress-label">
                      <span>Performance Metrics</span>
                      <span class="count-up" data-target="${score}">${score}%</span>
                    </div>
                    <div class="progress-track">
                      <div class="progress-fill" style="width:${score}%"></div>
                    </div>
                  </div>
                </div>

                <div class="detail-group">
                  <div class="detail-section-title">Task Rating</div>
                  <div class="rating-display-row">
                    <span class="rating-label">Average Rating</span>
                    <div class="student-rating">
                      <div class="stars">${renderStars(parseFloat(rating))}</div>
                      <span class="rating-value">${rating} / 5</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="detail-column">
                <div class="detail-group">
                  <div class="detail-section-title" style="display:flex;justify-content:space-between;align-items:center">
                    Project Progress
                    ${projects.length > 1 ? `
                    <div class="project-nav-container">
                      <button class="nav-arrow nav-arrow-sm" onclick="event.stopPropagation(); prevAdminProj('${profile.userId}')" title="Previous Project">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      <span class="project-counter">${(projectIndices[profile.userId] || 0) + 1} / ${projects.length}</span>
                      <button class="nav-arrow nav-arrow-sm" onclick="event.stopPropagation(); nextAdminProj('${profile.userId}')" title="Next Project">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    </div>` : ''}
                  </div>
                  ${projects.length > 0 ? (() => {
        const idx = projectIndices[profile.userId] || 0;
        const curr = projects[idx];
        return `
                    <div class="project-progress-card admin-view">
                      <div class="pp-header">
                        <div class="pp-title">${curr.title}</div>
                        <div class="pp-status-row">
                          <span class="pp-status-badge ${(curr.status || 'Ongoing').toLowerCase()}">${curr.status || 'Ongoing'}</span>
                          <span class="pp-date">Started ${new Date(curr.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      ${curr.updates?.length ? `
                      <div class="pp-updates-list">
                        ${curr.updates.slice(0, 1).map(u => `
                          <div class="pp-update-item">
                            <div class="pp-update-text">${u.text}</div>
                          </div>`).join('')}
                      </div>` : '<div class="text-dim text-xs">No progress updates.</div>'}
                    </div>`;
      })() : '<div class="text-dim text-xs">No active projects.</div>'}
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="detail-edit-row">
                <div class="detail-actions-left">
                  <button onclick="event.stopPropagation(); suspendStudent('${profile.userId}')" class="btn btn-warning btn-sm btn-magnetic">🚫 Suspend</button>
                  <button onclick="event.stopPropagation(); deleteStudent('${profile.userId}')" class="btn btn-danger btn-sm btn-magnetic">🗑️ Delete</button>
                </div>
                <div class="detail-actions-right">
                  <a href="profile-builder.html?student=${profile.userId}" class="btn btn-secondary btn-sm btn-magnetic">✏️ Edit Profile</a>
                  <a href="student-analytics.html?student=${profile.userId}" class="btn btn-primary btn-sm btn-magnetic">📊 Analytics</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>`;
  }

  renderAllCards();

  // ── Toggle expand/collapse ──
  window.toggleCard = function (uid) {
    const card = document.getElementById(`card-${uid}`);
    const details = document.getElementById(`details-${uid}`);

    const isExpanded = card.classList.contains('expanded');
    card.classList.toggle('expanded', !isExpanded);
    details.setAttribute('aria-hidden', String(isExpanded));

    if (!isExpanded) {
      // Trigger count-up animation for scores when opening
      setTimeout(() => {
        animateNumbers(details);
      }, 100);
    }
  };

  /**
   * Animates numbers from 0 to target
   */
  function animateNumbers(container) {
    const counters = container.querySelectorAll('.count-up');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      if (isNaN(target)) return;

      let count = 0;
      const duration = 1500; // 1.5s
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out exponential
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        count = Math.floor(easeProgress * target);

        counter.textContent = count + (counter.dataset.suffix || '%');

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      requestAnimationFrame(update);
    });
  }

  window.nextAdminProj = function (uid) {
    const studentProjects = Storage.getProjects().filter(p => p.ownerId === uid);
    if (!studentProjects.length) return;

    // Animate current project out
    const cardContent = document.querySelector(`#details-${uid} .project-progress-card`);
    if (cardContent) cardContent.style.opacity = '0';

    setTimeout(() => {
      projectIndices[uid] = ((projectIndices[uid] || 0) + 1) % studentProjects.length;
      renderAllCards();

      // Finalize will re-render, so we need to ensure the new one fades in
      // renderAllCards() will recreate the element, so we'll need a way to track it or just let the re-render handle it
    }, 150);
  };

  window.prevAdminProj = function (uid) {
    const studentProjects = Storage.getProjects().filter(p => p.ownerId === uid);
    if (!studentProjects.length) return;

    const cardContent = document.querySelector(`#details-${uid} .project-progress-card`);
    if (cardContent) cardContent.style.opacity = '0';

    setTimeout(() => {
      const curr = projectIndices[uid] || 0;
      projectIndices[uid] = (curr - 1 + studentProjects.length) % studentProjects.length;
      renderAllCards();
    }, 150);
  };

  window.suspendStudent = function (uid) {
    const profile = Storage.getProfile(uid);
    if (!profile) return;

    const confirmMsg = `Are you sure you want to suspend ${profile.name || 'this intern'}?`;
    if (!confirm(confirmMsg)) return;

    const daysStr = prompt(`How many days should ${profile.name || 'this intern'} be suspended?`, "7");
    const days = parseInt(daysStr);

    if (isNaN(days) || days <= 0) {
      alert("Please enter a valid number of days.");
      return;
    }

    const suspendedUntil = Date.now() + (days * 24 * 60 * 60 * 1000);
    profile.suspendedUntil = suspendedUntil;
    Storage.saveProfile(uid, profile);

    renderAllCards();
    alert(`${profile.name || 'Intern'} has been suspended for ${days} days.`);
  };

  window.deleteStudent = function (uid) {
    const profile = Storage.getProfile(uid);
    if (!profile) return;

    const confirmMsg = `CRITICAL: Are you sure you want to DELETE ${profile.name || 'this intern'}? This action cannot be undone and will remove all their projects.`;
    if (!confirm(confirmMsg)) return;

    if (Storage.deleteProfile(uid)) {
      renderAllCards();
      // Update count
      const profiles = Storage.getProfiles();
      const count = Object.keys(profiles).length;
      studentsCountEl.textContent = `${count} intern${count !== 1 ? 's' : ''}`;
      alert("Intern profile deleted successfully.");
    }
  };

  // Keyboard support
  document.querySelectorAll('.student-summary').forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  // ── Sidebar toggle ──
  function openSidebar() {
    appSidebar.classList.add('open');
    sidebarOverlay.classList.add('visible');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    appSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('visible');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
  hamburgerBtn.addEventListener('click', () => {
    appSidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  sidebarOverlay.addEventListener('click', closeSidebar);

  // ── Logout ──
  logoutBtn.addEventListener('click', () => Auth.logout());

  // ── Init Animations ──
  if (typeof initMagneticButtons === 'function') initMagneticButtons();
  if (typeof init3DTilt === 'function') init3DTilt();
  if (typeof initScrollReveals === 'function') initScrollReveals();
  if (typeof initTextReveals === 'function') initTextReveals();

})();
>>>>>>> 199b10f (added new files)
