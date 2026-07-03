import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db.js';
import { validateRegistration } from '../../../../lib/validatePassword.js';

export async function POST(request) {

    // TODO 3: Add validation.
  // Requirements:
  // - name required
  // - email required
  // - password at least 8 characters
  // - password has uppercase, number, special character
  // - department required

  const body = await request.json();
  const { name, email, password, confirmPassword, department } = body;

  const response = validateRegistration({name, email, password, confirmPassword, department})

  if(response!==null) return response

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, department, role)
       VALUES ($1, $2, $3, $4, 'operator')
       RETURNING id, name, email, role, department`,
      [name, email, passwordHash, department]
    );
``
    return NextResponse.json({ user: result.rows[0] }, { status: 201 });

  } catch (err) {
    if (err.code === '23505') {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }

    return NextResponse.json({ message: 'Failed to register user' }, { status: 500 });
  }
}
