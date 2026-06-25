# GC Website V2 — The Glorious Church Management Portal

## Project Architecture

```
Page Component → Hook → Service → Repository → Firestore
```

- **Pages** render UI and call hooks
- **Hooks** manage state and call services
- **Services** contain business logic
- **Repositories** handle Firestore operations
- **Providers** manage global state (auth, permissions)

No page ever calls Firestore directly.

---

## Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Public routes (login)
│   ├── (dashboard)/        # Protected routes (shared layout)
│   └── layout.tsx          # Root layout (providers)
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Dialog, Input)
│   ├── layout/             # App structure (Sidebar, Header, MobileNav)
│   └── shared/             # Reusable page blocks (DataTable, PageHeader)
├── features/               # Feature modules
│   └── [feature]/
│       ├── [feature].repository.ts  # Firestore access
│       ├── [feature].service.ts     # Business logic
│       ├── components/              # Feature-specific UI
│       ├── hooks/                   # Feature-specific hooks
│       └── types.ts                 # Feature types
├── services/
│   └── base.repository.ts  # Generic Firestore CRUD base class
├── providers/
│   ├── auth-provider.tsx    # Authentication context
│   └── permissions-provider.tsx  # Role-based access context
├── hooks/                  # Shared hooks
├── lib/
│   ├── firebase/           # Firebase initialization
│   └── utils.ts            # Utility functions
├── config/
│   ├── navigation.ts       # Nav items + role filtering
│   └── permissions.ts      # Page access matrix
├── types/                  # Shared type definitions
├── constants/              # App-wide constants (collection names, roles)
├── utils/                  # Pure utility functions
└── styles/                 # Global styles
```

---

## How to Run Locally

```bash
cd gc-portal
npm install
cp .env.local.example .env.local  # Add Firebase credentials
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

Create `.env.local` with:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Get values from the Firebase Console → Project Settings.

---

## Branch Strategy

| Branch | Purpose | Target |
|--------|---------|--------|
| `main` | Production | — |
| `develop` | Integration | → main |
| `feature/{desc}` | New work | → develop |
| `bugfix/{desc}` | Fixes | → develop |
| `hotfix/{desc}` | Urgent | → main + develop |

Rules:
- Never push directly to `main` or `develop`
- All work goes through Pull Requests
- Squash merge features into develop
- Delete branch after merge

---

## Coding Standards

### TypeScript
- Strict mode enabled
- No `any` unless absolutely necessary
- Use interfaces for data shapes, types for unions

### Naming
- Files: `kebab-case.ts` / `kebab-case.tsx`
- Components: `PascalCase`
- Functions/hooks: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Firestore fields: `camelCase` (match existing schema)

### Components
- One component per file
- `'use client'` only when needed (hooks, event handlers)
- Props interface named `{Component}Props`

### Imports
- Use `@/` alias for all project imports
- Group: external → internal → relative

### Prohibited
- `var`
- `any` without justification
- `console.log` in committed code
- Direct Firestore calls from pages/components
- New Firestore collections without team approval

---

## Pull Request Process

1. Create feature branch from `develop`
2. Implement changes (one feature per PR)
3. Run `npm run build` — must pass with zero errors
4. Create PR targeting `develop`
5. PR description: summary, files changed, testing done
6. Wait for review and approval
7. Squash merge after approval
8. Delete feature branch

---

## How to Add a New Feature

1. Create directory: `src/features/{feature-name}/`
2. Add repository: `{feature}.repository.ts` extending `BaseRepository`
3. Add service: `{feature}.service.ts` calling the repository
4. Add types if needed
5. Add hook: `use-{feature}.ts` calling the service
6. Add page: `src/app/(dashboard)/{feature}/page.tsx`
7. Add nav item to `src/config/navigation.ts`
8. Add page access to `src/config/permissions.ts`

---

## How to Add a New Page

1. Create `src/app/(dashboard)/{page-name}/page.tsx`
2. The `(dashboard)/layout.tsx` automatically wraps it with auth guard, sidebar, header
3. Add entry to `src/config/navigation.ts` with roles
4. Add entry to `src/config/permissions.ts`
5. Page is automatically protected — no auth code needed in the page

---

## Team Workflow

### Roles

| Person | Role | Authority |
|--------|------|-----------|
| Mighty | Tech Lead | Architecture, PR approval |
| Bruneez | Developer | Feature implementation |
| Sibiya | Developer | Feature implementation |
| Jason | PO / Tester | Acceptance testing |

### AI Usage

AI tools may:
- Implement approved features
- Generate code following these standards
- Suggest improvements within scope

AI tools may NOT:
- Create new Firestore collections
- Create new roles
- Modify permission logic without approval
- Add unapproved dependencies

### Definition of Done

- [ ] Feature works correctly
- [ ] TypeScript compiles with zero errors
- [ ] Permissions respected
- [ ] Responsive (mobile + desktop)
- [ ] No console errors
- [ ] Uses existing patterns (repository → service → hook → page)
- [ ] PR approved
- [ ] Tested by Jason

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.x | App Router, SSR/SSG |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | — | UI component patterns |
| Firebase | 10.12.0 | Auth, Firestore, Storage |
| lucide-react | 0.400.0 | Icons |

---

## Firebase Backend (Existing)

Collections (do NOT modify schema):
- `staff` — user accounts and roles
- `members` — church members
- `campuses` — schools (primary, high, higher)
- `creative_arts` — creative arts groups
- `attendance` — service headcount records
- `offerings` — financial offering records
- `transport` — taxi driver registry
- `events` — calendar events

Roles:
- `Admin` — full access
- `Pastor` — all except System Users
- `CA Leader` / `Creative Arts Leader` — scoped access
