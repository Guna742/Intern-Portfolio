/**
 * InternTrack — Dashboard Logic
 * Role-aware render, animated counters, sidebar, toasts.
 */

'use strict';

(() => {
  // Guard: require any authenticated user
  const session = Auth.requireAuth();
  if (!session) return;

  const isAdmin = session.role === 'admin';

  // ── DOM refs ──
  const sidebarNav = document.getElementById('sidebar-nav');
  const userAvatarSb = document.getElementById('user-avatar-sidebar');
  const userNameSb = document.getElementById('user-name-sidebar');
  const userRoleSb = document.getElementById('user-role-sidebar');
  const statsGrid = document.getElementById('stats-grid');
  const quickActions = document.getElementById('quick-actions');
  const recentProjList = document.getElementById('recent-projects-list');
  const welcomeTitle = document.getElementById('welcome-title');
  const welcomeSub = document.getElementById('welcome-sub');
  const roleBanner = document.getElementById('role-banner');
  const roleBadgeMain = document.getElementById('role-badge-main');
  const topbarRoleBadge = document.getElementById('topbar-role-badge');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const appSidebar = document.getElementById('app-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const logoutBtn = document.getElementById('logout-btn');

  // ── Populate user info ──
  const adminProfile = isAdmin ? (Storage.getAdminProfile ? Storage.getAdminProfile(session.userId) : null) : null;
  const userProfile = !isAdmin ? Storage.getProfile(session.userId) : null;
  const currentName = (isAdmin ? adminProfile?.name : userProfile?.name) || session.displayName;
<<<<<<< HEAD

  if (userAvatarSb) userAvatarSb.textContent = currentName[0].toUpperCase();
  if (userNameSb) userNameSb.textContent = currentName;
  if (userRoleSb) userRoleSb.textContent = isAdmin ? 'Administrator' : 'Intern';

  // Role banner
  if (welcomeTitle) welcomeTitle.textContent = `Welcome back, ${currentName}!`;
  if (welcomeSub) welcomeSub.textContent = isAdmin
    ? 'You have full admin access. Build profiles and manage intern performance.'
    : 'Track your performance and explore your project workspace.';
  if (roleBanner) roleBanner.classList.add(session.role);
=======
  const currentAvatar = isAdmin ? adminProfile?.avatar : userProfile?.avatar;

  if (userAvatarSb) {
    if (currentAvatar) {
      userAvatarSb.innerHTML = `<img src="${currentAvatar}" alt="${currentName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
    } else {
      userAvatarSb.textContent = currentName[0].toUpperCase();
    }
  }
  if (userNameSb) userNameSb.textContent = currentName;
  if (userRoleSb) userRoleSb.textContent = isAdmin ? (adminProfile?.role || 'Administrator') : 'Intern';

  // Role banner
  if (welcomeTitle) {
    welcomeTitle.innerHTML = `<span class="anim-title"><span>Welcome back, ${currentName}!</span></span>`;
  }
  if (welcomeSub) {
    welcomeSub.innerHTML = `<span class="anim-reveal" style="display:block; animation-delay: 0.1s">${isAdmin
      ? 'You have full admin access. Build profiles and manage intern performance.'
      : 'Track your performance and explore your project workspace.'}</span>`;
  }
  if (roleBanner) {
    roleBanner.classList.add(session.role);
    roleBanner.classList.add('anim-reveal');
  }
>>>>>>> 199b10f (added new files)

  const roleBadgeClass = isAdmin ? 'badge-admin' : 'badge-user';
  [roleBadgeMain, topbarRoleBadge].forEach(el => {
    el.textContent = isAdmin ? 'Admin' : 'Intern';
    el.className = `badge ${roleBadgeClass}`;
  });

  // ── Build Sidebar Nav ──
  const NAV_INTERN = [
    { label: 'Dashboard', href: 'dashboard.html', icon: '⊞', active: true },
    { label: 'My Profile', href: 'student-profile.html', icon: '👤' },
<<<<<<< HEAD
    { label: 'My Analytics', href: `student-analytics.html?student=${session.userId}`, icon: '📊' },
    { label: 'Projects', href: 'projects.html', icon: '🗂️' },
  ];
  const NAV_ADMIN = [
    { label: 'Dashboard', href: 'dashboard.html', icon: '⊞', active: true },
    { label: 'My Profile', href: 'admin-profile.html', icon: '👤' },
    { label: 'Interns', href: 'students.html', icon: '🎓' },
=======
    { label: 'Leaderboard', href: 'leaderboard.html', icon: '🏆' },
    { label: 'My Analytics', href: `student-analytics.html?student=${session.userId}`, icon: '📊' },
    { label: 'Projects', href: 'projects.html', icon: '🗂️' },
  ];

  const NAV_ADMIN = [
    { label: 'Dashboard', href: 'dashboard.html', icon: '⊞', active: true },
    { label: 'My Profile', href: 'admin-profile.html', icon: '👤' },
    { label: 'Interns', href: 'students.html', icon: '👥' },
>>>>>>> 199b10f (added new files)
    { label: 'Projects', href: 'projects.html', icon: '🗂️' },
  ];

  const navItems = isAdmin ? NAV_ADMIN : NAV_INTERN;

  let navHTML = `<div class="nav-section-label">Menu</div>`;
  navItems.forEach(item => {
    navHTML += `
      <a class="nav-item${item.active ? ' active' : ''}" href="${item.href}" aria-current="${item.active ? 'page' : 'false'}">
        <span class="nav-icon" aria-hidden="true">${item.icon}</span>
        <span>${item.label}</span>
      </a>`;
  });
  sidebarNav.innerHTML = navHTML;

  // ── Stats ──
  const projects = Storage.getProjects();
  const profile = Storage.getProfile(session.userId) || { skills: [] };

  const STATS_ADMIN = [
<<<<<<< HEAD
    { label: 'Total Projects', value: projects.length, icon: '🗂️', color: 'accent', trend: '+2 this week', clickable: true },
    { label: 'Interns', value: Object.keys(Storage.getProfiles()).length, icon: '👥', color: 'cyan', trend: 'Active' },
=======
    { label: 'Total Projects', value: projects.length, icon: '🗂️', color: 'accent', trend: '+2 this week', clickable: true, href: 'projects.html' },
    { label: 'Interns', value: Object.keys(Storage.getProfiles()).length, icon: '👥', color: 'cyan', trend: 'Active', clickable: true, href: 'students.html' },
>>>>>>> 199b10f (added new files)
    { label: 'Avg Skills', value: 8, icon: '⚡', color: 'violet', trend: 'Growing' },
    { label: 'Completion', value: 87, suffix: '%', icon: '✅', color: 'success', trend: '+5% week' },
  ];
  const STATS_USER = [
<<<<<<< HEAD
    { label: 'My Projects', value: projects.length, icon: '🗂️', color: 'accent', trend: 'Active', clickable: true },
    { label: 'Skills', value: profile.skills.length, icon: '⚡', color: 'cyan', trend: 'Listed' },
    { label: 'Internship', value: 1, icon: '🏢', color: 'violet', trend: 'In progress' },
    { label: 'Days Left', value: 42, icon: '📅', color: 'success', trend: 'On track' },
=======
    { label: 'My Projects', value: projects.length, icon: '🗂️', color: '#8b5cf6', trend: 'Active', clickable: true, href: 'projects.html' },
    { label: 'Skills', value: profile.skills.length, icon: '⚡', color: '#22d3ee', trend: 'Listed' },
    { label: 'Internship', value: 1, icon: '🏢', color: '#a855f7', trend: 'In progress' },
    { label: 'Days Left', value: 42, icon: '📅', color: '#10b981', trend: 'On track' },
>>>>>>> 199b10f (added new files)
  ];

  const stats = isAdmin ? STATS_ADMIN : STATS_USER;

  statsGrid.innerHTML = stats.map((s, i) => `
<<<<<<< HEAD
    <div class="stat-card c-${s.color} anim-fadeInUp anim-d${i + 1} ${s.clickable ? 'clickable-stat' : ''}" 
         role="figure" aria-label="${s.label}: ${s.value}${s.suffix || ''}"
         ${s.clickable ? 'onclick="window.location.href=\'projects.html\'"' : ''}>
      <div class="stat-icon c-${s.color}" aria-hidden="true">${s.icon}</div>
      <div class="stat-value">
        <span class="counter-num" data-target="${s.value}">${s.value}</span>
        ${s.suffix ? `<span class="stat-suffix">${s.suffix}</span>` : ''}
      </div>
      <div class="stat-label">${s.label}</div>
      <span class="stat-trend">${s.trend}</span>
    </div>
  `).join('');

=======
    <div class="stat-card reveal anim-d${i + 1} card-3d ${s.clickable ? 'clickable-stat' : ''}" 
         role="figure" aria-label="${s.label}: ${s.value}${s.suffix || ''}"
         ${s.clickable ? `onclick="window.location.href='${s.href}'"` : ''}>
      <div class="glare" aria-hidden="true"></div>
      <div class="stat-card-head">
          <div class="stat-card-label">${s.label}</div>
          <div class="stat-card-icon" style="background:${s.color}20" aria-hidden="true">${s.icon}</div>
      </div>
      <div class="stat-card-value">
        <span class="counter-num" data-target="${s.value}">${s.value}</span>
        ${s.suffix ? `<span class="stat-suffix">${s.suffix}</span>` : ''}
      </div>
      <div class="stat-card-trend up">
        ${arrowUp()}
        <span class="trend-text">${s.trend}</span>
      </div>
      ${sparklineSVG(s.color)}
    </div>
  `).join('');

  function sparklineSVG(color = '#8b5cf6') {
    return `
    <svg class="stat-sparkline" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0 35 Q 15 35, 25 25 T 50 15 T 75 25 T 100 5" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke" />
        <path d="M0 35 Q 15 35, 25 25 T 50 15 T 75 25 T 100 5 L 100 40 L 0 40 Z" fill="${color}" fill-opacity="0.1" />
    </svg>`;
  }

  function arrowUp() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  }

>>>>>>> 199b10f (added new files)
  // Animated counters
  function animateCounters() {
    document.querySelectorAll('.counter-num').forEach(el => {
      const target = parseInt(el.dataset.target, 10) || 0;
      if (target === 0) {
        el.textContent = '0';
        return;
      }
      const duration = 1000;
      const start = performance.now();
      const step = now => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  // Start animation after a short delay to ensure rendering
  setTimeout(animateCounters, 100);

  // ── Quick Actions ──
  const ACTIONS_ADMIN = [
    { label: 'Profile Builder', desc: 'Edit intern profile', href: 'profile-builder.html', icon: '✏️', color: 'rgba(79,124,255,.12)' },
    { label: 'All Projects', desc: 'Browse showcase', href: 'projects.html', icon: '🗂️', color: 'rgba(168,85,247,.08)' },
    { label: 'Intern Roster', desc: 'View intern details', href: 'students.html', icon: '🎓', color: 'rgba(34,211,238,.1)' },
  ];
  const ACTIONS_USER = [
    { label: 'My Profile', desc: 'View your portfolio', href: 'student-profile.html', icon: '👤', color: 'rgba(34,211,238,.08)' },
    { label: 'My Analytics', desc: 'Track your performance', href: `student-analytics.html?student=${session.userId}`, icon: '📊', color: 'rgba(139,92,246,.12)' },
    { label: 'Projects', desc: 'Browse all projects', href: 'projects.html', icon: '🗂️', color: 'rgba(79,124,255,.12)' },
  ];
  // Also update admin action to link to admin profile
  ACTIONS_ADMIN.unshift({ label: 'My Profile', desc: 'Admin profile & stats', href: 'admin-profile.html', icon: '👤', color: 'rgba(245,158,11,.1)' });

  const actions = isAdmin ? ACTIONS_ADMIN : ACTIONS_USER;
  quickActions.innerHTML = actions.map(a => `
<<<<<<< HEAD
    <a class="action-tile" href="${a.href}" aria-label="${a.label} — ${a.desc}">
      <div class="action-icon" style="background:${a.color}" aria-hidden="true">${a.icon}</div>
      <div class="action-label">${a.label}</div>
      <div class="action-desc">${a.desc}</div>
=======
    <a class="action-tile btn-magnetic" href="${a.href}" aria-label="${a.label} — ${a.desc}">
      <div class="action-icon" style="background:${a.color}" aria-hidden="true">${a.icon}</div>
      <div class="action-content">
        <div class="action-label">${a.label}</div>
        <div class="action-desc">${a.desc}</div>
      </div>
>>>>>>> 199b10f (added new files)
      <svg class="arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </a>
  `).join('');

  // ── Recent Projects ──
  const recent = projects.slice(0, 4);
  if (recent.length === 0) {
    recentProjList.innerHTML = `<p class="text-muted text-sm" style="padding:var(--sp-4) 0">No projects yet.</p>`;
  } else {
<<<<<<< HEAD
    recentProjList.innerHTML = recent.map(p => `
      <div class="proj-item">
        <div class="proj-thumb" aria-hidden="true">
=======
    recentProjList.innerHTML = recent.map((p, i) => `
      <div class="proj-item anim-stagger card-3d" style="transition-delay: ${i * 0.15}s">
        <div class="glare" aria-hidden="true"></div>
        <div class="proj-thumb" style="background:${p.screenshot ? 'none' : (['#4285F4', '#34A853', '#EA4335', '#FBBC05'][i % 4])}" aria-hidden="true">
>>>>>>> 199b10f (added new files)
          ${p.screenshot
        ? `<img src="${p.screenshot}" alt="${p.title} thumbnail">`
        : p.title[0]}
        </div>
        <div class="proj-info">
          <div class="proj-name">${p.title}</div>
          <div class="proj-tech">${(p.techStack || []).slice(0, 3).join(' · ')}</div>
        </div>
<<<<<<< HEAD
        ${p.liveLink ? `<a class="proj-link" href="${p.liveLink}" target="_blank" rel="noopener" aria-label="Live demo for ${p.title}">Live ↗</a>` : ''}
      </div>
    `).join('');
  }

=======
        ${p.liveLink ? `<a class="proj-link btn-magnetic" href="${p.liveLink}" target="_blank" rel="noopener" aria-label="Live demo for ${p.title}">Live ↗</a>` : ''}
      </div>
    `).join('');

    // Add visible class after a short frame
    requestAnimationFrame(() => {
      recentProjList.querySelectorAll('.proj-item').forEach(el => el.classList.add('visible'));
    });
  }

  // Re-init animation engine for dynamic content
  if (typeof initMagneticButtons === 'function') initMagneticButtons();
  if (typeof init3DTilt === 'function') init3DTilt();
  if (typeof initScrollReveals === 'function') initScrollReveals();
  if (typeof initTextReveals === 'function') initTextReveals();

>>>>>>> 199b10f (added new files)
  // ── Sidebar toggle (mobile) ──
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
