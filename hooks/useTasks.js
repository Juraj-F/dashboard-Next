'use client';

import { useEffect, useState } from 'react';
import { socket } from '../lib/socket.js';

async function parseResponse(response) {
  const data = await response.json();
  console.log("data inside parser", data)
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export function useTasks(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function refreshTasks(filters = {}) {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    try {
        if (filters.status) {
        params.set("status", filters.status);}
        if (filters.priority) {
        params.set("priority",filters.priority);}
        if (filters.search) {
        params.set("search",filters.search);}
      const query = params.toString();
      const response = await fetch(`/api/tasks${query ? `?${query}` : ''}`);
      const data = await parseResponse(response);
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  async function getTask(id) {
    const response = await fetch(`/api/tasks/${id}`);
    const data = await parseResponse(response);
    return data.task;
  }

  async function createTask(payload) {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if(!response.ok) setError("bad request")
    const data = await parseResponse(response);

    // TODO 15: Decide if you want optimistic update or refresh.
    return data.task;
  }

  async function updateTask(id, payload) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await parseResponse(response);
    return data.task;
  }

  async function removeTask(id) {
    try{    
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
       console.log("data in usetask", response)
       const data = await parseResponse(response);
       return data
    }
      catch(err){
        setError(err.message)
         throw err
      }
  }

  useEffect(() => {
    if (initialTasks.length === 0) {
      refreshTasks();
    }
  }, []);

  useEffect(() => {
    // TODO 16: Finish Socket.IO backend support.
    // The frontend listener is ready, but API routes do not emit yet.
    socket.connect();

    function handleCreated(task) {
      setTasks((prev) => [task, ...prev]);
    }

    function handleUpdated(updatedTask) {
      setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    }

    function handleDeleted({ id }) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }

    socket.on('task:created', handleCreated);
    socket.on('task:updated', handleUpdated);
    socket.on('task:deleted', handleDeleted);

    return () => {
      socket.off('task:created', handleCreated);
      socket.off('task:updated', handleUpdated);
      socket.off('task:deleted', handleDeleted);
      socket.disconnect();
    };
  }, []);

  return {
    tasks,
    loading,
    error,
    setError,
    getTask,
    createTask,
    updateTask,
    removeTask,
    refreshTasks
  };
}
