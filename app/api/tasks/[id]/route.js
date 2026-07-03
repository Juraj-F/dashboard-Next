import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db.js';
import { getCurrentUser } from '../../../../lib/auth.js';

export async function GET(request, { params }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // TODO 8: Enforce department visibility for non-supervisors.
  const userDepartment = user.department

  if(user.role==="administrator"||user.role==="supervisor")
  {const resultDepartment = await db.query(`
    SELECT t.*, u.name AS assigned_to_name
    FROM tasks t
    LEFT JOIN users u
    ON t.assigned_to = u.id
    ORDER BY t.created_at DESC
  `);

}

 const resultDepartment = await db.query(
  `SELECT t.*, u.name AS assigned_to_name
    FROM tasks t
    LEFT JOIN users u
    ON t.assigned_to = u.id
    WHERE t.department = $1
    ORDER BY t.created_at DESC`,[user.department]
  );
    
    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    const task = result.rows[0];
    
    if (!task) return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    
    return NextResponse.json({ task });
  }


export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, description, status, priority, zone, department, assigned_to, due_date } = body;

  // TODO 9: Validate status and priority.
 const titleNorm = title?.trim();
  const statusNorm = status?.toLowerCase();
  const priorityNorm = priority?.toLowerCase();

  const departmentNorm = department || user.department;

  if (titleNorm.length < 3) {
  return NextResponse.json(
    { message: "Title must be at least 3 characters." },
    { status: 400 }
  );
}

if (titleNorm.length > 100) {
  return NextResponse.json(
    { message: "Title must be less than 100 characters." },
    { status: 400 }
  );
}

if (description && description.length > 1000) {
  return NextResponse.json(
    { message: "Description must be less than 1000 characters." },
    { status: 400 }
  );
}

if (zone && zone.trim().length > 50) {
  return NextResponse.json(
    { message: "Zone must be less than 50 characters." },
    { status: 400 }
  );
}

if (assigned_to && Number.isNaN(Number(assigned_to))) {
  return NextResponse.json(
    { message: "Assigned user must be a valid user id." },
    { status: 400 }
  );
}

if (due_date && Number.isNaN(Date.parse(due_date))) {
  return NextResponse.json(
    { message: "Due date must be a valid date." },
    { status: 400 }
  );
}

if (user.role !== "administrator" && departmentNorm !== user.department) {
  return NextResponse.json(
    { message: "You cannot edit task belonging to another department." },
    { status: 403 }
  );
}

   if(!statusNorm || !titleNorm || !priorityNorm) {
      return NextResponse.json(
        { message: "Status, Title, Priority are required fields." },
        { status: 400 }
      );
    }

    const allowedPriorities = ["low","medium", "high"]
   
    if(!allowedPriorities.includes(priority.toLowerCase())) {
      return NextResponse.json(
        { message: "Invalid status." },
        { status: 400 }
      );
    }
   
    const allowedStatus = ["open","in_progress", "blocked", "completed"]
   
    if(!allowedStatus.includes(status.toLowerCase())) {
      return NextResponse.json(
        { message: "Invalid status." },
        { status: 400 }
      );
    }

  // TODO 10: Do not allow operators to update tasks outside their department.

  const result = await db.query(
    `UPDATE tasks
     SET title = $1,
         description = $2,
         status = $3,
         priority = $4,
         zone = $5,
         department = $6,
         assigned_to = $7,
         due_date = $8,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $9
     RETURNING *`,
    [title, 
      description, 
      status, 
      priority, 
      zone, 
      department, 
      assigned_to || null, 
      due_date || null, 
      id]
  );
const task = result.rows[0];

  if (!task) return NextResponse.json({ message: 'Task not found' }, { status: 404 });

  return NextResponse.json({ task });
}



export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // TODO 12: Only supervisors/admins should delete tasks.
  if(user.role!=="supervisor"){return NextResponse.json({message:"Only supervisor is allowed to delete tasks"}, {status:400})}

  const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);


  if (!result.rows[0]) {
    return NextResponse.json({ message: 'Task not found'}, {status: 404 });
  }

  // TODO 13: Emit task:deleted with Socket.IO after socket server is added.
  return NextResponse.json({ message: 'Task deleted successfully', id: Number(id) });
}
