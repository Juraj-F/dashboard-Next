# Brightpick Next.js Half-Finished Interview App

This is a deliberately half-finished JavaScript-only Next.js interview project.

The app should run, but many features are intentionally incomplete and marked with `TODO` comments.

## Stack

- Next.js App Router
- JavaScript only
- Tailwind CSS v4
- PostgreSQL
- JWT auth via HTTP-only cookie
- Socket.IO client included; backend socket emission is TODO

## Setup

```bash
npm install
cp .env.example .env.local
npm run db:setup
npm run dev
```

Login credentials:

```text
operator@example.com
password123
```

## Interview tasks to practice

1. Finish register validation.
2. Add password strength validation.
3. Finish task filtering by search/status/priority.
4. Add department-based visibility.
5. Restrict deletes to supervisor/admin users.
6. Add a custom confirm delete modal.
7. Complete Socket.IO backend event emission.
8. Replace refresh-after-mutation with optimistic updates.
9. Add pagination.
10. Explain the difference between Server Component `page.jsx` and Client Component `DashboardClient.jsx`.

## Important files

```text
app/dashboard/page.jsx              Server Component, initial task loading
app/dashboard/DashboardClient.jsx   Client Component, UI state and modals
app/api/tasks/route.js              GET and POST task API
app/api/tasks/[id]/route.js         GET, PATCH, DELETE task API
hooks/useTasks.js                   frontend task state and socket listeners
components/TaskForm.jsx             create/edit task form
components/TaskTable.jsx            task table UI
lib/auth.js                         JWT cookie helpers
lib/db.js                           PostgreSQL connection
```

## Why this app is half finished

The goal is not to give you a finished portfolio project. The goal is to simulate an interview where a company gives you an existing codebase and asks you to complete missing pieces.
