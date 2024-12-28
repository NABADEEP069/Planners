import React, { useEffect, useState } from 'react';
import { TaskStats } from '../types/task';
import { supabase } from '../lib/supabase';

export function Dashboard() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*');

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        return;
      }

      const tasks = tasksData || [];
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'finished').length;
      
      const stats: TaskStats = {
        totalTasks,
        completedPercentage: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
        pendingPercentage: totalTasks ? ((totalTasks - completedTasks) / totalTasks) * 100 : 0,
        pendingTasksByPriority: [1, 2, 3, 4, 5].map(priority => {
          const priorityTasks = tasks.filter(t => 
            t.status === 'pending' && t.priority === priority
          );
          
          const now = new Date();
          
          const timeLapsed = priorityTasks.reduce((acc, task) => {
            const startTime = new Date(task.start_time);
            return acc + Math.max(0, (now.getTime() - startTime.getTime()) / (1000 * 60 * 60));
          }, 0);

          const estimatedTimeLeft = priorityTasks.reduce((acc, task) => {
            const endTime = new Date(task.end_time);
            return acc + Math.max(0, (endTime.getTime() - now.getTime()) / (1000 * 60 * 60));
          }, 0);

          return {
            priority,
            timeLapsed,
            estimatedTimeLeft,
          };
        }),
        averageCompletionTime: completedTasks ? tasks
          .filter(t => t.status === 'finished')
          .reduce((acc, task) => {
            const startTime = new Date(task.start_time);
            const endTime = new Date(task.end_time);
            return acc + (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
          }, 0) / completedTasks : 0,
      };

      setStats(stats);
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-primary/90 to-primary p-6 rounded-lg shadow-lg text-white">
          <h3 className="text-lg font-medium opacity-90">Total Tasks</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalTasks}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/90 to-green-500 p-6 rounded-lg shadow-lg text-white">
          <h3 className="text-lg font-medium opacity-90">Completed</h3>
          <p className="text-3xl font-bold mt-2">{stats.completedPercentage.toFixed(1)}%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Tasks by Priority</h3>
        <div className="space-y-4">
          {stats.pendingTasksByPriority.map(({ priority, timeLapsed, estimatedTimeLeft }) => (
            <div key={priority} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Priority {priority}</span>
                <div className="text-sm space-x-4">
                  <span className="text-orange-600">
                    Elapsed: {timeLapsed.toFixed(1)}h
                  </span>
                  <span className="text-blue-600">
                    Remaining: {estimatedTimeLeft.toFixed(1)}h
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, (timeLapsed / (timeLapsed + estimatedTimeLeft)) * 100)}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}