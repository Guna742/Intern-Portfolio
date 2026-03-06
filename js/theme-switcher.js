<<<<<<< HEAD
/* =========================================
   InternTrack — Theme Switcher
   Three themes: Default (Dark), Google, Instagram
   ========================================= */

(function () {
  'use strict';

  /* ── Theme Definitions ── */
  const THEMES = [
    {
      id: 'default',
      label: 'Dark Mode',
      description: 'Original deep dark theme',
      icon: '🌙',
      palette: ['#060912', '#4f7cff', '#7c5cfc'],
    },
    {
      id: 'google',
      label: 'Google',
      description: 'Clean Google-inspired light theme',
      icon: '🎨',
      palette: ['#ffffff', '#4285F4', '#34A853'],
    },
    {
      id: 'instagram',
      label: 'Instagram',
      description: 'Instagram gradient theme',
      icon: '📸',
      palette: ['#833ab4', '#fd1d1d', '#fcb045'],
    },
  ];

  const STORAGE_KEY = 'interntrack_theme';

  /* ── Inject CSS for the theme switcher widget ── */
  function injectStyles() {
    if (document.getElementById('theme-switcher-styles')) return;
    const style = document.createElement('style');
    style.id = 'theme-switcher-styles';
    style.textContent = `
      /* ── Theme Variables: Google ── */
      body.theme-google {
        --clr-bg-deep:        #f8f9fa;
        --clr-bg-mid:         #ffffff;
        --clr-bg-surface:     #ffffff;
        --clr-bg-elevated:    #f1f3f4;
        --clr-accent:         #4285F4;
        --clr-accent-glow:    rgba(66,133,244,.25);
        --clr-accent-hover:   #1a73e8;
        --clr-indigo:         #34A853;
        --clr-indigo-glow:    rgba(52,168,83,.2);
        --clr-cyan:           #FBBC05;
        --clr-cyan-glow:      rgba(251,188,5,.2);
        --clr-violet:         #EA4335;
        --clr-violet-glow:    rgba(234,67,53,.2);
        --clr-text-primary:   #202124;
        --clr-text-secondary: #5f6368;
        --clr-text-muted:     #9aa0a6;
        --clr-text-inverse:   #ffffff;
        --glass-bg:           rgba(0,0,0,.04);
        --glass-border:       rgba(0,0,0,.12);
        --glass-blur:         0px;
        --glass-shadow:       0 1px 3px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.08);
        --shadow-sm:  0 1px 2px rgba(0,0,0,.1);
        --shadow-md:  0 2px 8px rgba(0,0,0,.15);
        --shadow-lg:  0 4px 16px rgba(0,0,0,.18);
        --shadow-xl:  0 8px 32px rgba(0,0,0,.2);
        /* Analytics token overrides */
        --bg-card: #ffffff;
        --bg-card-hover: #f8f9fa;
        --clr-border: rgba(0,0,0,.1);
        --clr-border-active: #4285F4;
        background-color: var(--clr-bg-deep) !important;
      }
      /* Kill the background glow orbs in analytics */
      body.theme-google::before,
      body.theme-google::after { display: none !important; }
      body.theme-google .app-sidebar {
        background: #ffffff;
        border-right: 1px solid #e0e0e0;
        box-shadow: 2px 0 8px rgba(0,0,0,.06);
      }
      body.theme-google .app-topbar {
        background: rgba(255,255,255,.98);
        border-bottom: 1px solid #e0e0e0;
      }
      body.theme-google .nav-item.active {
        background: rgba(66,133,244,.1);
        color: #4285F4;
      }
      body.theme-google .nav-item.active::before { background: #4285F4; }
      /* ── Solid Google Blue — no gradients anywhere ── */
      body.theme-google .btn-primary,
      body.theme-google .btn-primary:focus {
        background: #4285F4;
        box-shadow: 0 1px 2px rgba(0,0,0,.2);
      }
      body.theme-google .btn-primary:hover {
        background: #1a73e8;
        box-shadow: 0 2px 6px rgba(0,0,0,.25);
        filter: none;
      }
      body.theme-google .sidebar-logo { background: #4285F4; }
      body.theme-google .user-avatar  { background: #4285F4; }
      body.theme-google .field-input {
        background: #ffffff;
        border-color: #dadce0;
        color: #202124;
      }
      body.theme-google .field-input:focus {
        border-color: #4285F4;
        background: #ffffff;
        box-shadow: 0 0 0 2px rgba(66,133,244,.3);
      }
      body.theme-google .card {
        background: #ffffff;
        border-color: #e0e0e0;
        box-shadow: 0 1px 3px rgba(0,0,0,.1);
      }
      body.theme-google .app-content { background: #f8f9fa; }
      body.theme-google ::-webkit-scrollbar-track { background: #f1f3f4; }
      body.theme-google ::-webkit-scrollbar-thumb { background: #dadce0; }
      body.theme-google ::-webkit-scrollbar-thumb:hover { background: #4285F4; }
      body.theme-google .page-title {
        background: none;
        -webkit-text-fill-color: #202124;
        color: #202124;
      }
      /* ── Analytics page: stat cards ── */
      body.theme-google .stat-card {
        background: #ffffff;
        border: 1px solid #e0e0e0;
        box-shadow: 0 1px 3px rgba(0,0,0,.1);
        color: #202124;
      }
      body.theme-google .stat-card:hover {
        background: #f8f9fa;
        border-color: #4285F4;
        box-shadow: 0 2px 8px rgba(66,133,244,.15);
      }
      body.theme-google .stat-card::before { background: #4285F4; }
      body.theme-google .stat-card-label { color: #5f6368; }
      body.theme-google .stat-card-value,
      body.theme-google .stat-card-value[data-suffix="%"] {
        color: #202124;
        background: none;
        -webkit-text-fill-color: #202124;
        -webkit-background-clip: unset;
        background-clip: unset;
      }
      body.theme-google .stat-card-trend.up    { color: #34A853; }
      body.theme-google .stat-card-trend.down  { color: #EA4335; }
      body.theme-google .stat-card-trend.neutral { color: #9aa0a6; }
      body.theme-google .trend-label { color: #9aa0a6; }
      /* ── Analytics: chart widgets ── */
      body.theme-google .chart-widget {
        background: #ffffff;
        border: 1px solid #e0e0e0;
        box-shadow: 0 1px 3px rgba(0,0,0,.1);
        color: #202124;
      }
      body.theme-google .chart-widget::after { display: none; }
      body.theme-google .chart-widget-title { color: #202124; }
      body.theme-google .chart-widget-meta { color: #5f6368; }
      body.theme-google .chart-tab { color: #5f6368; border-color: transparent; }
      body.theme-google .chart-tab:not(.active):hover {
        background: #f1f3f4;
        color: #202124;
      }
      body.theme-google .chart-tab.active {
        background: rgba(66,133,244,.1);
        color: #4285F4;
        border-color: rgba(66,133,244,.3);
        box-shadow: none;
      }
      body.theme-google .chart-axes { color: #9aa0a6; }
      body.theme-google .chart-legend { border-top-color: #e0e0e0; }
      body.theme-google .legend-item { color: #5f6368; }
      body.theme-google .chart-tooltip {
        background: #ffffff;
        border-color: #e0e0e0;
        box-shadow: 0 4px 12px rgba(0,0,0,.12);
        color: #202124;
      }
      body.theme-google .chart-tooltip-date { color: #9aa0a6; }
      /* ── Analytics: bar chart ── */
      body.theme-google .bar-track { background: #f1f3f4; }
      body.theme-google .bar-fill { box-shadow: none; }
      body.theme-google .bar-label { color: #5f6368; }
      body.theme-google .bar-value { color: #202124; }
      body.theme-google .bar-row:hover { background: #f1f3f4; box-shadow: none; transform: none; }
      /* ── Analytics: history table ── */
      body.theme-google .history-section {
        background: #ffffff;
        border-color: #e0e0e0;
        color: #202124;
      }
      body.theme-google .history-head { border-bottom-color: #e0e0e0; }
      body.theme-google .history-title { color: #202124; }
      body.theme-google .history-table th {
        color: #5f6368;
        background: #f8f9fa;
        border-bottom-color: #e0e0e0;
      }
      body.theme-google .history-table td {
        color: #202124;
        border-bottom-color: #f1f3f4;
      }
      body.theme-google .history-table tr:hover td { background: #f8f9fa; }
      body.theme-google .proj-name { color: #202124; }
      body.theme-google .proj-sub { color: #5f6368; }
      body.theme-google .chip {
        background: rgba(66,133,244,.1);
        color: #1a73e8;
        border-color: rgba(66,133,244,.2);
      }
      body.theme-google .date-col { color: #9aa0a6; }
      body.theme-google .owner-name { color: #202124; }
      body.theme-google .owner-email { color: #9aa0a6; }
      body.theme-google .owner-avatar-sm { background: #4285F4; }
      body.theme-google .row-checkbox { accent-color: #4285F4; border-color: #dadce0; }
      body.theme-google .more-btn {
        background: #f1f3f4;
        border-color: #dadce0;
        color: #5f6368;
      }
      body.theme-google .more-btn:hover { background: #e8eaed; color: #202124; }
      body.theme-google .more-dots-btn:hover { background: #f1f3f4; color: #202124; }
      body.theme-google .section-header .chart-widget-title { color: #202124; }
      body.theme-google .empty-state { color: #5f6368; }
      body.theme-google .empty-state-title { color: #202124; }

      /* ── Avatars & logos (global.css, students.css, admin-profile.css) ── */
      body.theme-google .user-avatar,
      body.theme-google .apop-avatar,
      body.theme-google .avatar-preview,
      body.theme-google .student-avatar,
      body.theme-google .admin-avatar,
      body.theme-google .owner-avatar-sm { background: #4285F4 !important; }
      body.theme-google .sidebar-logo    { background: #4285F4 !important; }
      body.theme-google .badge-admin,
      body.theme-google .apop-badge-admin { background: rgba(66,133,244,.12); color: #4285F4; border-color: rgba(66,133,244,.3); }

      /* ── Projects: card icon squares (projects.css:335) ── */
      body.theme-google .project-icon,
      body.theme-google .proj-icon,
      body.theme-google .proj-letter,
      body.theme-google [class*="proj-icon"],
      body.theme-google [class*="project-icon"] { background: #4285F4 !important; }

      /* ── Admin profile hero banner ── */
      body.theme-google .admin-hero { background: #f8f9fa; }
      body.theme-google .admin-hero-banner { background: #e8f0fe; }
      body.theme-google .hero-orb { display: none; }
      body.theme-google .admin-avatar { background: #4285F4 !important; }
      body.theme-google .admin-avatar-badge { background: #FBBC05; }
      body.theme-google .admin-display-name { color: #202124; }
      body.theme-google .admin-role-tag { color: #5f6368; border-color: #dadce0; background: #f1f3f4; }
      body.theme-google .admin-email-row { color: #5f6368; }
      body.theme-google .admin-section { background: #ffffff; border-color: #e0e0e0; }
      body.theme-google .admin-section-title { color: #202124; }
      body.theme-google .admin-info-label { color: #5f6368; }
      body.theme-google .admin-info-value { color: #202124; }
      body.theme-google .quick-action-btn { background: #f8f9fa; border-color: #e0e0e0; }
      body.theme-google .quick-action-btn:hover { background: #e8f0fe; border-color: #4285F4; }
      body.theme-google .quick-action-label { color: #202124; }
      body.theme-google .quick-action-desc { color: #5f6368; }
      body.theme-google .quick-action-arrow { color: #4285F4; }
      body.theme-google .stat-card { background: #ffffff; border-color: #e0e0e0; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
      body.theme-google .stat-value { color: #202124; }
      body.theme-google .stat-label { color: #5f6368; }
      body.theme-google .stat-trend { color: #34A853; }
      body.theme-google .section-divider { background: #e0e0e0; }
      body.theme-google .student-list .student-item { background: #ffffff; border-color: #e0e0e0; }
      body.theme-google .student-item-name { color: #202124; }
      body.theme-google .student-item-role { color: #5f6368; }

      /* ── Student profile hero ── */
      body.theme-google .student-hero { background: #ffffff !important; border-radius: 20px !important; border-color: #e0e0e0 !important; }
      body.theme-google .student-hero-banner { background: #e8f0fe !important; height: 120px !important; }
      body.theme-google .student-hero-body { padding: 40px 40px 30px !important; }
      body.theme-google .student-hero-orb-1,
      body.theme-google .student-hero-orb-2 { display: none !important; }
      body.theme-google .student-display-name { color: #202124 !important; -webkit-text-fill-color: #202124 !important; }
      body.theme-google .student-tagline { color: #5f6368 !important; }
      body.theme-google .student-meta-item { background: #f1f3f4 !important; color: #5f6368 !important; border-color: #dadce0 !important; }
      body.theme-google .student-avatar { background: #4285F4 !important; border-color: #ffffff !important; }
      body.theme-google .student-hero-actions .btn-secondary { background: #e8f0fe !important; color: #4285F4 !important; border-color: transparent !important; border-radius: 100px !important; }
      body.theme-google .completion-fill,
      body.theme-google .progress-fill { background: #4285F4 !important; box-shadow: none !important; }
      body.theme-google .completion-bar,
      body.theme-google .progress-track { background: #f1f3f4 !important; }

      /* ── Dashboard stat card top bars ── */
      body.theme-google .stat-bar { background: #4285F4 !important; }
      body.theme-google .dash-card { background: #ffffff; border-color: #e0e0e0; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
      body.theme-google .dash-card-title { color: #202124; }
      body.theme-google .role-banner { background: #e8f0fe; border-color: rgba(66,133,244,.2); }
      body.theme-google .role-banner-title { color: #202124; }
      body.theme-google .role-banner-sub { color: #5f6368; }

      /* ── FAB button (theme-switcher) ── */
      body.theme-google #theme-switcher-fab {
        background: #4285F4 !important;
        box-shadow: 0 2px 8px rgba(66,133,244,.4) !important;
      }

      /* ── Student avatars (students.css:81) ── */
      body.theme-google .student-avatar {
        background: #4285F4 !important;
        border-color: rgba(66,133,244,.3) !important;
      }
      /* ── Student list avatar in admin-profile (admin-profile.css:403) ── */
      body.theme-google .student-list-avatar {
        background: #4285F4 !important;
      }
      /* ── Progress fill bar — solid blue, no gradient (students.css:315) ── */
      body.theme-google .progress-fill {
        background: #4285F4 !important;
        box-shadow: none !important;
      }
      /* ── Score ring — use Google blue (students.css:176 conic-gradient) ── */
      body.theme-google .score-ring {
        background: conic-gradient(#4285F4 var(--score-deg, 0deg), #f1f3f4 0deg) !important;
        box-shadow: 0 0 0 2px #dadce0 !important;
      }
      body.theme-google .score-ring::before { background: #ffffff !important; }
      body.theme-google .score-num { color: #202124 !important; }

      /* ── Admin profile: hero banner background & orbs ── */
      body.theme-google .admin-hero-body { background: none; }
      body.theme-google .admin-hero-banner {
        background: #e8f0fe !important;
        /* Kill the radial gradient orbs */
      }
      body.theme-google .hero-orb-1,
      body.theme-google .hero-orb-2 { display: none !important; }
      /* ── Admin avatar badge — solid amber, no gradient (admin-profile.css:129) ── */
      body.theme-google .admin-avatar-badge {
        background: #FBBC05 !important;
        box-shadow: none !important;
      }
      /* ── Admin display name gradient text (admin-profile.css:149, 278) ── */
      body.theme-google .admin-display-name {
        background: none !important;
        -webkit-background-clip: unset !important;
        -webkit-text-fill-color: #202124 !important;
        background-clip: unset !important;
        color: #202124 !important;
      }
      /* ── Stat counter row in admin-profile (admin-profile.css:199 gradient line) ── */
      body.theme-google .stats-row::after,
      body.theme-google .section-divider { background: #e0e0e0 !important; }
      /* ── Quick action stat progress (admin-profile.css:278) ── */
      body.theme-google .admin-section-count,
      body.theme-google .admin-stat-value {
        background: none !important;
        -webkit-text-fill-color: #202124 !important;
        color: #202124 !important;
      }
      /* ── Projects page .fab (Add Project button) (projects.css:335) ── */
      body.theme-google .fab {
        background: #4285F4 !important;
        box-shadow: 0 4px 12px rgba(66,133,244,.4) !important;
        animation: none !important;
      }
      body.theme-google .fab:hover {
        box-shadow: 0 6px 20px rgba(66,133,244,.5) !important;
      }
      /* ── Profile-builder avatar (profile-builder.css:215) ── */
      body.theme-google .avatar-preview {
        background: #4285F4 !important;
      }
      /* ── profile-view accent bar (profile-view.css:240) ── */
      body.theme-google .profile-accent-bar,
      body.theme-google .hero-accent-bar { background: #4285F4 !important; }
      /* ── Card placeholder background in projects (projects.css:112) ── */
      body.theme-google .card-img-placeholder {
        background: #f1f3f4 !important;
      }
      body.theme-google .project-card {
        background: #ffffff !important;
        border-color: #e0e0e0 !important;
      }
      body.theme-google .project-card:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,.1) !important;
        border-color: #4285F4 !important;
      }
      body.theme-google .card-title { color: #202124 !important; }
      body.theme-google .card-desc { color: #5f6368 !important; }
      body.theme-google .card-footer { border-top-color: #e0e0e0 !important; }
      body.theme-google .card-link.github {
        background: #f1f3f4 !important;
        border-color: #dadce0 !important;
        color: #5f6368 !important;
      }
      body.theme-google .card-link.live {
        background: rgba(66,133,244,.1) !important;
        border-color: rgba(66,133,244,.2) !important;
        color: #4285F4 !important;
      }
      body.theme-google .stack-tag {
        background: rgba(66,133,244,.08) !important;
        color: #4285F4 !important;
        border-color: rgba(66,133,244,.15) !important;
      }
      body.theme-google .card-owner {
        background: rgba(66,133,244,.04) !important;
        border-top-color: #e0e0e0 !important;
      }
      /* ── Students page: card hover, score, progress ── */
      body.theme-google .student-card {
        background: #ffffff !important;
        border-color: #e0e0e0 !important;
      }
      body.theme-google .student-card:hover {
        border-color: rgba(66,133,244,.3) !important;
        box-shadow: 0 2px 12px rgba(66,133,244,.1) !important;
      }
      body.theme-google .student-name { color: #202124 !important; }
      body.theme-google .student-role-tag { color: #5f6368 !important; }
      body.theme-google .student-summary:hover { background: rgba(0,0,0,.02) !important; }
      body.theme-google .expand-btn {
        border-color: #dadce0 !important;
        background: #f1f3f4 !important;
        color: #5f6368 !important;
      }
      body.theme-google .student-card.expanded .expand-btn {
        background: rgba(66,133,244,.1) !important;
        border-color: rgba(66,133,244,.3) !important;
        color: #4285F4 !important;
      }
      body.theme-google .student-details { border-top-color: #e0e0e0 !important; }
      body.theme-google .student-proj-item {
        background: #f8f9fa !important;
        border-color: #e0e0e0 !important;
      }
      body.theme-google .student-proj-name { color: #202124 !important; }
      body.theme-google .skill-chip {
        background: rgba(66,133,244,.08) !important;
        border-color: rgba(66,133,244,.15) !important;
        color: #4285F4 !important;
      }
      body.theme-google .progress-track { background: #f1f3f4 !important; border-color: #e0e0e0 !important; }
      body.theme-google .detail-edit-row { border-top-color: #e0e0e0 !important; }

      /* ── Theme Variables: Instagram ── */
      body.theme-instagram {
        --clr-bg-deep:        #0a0a0a;
        --clr-bg-mid:         #121212;
        --clr-bg-surface:     #1c1c1c;
        --clr-bg-elevated:    #262626;

        --clr-accent:         #e1306c;
        --clr-accent-glow:    rgba(225,48,108,.35);
        --clr-accent-hover:   #f0609c;
        --clr-indigo:         #833ab4;
        --clr-indigo-glow:    rgba(131,58,180,.3);
        --clr-cyan:           #fcb045;
        --clr-cyan-glow:      rgba(252,176,69,.25);
        --clr-violet:         #fd1d1d;
        --clr-violet-glow:    rgba(253,29,29,.25);
        --clr-text-primary:   #fafafa;
        --clr-text-secondary: #a8a8a8;
        --clr-text-muted:     #737373;
        --clr-text-inverse:   #0a0a0a;
        --glass-bg:           rgba(255,255,255,.04);
        --glass-border:       rgba(255,255,255,.1);
        --glass-blur:         16px;
        --glass-shadow:       0 8px 32px rgba(0,0,0,.6);
        background-color: var(--clr-bg-deep) !important;
      }
      body.theme-instagram .app-sidebar {
        background: #121212;
        border-right: 1px solid rgba(255,255,255,.1);
      }
      body.theme-instagram .app-topbar {
        background: rgba(18,18,18,.95);
        border-bottom: 1px solid rgba(255,255,255,.08);
      }
      body.theme-instagram .sidebar-logo {
        background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
      }
      body.theme-instagram .btn-primary {
        background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
        box-shadow: 0 4px 20px rgba(225,48,108,.4);
      }
      body.theme-instagram .btn-primary:hover {
        box-shadow: 0 8px 32px rgba(225,48,108,.6);
        filter: brightness(1.1);
      }
      body.theme-instagram .nav-item.active {
        background: rgba(225,48,108,.12);
        color: #e1306c;
      }
      body.theme-instagram .nav-item.active::before {
        background: linear-gradient(180deg, #833ab4, #fd1d1d, #fcb045);
      }
      body.theme-instagram .user-avatar {
        background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
      }
      body.theme-instagram .page-title {
        background: linear-gradient(135deg, #fafafa 0%, #e1306c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      body.theme-instagram ::-webkit-scrollbar-thumb:hover { background: #e1306c; }

      /* ── Lift page-level FABs above the theme-switcher button ── */
      .fab:not(#theme-switcher-fab) {
        bottom: 88px !important;  /* 24px + 48px FAB height + 16px gap */
      }
      /* Fix tilted tooltips: kill rotation on parent hover */
      .fab:not(#theme-switcher-fab):hover {
        transform: scale(1.12) !important; /* Keep scale but remove rotate(45deg) */
        rotate: 0deg !important;
      }
      /* Ensure tooltip itself remains perfectly horizontal and has branded visibility in Google theme */
      .fab-tooltip {
        transform: translateY(-50%) rotate(0) !important;
        background: #4285F4 !important;
        color: #ffffff !important;
        border-color: rgba(0,0,0,0.1) !important;
        box-shadow: 0 4px 12px rgba(66,133,244,0.3) !important;
      }

      /* ── Theme Switcher Widget ── */
      #theme-switcher-fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--clr-accent), var(--clr-indigo));
        color: #fff;
        border: none;
        cursor: pointer;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(0,0,0,.4), 0 0 0 0 var(--clr-accent-glow);
        transition: transform 0.25s cubic-bezier(.34,1.56,.64,1),
                    box-shadow 0.25s ease,
                    background 0.3s ease;
        animation: themeFabEntrance 0.5s cubic-bezier(.34,1.56,.64,1) both;
        outline: none;
      }
      body.theme-google #theme-switcher-fab {
        background: linear-gradient(135deg, #4285F4, #34A853);
        box-shadow: 0 2px 10px rgba(66,133,244,.4);
      }
      body.theme-instagram #theme-switcher-fab {
        background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
        box-shadow: 0 4px 20px rgba(225,48,108,.4);
      }
      #theme-switcher-fab:hover {
        transform: scale(1.12) rotate(15deg);
        box-shadow: 0 8px 28px rgba(0,0,0,.5);
      }
      #theme-switcher-fab.panel-open {
        transform: scale(1.05) rotate(45deg);
      }
      #theme-switcher-fab svg {
        width: 22px;
        height: 22px;
        transition: transform 0.3s ease;
        pointer-events: none;
      }
      @keyframes themeFabEntrance {
        from { transform: scale(0) rotate(-180deg); opacity: 0; }
        to   { transform: scale(1) rotate(0deg); opacity: 1; }
      }

      /* ── Theme Panel ── */
      #theme-panel {
        position: fixed;
        bottom: 84px;
        right: 24px;
        width: 260px;
        background: var(--clr-bg-elevated, #1a2235);
        border: 1px solid var(--glass-border, rgba(255,255,255,.09));
        border-radius: 16px;
        box-shadow: 0 16px 48px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04);
        z-index: 9998;
        overflow: hidden;
        /* Initial hidden state — slide from right */
        transform: translateX(calc(100% + 32px));
        opacity: 0;
        pointer-events: none;
        transition: transform 0.35s cubic-bezier(.2,.8,.2,1),
                    opacity 0.3s ease;
      }
      body.theme-google #theme-panel {
        background: #ffffff;
        border-color: rgba(0,0,0,.12);
        box-shadow: 0 8px 24px rgba(0,0,0,.15);
      }
      #theme-panel.panel-visible {
        transform: translateX(0);
        opacity: 1;
        pointer-events: all;
      }
      #theme-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px 10px;
        border-bottom: 1px solid var(--glass-border, rgba(255,255,255,.09));
      }
      body.theme-google #theme-panel-header {
        border-bottom-color: rgba(0,0,0,.08);
      }
      #theme-panel-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--clr-text-primary, #f0f4ff);
        letter-spacing: .02em;
      }
      #theme-panel-close {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--glass-bg, rgba(255,255,255,.04));
        border: 1px solid var(--glass-border, rgba(255,255,255,.09));
        color: var(--clr-text-secondary, #94a3b8);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        line-height: 1;
        transition: background 0.2s, color 0.2s;
        outline: none;
      }
      #theme-panel-close:hover {
        background: rgba(255,255,255,.1);
        color: var(--clr-text-primary, #f0f4ff);
      }
      body.theme-google #theme-panel-close:hover {
        background: rgba(0,0,0,.06);
      }
      #theme-options {
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .theme-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 10px;
        cursor: pointer;
        border: 2px solid transparent;
        background: var(--glass-bg, rgba(255,255,255,.04));
        transition: background 0.2s, border-color 0.2s, transform 0.15s;
        outline: none;
        position: relative;
      }
      .theme-option:hover {
        background: rgba(255,255,255,.07);
        transform: translateX(-3px);
      }
      body.theme-google .theme-option:hover {
        background: rgba(0,0,0,.04);
      }
      .theme-option.active {
        border-color: var(--clr-accent, #4f7cff);
        background: rgba(79,124,255,.08);
      }
      body.theme-google .theme-option.active {
        border-color: #4285F4;
        background: rgba(66,133,244,.08);
      }
      body.theme-instagram .theme-option.active {
        border-color: #e1306c;
        background: rgba(225,48,108,.1);
      }
      .theme-palette {
        display: flex;
        gap: 3px;
        flex-shrink: 0;
      }
      .theme-palette-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 1.5px solid rgba(255,255,255,.2);
      }
      body.theme-google .theme-palette-dot {
        border-color: rgba(0,0,0,.15);
      }
      .theme-option-info {
        flex: 1;
        min-width: 0;
      }
      .theme-option-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--clr-text-primary, #f0f4ff);
        line-height: 1.3;
      }
      .theme-option-desc {
        font-size: 11px;
        color: var(--clr-text-muted, #4b5776);
        margin-top: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .theme-option-check {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: var(--clr-accent, #4f7cff);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #fff;
        flex-shrink: 0;
        opacity: 0;
        transform: scale(0);
        transition: opacity 0.2s, transform 0.25s cubic-bezier(.34,1.56,.64,1);
      }
      body.theme-google .theme-option-check { background: #4285F4; }
      body.theme-instagram .theme-option-check { background: #e1306c; }
      .theme-option.active .theme-option-check {
        opacity: 1;
        transform: scale(1);
      }
      .theme-option-icon {
        font-size: 18px;
        flex-shrink: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: rgba(255,255,255,.05);
      }
      body.theme-google .theme-option-icon { background: rgba(0,0,0,.04); }
    `;
    document.head.appendChild(style);
  }

  /* ── Create DOM elements ── */
  function createWidget() {
    // FAB button
    const fab = document.createElement('button');
    fab.id = 'theme-switcher-fab';
    fab.setAttribute('aria-label', 'Change color theme');
    fab.setAttribute('title', 'Change Theme');
    fab.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a10 10 0 0 1 0 20"/>
        <path d="M2 12h20"/>
        <path d="M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10"/>
      </svg>`;

    // Panel
    const panel = document.createElement('div');
    panel.id = 'theme-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Theme selection');
    panel.innerHTML = `
      <div id="theme-panel-header">
        <span id="theme-panel-title">✨ Choose Theme</span>
        <button id="theme-panel-close" aria-label="Close theme panel">✕</button>
      </div>
      <div id="theme-options" role="listbox" aria-label="Available themes">
        ${THEMES.map(t => `
          <button
            class="theme-option"
            data-theme="${t.id}"
            role="option"
            aria-label="${t.label} theme"
            title="${t.label}"
          >
            <span class="theme-option-icon">${t.icon}</span>
            <div class="theme-palette">
              ${t.palette.map(c => `<span class="theme-palette-dot" style="background:${c}"></span>`).join('')}
            </div>
            <span class="theme-option-check" aria-hidden="true">✓</span>
          </button>`).join('')}
      </div>`;

    document.body.appendChild(fab);
    document.body.appendChild(panel);
    return { fab, panel };
  }

  /* ── Apply theme ── */
  function applyTheme(themeId, save = true) {
    const body = document.body;
    // Remove old theme classes
    body.classList.remove('theme-default', 'theme-google', 'theme-instagram');
    if (themeId !== 'default') {
      body.classList.add(`theme-${themeId}`);
    }
    if (save) {
      try { localStorage.setItem(STORAGE_KEY, themeId); } catch (e) { }
    }
    // Update active state on options
    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === themeId);
      opt.setAttribute('aria-selected', opt.dataset.theme === themeId ? 'true' : 'false');
    });
  }

  /* ── Toggle panel ── */
  function togglePanel(fab, panel) {
    const isOpen = panel.classList.contains('panel-visible');
    if (isOpen) {
      closePanel(fab, panel);
    } else {
      openPanel(fab, panel);
    }
  }

  function openPanel(fab, panel) {
    panel.classList.add('panel-visible');
    fab.classList.add('panel-open');
    fab.setAttribute('aria-expanded', 'true');
  }

  function closePanel(fab, panel) {
    panel.classList.remove('panel-visible');
    fab.classList.remove('panel-open');
    fab.setAttribute('aria-expanded', 'false');
  }

  /* ── Init ── */
  function init() {
    injectStyles();
    const { fab, panel } = createWidget();

    // Restore saved theme immediately
    let saved = 'default';
    try { saved = localStorage.getItem(STORAGE_KEY) || 'default'; } catch (e) { }
    applyTheme(saved, false);

    // FAB click
    fab.addEventListener('click', () => togglePanel(fab, panel));

    // Close button
    document.getElementById('theme-panel-close').addEventListener('click', () => closePanel(fab, panel));

    // Theme option clicks
    panel.querySelectorAll('.theme-option').forEach(opt => {
      opt.addEventListener('click', () => {
        applyTheme(opt.dataset.theme);
        // Brief delay then close
        setTimeout(() => closePanel(fab, panel), 220);
      });
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && e.target !== fab) {
        closePanel(fab, panel);
      }
    }, true);

    // Keyboard: Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePanel(fab, panel);
    });
  }

  /* ── Boot ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
=======
/* =========================================
   InternTrack — Theme Switcher
   Three themes: Default (Dark), Google, Instagram
   ========================================= */

(function () {
  'use strict';

  /* ── Theme Definitions ── */
  const THEMES = [
    {
      id: 'default',
      label: 'Dark Mode',
      description: 'Original deep dark theme',
      icon: '🌙',
      palette: ['#060912', '#4f7cff', '#7c5cfc'],
    },
    {
      id: 'google',
      label: 'Google',
      description: 'Clean Google-inspired light theme',
      icon: '🎨',
      palette: ['#ffffff', '#4285F4', '#34A853'],
    },
    {
      id: 'instagram',
      label: 'Instagram',
      description: 'Instagram gradient theme',
      icon: '📸',
      palette: ['#833ab4', '#fd1d1d', '#fcb045'],
    },
  ];

  const STORAGE_KEY = 'interntrack_theme';

  /* ── Inject CSS for the theme switcher widget ── */
  function injectStyles() {
    if (document.getElementById('theme-switcher-styles')) return;
    const style = document.createElement('style');
    style.id = 'theme-switcher-styles';
    style.textContent = `
      /* ── Theme Variables: Google ── */
      body.theme-google {
        --clr-bg-deep:        #f8f9fa;
        --clr-bg-mid:         #ffffff;
        --clr-bg-surface:     #ffffff;
        --clr-bg-elevated:    #f1f3f4;
        --clr-accent:         #4285F4;
        --clr-accent-glow:    rgba(66,133,244,.25);
        --clr-accent-hover:   #1a73e8;
        --clr-indigo:         #34A853;
        --clr-indigo-glow:    rgba(52,168,83,.2);
        --clr-cyan:           #FBBC05;
        --clr-cyan-glow:      rgba(251,188,5,.2);
        --clr-violet:         #EA4335;
        --clr-violet-glow:    rgba(234,67,53,.2);
        --clr-text-primary:   #202124;
        --clr-text-secondary: #5f6368;
        --clr-text-muted:     #9aa0a6;
        --clr-text-inverse:   #ffffff;
        --glass-bg:           rgba(0,0,0,.04);
        --glass-border:       rgba(0,0,0,.12);
        --glass-blur:         0px;
        --glass-shadow:       0 1px 3px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.08);
        --shadow-sm:  0 1px 2px rgba(0,0,0,.1);
        --shadow-md:  0 2px 8px rgba(0,0,0,.15);
        --shadow-lg:  0 4px 16px rgba(0,0,0,.18);
        --shadow-xl:  0 8px 32px rgba(0,0,0,.2);
        /* Analytics token overrides */
        --bg-card: #ffffff;
        --bg-card-hover: #f8f9fa;
        --clr-border: rgba(0,0,0,.1);
        --clr-border-active: #4285F4;
        background-color: var(--clr-bg-deep) !important;
      }
      /* Kill the background glow orbs in analytics */
      body.theme-google::before,
      body.theme-google::after { display: none !important; }
      body.theme-google .app-sidebar {
        background: #ffffff;
        border-right: 1px solid #e0e0e0;
        box-shadow: 2px 0 8px rgba(0,0,0,.06);
      }
      body.theme-google .app-topbar {
        background: rgba(255,255,255,.98);
        border-bottom: 1px solid #e0e0e0;
      }
      body.theme-google .nav-item.active {
        background: rgba(66,133,244,.1);
        color: #4285F4;
      }
      body.theme-google .nav-item.active::before { background: #4285F4; }
      /* ── Solid Google Blue — no gradients anywhere ── */
      body.theme-google .btn-primary,
      body.theme-google .btn-primary:focus {
        background: #4285F4;
        box-shadow: 0 1px 2px rgba(0,0,0,.2);
      }
      body.theme-google .btn-primary:hover {
        background: #1a73e8;
        box-shadow: 0 2px 6px rgba(0,0,0,.25);
        filter: none;
      }
      body.theme-google .sidebar-logo { background: #4285F4; }
      body.theme-google .user-avatar  { background: #4285F4; }
      body.theme-google .field-input {
        background: #ffffff;
        border-color: #dadce0;
        color: #202124;
      }
      body.theme-google .field-input:focus {
        border-color: #4285F4;
        background: #ffffff;
        box-shadow: 0 0 0 2px rgba(66,133,244,.3);
      }
      body.theme-google .card {
        background: #ffffff;
        border-color: #e0e0e0;
        box-shadow: 0 1px 3px rgba(0,0,0,.1);
      }
      body.theme-google .app-content { background: #f8f9fa; }
      body.theme-google ::-webkit-scrollbar-track { background: #f1f3f4; }
      body.theme-google ::-webkit-scrollbar-thumb { background: #dadce0; }
      body.theme-google ::-webkit-scrollbar-thumb:hover { background: #4285F4; }
      body.theme-google .page-title {
        background: none;
        -webkit-text-fill-color: #202124;
        color: #202124;
      }
      /* ── Analytics page: stat cards ── */
      body.theme-google .stat-card {
        background: #ffffff;
        border: 1px solid #e0e0e0;
        box-shadow: 0 1px 3px rgba(0,0,0,.1);
        color: #202124;
      }
      body.theme-google .stat-card:hover {
        background: #f8f9fa;
        border-color: #4285F4;
        box-shadow: 0 2px 8px rgba(66,133,244,.15);
      }
      body.theme-google .stat-card::before { background: #4285F4; }
      body.theme-google .stat-card-label { color: #5f6368; }
      body.theme-google .stat-card-value,
      body.theme-google .stat-card-value[data-suffix="%"] {
        color: #202124;
        background: none;
        -webkit-text-fill-color: #202124;
        -webkit-background-clip: unset;
        background-clip: unset;
      }
      body.theme-google .stat-card-trend.up    { color: #34A853; }
      body.theme-google .stat-card-trend.down  { color: #EA4335; }
      body.theme-google .stat-card-trend.neutral { color: #9aa0a6; }
      body.theme-google .trend-label { color: #9aa0a6; }
      /* ── Analytics: chart widgets ── */
      body.theme-google .chart-widget {
        background: #ffffff;
        border: 1px solid #e0e0e0;
        box-shadow: 0 1px 3px rgba(0,0,0,.1);
        color: #202124;
      }
      body.theme-google .chart-widget::after { display: none; }
      body.theme-google .chart-widget-title { color: #202124; }
      body.theme-google .chart-widget-meta { color: #5f6368; }
      body.theme-google .chart-tab { color: #5f6368; border-color: transparent; }
      body.theme-google .chart-tab:not(.active):hover {
        background: #f1f3f4;
        color: #202124;
      }
      body.theme-google .chart-tab.active {
        background: rgba(66,133,244,.1);
        color: #4285F4;
        border-color: rgba(66,133,244,.3);
        box-shadow: none;
      }
      body.theme-google .chart-axes { color: #9aa0a6; }
      body.theme-google .chart-legend { border-top-color: #e0e0e0; }
      body.theme-google .legend-item { color: #5f6368; }
      body.theme-google .chart-tooltip {
        background: #ffffff;
        border-color: #e0e0e0;
        box-shadow: 0 4px 12px rgba(0,0,0,.12);
        color: #202124;
      }
      body.theme-google .chart-tooltip-date { color: #9aa0a6; }
      /* ── Analytics: bar chart ── */
      body.theme-google .bar-track { background: #f1f3f4; }
      body.theme-google .bar-fill { box-shadow: none; }
      body.theme-google .bar-label { color: #5f6368; }
      body.theme-google .bar-value { color: #202124; }
      body.theme-google .bar-row:hover { background: #f1f3f4; box-shadow: none; transform: none; }
      /* ── Analytics: history table ── */
      body.theme-google .history-section {
        background: #ffffff;
        border-color: #e0e0e0;
        color: #202124;
      }
      body.theme-google .history-head { border-bottom-color: #e0e0e0; }
      body.theme-google .history-title { color: #202124; }
      body.theme-google .history-table th {
        color: #5f6368;
        background: #f8f9fa;
        border-bottom-color: #e0e0e0;
      }
      body.theme-google .history-table td {
        color: #202124;
        border-bottom-color: #f1f3f4;
      }
      body.theme-google .history-table tr:hover td { background: #f8f9fa; }
      body.theme-google .proj-name { color: #202124; }
      body.theme-google .proj-sub { color: #5f6368; }
      body.theme-google .chip {
        background: rgba(66,133,244,.1);
        color: #1a73e8;
        border-color: rgba(66,133,244,.2);
      }
      body.theme-google .date-col { color: #9aa0a6; }
      body.theme-google .owner-name { color: #202124; }
      body.theme-google .owner-email { color: #9aa0a6; }
      body.theme-google .owner-avatar-sm { background: #4285F4; }
      body.theme-google .row-checkbox { accent-color: #4285F4; border-color: #dadce0; }
      body.theme-google .more-btn {
        background: #f1f3f4;
        border-color: #dadce0;
        color: #5f6368;
      }
      body.theme-google .more-btn:hover { background: #e8eaed; color: #202124; }
      body.theme-google .more-dots-btn:hover { background: #f1f3f4; color: #202124; }
      body.theme-google .section-header .chart-widget-title { color: #202124; }
      body.theme-google .empty-state { color: #5f6368; }
      body.theme-google .empty-state-title { color: #202124; }

      /* ── Avatars & logos (global.css, students.css, admin-profile.css) ── */
      body.theme-google .user-avatar,
      body.theme-google .apop-avatar,
      body.theme-google .avatar-preview,
      body.theme-google .student-avatar,
      body.theme-google .admin-avatar,
      body.theme-google .owner-avatar-sm { background: #4285F4 !important; }
      body.theme-google .sidebar-logo    { background: #4285F4 !important; }
      body.theme-google .badge-admin,
      body.theme-google .apop-badge-admin { background: rgba(66,133,244,.12); color: #4285F4; border-color: rgba(66,133,244,.3); }

      /* ── Projects: card icon squares (projects.css:335) ── */
      body.theme-google .project-icon,
      body.theme-google .proj-icon,
      body.theme-google .proj-letter,
      body.theme-google [class*="proj-icon"],
      body.theme-google [class*="project-icon"] { background: #4285F4 !important; }

      /* ── Admin profile hero banner ── */
      body.theme-google .admin-hero { background: #f8f9fa; }
      body.theme-google .admin-hero-banner { background: #e8f0fe; }
      body.theme-google .hero-orb { display: none; }
      body.theme-google .admin-avatar { background: #4285F4 !important; }
      body.theme-google .admin-avatar-badge { background: #FBBC05; }
      body.theme-google .admin-display-name { color: #202124; }
      body.theme-google .admin-role-tag { color: #5f6368; border-color: #dadce0; background: #f1f3f4; }
      body.theme-google .admin-email-row { color: #5f6368; }
      body.theme-google .admin-section { background: #ffffff; border-color: #e0e0e0; }
      body.theme-google .admin-section-title { color: #202124; }
      body.theme-google .admin-info-label { color: #5f6368; }
      body.theme-google .admin-info-value { color: #202124; }
      body.theme-google .quick-action-btn { background: #f8f9fa; border-color: #e0e0e0; }
      body.theme-google .quick-action-btn:hover { background: #e8f0fe; border-color: #4285F4; }
      body.theme-google .quick-action-label { color: #202124; }
      body.theme-google .quick-action-desc { color: #5f6368; }
      body.theme-google .quick-action-arrow { color: #4285F4; }
      body.theme-google .stat-card { background: #ffffff; border-color: #e0e0e0; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
      body.theme-google .stat-value { color: #202124; }
      body.theme-google .stat-label { color: #5f6368; }
      body.theme-google .stat-trend { color: #34A853; }
      body.theme-google .section-divider { background: #e0e0e0; }
      body.theme-google .student-list .student-item { background: #ffffff; border-color: #e0e0e0; }
      body.theme-google .student-item-name { color: #202124; }
      body.theme-google .student-item-role { color: #5f6368; }

      /* ── Student profile hero ── */
      body.theme-google .student-hero { background: #ffffff !important; border-radius: 20px !important; border-color: #e0e0e0 !important; }
      body.theme-google .student-hero-banner { background: #e8f0fe !important; height: 120px !important; }
      body.theme-google .student-hero-body { padding: 40px 40px 30px !important; }
      body.theme-google .student-hero-orb-1,
      body.theme-google .student-hero-orb-2 { display: none !important; }
      body.theme-google .student-display-name { color: #202124 !important; -webkit-text-fill-color: #202124 !important; }
      body.theme-google .student-tagline { color: #5f6368 !important; }
      body.theme-google .student-meta-item { background: #f1f3f4 !important; color: #5f6368 !important; border-color: #dadce0 !important; }
      body.theme-google .student-avatar { background: #4285F4 !important; border-color: #ffffff !important; }
      body.theme-google .student-hero-actions .btn-secondary { background: #e8f0fe !important; color: #4285F4 !important; border-color: transparent !important; border-radius: 100px !important; }
      body.theme-google .completion-fill,
      body.theme-google .progress-fill { background: #4285F4 !important; box-shadow: none !important; }
      body.theme-google .completion-bar,
      body.theme-google .progress-track { background: #f1f3f4 !important; }

      /* ── Dashboard stat card top bars ── */
      body.theme-google .stat-bar { background: #4285F4 !important; }
      body.theme-google .dash-card { background: #ffffff; border-color: #e0e0e0; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
      body.theme-google .dash-card-title { color: #202124; }
      body.theme-google .role-banner { background: #e8f0fe; border-color: rgba(66,133,244,.2); }
      body.theme-google .role-banner-title { color: #202124; }
      body.theme-google .role-banner-sub { color: #5f6368; }

      /* ── FAB button (theme-switcher) ── */
      body.theme-google #theme-switcher-fab {
        background: #4285F4 !important;
        box-shadow: 0 2px 8px rgba(66,133,244,.4) !important;
      }

      /* ── Student avatars (students.css:81) ── */
      body.theme-google .student-avatar {
        background: #4285F4 !important;
        border-color: rgba(66,133,244,.3) !important;
      }
      /* ── Student list avatar in admin-profile (admin-profile.css:403) ── */
      body.theme-google .student-list-avatar {
        background: #4285F4 !important;
      }
      /* ── Progress fill bar — solid blue, no gradient (students.css:315) ── */
      body.theme-google .progress-fill {
        background: #4285F4 !important;
        box-shadow: none !important;
      }
      /* ── Score ring — use Google blue (students.css:176 conic-gradient) ── */
      body.theme-google .score-ring {
        background: conic-gradient(#4285F4 var(--score-deg, 0deg), #f1f3f4 0deg) !important;
        box-shadow: 0 0 0 2px #dadce0 !important;
      }
      body.theme-google .score-ring::before { background: #ffffff !important; }
      body.theme-google .score-num { color: #202124 !important; }

      /* ── Admin profile: hero banner background & orbs ── */
      body.theme-google .admin-hero-body { background: none; }
      body.theme-google .admin-hero-banner {
        background: #e8f0fe !important;
        /* Kill the radial gradient orbs */
      }
      body.theme-google .hero-orb-1,
      body.theme-google .hero-orb-2 { display: none !important; }
      /* ── Admin avatar badge — solid amber, no gradient (admin-profile.css:129) ── */
      body.theme-google .admin-avatar-badge {
        background: #FBBC05 !important;
        box-shadow: none !important;
      }
      /* ── Admin display name gradient text (admin-profile.css:149, 278) ── */
      body.theme-google .admin-display-name {
        background: none !important;
        -webkit-background-clip: unset !important;
        -webkit-text-fill-color: #202124 !important;
        background-clip: unset !important;
        color: #202124 !important;
      }
      /* ── Stat counter row in admin-profile (admin-profile.css:199 gradient line) ── */
      body.theme-google .stats-row::after,
      body.theme-google .section-divider { background: #e0e0e0 !important; }
      /* ── Quick action stat progress (admin-profile.css:278) ── */
      body.theme-google .admin-section-count,
      body.theme-google .admin-stat-value {
        background: none !important;
        -webkit-text-fill-color: #202124 !important;
        color: #202124 !important;
      }
      /* ── Projects page .fab (Add Project button) (projects.css:335) ── */
      body.theme-google .fab {
        background: #4285F4 !important;
        box-shadow: 0 4px 12px rgba(66,133,244,.4) !important;
        animation: none !important;
      }
      body.theme-google .fab:hover {
        box-shadow: 0 6px 20px rgba(66,133,244,.5) !important;
      }
      /* ── Profile-builder avatar (profile-builder.css:215) ── */
      body.theme-google .avatar-preview {
        background: #4285F4 !important;
      }
      /* ── profile-view accent bar (profile-view.css:240) ── */
      body.theme-google .profile-accent-bar,
      body.theme-google .hero-accent-bar { background: #4285F4 !important; }
      /* ── Card placeholder background in projects (projects.css:112) ── */
      body.theme-google .card-img-placeholder {
        background: #f1f3f4 !important;
      }
      body.theme-google .project-card {
        background: #ffffff !important;
        border-color: #e0e0e0 !important;
      }
      body.theme-google .project-card:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,.1) !important;
        border-color: #4285F4 !important;
      }
      body.theme-google .card-title { color: #202124 !important; }
      body.theme-google .card-desc { color: #5f6368 !important; }
      body.theme-google .card-footer { border-top-color: #e0e0e0 !important; }
      body.theme-google .card-link.github {
        background: #f1f3f4 !important;
        border-color: #dadce0 !important;
        color: #5f6368 !important;
      }
      body.theme-google .card-link.live {
        background: rgba(66,133,244,.1) !important;
        border-color: rgba(66,133,244,.2) !important;
        color: #4285F4 !important;
      }
      body.theme-google .stack-tag {
        background: rgba(66,133,244,.08) !important;
        color: #4285F4 !important;
        border-color: rgba(66,133,244,.15) !important;
      }
      body.theme-google .card-owner {
        background: rgba(66,133,244,.04) !important;
        border-top-color: #e0e0e0 !important;
      }
      /* ── Students page: card hover, score, progress ── */
      body.theme-google .student-card {
        background: #ffffff !important;
        border-color: #e0e0e0 !important;
      }
      body.theme-google .student-card:hover {
        border-color: rgba(66,133,244,.3) !important;
        box-shadow: 0 2px 12px rgba(66,133,244,.1) !important;
      }
      body.theme-google .student-name { color: #202124 !important; }
      body.theme-google .student-role-tag { color: #5f6368 !important; }
      body.theme-google .student-summary:hover { background: rgba(0,0,0,.02) !important; }
      body.theme-google .expand-btn {
        border-color: #dadce0 !important;
        background: #f1f3f4 !important;
        color: #5f6368 !important;
      }
      body.theme-google .student-card.expanded .expand-btn {
        background: rgba(66,133,244,.1) !important;
        border-color: rgba(66,133,244,.3) !important;
        color: #4285F4 !important;
      }
      body.theme-google .student-details { border-top-color: #e0e0e0 !important; }
      body.theme-google .student-proj-item {
        background: #f8f9fa !important;
        border-color: #e0e0e0 !important;
      }
      body.theme-google .student-proj-name { color: #202124 !important; }
      body.theme-google .skill-chip {
        background: rgba(66,133,244,.08) !important;
        border-color: rgba(66,133,244,.15) !important;
        color: #4285F4 !important;
      }
      body.theme-google .progress-track { background: #f1f3f4 !important; border-color: #e0e0e0 !important; }
      body.theme-google .detail-edit-row { border-top-color: #e0e0e0 !important; }

      /* ── Theme Variables: Instagram ── */
      body.theme-instagram {
        --clr-bg-deep:        #0a0a0a;
        --clr-bg-mid:         #121212;
        --clr-bg-surface:     #1c1c1c;
        --clr-bg-elevated:    #262626;

        --clr-accent:         #e1306c;
        --clr-accent-glow:    rgba(225,48,108,.35);
        --clr-accent-hover:   #f0609c;
        --clr-indigo:         #833ab4;
        --clr-indigo-glow:    rgba(131,58,180,.3);
        --clr-cyan:           #fcb045;
        --clr-cyan-glow:      rgba(252,176,69,.25);
        --clr-violet:         #fd1d1d;
        --clr-violet-glow:    rgba(253,29,29,.25);
        --clr-text-primary:   #fafafa;
        --clr-text-secondary: #a8a8a8;
        --clr-text-muted:     #737373;
        --clr-text-inverse:   #0a0a0a;
        --glass-bg:           rgba(255,255,255,.04);
        --glass-border:       rgba(255,255,255,.1);
        --glass-blur:         16px;
        --glass-shadow:       0 8px 32px rgba(0,0,0,.6);
        background-color: var(--clr-bg-deep) !important;
      }
      body.theme-instagram .app-sidebar {
        background: #121212;
        border-right: 1px solid rgba(255,255,255,.1);
      }
      body.theme-instagram .app-topbar {
        background: rgba(18,18,18,.95);
        border-bottom: 1px solid rgba(255,255,255,.08);
      }
      body.theme-instagram .sidebar-logo {
        background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
      }
      body.theme-instagram .btn-primary {
        background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
        box-shadow: 0 4px 20px rgba(225,48,108,.4);
      }
      body.theme-instagram .btn-primary:hover {
        box-shadow: 0 8px 32px rgba(225,48,108,.6);
        filter: brightness(1.1);
      }
      body.theme-instagram .nav-item.active {
        background: rgba(225,48,108,.12);
        color: #e1306c;
      }
      body.theme-instagram .nav-item.active::before {
        background: linear-gradient(180deg, #833ab4, #fd1d1d, #fcb045);
      }
      body.theme-instagram .user-avatar {
        background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
      }
      body.theme-instagram .page-title {
        background: linear-gradient(135deg, #fafafa 0%, #e1306c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      body.theme-instagram ::-webkit-scrollbar-thumb:hover { background: #e1306c; }

      /* ── Lift page-level FABs above the theme-switcher button ── */
      .fab:not(#theme-switcher-fab) {
        bottom: 88px !important;  /* 24px + 48px FAB height + 16px gap */
      }
      /* Fix tilted tooltips: kill rotation on parent hover */
      .fab:not(#theme-switcher-fab):hover {
        transform: scale(1.12) !important; /* Keep scale but remove rotate(45deg) */
        rotate: 0deg !important;
      }
      /* Ensure tooltip itself remains perfectly horizontal and has branded visibility in Google theme */
      .fab-tooltip {
        transform: translateY(-50%) rotate(0) !important;
        background: #4285F4 !important;
        color: #ffffff !important;
        border-color: rgba(0,0,0,0.1) !important;
        box-shadow: 0 4px 12px rgba(66,133,244,0.3) !important;
      }

      /* ── Theme Switcher Widget ── */
      #theme-switcher-fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--clr-accent), var(--clr-indigo));
        color: #fff;
        border: none;
        cursor: pointer;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(0,0,0,.4), 0 0 0 0 var(--clr-accent-glow);
        transition: transform 0.25s cubic-bezier(.34,1.56,.64,1),
                    box-shadow 0.25s ease,
                    background 0.3s ease;
        animation: themeFabEntrance 0.5s cubic-bezier(.34,1.56,.64,1) both;
        outline: none;
      }
      body.theme-google #theme-switcher-fab {
        background: linear-gradient(135deg, #4285F4, #34A853);
        box-shadow: 0 2px 10px rgba(66,133,244,.4);
      }
      body.theme-instagram #theme-switcher-fab {
        background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
        box-shadow: 0 4px 20px rgba(225,48,108,.4);
      }
      #theme-switcher-fab:hover {
        transform: scale(1.12) rotate(15deg);
        box-shadow: 0 8px 28px rgba(0,0,0,.5);
      }
      #theme-switcher-fab.panel-open {
        transform: scale(1.05) rotate(45deg);
      }
      #theme-switcher-fab svg {
        width: 22px;
        height: 22px;
        transition: transform 0.3s ease;
        pointer-events: none;
      }
      @keyframes themeFabEntrance {
        from { transform: scale(0) rotate(-180deg); opacity: 0; }
        to   { transform: scale(1) rotate(0deg); opacity: 1; }
      }

      /* ── Theme Panel ── */
      #theme-panel {
        position: fixed;
        bottom: 84px;
        right: 24px;
        width: 260px;
        background: var(--clr-bg-elevated, #1a2235);
        border: 1px solid var(--glass-border, rgba(255,255,255,.09));
        border-radius: 16px;
        box-shadow: 0 16px 48px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04);
        z-index: 9998;
        overflow: hidden;
        /* Initial hidden state — slide from right */
        transform: translateX(calc(100% + 32px));
        opacity: 0;
        pointer-events: none;
        transition: transform 0.35s cubic-bezier(.2,.8,.2,1),
                    opacity 0.3s ease;
      }
      body.theme-google #theme-panel {
        background: #ffffff;
        border-color: rgba(0,0,0,.12);
        box-shadow: 0 8px 24px rgba(0,0,0,.15);
      }
      #theme-panel.panel-visible {
        transform: translateX(0);
        opacity: 1;
        pointer-events: all;
      }
      #theme-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px 10px;
        border-bottom: 1px solid var(--glass-border, rgba(255,255,255,.09));
      }
      body.theme-google #theme-panel-header {
        border-bottom-color: rgba(0,0,0,.08);
      }
      #theme-panel-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--clr-text-primary, #f0f4ff);
        letter-spacing: .02em;
      }
      #theme-panel-close {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--glass-bg, rgba(255,255,255,.04));
        border: 1px solid var(--glass-border, rgba(255,255,255,.09));
        color: var(--clr-text-secondary, #94a3b8);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        line-height: 1;
        transition: background 0.2s, color 0.2s;
        outline: none;
      }
      #theme-panel-close:hover {
        background: rgba(255,255,255,.1);
        color: var(--clr-text-primary, #f0f4ff);
      }
      body.theme-google #theme-panel-close:hover {
        background: rgba(0,0,0,.06);
      }
      #theme-options {
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .theme-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 10px;
        cursor: pointer;
        border: 2px solid transparent;
        background: var(--glass-bg, rgba(255,255,255,.04));
        transition: background 0.2s, border-color 0.2s, transform 0.15s;
        outline: none;
        position: relative;
      }
      .theme-option:hover {
        background: rgba(255,255,255,.07);
        transform: translateX(-3px);
      }
      body.theme-google .theme-option:hover {
        background: rgba(0,0,0,.04);
      }
      .theme-option.active {
        border-color: var(--clr-accent, #4f7cff);
        background: rgba(79,124,255,.08);
      }
      body.theme-google .theme-option.active {
        border-color: #4285F4;
        background: rgba(66,133,244,.08);
      }
      body.theme-instagram .theme-option.active {
        border-color: #e1306c;
        background: rgba(225,48,108,.1);
      }
      .theme-palette {
        display: flex;
        gap: 3px;
        flex-shrink: 0;
      }
      .theme-palette-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 1.5px solid rgba(255,255,255,.2);
      }
      body.theme-google .theme-palette-dot {
        border-color: rgba(0,0,0,.15);
      }
      .theme-option-info {
        flex: 1;
        min-width: 0;
      }
      .theme-option-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--clr-text-primary, #f0f4ff);
        line-height: 1.3;
      }
      .theme-option-desc {
        font-size: 11px;
        color: var(--clr-text-muted, #4b5776);
        margin-top: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .theme-option-check {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: var(--clr-accent, #4f7cff);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #fff;
        flex-shrink: 0;
        opacity: 0;
        transform: scale(0);
        transition: opacity 0.2s, transform 0.25s cubic-bezier(.34,1.56,.64,1);
      }
      body.theme-google .theme-option-check { background: #4285F4; }
      body.theme-instagram .theme-option-check { background: #e1306c; }
      .theme-option.active .theme-option-check {
        opacity: 1;
        transform: scale(1);
      }
      .theme-option-icon {
        font-size: 18px;
        flex-shrink: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: rgba(255,255,255,.05);
      }
      body.theme-google .theme-option-icon { background: rgba(0,0,0,.04); }
      
      /* Ensure Crown Visibility */
      .student-crown-icon {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        z-index: 100 !important;
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Create DOM elements ── */
  function createWidget() {
    // FAB button
    const fab = document.createElement('button');
    fab.id = 'theme-switcher-fab';
    fab.setAttribute('aria-label', 'Change color theme');
    fab.setAttribute('title', 'Change Theme');
    fab.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a10 10 0 0 1 0 20"/>
        <path d="M2 12h20"/>
        <path d="M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10"/>
      </svg>`;

    // Panel
    const panel = document.createElement('div');
    panel.id = 'theme-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Theme selection');
    panel.innerHTML = `
      <div id="theme-panel-header">
        <span id="theme-panel-title">✨ Choose Theme</span>
        <button id="theme-panel-close" aria-label="Close theme panel">✕</button>
      </div>
      <div id="theme-options" role="listbox" aria-label="Available themes">
        ${THEMES.map(t => `
          <button
            class="theme-option"
            data-theme="${t.id}"
            role="option"
            aria-label="${t.label} theme"
            title="${t.label}"
          >
            <span class="theme-option-icon">${t.icon}</span>
            <div class="theme-palette">
              ${t.palette.map(c => `<span class="theme-palette-dot" style="background:${c}"></span>`).join('')}
            </div>
            <span class="theme-option-check" aria-hidden="true">✓</span>
          </button>`).join('')}
      </div>`;

    document.body.appendChild(fab);
    document.body.appendChild(panel);
    return { fab, panel };
  }

  /* ── Apply theme ── */
  function applyTheme(themeId, save = true) {
    const body = document.body;
    // Remove old theme classes
    body.classList.remove('theme-default', 'theme-google', 'theme-instagram');
    if (themeId !== 'default') {
      body.classList.add(`theme-${themeId}`);
    }
    if (save) {
      try { localStorage.setItem(STORAGE_KEY, themeId); } catch (e) { }
    }
    // Update active state on options
    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === themeId);
      opt.setAttribute('aria-selected', opt.dataset.theme === themeId ? 'true' : 'false');
    });
  }

  /* ── Toggle panel ── */
  function togglePanel(fab, panel) {
    const isOpen = panel.classList.contains('panel-visible');
    if (isOpen) {
      closePanel(fab, panel);
    } else {
      openPanel(fab, panel);
    }
  }

  function openPanel(fab, panel) {
    panel.classList.add('panel-visible');
    fab.classList.add('panel-open');
    fab.setAttribute('aria-expanded', 'true');
  }

  function closePanel(fab, panel) {
    panel.classList.remove('panel-visible');
    fab.classList.remove('panel-open');
    fab.setAttribute('aria-expanded', 'false');
  }

  /* ── Init ── */
  function init() {
    injectStyles();
    const { fab, panel } = createWidget();

    // Restore saved theme immediately
    let saved = 'default';
    try { saved = localStorage.getItem(STORAGE_KEY) || 'default'; } catch (e) { }
    applyTheme(saved, false);

    // FAB click
    fab.addEventListener('click', () => togglePanel(fab, panel));

    // Close button
    document.getElementById('theme-panel-close').addEventListener('click', () => closePanel(fab, panel));

    // Theme option clicks
    panel.querySelectorAll('.theme-option').forEach(opt => {
      opt.addEventListener('click', () => {
        applyTheme(opt.dataset.theme);
        // Brief delay then close
        setTimeout(() => closePanel(fab, panel), 220);
      });
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && e.target !== fab) {
        closePanel(fab, panel);
      }
    }, true);

    // Keyboard: Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePanel(fab, panel);
    });
  }

  /* ── Boot ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
>>>>>>> 199b10f (added new files)
