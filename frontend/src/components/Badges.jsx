import { Flag } from 'lucide-react';
import { PRIORITY_LABELS, STATUS_LABELS } from '../utils/task.js';

export function StatusBadge({ status }) {
  return (
    <span className={`badge badge-status-${status}`}>
      <span className="badge-dot" aria-hidden="true" />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`badge badge-priority-${priority}`}>
      <Flag size={12} aria-hidden="true" />
      {PRIORITY_LABELS[priority] ?? priority} priority
    </span>
  );
}