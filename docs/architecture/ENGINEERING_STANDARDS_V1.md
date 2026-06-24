# GC Website — Engineering Standards v1

## Roles & Responsibilities

| Person | Role | Authority |
|--------|------|-----------|
| Mighty | Tech Lead | Architecture, PR approval, shared systems |
| Bruneez | Developer | Feature implementation |
| Sibiya | Developer | Feature implementation |
| Jason | PO / Tester | Acceptance testing |

Rules:
- Architecture decisions require Mighty's approval
- PRs require Mighty's review before merge
- Developers do not modify `js/core/` without approval

---

## Architecture Rules

- Firebase is the backend. No migrations.
- No full rewrites. Incremental changes only.
- No new Firestore collections without an ACR in `docs/decisions/`.
- No new roles without an ACR.
- Shared utilities must be reused — do not duplicate logic.
- Inline `<script>` is acceptable in current codebase. External JS preferred for new features.

---

## Firebase Rules

- Auth: Firebase Authentication (email/password)
- DB: Firestore (compat SDK v10.8.0)
- Storage: Firebase Storage (for images — no Base64 in Firestore for new code)
- Staff documents: keyed by Firebase UID (for new documents)
- Existing data patterns remain until explicitly migrated

---

## Permission Rules

| Role | Access |
|------|--------|
| Admin | All pages, all actions |
| Pastor | All pages except users.html, all data actions |
| CA Leader | Dashboard, Members (own dept), Creative Arts, Schools, Maps (own dept), Attendance (view), Offerings, Calendar |

Actions:
- Only Admin can manage staff users
- Only Admin/Pastor can add/edit/delete members, attendance, offerings, events, schools
- CA Leader: view-only on attendance; scoped to own department on members/maps

---

## Coding Standards

| Rule | Standard |
|------|----------|
| Variables | `const` / `let` — no `var` |
| Functions | camelCase: `handleFormSubmit()`, `renderTable()` |
| Files | kebab-case: `shared-nav.js`, `image-upload.js` |
| Firestore fields | camelCase: `photoUrl`, `createdAt`, `instType` |
| Timestamps | `At` suffix: `createdAt`, `updatedAt` |
| Booleans | `is`/`has` prefix: `isActive`, `hasLocation` |
| Collections | camelCase plural: `members`, `campuses`, `transportDrivers` |

Prohibited:
- `var`
- `alert()` / `confirm()` (use visual feedback instead)
- `@latest` CDN versions (pin to specific version)
- `console.log()` left in committed code (use `console.error()` for real errors)

---

## Git Workflow

| Branch | Purpose | Target |
|--------|---------|--------|
| `main` | Production | — |
| `develop` | Integration | → main |
| `feature/{issue#}-{desc}` | New work | → develop |
| `bugfix/{issue#}-{desc}` | Fixes | → develop |
| `hotfix/{issue#}-{desc}` | Urgent | → main + develop |

Rules:
- Never push directly to `main` or `develop`
- All work goes through PRs
- Squash merge features into develop
- Mighty approves all PRs
- Delete branch after merge

---

## AI Usage Rules

AI tools (Kiro, Claude, Cursor, etc.) may:
- Implement approved issues
- Generate code following these standards
- Suggest improvements within scope

AI tools may NOT (without Mighty's approval):
- Create new Firestore collections
- Create new roles
- Modify permission logic
- Change navigation structure
- Refactor files outside issue scope

Developers must review all AI-generated code before committing.

---

## Definition of Done

Every issue must satisfy ALL:

- [ ] Feature works correctly
- [ ] Permissions respected (correct role access)
- [ ] Responsive (mobile + desktop verified)
- [ ] No console errors
- [ ] No duplicated logic (reuse existing patterns)
- [ ] PR approved by Mighty
- [ ] Tested by Jason
