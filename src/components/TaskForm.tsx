import React, { useState } from 'react';
import { TaskPriority, TaskStatus } from '../types/task';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import toast from 'react-hot-toast';

interface TaskFormProps {
  onSuccess?: () => void;
}

export function TaskForm({ onSuccess }: TaskFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(3);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create tasks');
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.from('tasks').insert({
        title,
        start_time: startTime,
        end_time: endTime,
        priority,
        status: 'pending' as TaskStatus,
        user_id: user.id
      });

      if (error) throw error;

      toast.success('Task created successfully!');
      setTitle('');
      setStartTime('');
      setEndTime('');
      setPriority(3);
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create task');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition-colors duration-200"
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition-colors duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          min={startTime}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition-colors duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value) as TaskPriority)}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition-colors duration-200"
        >
          {[1, 2, 3, 4, 5].map((p) => (
            <option key={p} value={p}>
              Priority {p}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
      >
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}