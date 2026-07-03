'use client';

export default function TaskTable({ tasks, loading, error, onOpen, onEdit, onDelete }) {
  if (loading) return <div className="p-6 text-gray-600">Loading tasks...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b bg-gray-50 text-gray-600">
        <tr>
          <th className="px-4 py-3 font-medium">Task</th>
          <th className="px-4 py-3 font-medium">Status</th>
          <th className="px-4 py-3 font-medium">Priority</th>
          <th className="px-4 py-3 font-medium">Department</th>
          <th className="px-4 py-3 font-medium">Zone</th>
          <th className="px-4 py-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {tasks?.map((task) => (
          <tr key={task.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onOpen(task.id)}>
            <td className="px-4 py-3 font-medium text-gray-900">{task.title}</td>
            <td className="px-4 py-3">{task.status}</td>
            <td className="px-4 py-3">{task.priority}</td>
            <td className="px-4 py-3">{task.department}</td>
            <td className="px-4 py-3">{task.zone}</td>
            <td className="px-4 py-3 text-right">
              <button className="mr-3 text-blue-600 hover:underline" onClick={(event) => onEdit(event, task)}>Edit</button>
              <button className="text-red-600 hover:underline" onClick={(e) => onDelete(e, task)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
