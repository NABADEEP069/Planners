import { Navigation } from '../components/Navigation';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { useState } from 'react';
import { TaskFilter } from '../types/task';

export function TaskListPage() {
  const [filter, setFilter] = useState<TaskFilter>({});
  const [sortBy, setSortBy] = useState<'start_time' | 'end_time'>('start_time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Task List</h2>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <select
                    value={filter.priority || ''}
                    onChange={(e) => setFilter({
                      ...filter,
                      priority: e.target.value ? Number(e.target.value) : undefined
                    })}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition-colors duration-200"
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
                      status: e.target.value as any || undefined
                    })}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition-colors duration-200"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="finished">Finished</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'start_time' | 'end_time')}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition-colors duration-200"
                  >
                    <option value="start_time">Sort by Start Time</option>
                    <option value="end_time">Sort by End Time</option>
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition-colors duration-200"
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
              <div className="bg-white shadow-lg rounded-xl p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h2>
                <TaskForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}