<<<<<<< HEAD
/**
 * InternTrack — Login Page Logic
 * Handles role toggle, form validation, animations, and auth.
 */

'use strict';

(() => {
    // Redirect already-authenticated users
    Auth.redirectByRole();

    // ── DOM refs ──
    const form = document.getElementById('login-form');
    const emailEl = document.getElementById('email');
    const passwordEl = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const errorBox = document.getElementById('error-box');
    const errorMsg = document.getElementById('error-msg');
    const togglePw = document.getElementById('toggle-pw');
    const roleBtns = document.querySelectorAll('.role-btn');

    let selectedRole = 'admin'; // default

    // ── Role Toggle ──
    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            roleBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            selectedRole = btn.dataset.role;
            hideError();
            // Update placeholder hints
            if (selectedRole === 'admin') {
                emailEl.placeholder = 'e.g. admin@interntrack.com';
                passwordEl.placeholder = 'e.g. admin123';
            } else {
                emailEl.placeholder = 'e.g. intern01@interntrack.com';
                passwordEl.placeholder = 'e.g. intern123';
            }
        });
    });

    // ── Password toggle ──
    togglePw.addEventListener('click', () => {
        const isHidden = passwordEl.type === 'password';
        passwordEl.type = isHidden ? 'text' : 'password';
        togglePw.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
        togglePw.querySelector('svg').innerHTML = isHidden
            ? '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
            : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    });

    // ── Ripple effect ──
    function addRipple(e) {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-el');
        ripple.style.left = (e.clientX - rect.left - 6) + 'px';
        ripple.style.top = (e.clientY - rect.top - 6) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
    loginBtn.addEventListener('click', addRipple);

    // ── Error helpers ──
    function showError(msg) {
        errorMsg.textContent = msg;
        errorBox.classList.add('visible');
        // Shake the card
        const card = document.querySelector('.auth-card');
        card.classList.remove('shake');
        void card.offsetWidth; // force reflow
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 600);
    }

    function hideError() {
        errorBox.classList.remove('visible');
    }

    // ── Loading state ──
    function setLoading(on) {
        loginBtn.disabled = on;
        loginBtn.classList.toggle('loading', on);
    }

    // ── Submit ──
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();

        const email = emailEl.value.trim();
        const password = passwordEl.value;

        // Basic validation
        if (!email) { showError('Email ID is required.'); emailEl.focus(); return; }
        if (!password) { showError('Password is required.'); passwordEl.focus(); return; }

        setLoading(true);

        // Simulate async network delay for realism
        await new Promise(r => setTimeout(r, 900));

        const result = Auth.login(email, password, selectedRole);

        if (!result.success) {
            setLoading(false);
            showError(result.error);
            return;
        }

        // Success → fade out and redirect
        loginBtn.textContent = '✓ Authenticated';
        loginBtn.style.backgroundColor = 'var(--clr-success)';
        await new Promise(r => setTimeout(r, 600));
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity .4s ease';
        setTimeout(() => window.location.replace('dashboard.html'), 400);
    });

    // ── Create Account ──
    const createAccountLink = document.getElementById('create-account-link');
    if (createAccountLink) {
        createAccountLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Registration is currently disabled in the demo. Please contact your administrator to create an account.');
        });
    }

    // ── Input: clear error on change ──
    [emailEl, passwordEl].forEach(el => {
        el.addEventListener('input', hideError);
    });

})();
=======
/**
 * InternTrack — Login Page Logic
 * Handles role toggle, form validation, animations, and auth.
 */

'use strict';

(() => {
    // Redirect already-authenticated users
    Auth.redirectByRole();

    // ── DOM refs ──
    const form = document.getElementById('login-form');
    const emailEl = document.getElementById('email');
    const passwordEl = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const errorBox = document.getElementById('error-box');
    const errorMsg = document.getElementById('error-msg');
    const togglePw = document.getElementById('toggle-pw');
    const roleBtns = document.querySelectorAll('.role-btn');

    let selectedRole = 'admin'; // default

    // ── Role Toggle ──
    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            roleBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            selectedRole = btn.dataset.role;
            hideError();
            // Update placeholder hints
            if (selectedRole === 'admin') {
                emailEl.placeholder = 'e.g. admin@interntrack.com';
                passwordEl.placeholder = 'e.g. admin123';
            } else {
                emailEl.placeholder = 'e.g. intern01@interntrack.com';
                passwordEl.placeholder = 'e.g. intern123';
            }
        });
    });

    // ── Password toggle ──
    togglePw.addEventListener('click', () => {
        const isHidden = passwordEl.type === 'password';
        passwordEl.type = isHidden ? 'text' : 'password';
        togglePw.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
        togglePw.querySelector('svg').innerHTML = isHidden
            ? '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
            : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    });

    // ── Ripple effect ──
    function addRipple(e) {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-el');
        ripple.style.left = (e.clientX - rect.left - 6) + 'px';
        ripple.style.top = (e.clientY - rect.top - 6) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
    loginBtn.addEventListener('click', addRipple);

    // ── Error helpers ──
    function showError(msg) {
        errorMsg.textContent = msg;
        errorBox.classList.add('visible');
        // Shake the card
        const card = document.querySelector('.auth-card');
        card.classList.remove('shake');
        void card.offsetWidth; // force reflow
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 600);
    }

    function hideError() {
        errorBox.classList.remove('visible');
    }

    // ── Loading state ──
    function setLoading(on) {
        loginBtn.disabled = on;
        loginBtn.classList.toggle('loading', on);
    }

    // ── Submit ──
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();

        const email = emailEl.value.trim();
        const password = passwordEl.value;

        // Basic validation
        if (!email) { showError('Email ID is required.'); emailEl.focus(); return; }
        if (!password) { showError('Password is required.'); passwordEl.focus(); return; }

        setLoading(true);

        // Simulate async network delay for realism
        await new Promise(r => setTimeout(r, 900));

        const result = Auth.login(email, password, selectedRole);

        if (!result.success) {
            setLoading(false);
            showError(result.error);
            return;
        }

        // Success → fade out and redirect
        loginBtn.textContent = '✓ Authenticated';
        loginBtn.style.backgroundColor = 'var(--clr-success)';
        await new Promise(r => setTimeout(r, 600));
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity .4s ease';
        setTimeout(() => window.location.replace('dashboard.html'), 400);
    });

    // ── Create Account ──
    const createAccountLink = document.getElementById('create-account-link');
    if (createAccountLink) {
        createAccountLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Registration is currently disabled in the demo. Please contact your administrator to create an account.');
        });
    }

    // ── Input: clear error on change ──
    [emailEl, passwordEl].forEach(el => {
        el.addEventListener('input', hideError);
    });

})();
>>>>>>> 199b10f (added new files)
