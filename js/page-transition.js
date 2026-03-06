/**
 * InternTrack — Global Page Transition System
 * Handles smooth fade-in/out during navigation
 */

const PageTransition = (() => {
    // ── Configuration ──
    const EXCLUDE_SELECTORS = [
        '[target="_blank"]',           // External links
        '[href^="#"]',                 // Anchors
        '[href^="javascript:"]',      // JS links
        '[href^="mailto:"]',          // Email links
        '[href^="tel:"]',             // Phone links
        '.no-transition'               // Explicitly opted-out links
    ];

    const TRANSITION_DURATION = 150; // ms (Snappier feel)

    // ── Initialization ──
    const init = () => {
        // 1. Create and inject overlay if it doesn't exist
        if (!document.getElementById('page-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'page-overlay';
            overlay.className = 'page-transition-overlay';
            document.body.appendChild(overlay);
        }

        // 2. Handle Entry Transition
        window.addEventListener('load', () => {
            document.body.classList.add('page-loaded');

            // Remove overlay after transition for accessibility/interaction
            setTimeout(() => {
                const overlay = document.getElementById('page-overlay');
                if (overlay) overlay.style.pointerEvents = 'none';
            }, TRANSITION_DURATION);
        });

        // 3. Handle Exit Transitions (Link Clicks)
        document.addEventListener('click', handleLinkClick);

        // 4. Handle Browser Back/Forward (Bfcache)
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                document.body.classList.add('page-loaded');
            }
        });

        // 5. Global Info Button Listener
        document.addEventListener('click', (e) => {
            const infoBtn = e.target.closest('#info-btn');
            if (infoBtn) {
                e.preventDefault();
                navigateTo('info.html');
            }
        });
    };

    const navigateTo = (targetHref) => {
        document.body.classList.remove('page-loaded');
        document.body.classList.add('page-exiting');

        // Preload hint
        const linkElem = document.createElement('link');
        linkElem.rel = 'prefetch';
        linkElem.href = targetHref;
        document.head.appendChild(linkElem);

        setTimeout(() => {
            window.location.href = targetHref;
        }, 80);
    };

    const handleLinkClick = (e) => {
        const link = e.target.closest('a');

        // Validation: Is it a valid internal navigation link?
        if (!link || !link.href) return;

        // Ignore if default prevented
        if (e.defaultPrevented) return;

        // Ignore if meta/ctrl/shift click
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

        // Check against exclude list
        const isExcluded = EXCLUDE_SELECTORS.some(selector => link.matches(selector));
        if (isExcluded) return;

        // Check if same origin
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;

        // Check if it's the same page but different hash
        if (url.pathname === window.location.pathname && url.search === window.location.search) {
            if (url.hash !== window.location.hash) return;
        }

        // ── Start Exit Transition ──
        e.preventDefault();
        navigateTo(link.href);
    };

    return { init };
})();

// Start system
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', PageTransition.init);
} else {
    PageTransition.init();
}
