import { useEffect, useState } from 'react';
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
        pendingTasksByPriority: [1, 2, 3, 4, 5].map(priority => ({
          priority: priority as TaskStats['pendingTasksByPriority'][0]['priority'],
          timeLapsed: calculateTimeLapsed(tasks.filter(t => 
            t.status === 'pending' && t.priority === priority
          )),
          estimatedTimeLeft: calculateTimeLeft(tasks.filter(t => 
            t.status === 'pending' && t.priority === priority
          ))
        })),
        averageCompletionTime: calculateAverageCompletionTime(tasks.filter(t => t.status === 'finished'))
      };

      setStats(stats);
      setLoading(false);
    };

    fetchStats();
  }, []);

  const calculateTimeLapsed = (tasks: any[]) => {
    const now = new Date();
    return tasks.reduce((acc, task) => {
      const startTime = new Date(task.start_time);
      return acc + Math.max(0, (now.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    }, 0);
  };

  const calculateTimeLeft = (tasks: any[]) => {
    const now = new Date();
    return tasks.reduce((acc, task) => {
      const endTime = new Date(task.end_time);
      return acc + Math.max(0, (endTime.getTime() - now.getTime()) / (1000 * 60 * 60));
    }, 0);
  };

  const calculateAverageCompletionTime = (tasks: any[]) => {
    if (tasks.length === 0) return 0;
    return tasks.reduce((acc, task) => {
      const startTime = new Date(task.start_time);
      const endTime = new Date(task.end_time);
      return acc + (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    }, 0) / tasks.length;
  };

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
      {/* Rest of the component remains the same */}
    </div>
  );
}