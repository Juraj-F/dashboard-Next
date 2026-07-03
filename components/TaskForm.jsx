'use client';

import { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  description: '',
  status: 'open',
  priority: 'low',
  zone: '',
  department: 'operations',
  assigned_to: '',
  due_date: '',
};

export default function TaskForm({ mode = 'create', task, onSubmit, onClose, errorMessage }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'open',
        priority: task.priority || 'low',
        zone: task.zone || '',
        department: task.department || 'operations',
        assigned_to: task.assigned_to || '',
        due_date: task.due_date || '',
      });
    }
  }, [mode, task]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // TODO 14: Add frontend validation.
    if(errorMessage) setError(errorMessage)
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    
    }

    await onSubmit(form);
  }

  const isEdit = mode === 'edit';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
        <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500">
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Department</label>
          <select name="department" value={form.department} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500">
            <option value="operations">Operations</option>
            <option value="inventory">Inventory</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Zone</label>
          <input name="zone" value={form.zone} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-5">
        <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          {isEdit ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
