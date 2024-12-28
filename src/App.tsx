import React, { useState } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Dashboard } from './components/Dashboard';
import { TaskFilter, TaskPriority, TaskStatus } from './types/task';
import { AuthProvider, useAuth } from './lib/auth';
import { AuthForm } from './components/AuthForm';

function TaskManager() {
  const { user, signOut } = useAuth();
  const [filter, setFilter] = useState<TaskFilter>({});
  const [sortBy, setSortBy] = useState<'start_time' | 'end_time'>('start_time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign Out
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Task List</h2>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <select
                    value={filter.priority || ''}
                    onChange={(e) => setFilter({
                      ...filter,
                      priority: e.target.value ? Number(e.target.value) as TaskPriority : undefined
                    })}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">All Priorities</option>
                    {[1, 2, 3, 4, 5].map((p) => (
                      <option key={p} value={p}>Priority {p}</option>
                    ))}
                  </select>

                  <select
                    value={filter.status || ''}
                    onChange={(e) => setFilter({
                      ...filter,
                      status: e.target.value as TaskStatus || undefined
                    })}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="finished">Finished</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'start_time' | 'end_time')}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="start_time">Sort by Start Time</option>
                    <option value="end_time">Sort by End Time</option>
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>

                <TaskList
                  filter={filter}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                />
              </div>
            </div>

            <div>
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
                <TaskForm />
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
                <Dashboard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TaskManager />
    </AuthProvider>
  );
}

export default App;