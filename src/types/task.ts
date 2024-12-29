export type TaskPriority = 1 | 2 | 3 | 4 | 5;
export type TaskStatus = 'pending' | 'finished';

/**
 * Represents a task with various attributes such as title, time, priority, status, and user association.
 */

export interface Task {

  id: string;

  title: string;

  start_time: string;

  end_time: string | null;

  priority: TaskPriority;

  status: 'pending' | 'finished';

  created_at: string;

  user_id: string;

}


export interface TaskFilter {
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface TaskStats {
  totalTasks: number;
  completedPercentage: number;
  pendingPercentage: number;
  pendingTasksByPriority: {
    priority: TaskPriority;
    timeLapsed: number;
    estimatedTimeLeft: number;
  }[];
  averageCompletionTime: number;
}