# Dashboard Next.js Half-Finished App

This is a deliberately half-finished JavaScript-only Next.js project.

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

## Tasks to practice

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
