/**
 * InternTrack — Profile Builder Logic (Admin Only)
 * Accordion UI, tag chip input, avatar upload, save to localStorage.
 */

'use strict';

(() => {
    // Guard: admin only
    const session = Auth.requireAuth(['admin']);
    if (!session) return;

    // ── Sidebar setup (shared pattern) ──
    setupSidebar(session, 'profile-builder.html');

    // ── DOM refs ──
    const saveBtn = document.getElementById('save-btn');
    const saveStatus = document.getElementById('save-status');
    const saveStatusText = document.getElementById('save-status-text');
    const saveStatusIcon = document.getElementById('save-status-icon');
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarFile = document.getElementById('avatar-file');
    const tagsList = document.getElementById('tags-list');
    const tagsInput = document.getElementById('skills-input');
    const skillsCountBadge = document.getElementById('skills-count-badge');
    const logoutBtn = document.getElementById('logout-btn');
    const studentSelector = document.getElementById('student-selector');
    const addStudentBtn = document.getElementById('add-student-btn');

    // ── Multi-profile State ──
    let allProfiles = Storage.getProfiles();
    // Support deep-link: profile-builder.html?student=userId
    const urlStudentId = new URLSearchParams(window.location.search).get('student');
    let currentStudentId = (urlStudentId && allProfiles[urlStudentId])
        ? urlStudentId
        : (Object.keys(allProfiles)[0] || 'u_intern1');
    let profile = allProfiles[currentStudentId] || {};
    let skills = [...(profile.skills || [])];

    // ── Init ──
    initStudentSelector();
    populateForm(profile);

    function initStudentSelector() {
        if (!studentSelector) return;
        studentSelector.innerHTML = Object.values(allProfiles).map(p =>
            `<option value="${p.userId}" ${p.userId === currentStudentId ? 'selected' : ''}>${p.name || p.userId}</option>`
        ).join('');

        studentSelector.addEventListener('change', (e) => {
            if (!confirm('Switch student? Unsaved changes for the current student will be lost.')) {
                studentSelector.value = currentStudentId;
                return;
            }
            currentStudentId = e.target.value;
            profile = allProfiles[currentStudentId];
            skills = [...(profile.skills || [])];
            populateForm(profile);
            markSaved(); // Reset status
        });
    }

    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', () => {
            const name = prompt('Enter new student name:');
            if (!name) return;
            const id = 'u_new_' + Date.now();
            const newProfile = {
                userId: id,
                name: name,
                email: '',
                tagline: '',
                bio: '',
                skills: [],
                internship: {},
                socialLinks: {}
            };
            allProfiles[id] = newProfile;
            Storage.saveProfile(id, newProfile);

            // Switch to new student
            currentStudentId = id;
            allProfiles = Storage.getProfiles();
            initStudentSelector();
            profile = allProfiles[currentStudentId];
            skills = [];
            populateForm(profile);
            showToast(`Created profile for ${name}`, 'success');
        });
    }

    function populateForm(p) {
        if (!p) return;
        // Personal
        getField('name').value = p.name || '';
        getField('email').value = p.email || '';
        getField('tagline').value = p.tagline || '';
        getField('location').value = p.location || '';
        getField('bio').value = p.bio || '';
        getField('github').value = p.socialLinks?.github || '';
        getField('linkedin').value = p.socialLinks?.linkedin || '';
        // Avatar
        if (p.avatar) {
            setAvatarPreview(p.avatar);
        } else {
            avatarPreview.textContent = (p.name || 'J')[0].toUpperCase();
        }
        // Skills
        renderTags();
        // Internship
        const i = p.internship || {};
        getField('company').value = i.company || '';
        getField('role').value = i.role || '';
        getField('start').value = i.startDate || '';
        getField('end').value = i.endDate || '';
        getField('intern-desc').value = i.description || '';
    }

    function getField(id) { return document.getElementById('field-' + id); }

    // ── Avatar upload ──
    avatarFile.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            showToast('Image too large. Max size is 2MB.', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = ev => {
            profile.avatar = ev.target.result;
            setAvatarPreview(ev.target.result);
            markUnsaved();
        };
        reader.readAsDataURL(file);
    });
    function setAvatarPreview(src) {
        avatarPreview.innerHTML = `<img src="${src}" alt="Avatar preview">`;
    }

    // ── Tag chip system ──
    function renderTags() {
        tagsList.innerHTML = skills.map((s, i) => `
      <span class="tag-chip">
        ${s}
        <button class="tag-chip-remove" data-idx="${i}" aria-label="Remove ${s} skill" type="button">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </span>
    `).join('');
        // Attach remove listeners
        tagsList.querySelectorAll('.tag-chip-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                skills.splice(parseInt(btn.dataset.idx, 10), 1);
                renderTags();
                markUnsaved();
            });
        });
        skillsCountBadge.textContent = skills.length ? `(${skills.length})` : '';
    }

    function addTag(value) {
        const v = value.trim().replace(/,$/, '');
        if (!v || skills.includes(v)) return;
        skills.push(v);
        renderTags();
        markUnsaved();
    }

    tagsInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(tagsInput.value);
            tagsInput.value = '';
        } else if (e.key === 'Backspace' && !tagsInput.value && skills.length) {
            skills.pop();
            renderTags();
            markUnsaved();
        }
    });
    tagsInput.addEventListener('blur', () => {
        if (tagsInput.value.trim()) { addTag(tagsInput.value); tagsInput.value = ''; }
    });
    // Allow clicking tag wrap to focus input
    document.getElementById('tags-wrap').addEventListener('click', () => tagsInput.focus());

    // ── Change detection ──
    function markSaved() {
        saveStatus.classList.remove('saved');
        saveStatusIcon.textContent = '✅';
        saveStatusText.textContent = 'All changes saved';
    }

    function markUnsaved() {
        saveStatus.classList.remove('saved');
        saveStatusIcon.textContent = '💾';
        saveStatusText.textContent = 'Unsaved changes';
    }
    document.querySelectorAll('.field-input').forEach(el => {
        el.addEventListener('input', markUnsaved);
    });

    // ── Save ──
    saveBtn.addEventListener('click', () => {
        const p = {
            ...profile,
            name: getField('name').value.trim(),
            email: getField('email').value.trim(),
            tagline: getField('tagline').value.trim(),
            location: getField('location').value.trim(),
            bio: getField('bio').value.trim(),
            skills: [...skills],
            socialLinks: {
                github: getField('github').value.trim(),
                linkedin: getField('linkedin').value.trim(),
            },
            internship: {
                company: getField('company').value.trim(),
                role: getField('role').value.trim(),
                startDate: getField('start').value,
                endDate: getField('end').value,
                description: getField('intern-desc').value.trim(),
                technologies: skills.slice(0, 4),
            }
        };

        Storage.saveProfile(currentStudentId, p);
        allProfiles = Storage.getProfiles();
        profile = allProfiles[currentStudentId];
        initStudentSelector(); // Update dropdown text in case name changed

        // Success feedback
        saveBtn.classList.add('saved-anim');
        setTimeout(() => saveBtn.classList.remove('saved-anim'), 800);
        saveStatus.classList.add('saved');
        saveStatusIcon.textContent = '✅';
        saveStatusText.textContent = 'Saved successfully';

        showToast(`Profile for ${p.name || currentStudentId} saved!`, 'success');
        setTimeout(() => {
            saveStatus.classList.remove('saved');
            saveStatusText.textContent = 'All changes saved';
        }, 3000);
    });

    // ── Accordion ──
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => toggleAccordion(header.closest('.accordion-item')));
        header.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAccordion(header.closest('.accordion-item'));
            }
        });
    });

    function toggleAccordion(item) {
        const isOpen = item.classList.contains('open');
        item.classList.toggle('open', !isOpen);
        item.querySelector('.accordion-header').setAttribute('aria-expanded', String(!isOpen));
    }

    // ── Sidebar & Logout ──
    logoutBtn.addEventListener('click', () => Auth.logout());

    // ── Toast ──
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span class="toast-icon" aria-hidden="true">${icons[type]}</span><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-12px)';
            toast.style.transition = 'all .3s ease';
            setTimeout(() => toast.remove(), 350);
        }, 3200);
    }

    // ── Shared sidebar builder ──
    function setupSidebar(session, activePage) {
        const nav = document.getElementById('sidebar-nav');
        const avatar = document.getElementById('user-avatar-sidebar');
        const nameEl = document.getElementById('user-name-sidebar');
        const roleEl = document.getElementById('user-role-sidebar');

        const p = Storage.getAdminProfile ? Storage.getAdminProfile(session.userId) : null;
        const currentName = p?.name || session.displayName;

<<<<<<< HEAD
        if (avatar) avatar.textContent = currentName[0].toUpperCase();
        if (nameEl) nameEl.textContent = currentName;
        if (roleEl) roleEl.textContent = 'Administrator';
=======
        if (avatar) {
            if (p?.avatar) {
                avatar.innerHTML = `<img src="${p.avatar}" alt="${currentName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
            } else {
                avatar.textContent = currentName[0].toUpperCase();
            }
        }
        if (nameEl) nameEl.textContent = currentName;
        if (roleEl) roleEl.textContent = p?.role || 'Administrator';

>>>>>>> 199b10f (added new files)

        const items = [
            { label: 'Dashboard', href: 'dashboard.html', icon: '⊞' },
            { label: 'My Profile', href: 'admin-profile.html', icon: '👤' },
<<<<<<< HEAD
            { label: 'Students', href: 'students.html', icon: '🎓' },
=======
            { label: 'Interns', href: 'students.html', icon: '👥' },
>>>>>>> 199b10f (added new files)
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

        // Mobile sidebar
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
