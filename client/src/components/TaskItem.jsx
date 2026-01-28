import './Tasks.css';

const TaskItem = ({ task, onStatusChange, onDelete }) => {
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

  return (
    <div className={`task-item task-${task.status}`}>
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
