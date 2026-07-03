'use client';

export default function TaskCard({ task, onClose }) {
  if (!task) return <p className="text-gray-500">Loading task...</p>;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Title</p>
        <p className="rounded-lg border bg-gray-50 px-3 py-2">{task.title}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Description</p>
        <p className="min-h-20 whitespace-pre-wrap rounded-lg border bg-gray-50 px-3 py-2">{task.description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><p className="text-sm font-medium text-gray-500">Status</p><p>{task.status}</p></div>
        <div><p className="text-sm font-medium text-gray-500">Priority</p><p>{task.priority}</p></div>
        <div><p className="text-sm font-medium text-gray-500">Department</p><p>{task.department}</p></div>
        <div><p className="text-sm font-medium text-gray-500">Zone</p><p>{task.zone}</p></div>
      </div>
      <div className="flex justify-end border-t pt-4">
        <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Close</button>
      </div>
    </div>
  );
}
