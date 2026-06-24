// =============================================================================
// js/auth-guard.js — Shared Authentication & Session Management
// =============================================================================
//
// PURPOSE:
//   Single source of truth for Firebase Auth state across all protected pages.
//   Manages user session, loads the staff Firestore document, and exposes
//   authenticated user data via the GCAuth namespace.
//
// NAMESPACE: GCAuth
//
// DEPENDENCIES:
//   - firebase-app-compat.js (Firebase App SDK)
//   - firebase-auth-compat.js (Firebase Auth SDK)
//   - firebase-firestore-compat.js (Firebase Firestore SDK)
//   - js/firebase-init.js (must be loaded BEFORE this file)
//
// USAGE:
//   Include on every protected page AFTER firebase-init.js.
//   Do NOT include on login.html.
//
//   <script src="js/firebase-init.js"></script>
//   <script src="js/auth-guard.js"></script>
//
// API:
//   GCAuth.currentUser   — Firebase Auth user object (or null)
//   GCAuth.currentRole   — Normalized role string: 'Admin' | 'Pastor' | 'CA Leader'
//   GCAuth.staffDocId    — Firestore document ID of the authenticated staff record
//   GCAuth.staffData     — Full staff document data object
//   GCAuth.isReady       — Boolean, true after auth + staff doc resolved
//   GCAuth.onReady(cb)   — Execute callback once auth is fully resolved
//   GCAuth.signOut()     — Sign out and redirect to login.html
//   GCAuth.normalizeRole(r) — Normalize role strings (e.g. 'Creative Arts Leader' → 'CA Leader')
//
// BEHAVIOR:
//   - Redirects unauthenticated users to login.html
//   - Signs out users not found in the 'staff' collection
//   - Sets window.currentUserRole for backward compatibility
//   - Fails closed: unknown/empty role = no access
//
// =============================================================================

const GCAuth = (function () {
    'use strict';

    const db = firebase.firestore();
    const auth = firebase.auth();

    // --- State ---
    let currentUser = null;
    let currentRole = '';
    let staffDocId = '';
    let staffData = null;
    let isReady = false;
    const readyCallbacks = [];

    // --- Helpers ---

    function normalizeRole(role) {
        if (!role) return '';
        const r = role.trim();
        if (r === 'Creative Arts Leader') return 'CA Leader';
        return r;
    }

    function resolveReady() {
        isReady = true;
        readyCallbacks.forEach(function (cb) { cb(); });
        readyCallbacks.length = 0;
    }

    // --- Auth listener (single instance) ---

    auth.onAuthStateChanged(function (user) {
        if (!user) {
            currentUser = null;
            currentRole = '';
            staffDocId = '';
            staffData = null;
            window.location.href = 'login.html';
            return;
        }

        currentUser = user;

        db.collection('staff').where('email', '==', user.email).get()
            .then(function (snapshot) {
                if (snapshot.empty) {
                    auth.signOut().then(function () {
                        window.location.href = 'login.html';
                    });
                    return;
                }

                const doc = snapshot.docs[0];
                staffDocId = doc.id;
                staffData = doc.data();
                currentRole = normalizeRole(staffData.role);

                // Legacy global for backward compatibility with existing page scripts
                window.currentUserRole = currentRole;

                resolveReady();
            })
            .catch(function () {
                auth.signOut().then(function () {
                    window.location.href = 'login.html';
                });
            });
    });

    // --- Public API ---

    function onReady(callback) {
        if (typeof callback !== 'function') return;
        if (isReady) {
            callback();
        } else {
            readyCallbacks.push(callback);
        }
    }

    function signOut() {
        return auth.signOut().then(function () {
            window.location.href = 'login.html';
        });
    }

    return {
        get currentUser() { return currentUser; },
        get currentRole() { return currentRole; },
        get staffDocId() { return staffDocId; },
        get staffData() { return staffData; },
        get isReady() { return isReady; },
        onReady: onReady,
        signOut: signOut,
        normalizeRole: normalizeRole
    };
})();
