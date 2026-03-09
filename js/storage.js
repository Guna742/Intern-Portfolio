/**
 * InternTrack — Storage Module
 * LocalStorage CRUD helpers + default seed data.
 */

'use strict';

const Storage = (() => {
    const PROFILES_KEY = 'interntrack_profiles';
    const PROJECTS_KEY = 'interntrack_projects';
    const REPORTS_KEY = 'interntrack_hourly_reports';

    // ── Default seed data (loaded on first run) ──
    const DEFAULT_PROFILES = {};

    const DEFAULT_PROJECTS = [];

    const VERSION_KEY = 'interntrack_v';
    const CURRENT_VERSION = '3.0';

    /** Bootstrap default data on first run; clears stale data from old builds. */
    function seed() {
        const storedVersion = localStorage.getItem(VERSION_KEY);
        if (storedVersion !== CURRENT_VERSION) {
            localStorage.removeItem(PROFILES_KEY);
            localStorage.removeItem(PROJECTS_KEY);
            localStorage.removeItem(REPORTS_KEY);
            Object.keys(localStorage)
                .filter(k => k.startsWith('interntrack_') && k !== VERSION_KEY)
                .forEach(k => localStorage.removeItem(k));
            localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        }
        if (!localStorage.getItem(PROFILES_KEY)) {
            localStorage.setItem(PROFILES_KEY, JSON.stringify(DEFAULT_PROFILES));
        }
        if (!localStorage.getItem(PROJECTS_KEY)) {
            localStorage.setItem(PROJECTS_KEY, JSON.stringify(DEFAULT_PROJECTS));
        }
        if (!localStorage.getItem(REPORTS_KEY)) {
            localStorage.setItem(REPORTS_KEY, JSON.stringify([]));
        }
    }

    // ── Profiles ──
    function getProfiles() {
        try {
            const raw = localStorage.getItem(PROFILES_KEY);
            return raw ? JSON.parse(raw) : DEFAULT_PROFILES;
        } catch { return DEFAULT_PROFILES; }
    }

    function getProfile(userId) {
        if (!userId) {
            const session = Auth.getSession();
            userId = session ? session.userId : null;
        }
        if (!userId) return null;
        const profiles = getProfiles();
        if (profiles[userId]) return profiles[userId];

        // NEW: Handle missing profiles for logged-in users (Skeletal Profile)
        const session = Auth.getSession();
        if (session && session.userId === userId) {
            return {
                userId,
                name: session.displayName || 'New Intern',
                email: session.email || '',
                tagline: 'Software Engineering Intern',
                bio: 'Welcome to I.R.I.S! Please update your bio and skills to complete your profile.',
                skills: [],
                location: '',
                internship: { role: 'Intern', company: '' },
                socialLinks: { github: '', linkedin: '' },
                _isSkeleton: true // Internal flag to prompt saving
            };
        }
        return null;
    }

    function saveProfile(userId, data) {
        const profiles = getProfiles();
        profiles[userId] = { ...data, userId };
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    }

    function deleteProfile(userId) {
        const profiles = getProfiles();
        if (profiles[userId]) {
            delete profiles[userId];
            localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
            // Also delete their projects
            const projects = getProjects().filter(p => p.ownerId !== userId);
            localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
            return true;
        }
        return false;
    }

    // ── Projects ──
    function getProjects() {
        try {
            const raw = localStorage.getItem(PROJECTS_KEY);
            const projects = raw ? JSON.parse(raw) : DEFAULT_PROJECTS;
            return projects.sort((a, b) => b.createdAt - a.createdAt);
        } catch { return DEFAULT_PROJECTS; }
    }

    function saveProject(project) {
        const projects = getProjects();
        const idx = projects.findIndex(p => p.id === project.id);
        if (idx > -1) {
            projects[idx] = project; // update
        } else {
            project.id = 'proj_' + Date.now();
            project.createdAt = Date.now();
            projects.unshift(project); // add to front
        }
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
        return project;
    }

    function deleteProject(id) {
        const projects = getProjects().filter(p => p.id !== id);
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }

    function getProjectById(id) {
        return getProjects().find(p => p.id === id) || null;
    }

    // ── Hourly Reports ──
    function getHourlyReports(userId) {
        try {
            const raw = localStorage.getItem(REPORTS_KEY);
            const all = raw ? JSON.parse(raw) : [];
            if (!userId) return all;
            return all.filter(r => String(r.userId) === String(userId));
        } catch { return []; }
    }

    function saveHourlyReport(report) {
        const all = getHourlyReports();
        report.id = 'rep_' + Date.now();
        report.createdAt = Date.now();
        all.push(report);
        localStorage.setItem(REPORTS_KEY, JSON.stringify(all));
        return report;
    }

    // ── Admin Profiles ──
    const ADMIN_KEY = 'interntrack_admin';
    function getAdminProfile(userId) {
        try {
            const raw = localStorage.getItem(ADMIN_KEY);
            const admins = raw ? JSON.parse(raw) : {};
            return admins[userId] || null;
        } catch { return null; }
    }

    function saveAdminProfile(userId, data) {
        try {
            const raw = localStorage.getItem(ADMIN_KEY);
            const admins = raw ? JSON.parse(raw) : {};
            admins[userId] = { ...data, userId };
            localStorage.setItem(ADMIN_KEY, JSON.stringify(admins));
        } catch (e) { console.error('Failed to save admin profile', e); }
    }

    /** Centralized scoring logic (shared across leaderboard/profile/analytics) */
    function computeInternScore(p) {
        if (!p || !p.userId) return 0;
        const projects = getProjects().filter(proj => String(proj.ownerId) === String(p.userId));
        const ratedProjects = projects.filter(proj => proj.rating);
        if (ratedProjects.length === 0) return 0;

        const totalRating = ratedProjects.reduce((sum, proj) => sum + proj.rating, 0);
        const avg = totalRating / ratedProjects.length;
        return Math.round((avg / 5) * 100);
    }

    /** Calculate rank for a specific intern based on overall score */
    function getInternRank(userId) {
        const profiles = getProfiles();
        const internList = Object.values(profiles);

        const enriched = internList.map(p => ({
            userId: p.userId,
            score: computeInternScore(p)
        })).sort((a, b) => b.score - a.score);

        const index = enriched.findIndex(p => p.userId === userId);
        return index > -1 ? index + 1 : null;
    }

    return {
        seed,
        getProfiles,
        getProfile,
        saveProfile,
        deleteProfile,
        getProjects,
        saveProject,
        deleteProject,
        getProjectById,
        getAdminProfile,
        saveAdminProfile,
        computeInternScore,
        getInternRank,
        getHourlyReports,
        saveHourlyReport
    };
})();

// Auto-seed on load
Storage.seed();
