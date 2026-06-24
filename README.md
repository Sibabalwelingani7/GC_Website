# GC Website

## Purpose

GC Website is the official church management system used to manage members, schools, attendance, offerings, transport, maps, and church administration.

Current stack:

* Firebase Authentication
* Firestore
* Firebase Storage
* HTML
* JavaScript
* Tailwind CSS

We are improving the existing application.

We are NOT rebuilding the application.

We are NOT migrating away from Firebase.

---

# Team

## Jason Ross

* Project Manager
* Requirements & Planning

## Mighty

* Technical Lead
* Architecture Owner
* PR Reviewer

## Bruneez

* Software Developer

## Sibiya

* Software Developer



---

# Before You Start Development

Every developer must read:

* docs/architecture/ENGINEERING_STANDARDS_V1.md
* docs/templates/AI_IMPLEMENTATION_TEMPLATE.md
* docs/templates/DEVELOPER_TASK_TEMPLATE.md

Do not start coding before reading these documents.

---

# Development Workflow

1. Open your assigned GitHub Issue.
2. Create a feature branch from develop.
3. Implement only the assigned issue.
4. Test your changes locally.
5. Create a Pull Request to develop.
6. Assign Mighty as reviewer.
7. Do not merge your own Pull Request.
8. Wait for approval before merging.

---

# Branch Strategy

main

* Production branch

develop

* Integration branch

feature/*

* Individual feature work

Examples:

feature/5-admin-role-dropdown

feature/7-members-mobile-cards

feature/10-members-map

---

# AI Usage Rules

AI is allowed.

However:

* Do not let AI make architecture decisions.
* Do not create new collections without approval.
* Do not create new roles without approval.
* Do not modify permissions without approval.
* Follow Engineering Standards v1.

All AI-generated code must be reviewed before committing.

---

# Pull Request Rules

Before creating a PR:

* Verify functionality works.
* Verify permissions are correct.
* Verify responsiveness.
* Check browser console for errors.
* Ensure changes are limited to the assigned issue.

PRs must target:

feature/* → develop

Only Mighty approves merges.

---

# Sprint Execution

Work from GitHub Issues.

Start with:

P0 → P1 → P2 → P3

Do not skip priorities unless instructed.

---

# If You Are Blocked

Do not create workarounds.

Raise the blocker immediately.

Discuss with Mighty before making architectural changes.

---

# Goal

Deliver business requirements quickly while maintaining a clean, maintainable, and scalable codebase.

