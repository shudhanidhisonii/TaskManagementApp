import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, ListChecks, PlayCircle } from 'lucide-react';

export default function StatsGrid({ tasks }) {
  const count = (status) => tasks.filter((task) => task.status === status).length;

  const stats = [
    { key: 'total', label: 'Total Tasks', value: tasks.length, icon: ListChecks, to: '/tasks' },
    { key: 'pending', label: 'Pending', value: count('pending'), icon: Clock, to: '/tasks?status=pending' },
    {
      key: 'in_progress',
      label: 'In Progress',
      value: count('in_progress'),
      icon: PlayCircle,
      to: '/tasks?status=in_progress',
    },
    {
      key: 'completed',
      label: 'Completed',
      value: count('completed'),
      icon: CheckCircle2,
      to: '/tasks?status=completed',
    },
  ];

  return (
    <section className="stats" aria-label="Task statistics">
      {stats.map(({ key, label, value, icon: Icon, to }) => (
        <Link key={key} to={to} className={`stat stat--${key}`}>
          <span className="stat__icon">
            <Icon size={22} />
          </span>
          <span>
            <span className="stat__value">{value}</span>
            <span className="stat__label">{label}</span>
          </span>
        </Link>
      ))}
    </section>
  );
}