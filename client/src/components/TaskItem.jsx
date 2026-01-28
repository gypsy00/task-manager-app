import { useState } from 'react';
import './Tasks.css';

const TaskItem = ({ task, onStatusChange, onDelete, onEdit, isDragging }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
  });
  const [saving, setSaving] = useState(false);

  const statusColors = {
    'todo': '#e74c3c',
    'in-progress': '#f39c12',
    'done': '#27ae60',
  };

  const statusLabels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done',
  };

  const handleStatusChange = (e) => {
    onStatusChange(task._id, e.target.value);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData.title.trim()) return;

    setSaving(true);
    try {
      await onEdit(task._id, editData);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`task-item task-${task.status} task-editing`}>
        <form onSubmit={handleEditSubmit} className="edit-form">
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleEditChange}
            className="edit-input"
            placeholder="Task title"
            maxLength={100}
            autoFocus
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleEditChange}
            className="edit-textarea"
            placeholder="Description (optional)"
            rows={2}
            maxLength={500}
          />
          <div className="edit-actions">
            <button type="submit" className="save-button" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={handleCancelEdit} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`task-item task-${task.status}${isDragging ? ' task-dragging' : ''}`}>
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-meta">
          <span
            className="task-status-badge"
            style={{ backgroundColor: statusColors[task.status] }}
          >
            {statusLabels[task.status]}
          </span>
          <span className="task-date">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="task-actions">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="status-select"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button
          onClick={() => setIsEditing(true)}
          className="edit-button"
          title="Edit task"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="delete-button"
          title="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
