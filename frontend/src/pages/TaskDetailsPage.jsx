import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../components/Badges.jsx';
import { EmptyState, ErrorState, Loader } from '../components/StateViews.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import useTask from '../hooks/useTask.js';
import { formatDateTime, formatDueDate, isOverdue } from '../utils/task.js';

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requestDelete } = useTasks();
  const { task, loading, error, notFound, reload } = useTask(id);

  let content;
  if (loading) {
    content = <Loader label="Loading task…" />;
  } else if (notFound) {
    content = (
      <EmptyState
        title="Task not found"
        message="This task may have been deleted."
        action={<Link to="/tasks" className="btn btn-primary">Back to My Tasks</Link>}
      />
    );
  } else if (error) {
    content = <ErrorState message={error} onRetry={reload} />;
  } else {
    content = (
      <article className="detail">
        <div className="detail__badges">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {isOverdue(task) && <span className="overdue-tag">Overdue</span>}
        </div>
        <h1 className="detail__title">{task.title}</h1>
        <p className="detail__description">{task.description || 'No description provided.'}</p>

        <dl className="detail__meta">
          <div>
            <dt>Due date</dt>
            <dd>{task.dueDate ? formatDueDate(task.dueDate) : 'No due date'}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{formatDateTime(task.createdAt)}</dd>
          </div>
          <div>
            <dt>Last updated</dt>
            <dd>{formatDateTime(task.updatedAt)}</dd>
          </div>
          <div>
            <dt>Task ID</dt>
            <dd className="mono">{task.id}</dd>
          </div>
        </dl>

        <div className="detail__actions">
          <Link to={`/tasks/${task.id}/edit`} className="btn btn-primary">
            <Pencil size={16} /> Edit
          </Link>
          <button
            type="button"
            className="btn btn-outline btn-danger"
            onClick={() => requestDelete(task, () => navigate('/tasks'))}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </article>
    );
  }

  return (
    <div className="container container--narrow page">
      <Link to="/tasks" className="back-link">
        <ArrowLeft size={16} /> Back to My Tasks
      </Link>
      {content}
    </div>
  );
}