// shared-nav.js — Shared navigation utilities
// Depends on: currentUserRole (global, set by auth), lucide (global)

function buildSecuredNavigation(activeHref) {
    fetch('index.html')
        .then(res => res.text())
        .then(html => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const mobileSource = doc.querySelector('.md\\:hidden');
            const sidebarSource = doc.getElementById('sidebar-menu') || doc.querySelector('aside');

            if (!mobileSource || !sidebarSource) return;

            if ((typeof currentUserRole !== 'undefined') && (currentUserRole === "CA Leader" || currentUserRole === "Creative Arts Leader")) {
                ['users.html'].forEach(page => {
                    const ml = mobileSource.querySelector(`a[href="${page}"]`);
                    const sl = sidebarSource.querySelector(`a[href="${page}"]`);
                    if (ml) ml.remove();
                    if (sl) sl.remove();
                });
            }

            const mobileTopBar = document.getElementById('mobile-top-bar');
            if (mobileTopBar) {
                mobileTopBar.className = mobileSource.className;
                mobileTopBar.innerHTML = mobileSource.innerHTML;
            }

            const container = document.getElementById('sidebar-container');
            if (container) {
                container.className = sidebarSource.className;
                container.id = 'sidebar-menu';
                container.innerHTML = sidebarSource.innerHTML;

                container.querySelectorAll('a').forEach(link => {
                    link.className = link.getAttribute('href') === activeHref
                        ? 'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-white bg-indigo-600 font-medium transition'
                        : 'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800/60 hover:text-white font-medium transition';
                });
            }

            const roleIndicator = document.getElementById('sidebar-role-indicator');
            if (roleIndicator && typeof currentUserRole !== 'undefined') {
                roleIndicator.innerText = currentUserRole;
            }

            if (typeof lucide !== 'undefined') lucide.createIcons();
        })
        .catch(err => console.error('Error running template rendering system:', err));
}

function toggleMobileMenu() {
    const menu = document.getElementById('sidebar-menu');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!menu) return;
    const isOpen = !menu.classList.contains('-translate-x-full');
    menu.classList.toggle('-translate-x-full');
    if (backdrop) backdrop.classList.toggle('hidden', isOpen);
}

function closeMobileMenu() {
    const menu = document.getElementById('sidebar-menu');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (menu) menu.classList.add('-translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
}

function toggleProfileDropdown(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('profile-dropdown-menu');
    if (menu) menu.classList.toggle('hidden');
}

function closeProfileDropdown() {
    const menu = document.getElementById('profile-dropdown-menu');
    if (menu) menu.classList.add('hidden');
}
