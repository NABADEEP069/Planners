import React, { useEffect, useState } from 'react';
import { Task, TaskFilter } from '../types/task';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { EditTaskDialog } from './EditTaskDialog';

interface TaskListProps {
  filter: TaskFilter;
  sortBy?: 'start_time' | 'end_time';
  sortOrder?: 'asc' | 'desc';
}

export function TaskList({ filter, sortBy = 'start_time', sortOrder = 'asc' }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      let query = supabase
        .from('tasks')
        .select('*');

      if (filter.priority) {
        query = query.eq('priority', filter.priority);
      }
      if (filter.status) {
        query = query.eq('status', filter.status);
      }

      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      setTasks(data || []);
      setLoading(false);
    };

    fetchTasks();
  }, [filter, sortBy, sortOrder]);

  const handleStatusChange = async (taskId: string, newStatus: 'pending' | 'finished') => {
    const updates = {
      status: newStatus,
      end_time: newStatus === 'finished' ? new Date().toISOString() : null,
    };

    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error);
      return;
    }

    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, ...updates }
        : task
    ));
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="task-card bg-white rounded-lg p-6 shadow-md animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="w-20">Start:</span>
                    <span className="font-medium">{format(new Date(task.start_time), 'PPp')}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="w-20">End:</span>
                    <span className="font-medium">{format(new Date(task.end_time), 'PPp')}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="w-20">Priority:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${task.priority <= 2 ? 'bg-red-100 text-red-800' :
                        task.priority === 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}`}>
                      {task.priority}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setEditingTask(task)}
                  className="px-3 py-1 text-sm font-medium text-primary hover:text-primary/90 focus:outline-none"
                >
                  Edit
                </button>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as 'pending' | 'finished')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors
                    ${task.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                >
                  <option value="pending">Pending</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No tasks found</p>
          </div>
        )}
      </div>

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          isOpen={true}
          onClose={() => setEditingTask(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </>
  );
}