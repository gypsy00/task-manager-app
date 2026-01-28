import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import './Tasks.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await tasksAPI.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    setCreating(true);
    try {
      const response = await tasksAPI.createTask(taskData);
      setTasks([response.data, ...tasks]);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await tasksAPI.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map((task) =>
        task._id === taskId ? response.data : task
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const tasksByStatus = {
    'todo': tasks.filter((t) => t.status === 'todo'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    'done': tasks.filter((t) => t.status === 'done'),
  };

  if (loading) {
    return (
      <div className="tasks-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <TaskForm onSubmit={handleCreateTask} loading={creating} />

      {error && (
        <div className="tasks-error">
          {error}
          <button onClick={() => setError('')} className="error-dismiss">
            Dismiss
          </button>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Create your first task above!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          <div className="task-column">
            <h3 className="column-title">
              <span className="column-dot todo-dot"></span>
              To Do ({tasksByStatus['todo'].length})
            </h3>
            <div className="task-list">
              {tasksByStatus['todo'].map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>

          <div className="task-column">
            <h3 className="column-title">
              <span className="column-dot progress-dot"></span>
              In Progress ({tasksByStatus['in-progress'].length})
            </h3>
            <div className="task-list">
              {tasksByStatus['in-progress'].map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>

          <div className="task-column">
            <h3 className="column-title">
              <span className="column-dot done-dot"></span>
              Done ({tasksByStatus['done'].length})
            </h3>
            <div className="task-list">
              {tasksByStatus['done'].map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
