export function validateRegistration({ name, email, password, confirmPassword, department }) {
  if (!name?.trim()) return 'Name is required.';
  if (!email?.includes('@')) return 'Valid email is required.';
  if (!department?.trim()) return 'Department is required.';
  if (password !== confirmPassword) return 'Passwords do not match.';

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!passwordRegex.test(password || '')) {
    return 'Password must be at least 8 characters and include uppercase, lowercase, number and special character.';
  }

  return null;
}
