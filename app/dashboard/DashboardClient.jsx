'use client';

import { useEffect, useState } from 'react';
import Modal from '../../components/Modal.jsx';
import TaskCard from '../../components/TaskCard.jsx';
import TaskForm from '../../components/TaskForm.jsx';
import TaskTable from '../../components/TaskTable.jsx';
import Toast from '../../components/Toast.jsx';
import { useTasks } from '../../hooks/useTasks.js';
import { useToast } from '../../hooks/useToast.js';

export default function DashboardClient({ user, initialTasks }) {
  const [filters,setFilters] = useState({
    status: "",
    priority: "",
    search: ""
  })
  const [modal, setModal] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const { message, showToast } = useToast();
  const [taskToDelete, setTaskToDelete]=useState('')
  const { tasks, loading, setError ,error, getTask, createTask, updateTask, removeTask, refreshTasks } = useTasks(initialTasks);


  async function filterTasks() {
    const {status, priority, search} = filters
    refreshTasks({status, priority, search})
  }

  useEffect(()=>{
    filterTasks()
  },[filters])

  function closeModal() {
    setModal(null);
    setSelectedTask(null);
  }

  async function handleOpenTask(id) {
    setModal('details');
    const task = await getTask(id);
    setSelectedTask(task);
  }

  function handleEditTask(e, task) {
    e.stopPropagation();
    setSelectedTask(task);
    setModal('edit');
  }

  async function handleDeleteTask(e, task) {
    e.stopPropagation();
    setTaskToDelete(task)
    setModal('delete')
  }

  async function handleCreateTask(payload) {
    await createTask(payload);
    showToast('Task created successfully');
    closeModal();
    await refreshTasks();
  }

  async function handleUpdateTask(payload) {

    try{   
    await updateTask(selectedTask.id, payload);
    showToast('Task updated successfully');
    closeModal();
  } catch (err){ 
    showToast(err.message)
  }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }



  return (
    <div className="min-h-screen bg-gray-100">
      <Toast message={message} />

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Warehouse Operations Dashboard</h1>
            <p className="text-sm text-gray-500">{user.email} · {user.role} · {user.department}</p>
          </div>
          <button onClick={logout} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">Logout</button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Tasks</h2>
            <p className="text-sm text-gray-500">Manage daily warehouse operations.</p>
          </div>
          <button onClick={() => setModal('create')} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">+ New Task</button>
        </div>

        <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            {/* TODO 20: Wire these filters to useTasks.refreshTasks({ search, status, priority }) */}
            <input 
            onChange={(e)=>setFilters({...filters, search: e.target.value})}
            value={filters.search}
            type="text" 
            placeholder="Search tasks..." 
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" 
            />
            <select 
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
            onChange={(e)=>setFilters({...filters, status: e.target.value})}
            value={filters.status}>
              <option value="">All statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
            <select 
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" 
            onChange={(e)=>setFilters({...filters, priority: e.target.value})}
            value={filters.priority}>
              <option value="">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50" 
            onClick={() => {
                          setFilters({
                            status: '',
                            priority: '',
                            search: '',
                          });
                          refreshTasks({});
                          }}
              >Clear Filters</button>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <TaskTable
            tasks={tasks}
            loading={loading}
            error={error}
            onOpen={handleOpenTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        </section>
      </main>
      <Modal open={modal === 'delete'} title="Delete Task" onClose={closeModal}>
        <div>
                    {error && (
  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    <strong className="font-semibold">Error: </strong>
    <span>{error}</span>
  </div>
)}
          <h1 className='mb-10'>Please confim your deletion</h1>
          <button 
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          onClick={async ()=>{
                      // TODO 19: Replace window.confirm with custom ConfirmDeleteModal.
                      // const confirmed = window.confirm(`Delete "${task.title}"?`);
                      // if (!confirmed) return;
                      try{
                          await removeTask(taskToDelete.id);
                          showToast('Task deleted successfully');
                          setTaskToDelete(null);
                          await refreshTasks()
                          closeModal();
                      }catch(err){
                        console.log("mesage in catch",err.message)
                        console.log("error", error)
                          showToast(err.message)
                      }
                    }}

          >Delete</button>
          <button 
          className="rounded-lg border px-4 mx-10 py-2 text-sm font-medium hover:bg-gray-50"
          // onClick={()=>{setModal(''); refreshTasks()}}
          onClick={() => {
                  setTaskToDelete(null);
                  setError('')
                  closeModal();
                }}
          >Cancel</button>
        </div>
      </Modal>

      <Modal open={modal === 'create'} title="Create Task" onClose={closeModal}>
        <TaskForm onSubmit={handleCreateTask} onClose={closeModal} />
      </Modal>

      <Modal open={modal === 'edit'} title="Edit Task" onClose={closeModal}>
        <TaskForm mode="edit" task={selectedTask} onSubmit={handleUpdateTask} onClose={closeModal} errorMessage={message} />
      </Modal>

      <Modal open={modal === 'details'} title="Task Details" onClose={closeModal}>
        <TaskCard task={selectedTask} onClose={closeModal} />
      </Modal>
    </div>
  );
}
