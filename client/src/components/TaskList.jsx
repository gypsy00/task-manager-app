import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { tasksAPI } from '../services/api';
import TaskItem from './TaskItem';
import SortableTaskItem from './SortableTaskItem';
import TaskForm from './TaskForm';
import './Tasks.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState('all');
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const getTasksByStatus = (status) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => a.position - b.position);
  };

  const findContainer = (id) => {
    if (['todo', 'in-progress', 'done'].includes(id)) {
      return id;
    }
    const task = tasks.find(t => t._id === id);
    return task?.status;
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    // Moving to a different column
    setTasks((prev) => {
      const activeTask = prev.find(t => t._id === activeId);
      if (!activeTask) return prev;

      return prev.map(task => {
        if (task._id === activeId) {
          return { ...task, status: overContainer };
        }
        return task;
      });
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    // Get the tasks in the target column
    const columnTasks = tasks
      .filter(t => t.status === overContainer)
      .sort((a, b) => a.position - b.position);

    // Find the new position
    let newPosition;
    if (overId === overContainer) {
      // Dropped on the column itself (at the end)
      newPosition = columnTasks.length > 0
        ? Math.max(...columnTasks.map(t => t.position)) + 1
        : 0;
    } else {
      // Dropped on another task
      const overIndex = columnTasks.findIndex(t => t._id === overId);
      const activeIndex = columnTasks.findIndex(t => t._id === activeId);

      if (activeIndex !== -1 && overIndex !== -1) {
        // Reordering within the same column
        newPosition = overIndex;
      } else {
        // Moving from another column
        newPosition = overIndex >= 0 ? overIndex : columnTasks.length;
      }
    }

    // Update positions for all tasks in the affected columns
    const updatedTasks = tasks.map(task => {
      if (task._id === activeId) {
        return { ...task, status: overContainer, position: newPosition };
      }
      return task;
    });

    // Recalculate positions for the target column
    const finalTasks = recalculatePositions(updatedTasks, overContainer, activeId, newPosition);
    setTasks(finalTasks);

    // Save to backend
    try {
      const tasksToUpdate = finalTasks
        .filter(t => t.status === overContainer || t.status === activeContainer)
        .map(t => ({ id: t._id, status: t.status, position: t.position }));

      await tasksAPI.reorderTasks(tasksToUpdate);
    } catch (err) {
      setError('Failed to save task order');
      fetchTasks(); // Revert on error
    }
  };

  const recalculatePositions = (taskList, status, movedTaskId, targetPosition) => {
    const columnTasks = taskList
      .filter(t => t.status === status)
      .sort((a, b) => {
        if (a._id === movedTaskId) return targetPosition - b.position;
        if (b._id === movedTaskId) return a.position - targetPosition;
        return a.position - b.position;
      });

    return taskList.map(task => {
      if (task.status === status) {
        const index = columnTasks.findIndex(t => t._id === task._id);
        return { ...task, position: index };
      }
      return task;
    });
  };

  // Filter tasks based on selected filter
  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(task => task.status === filter);

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

  const renderColumn = (status, title, dotClass) => {
    const columnTasks = getTasksByStatus(status);
    const showColumn = filter === 'all' || filter === status;

    if (!showColumn) return null;

    return (
      <div className="task-column" key={status}>
        <h3 className="column-title">
          <span className={`column-dot ${dotClass}`}></span>
          {title} ({columnTasks.length})
        </h3>
        <SortableContext
          items={columnTasks.map(t => t._id)}
          strategy={verticalListSortingStrategy}
          id={status}
        >
          <div className="task-list droppable-area" data-status={status}>
            {columnTasks.map((task) => (
              <SortableTaskItem
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
            {columnTasks.length === 0 && (
              <div className="empty-column">Drop tasks here</div>
            )}
          </div>
        </SortableContext>
      </div>
    );
  };

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

      {/* Filter Controls */}
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
        <div className="drag-hint">
          Drag tasks to reorder or move between columns
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
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="tasks-grid">
            {renderColumn('todo', 'To Do', 'todo-dot')}
            {renderColumn('in-progress', 'In Progress', 'progress-dot')}
            {renderColumn('done', 'Done', 'done-dot')}
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskItem
                task={activeTask}
                onStatusChange={() => {}}
                onDelete={() => {}}
                onEdit={() => {}}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default TaskList;
