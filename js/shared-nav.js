// js/shared-nav.js — Role-based navigation rendering
// Depends on: GCAuth (from auth-guard.js), lucide (global)

(function () {
    'use strict';

    // Navigation items CA Leader is NOT allowed to see
    var CA_LEADER_HIDDEN = ['users.html'];

    // Navigation items Pastor is NOT allowed to see
    var PASTOR_HIDDEN = ['users.html'];

    // Filters nav links based on role
    function filterNavLinks(container, role) {
        if (!container) return;
        var hiddenPages = [];

        if (role === 'CA Leader') {
            hiddenPages = CA_LEADER_HIDDEN;
        } else if (role === 'Pastor') {
            hiddenPages = PASTOR_HIDDEN;
        }

        hiddenPages.forEach(function (page) {
            var link = container.querySelector('a[href="' + page + '"]');
            if (link) link.remove();
        });
    }

    // Ensure sidebar backdrop exists for mobile overlay
    function ensureBackdrop() {
        if (document.getElementById('sidebar-backdrop')) return;
        var backdrop = document.createElement('div');
        backdrop.id = 'sidebar-backdrop';
        backdrop.className = 'hidden fixed inset-0 bg-black/50 z-30 md:hidden';
        backdrop.onclick = toggleMobileMenu;
        document.body.insertBefore(backdrop, document.body.firstChild);
    }

    function buildSecuredNavigation(activeHref) {
        // Determine role: prefer GCAuth namespace, fall back to legacy global
        var role = (typeof GCAuth !== 'undefined' && GCAuth.currentRole)
            ? GCAuth.currentRole
            : (window.currentUserRole || '');

        fetch('index.html')
            .then(function (res) { return res.text(); })
            .then(function (html) {
                var doc = new DOMParser().parseFromString(html, 'text/html');

                // Find the mobile header — the div with md:hidden that contains
                // the hamburger button (not the empty backdrop div)
                var mobileHeaders = doc.querySelectorAll('.md\\:hidden');
                var mobileSource = null;
                for (var i = 0; i < mobileHeaders.length; i++) {
                    if (mobileHeaders[i].querySelector('button')) {
                        mobileSource = mobileHeaders[i];
                        break;
                    }
                }

                var sidebarSource = doc.getElementById('sidebar-menu') || doc.querySelector('aside');

                if (!mobileSource || !sidebarSource) return;

                // Apply role-based filtering
                filterNavLinks(mobileSource, role);
                filterNavLinks(sidebarSource, role);

                // Ensure backdrop exists for mobile toggle
                ensureBackdrop();

                // Inject mobile top bar
                var mobileTopBar = document.getElementById('mobile-top-bar');
                if (mobileTopBar) {
                    mobileTopBar.className = mobileSource.className;
                    mobileTopBar.innerHTML = mobileSource.innerHTML;
                }

                // Inject sidebar
                var container = document.getElementById('sidebar-container');
                if (container) {
                    container.className = sidebarSource.className;
                    container.id = 'sidebar-menu';
                    container.innerHTML = sidebarSource.innerHTML;

                    // Highlight active page link
                    container.querySelectorAll('a').forEach(function (link) {
                        link.className = link.getAttribute('href') === activeHref
                            ? 'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-white bg-indigo-600 font-medium transition'
                            : 'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800/60 hover:text-white font-medium transition';
                    });
                }

                // Update role indicator if present
                var roleIndicator = document.getElementById('sidebar-role-indicator');
                if (roleIndicator) roleIndicator.innerText = role;

                if (typeof lucide !== 'undefined') lucide.createIcons();
            })
            .catch(function (err) {
                console.error('Navigation render error:', err);
            });
    }

    // --- UI Helpers (kept global for existing onclick handlers) ---

    function toggleMobileMenu() {
        var menu = document.getElementById('sidebar-menu');
        var backdrop = document.getElementById('sidebar-backdrop');
        if (!menu) return;
        var isOpen = !menu.classList.contains('-translate-x-full');
        menu.classList.toggle('-translate-x-full');
        if (backdrop) backdrop.classList.toggle('hidden', isOpen);
    }

    function closeMobileMenu() {
        var menu = document.getElementById('sidebar-menu');
        var backdrop = document.getElementById('sidebar-backdrop');
        if (menu) menu.classList.add('-translate-x-full');
        if (backdrop) backdrop.classList.add('hidden');
    }

    function toggleProfileDropdown(event) {
        if (event) event.stopPropagation();
        var menu = document.getElementById('profile-dropdown-menu');
        if (menu) menu.classList.toggle('hidden');
    }

    function closeProfileDropdown() {
        var menu = document.getElementById('profile-dropdown-menu');
        if (menu) menu.classList.add('hidden');
    }

    // Expose globally (existing pages call these directly)
    window.buildSecuredNavigation = buildSecuredNavigation;
    window.toggleMobileMenu = toggleMobileMenu;
    window.closeMobileMenu = closeMobileMenu;
    window.toggleProfileDropdown = toggleProfileDropdown;
    window.closeProfileDropdown = closeProfileDropdown;
})();
