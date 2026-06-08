import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../App';
import { apiClient } from '../../api/client';
import '../../styles/TasksScreen.css';

interface Task {
  id: string;
  title: string;
  description: string;
  action_url: string;
  task_type: 'join_channel' | 'join_group' | 'start_bot';
}

export default function TasksScreen() {
  const context = useContext(AppContext);
  const user = context?.user;
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Join Our Channel',
      description: 'Join our main channel for updates',
      action_url: 'https://t.me/your_channel',
      task_type: 'join_channel',
    },
    {
      id: '2',
      title: 'Join Our Group',
      description: 'Join our community group',
      action_url: 'https://t.me/your_group',
      task_type: 'join_group',
    },
    {
      id: '3',
      title: 'Start Our Bot',
      description: 'Start our helper bot',
      action_url: 'https://t.me/your_bot?start=task3',
      task_type: 'start_bot',
    },
  ]);
  const [taskStats, setTaskStats] = useState({
    tasks_completed_total: 0,
    tasks_limit: 10,
  });
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTaskStats();
  }, [user?.telegram_id]);

  const loadTaskStats = async () => {
    try {
      if (!user) return;
      const stats = await apiClient.getTaskStats(user.telegram_id);
      setTaskStats(stats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task stats');
    }
  };

  const handleCompleteTask = async (task: Task) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) return;

      // Open task link
      window.open(task.action_url, '_blank');

      // Wait for user to complete
      setTimeout(async () => {
        try {
          const response = await apiClient.completeTask({
            telegram_id: user.telegram_id,
            task_id: task.id,
            task_type: task.task_type,
          });

          if (response.success) {
            setCompletedTasks([...completedTasks, task.id]);
            await loadTaskStats();
            setError(null);
          } else {
            setError(response.message);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to complete task');
        } finally {
          setLoading(false);
        }
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error opening task');
      setLoading(false);
    }
  };

  const isLimitReached = taskStats.tasks_completed_total >= 10;

  return (
    <div className="tasks-screen">
      <div className="tasks-container">
        <h2>✅ Complete Tasks</h2>

        <div className="task-progress">
          <span className="progress-label">Tasks Completed</span>
          <span className="progress-value">
            {taskStats.tasks_completed_total}/{taskStats.tasks_limit}
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(taskStats.tasks_completed_total / taskStats.tasks_limit) * 100}%` }}
            ></div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-info">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>

              <button
                className="btn-complete-task"
                onClick={() => handleCompleteTask(task)}
                disabled={
                  loading || 
                  isLimitReached || 
                  completedTasks.includes(task.id)
                }
              >
                {completedTasks.includes(task.id) ? '✅ Done' : 'Go to Task'}
              </button>
            </div>
          ))}
        </div>

        {isLimitReached && (
          <div className="success-message">
            ✅ You've completed all 10 tasks today! <br/>
            Watch 30 ads to get your ₹{user?.balance || '0'} reward.
          </div>
        )}

        <div className="tasks-info">
          <h3>📋 Task Types:</h3>
          <ul>
            <li>🔗 Join Channel - Subscribe to a Telegram channel</li>
            <li>👥 Join Group - Join a Telegram group</li>
            <li>🤖 Start Bot - Start a Telegram bot</li>
            <li>⏰ Maximum 10 tasks per day</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
