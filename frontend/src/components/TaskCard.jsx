import { Link } from 'react-router-dom';
import { CalendarDays, Eye, Pencil, Trash2 } from 'lucide-react';
import { PriorityBadge, StatusBadge } from './Badges.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import { formatDueDate, isOverdue } from '../utils/task.js';

export default function TaskCard({ task }) {
  const { requestDelete } = useTasks();
  const overdue = isOverdue(task);

  return (
    <article className="task-card" data-status={task.status}>
      <h3 className="task-card__title">
        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
      </h3>

      <p className="task-card__description">{task.description || 'No description provided.'}</p>

      <div className="task-card__badges">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      <p className={`task-card__due ${overdue ? 'is-overdue' : ''}`}>
        <CalendarDays size={15} />
        {task.dueDate ? `Due ${formatDueDate(task.dueDate)}` : 'No due date'}
        {overdue && <span className="overdue-tag">Overdue</span>}
      </p>

      <div className="task-card__actions">
        <Link to={`/tasks/${task.id}`} className="btn btn-primary btn-sm">
          <Eye size={15} /> View Details
        </Link>
        <Link
          to={`/tasks/${task.id}/edit`}
          className="btn btn-outline btn-sm"
          aria-label={`Edit ${task.title}`}
        >
          <Pencil size={15} /> Edit
        </Link>
        <button
          type="button"
          className="btn btn-outline btn-danger btn-sm"
          onClick={() => requestDelete(task)}
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </article>
  );
}