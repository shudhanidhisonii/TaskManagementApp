import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Hero from '../components/Hero.jsx';
import StatsGrid from '../components/StatsGrid.jsx';
import TaskRow from '../components/TaskRow.jsx';
import { EmptyState, ErrorState, Loader } from '../components/StateViews.jsx';
import { useTasks } from '../context/TaskContext.jsx';

export default function DashboardPage() {
  const { tasks, loading, error, fetchTasks } = useTasks();

  const newestFirst = [...tasks].reverse();
  const rows = [
    {
      title: 'Continue Working',
      tasks: newestFirst.filter((task) => task.status === 'in_progress'),
      emptyMessage: 'Nothing in progress right now. Start a task and it will show up here.',
    },
    {
      title: 'Pending Tasks',
      tasks: newestFirst.filter((task) => task.status === 'pending'),
      emptyMessage: 'No pending tasks. You are all caught up!',
    },
    {
      title: 'Completed Tasks',
      tasks: newestFirst.filter((task) => task.status === 'completed'),
      emptyMessage: 'No completed tasks yet. Finish one to see it here.',
    },
    {
      title: 'High Priority',
      tasks: newestFirst.filter((task) => task.priority === 'high'),
      emptyMessage: 'No high priority tasks.',
    },
  ];

  let content;
  if (loading) {
    content = <Loader label="Loading your tasks…" />;
  } else if (error) {
    content = <ErrorState message={error} onRetry={() => fetchTasks()} />;
  } else if (tasks.length === 0) {
    content = (
      <EmptyState
        title="No tasks yet"
        message="Create your first task to start tracking your progress."
        action={
          <Link to="/tasks/new" className="btn btn-primary">
            <Plus size={16} /> Create Task
          </Link>
        }
      />
    );
  } else {
    content = (
      <>
        <StatsGrid tasks={tasks} />
        {rows.map((row) => (
          <TaskRow key={row.title} title={row.title} tasks={row.tasks} emptyMessage={row.emptyMessage} />
        ))}
      </>
    );
  }

  return (
    <>
      <Hero />
      <div className="container dashboard">{content}</div>
    </>
  );
}