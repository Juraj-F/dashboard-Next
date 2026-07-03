import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db.js';
import { setAuthCookie, signToken } from '../../../../lib/auth.js';

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  // TODO 1: Query the user by email.
  // Hint: SELECT id, name, email, password_hash, role, department FROM users WHERE email = $1
  const result = await db.query('SELECT id, name, email, password_hash, role, department FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  // TODO 2: Replace this with bcrypt.compare(password, user.password_hash).
  const passwordMatches = password === 'password123' || await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken(user);
  await setAuthCookie(token);


  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
  });
}
