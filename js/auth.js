<<<<<<< HEAD
/**
 * InternTrack — Auth Module
 * Central authentication & session management.
 * All role checks and redirects go through here.
 */

'use strict';

const Auth = (() => {
  const SESSION_KEY = 'interntrack_session';

  // ── Hardcoded demo users ──
  const USERS = [
    { id: 'u_admin', email: 'admin@interntrack.com', password: 'admin123', role: 'admin', displayName: 'Alex Morgan' },
    { id: 'u_intern1', email: 'intern01@interntrack.com', password: 'intern123', role: 'user', displayName: 'Jordan Lee' },
    { id: 'u_intern2', email: 'intern02@interntrack.com', password: 'intern456', role: 'user', displayName: 'Casey Rivera' },
  ];

  /**
   * Attempt login.
   * @param {string} email
   * @param {string} password
   * @param {string} role — 'admin' | 'user'
   * @returns {{ success: boolean, user?: object, error?: string }}
   */
  function login(email, password, role) {
    const user = USERS.find(
      u => u.email === email.trim().toLowerCase() &&
        u.password === password &&
        u.role === role
    );
    if (!user) {
      return { success: false, error: 'Invalid credentials. Please check your email, password and role.' };
    }
    const session = {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      loginTime: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session)); // persist across tabs
    return { success: true, user: session };
  }

  /** Clear session and redirect to login. */
  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  }

  /** Get current session object, or null if not authenticated. */
  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /** Get current user role. */
  function getRole() {
    const s = getSession();
    return s ? s.role : null;
  }

  /** Returns true if authenticated. */
  function isAuthenticated() {
    return getSession() !== null;
  }

  /** Returns true if current user is admin. */
  function isAdmin() {
    return getRole() === 'admin';
  }

  /**
   * Guard: require auth. If not authenticated, redirect to login.
   * If allowedRoles provided, also check role.
   * @param {string[]} [allowedRoles] — optional whitelist of roles
   */
  function requireAuth(allowedRoles) {
    const session = getSession();
    if (!session) {
      window.location.replace('login.html');
      return null;
    }
    if (allowedRoles && !allowedRoles.includes(session.role)) {
      // Role not allowed — redirect to dashboard
      window.location.replace('dashboard.html');
      return null;
    }
    return session;
  }

  /** Redirect authenticated users to their correct dashboard. */
  function redirectByRole() {
    const session = getSession();
    if (session) {
      window.location.replace('dashboard.html');
    }
  }

  return { login, logout, getSession, getRole, isAuthenticated, isAdmin, requireAuth, redirectByRole };
})();
=======
/**
 * InternTrack — Auth Module
 * Central authentication & session management.
 * All role checks and redirects go through here.
 */

'use strict';

const Auth = (() => {
  const SESSION_KEY = 'interntrack_session';

  // ── Hardcoded demo users ──
  const USERS = [
    { id: 'u_admin', email: 'admin@interntrack.com', password: 'admin123', role: 'admin', displayName: 'Alex Morgan' },
    { id: 'u_intern1', email: 'intern01@interntrack.com', password: 'intern123', role: 'user', displayName: 'Jordan Lee' },
    { id: 'u_intern2', email: 'intern02@interntrack.com', password: 'intern456', role: 'user', displayName: 'Casey Rivera' },
  ];

  /**
   * Attempt login.
   * @param {string} email
   * @param {string} password
   * @param {string} role — 'admin' | 'user'
   * @returns {{ success: boolean, user?: object, error?: string }}
   */
  function login(email, password, role) {
    const user = USERS.find(
      u => u.email === email.trim().toLowerCase() &&
        u.password === password &&
        u.role === role
    );
    if (!user) {
      return { success: false, error: 'Invalid credentials. Please check your email, password and role.' };
    }
    const session = {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      loginTime: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session)); // persist across tabs
    return { success: true, user: session };
  }

  /** Clear session and redirect to login. */
  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  }

  /** Get current session object, or null if not authenticated. */
  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /** Get current user role. */
  function getRole() {
    const s = getSession();
    return s ? s.role : null;
  }

  /** Returns true if authenticated. */
  function isAuthenticated() {
    return getSession() !== null;
  }

  /** Returns true if current user is admin. */
  function isAdmin() {
    return getRole() === 'admin';
  }

  /**
   * Guard: require auth. If not authenticated, redirect to login.
   * If allowedRoles provided, also check role.
   * @param {string[]} [allowedRoles] — optional whitelist of roles
   */
  function requireAuth(allowedRoles) {
    const session = getSession();
    if (!session) {
      window.location.replace('login.html');
      return null;
    }
    if (allowedRoles && !allowedRoles.includes(session.role)) {
      // Role not allowed — redirect to dashboard
      window.location.replace('dashboard.html');
      return null;
    }
    return session;
  }

  /** Redirect authenticated users to their correct dashboard. */
  function redirectByRole() {
    const session = getSession();
    if (session) {
      window.location.replace('dashboard.html');
    }
  }

  return { login, logout, getSession, getRole, isAuthenticated, isAdmin, requireAuth, redirectByRole };
})();
>>>>>>> 199b10f (added new files)
