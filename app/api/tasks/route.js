import { NextResponse } from 'next/server';
import { db } from '../../../lib/db.js';
import { getCurrentUser } from '../../../lib/auth.js';


export async function GET(request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";

  let query = `
    SELECT t.*, u.name AS assigned_to_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE 1 = 1
  `;

  const values = [];

  if (user.role !== "admin" && user.role !== "supervisor") {
    values.push(user.department);
    query += ` AND t.department = $${values.length}`;
  }

  if (search) {
    values.push(`%${search}%`);
    query += ` AND t.title ILIKE $${values.length}`;
  }

  if (status) {
    values.push(status);
    query += ` AND t.status = $${values.length}`;
  }

  if (priority) {
    values.push(priority);
    query += ` AND t.priority = $${values.length}`;
  }

  query += ` ORDER BY t.created_at DESC`;

  const result = await db.query(query, values);

  return NextResponse.json({ tasks: result.rows });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { title, description, status, priority, zone, department, assigned_to, due_date } = body;

  // TODO 6: Add backend validation for title/status/priority.

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

if (user.role !== "admin" && departmentNorm !== user.department) {
  return NextResponse.json(
    { message: "You cannot create tasks for another department." },
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

  const result = await db.query(
    `INSERT INTO tasks (title, description, status, priority, zone, department, assigned_to, created_by, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      titleNorm,
      description?.trim() || null,
      statusNorm,
      priorityNorm,
      zone?.trim() || null,
      department || user.department,
      assigned_to || null,
      user.id,
      due_date || null,
    ]
  );

  return NextResponse.json({ task: result.rows[0] }, { status: 201 });
}
