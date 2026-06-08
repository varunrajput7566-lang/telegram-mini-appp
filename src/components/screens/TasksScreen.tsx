import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../App';
import { apiClient } from '../../api/client';
import { Task } from '../../types';
import '../../styles/TasksScreen.css';

export default function TasksScreen() {
  const context = useContext(AppContext);
  const user = context?.user;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, [user?.telegram_id]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const data = await apiClient.getAdsgramTasks(user.telegram_id);
      setTasks(data.tasks || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (taskUrl: string) => {
    window.open(taskUrl, '_blank');
  };

  if (loading) return <div className="tasks-screen"><div className="loader">Loading tasks...</div></div>;
  if (error) return <div className="tasks-screen"><div className="error">{error}</div></div>;

  return (
    <div className="tasks-screen">
      <div className="tasks-container">
        <h2>📋 Daily Tasks</h2>

        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks available right now</p>
            <p>Check back later!</p>
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-info">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>
                <button
                  className="btn-task"
                  onClick={() => handleTaskClick(task.action_url)}
                >
                  Join Channel
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="tasks-progress">
          Tasks: {user?.tasks_completed_today || 0}/10
        </div>
      </div>
    </div>
  );
}
