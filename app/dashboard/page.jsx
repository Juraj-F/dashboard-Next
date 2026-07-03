import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../lib/auth.js';
import { db } from '../../lib/db.js';
import DashboardClient from './DashboardClient.jsx';

async function getInitialTasks(user) {
  // TODO 18: Apply same filtering rules here as in GET /api/tasks.
  if(user.role==="admin"){
    const result = await db.query(
    `SELECT t.*, u.name AS assigned_to_name
     FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     ORDER BY t.created_at DESC`);
 return result.rows;  
} 

const result = await db.query(
    `SELECT t.*, u.name AS assigned_to_name
     FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE t.department = $1
     ORDER BY t.created_at DESC`,
    [user.department]
  );

 return result.rows;
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const initialTasks = await getInitialTasks(user);

  return <DashboardClient user={user} initialTasks={initialTasks} />;
}
