// =============================================================================
// js/permissions.js — Frontend Permission Matrix & Access Control Helpers
// =============================================================================
//
// PURPOSE:
//   Centralized permission enforcement for the frontend. Contains the page
//   access matrix, view-only rules, and helper methods to show/hide UI
//   elements based on the authenticated user's role.
//
// NAMESPACE: GCPermissions
//
// DEPENDENCIES:
//   - js/auth-guard.js (GCAuth must be loaded BEFORE this file)
//
// USAGE:
//   Include on every protected page AFTER auth-guard.js.
//
//   <script src="js/firebase-init.js"></script>
//   <script src="js/auth-guard.js"></script>
//   <script src="js/permissions.js"></script>
//
// API:
//   GCPermissions.hasRole(role)            — Check if user has exact role
//   GCPermissions.isAdminOrPastor()        — Returns true for Admin or Pastor
//   GCPermissions.canAccessPage(page)      — Check page against access matrix
//   GCPermissions.isViewOnly(page)         — True if role is view-only on page
//   GCPermissions.canPerformAction(action) — Check if 'add'/'edit'/'delete' is allowed
//   GCPermissions.hideIfDenied(el, roles)  — Hide element unless role is in list
//   GCPermissions.enforcePageAccess()      — Redirect to index.html if unauthorized
//
// PERMISSION MATRIX:
//   Admin      — Full access to all pages and actions
//   Pastor     — All pages except users.html; full data actions
//   CA Leader  — Dashboard, Members, Creative Arts, Schools, Maps, Attendance
//                (view-only), Offerings, Calendar. No System Users. No delete.
//
// BEHAVIOR:
//   - Fails closed: if role is empty/unknown, access is denied
//   - Does NOT modify Firestore or Security Rules (frontend only)
//   - Pages must call enforcePageAccess() inside GCAuth.onReady() to enforce
//
// =============================================================================

const GCPermissions = (function () {
    'use strict';

    // --- Permission matrix (from ENGINEERING_STANDARDS_V1) ---
    const PAGE_ACCESS = {
        'index.html':            ['Admin', 'Pastor', 'CA Leader'],
        'users.html':            ['Admin'],
        'members.html':          ['Admin', 'Pastor', 'CA Leader'],
        'creative-arts.html':    ['Admin', 'Pastor', 'CA Leader'],
        'primaryschools.html':   ['Admin', 'Pastor', 'CA Leader'],
        'highschools.html':      ['Admin', 'Pastor', 'CA Leader'],
        'higher-education.html': ['Admin', 'Pastor', 'CA Leader'],
        'members-map.html':      ['Admin', 'Pastor', 'CA Leader'],
        'schools-map.html':      ['Admin', 'Pastor', 'CA Leader'],
        'attendance.html':       ['Admin', 'Pastor', 'CA Leader'],
        'offerings.html':        ['Admin', 'Pastor', 'CA Leader'],
        'transport.html':        ['Admin', 'Pastor', 'CA Leader'],
        'calendar.html':         ['Admin', 'Pastor', 'CA Leader']
    };

    // Pages where specific roles have view-only access (no write actions)
    const VIEW_ONLY_PAGES = {
        'CA Leader': ['attendance.html']
    };

    // --- Helpers ---

    function getCurrentPage() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    }

    function getRole() {
        return GCAuth.currentRole;
    }

    // --- Public API ---

    function hasRole(role) {
        return getRole() === GCAuth.normalizeRole(role);
    }

    function isAdminOrPastor() {
        const role = getRole();
        return role === 'Admin' || role === 'Pastor';
    }

    function canAccessPage(page) {
        const allowed = PAGE_ACCESS[page];
        if (!allowed) return true;
        return allowed.indexOf(getRole()) !== -1;
    }

    function isViewOnly(page) {
        const pages = VIEW_ONLY_PAGES[getRole()];
        if (!pages) return false;
        return pages.indexOf(page || getCurrentPage()) !== -1;
    }

    function canPerformAction(action) {
        if (isViewOnly()) return false;
        if (getRole() === 'CA Leader') {
            if (action === 'delete') return false;
            return true;
        }
        return isAdminOrPastor();
    }

    function hideIfDenied(element, requiredRoles) {
        if (!element) return;
        if (!requiredRoles) {
            element.classList.add('hidden');
            return;
        }
        const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
        if (roles.indexOf(getRole()) === -1) {
            element.classList.add('hidden');
        } else {
            element.classList.remove('hidden');
        }
    }

    function enforcePageAccess() {
        const page = getCurrentPage();
        if (!canAccessPage(page)) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    return {
        hasRole: hasRole,
        isAdminOrPastor: isAdminOrPastor,
        canAccessPage: canAccessPage,
        isViewOnly: isViewOnly,
        canPerformAction: canPerformAction,
        hideIfDenied: hideIfDenied,
        enforcePageAccess: enforcePageAccess
    };
})();
