'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState(
    { name: '', 
      email: '', 
      password: '', 
      confirmPassword: '', 
      department: 'operations' });
      
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    // TODO 17: Implement frontend password validation.
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.message || 'Registration failed');
      return;
    }

    router.push('/login');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">Create Account</h1>
        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="mb-3 w-full rounded-lg border px-3 py-2" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="mb-3 w-full rounded-lg border px-3 py-2" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="mb-3 w-full rounded-lg border px-3 py-2" />
        <input name="confirmPassword" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} className="mb-3 w-full rounded-lg border px-3 py-2" />
        <select name="department" value={form.department} onChange={handleChange} className="mb-6 w-full rounded-lg border px-3 py-2">
          <option value="operations">Operations</option>
          <option value="inventory">Inventory</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Register</button>
      </form>
    </main>
  );
}
