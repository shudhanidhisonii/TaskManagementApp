import { ArrowDown, ArrowUp, Check, Clock, Minus, Play } from 'lucide-react';
import { PRIORITY_LABELS, STATUS_LABELS } from '../utils/task.js';

// The little symbol shown inside the coloured circle of each badge
const STATUS_ICONS = {
  pending: { Icon: Clock },
  in_progress: { Icon: Play, filled: true },
  completed: { Icon: Check },
};

const PRIORITY_ICONS = {
  high: { Icon: ArrowUp },
  medium: { Icon: Minus },
  low: { Icon: ArrowDown },
};

function Badge({ className, icon, children }) {
  const { Icon, filled } = icon ?? {};
  return (
    <span className={`badge ${className}`}>
      <span className="badge__icon" aria-hidden="true">
        {Icon && <Icon size={11} strokeWidth={3} fill={filled ? 'currentColor' : 'none'} />}
      </span>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  return (
    <Badge className={`badge-status-${status}`} icon={STATUS_ICONS[status]}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <Badge className={`badge-priority-${priority}`} icon={PRIORITY_ICONS[priority]}>
      {PRIORITY_LABELS[priority] ?? priority} priority
    </Badge>
  );
}