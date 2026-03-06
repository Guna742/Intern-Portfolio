<<<<<<< HEAD
/**
 * InternTrack — Admin Profile Popup
 * Shared module: injects a slide-up profile card when the sidebar user-info is clicked.
 * Include AFTER auth.js and storage.js.
 */

'use strict';

const AdminPopup = (() => {

    let popupEl = null;
    let isOpen = false;

    function buildPopupHTML(session) {
        const isAdmin = session.role === 'admin';
        const p = isAdmin ? (Storage.getAdminProfile ? Storage.getAdminProfile(session.userId) : null) : Storage.getProfile(session.userId);
        const currentName = p?.name || session.displayName;

        const initial = currentName[0].toUpperCase();

        const loginDate = new Date(session.loginTime).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        const adminCapabilities = [
            { icon: '✏️', label: 'Profile Builder', desc: 'Create & edit intern profiles' },
            { icon: '🎓', label: 'Student Management', desc: 'View all intern details' },
            { icon: '🗂️', label: 'Project Oversight', desc: 'Monitor all project submissions' },
        ];

        const internCapabilities = [
            { icon: '👤', label: 'My Profile', desc: 'View your own portfolio' },
            { icon: '🗂️', label: 'Projects', desc: 'Submit & manage your projects' },
        ];

        const caps = isAdmin ? adminCapabilities : internCapabilities;

        return `
        <div class="apop-arrow" aria-hidden="true"></div>
        <div class="apop-header">
            <div class="apop-avatar">${initial}</div>
            <div class="apop-identity">
                <div class="apop-name">${currentName}</div>
                <div class="apop-email">${session.email}</div>
                <span class="apop-badge ${isAdmin ? 'apop-badge-admin' : 'apop-badge-user'}">
                    ${isAdmin ? '🛡️ Administrator' : '🎓 Intern'}
                </span>
            </div>
        </div>
        <div class="apop-divider"></div>
        <div class="apop-section-label">Permissions</div>
        <ul class="apop-caps">
            ${caps.map(c => `
            <li class="apop-cap-item">
                <span class="apop-cap-icon" aria-hidden="true">${c.icon}</span>
                <div>
                    <div class="apop-cap-label">${c.label}</div>
                    <div class="apop-cap-desc">${c.desc}</div>
                </div>
            </li>`).join('')}
        </ul>
        <div class="apop-divider"></div>
        <div class="apop-meta">
            <span class="apop-meta-icon" aria-hidden="true">🕐</span>
            Logged in: ${loginDate}
        </div>
        <button class="apop-signout-btn" id="apop-signout-btn" aria-label="Sign out">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
        </button>`;
    }

    function open(session) {
        if (!popupEl) return;
        popupEl.innerHTML = buildPopupHTML(session);
        popupEl.classList.add('apop-visible');
        isOpen = true;

        document.getElementById('apop-signout-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            Auth.logout();
        });

        // close on outside click
        setTimeout(() => {
            document.addEventListener('click', closeOnOutside);
        }, 50);
    }

    function close() {
        if (!popupEl) return;
        popupEl.classList.remove('apop-visible');
        isOpen = false;
        document.removeEventListener('click', closeOnOutside);
    }

    function closeOnOutside(e) {
        if (popupEl && !popupEl.contains(e.target)) {
            close();
        }
    }

    function init() {
        const session = Auth.getSession();
        if (!session) return;

        const footer = document.querySelector('.sidebar-footer');
        if (!footer) return;

        // Create popup container anchored inside sidebar-footer
        popupEl = document.createElement('div');
        popupEl.className = 'admin-popup';
        popupEl.id = 'admin-popup';
        popupEl.setAttribute('role', 'dialog');
        popupEl.setAttribute('aria-label', 'User profile');
        footer.insertBefore(popupEl, footer.firstChild);

        // Wire click on user-info
        const userInfo = document.getElementById('user-info-sidebar');
        if (userInfo) {
            userInfo.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isOpen) {
                    close();
                } else {
                    open(session);
                }
            });

            // Keyboard support
            userInfo.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    userInfo.click();
                }
                if (e.key === 'Escape') close();
            });
        }

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) close();
        });
    }

    return { init, open, close };
})();

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', () => AdminPopup.init());
// Also init immediately in case DOMContentLoaded already fired
if (document.readyState !== 'loading') AdminPopup.init();
=======
/**
 * InternTrack — Admin Profile Popup
 * Shared module: injects a slide-up profile card when the sidebar user-info is clicked.
 * Include AFTER auth.js and storage.js.
 */

'use strict';

const AdminPopup = (() => {

    let popupEl = null;
    let isOpen = false;

    function buildPopupHTML(session) {
        const isAdmin = session.role === 'admin';
        const p = isAdmin ? (Storage.getAdminProfile ? Storage.getAdminProfile(session.userId) : null) : Storage.getProfile(session.userId);
        const currentName = p?.name || session.displayName;

        const initial = currentName[0].toUpperCase();
        const avatarHtml = p?.avatar
            ? `<img src="${p.avatar}" alt="${currentName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
            : initial;

        const loginDate = new Date(session.loginTime).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        const adminCapabilities = [
            { icon: '✏️', label: 'Profile Builder', desc: 'Create & edit intern profiles' },
            { icon: '🎓', label: 'Student Management', desc: 'View all intern details' },
            { icon: '🗂️', label: 'Project Oversight', desc: 'Monitor all project submissions' },
        ];

        const internCapabilities = [
            { icon: '👤', label: 'My Profile', desc: 'View your own portfolio' },
            { icon: '🗂️', label: 'Projects', desc: 'Submit & manage your projects' },
        ];

        const caps = isAdmin ? adminCapabilities : internCapabilities;

        return `
        <div class="apop-arrow" aria-hidden="true"></div>
        <div class="apop-header">
            <div class="apop-avatar" style="overflow:hidden">${avatarHtml}</div>
            <div class="apop-identity">
                <div class="apop-name">${currentName}</div>
                <div class="apop-email">${session.email}</div>
                <span class="apop-badge ${isAdmin ? 'apop-badge-admin' : 'apop-badge-user'}">
                    ${isAdmin ? '🛡️ Administrator' : '🎓 Intern'}
                </span>
            </div>
        </div>
        <div class="apop-divider"></div>
        <div class="apop-section-label">Permissions</div>
        <ul class="apop-caps">
            ${caps.map(c => `
            <li class="apop-cap-item">
                <span class="apop-cap-icon" aria-hidden="true">${c.icon}</span>
                <div>
                    <div class="apop-cap-label">${c.label}</div>
                    <div class="apop-cap-desc">${c.desc}</div>
                </div>
            </li>`).join('')}
        </ul>
        <div class="apop-divider"></div>
        <div class="apop-meta">
            <span class="apop-meta-icon" aria-hidden="true">🕐</span>
            Logged in: ${loginDate}
        </div>
        <button class="apop-signout-btn" id="apop-signout-btn" aria-label="Sign out">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
        </button>`;
    }

    function open(session) {
        if (!popupEl) return;
        popupEl.innerHTML = buildPopupHTML(session);
        popupEl.classList.add('apop-visible');
        isOpen = true;

        document.getElementById('apop-signout-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            Auth.logout();
        });

        // close on outside click
        setTimeout(() => {
            document.addEventListener('click', closeOnOutside);
        }, 50);
    }

    function close() {
        if (!popupEl) return;
        popupEl.classList.remove('apop-visible');
        isOpen = false;
        document.removeEventListener('click', closeOnOutside);
    }

    function closeOnOutside(e) {
        if (popupEl && !popupEl.contains(e.target)) {
            close();
        }
    }

    function init() {
        const session = Auth.getSession();
        if (!session) return;

        const footer = document.querySelector('.sidebar-footer');
        if (!footer) return;

        // Create popup container anchored inside sidebar-footer
        popupEl = document.createElement('div');
        popupEl.className = 'admin-popup';
        popupEl.id = 'admin-popup';
        popupEl.setAttribute('role', 'dialog');
        popupEl.setAttribute('aria-label', 'User profile');
        footer.insertBefore(popupEl, footer.firstChild);

        // Wire click on user-info
        const userInfo = document.getElementById('user-info-sidebar');
        if (userInfo) {
            userInfo.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isOpen) {
                    close();
                } else {
                    open(session);
                }
            });

            // Keyboard support
            userInfo.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    userInfo.click();
                }
                if (e.key === 'Escape') close();
            });
        }

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) close();
        });
    }

    return { init, open, close };
})();

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', () => AdminPopup.init());
// Also init immediately in case DOMContentLoaded already fired
if (document.readyState !== 'loading') AdminPopup.init();
>>>>>>> 199b10f (added new files)
