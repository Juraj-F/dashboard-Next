'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { get, post } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: 'operator@example.com', password: 'password123' });
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    
try {
    await post("/api/auth/login", form);
    
    router.push("/dashboard");
} catch (err) {
    setError(err.message);
}}

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Warehouse Login</h1>
        <p className="mb-6 text-sm text-gray-500">Use operator@example.com / password123</p>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <input name="email" value={form.email} onChange={handleChange} className="mb-4 w-full rounded-lg border px-3 py-2" />

        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} className="mb-6 w-full rounded-lg border px-3 py-2" />

        <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Login</button>
      </form>
    </main>
  );
}
