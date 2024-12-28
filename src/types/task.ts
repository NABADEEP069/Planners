export type TaskPriority = 1 | 2 | 3 | 4 | 5;
export type TaskStatus = 'pending' | 'finished';

export interface Task {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  priority: TaskPriority;
  status: TaskStatus;
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