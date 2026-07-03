import { getCurrentUser } from '../../../../lib/auth.js';

export async function POST() {
  const user = await getCurrentUser();
  console.log("user from me auth", user)
  return Response.json({ user });
}
