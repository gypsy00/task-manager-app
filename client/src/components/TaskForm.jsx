import { useState } from 'react';
import './Tasks.css';

const TaskForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (formData.title.length > 100) {
      setError('Title must be less than 100 characters');
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ title: '', description: '', status: 'todo' });
    } catch (err) {
      setError(err.message || 'Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3 className="form-title">Create New Task</h3>

      {error && <div className="form-error">{error}</div>}

      <div className="form-row">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title"
          className="form-input"
          maxLength={100}
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-select"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description (optional)"
        className="form-textarea"
        rows={2}
        maxLength={500}
      />
    </form>
  );
};

export default TaskForm;
