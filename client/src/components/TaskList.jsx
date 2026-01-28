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
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'list'

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

  const handleEditTask = async (taskId, updates) => {
    try {
      const response = await tasksAPI.updateTask(taskId, updates);
      setTasks(tasks.map((task) =>
        task._id === taskId ? response.data : task
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      throw err;
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

  // Filter tasks based on selected filter
  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(task => task.status === filter);

  const tasksByStatus = {
    'todo': filteredTasks.filter((t) => t.status === 'todo'),
    'in-progress': filteredTasks.filter((t) => t.status === 'in-progress'),
    'done': filteredTasks.filter((t) => t.status === 'done'),
  };

  const taskCounts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
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

      {/* Filter and View Controls */}
      <div className="tasks-controls">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All <span className="count">{taskCounts.all}</span>
          </button>
          <button
            className={`filter-tab filter-todo ${filter === 'todo' ? 'active' : ''}`}
            onClick={() => setFilter('todo')}
          >
            To Do <span className="count">{taskCounts.todo}</span>
          </button>
          <button
            className={`filter-tab filter-progress ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress <span className="count">{taskCounts['in-progress']}</span>
          </button>
          <button
            className={`filter-tab filter-done ${filter === 'done' ? 'active' : ''}`}
            onClick={() => setFilter('done')}
          >
            Done <span className="count">{taskCounts.done}</span>
          </button>
        </div>
        <div className="view-toggle">
          <button
            className={`view-button ${viewMode === 'board' ? 'active' : ''}`}
            onClick={() => setViewMode('board')}
            title="Board view"
          >
            Board
          </button>
          <button
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            List
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Create your first task above!</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks match the selected filter.</p>
        </div>
      ) : viewMode === 'board' ? (
        <div className="tasks-grid">
          {(filter === 'all' || filter === 'todo') && (
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
                    onEdit={handleEditTask}
                  />
                ))}
              </div>
            </div>
          )}

          {(filter === 'all' || filter === 'in-progress') && (
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
                    onEdit={handleEditTask}
                  />
                ))}
              </div>
            </div>
          )}

          {(filter === 'all' || filter === 'done') && (
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
                    onEdit={handleEditTask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="tasks-list-view">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
