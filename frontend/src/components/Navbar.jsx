import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();

  const isHome = pathname === '/';
  const isCreate = pathname === '/tasks/new';
  const isMyTasks = pathname.startsWith('/tasks') && !isCreate;

  const linkClass = (active, extra = '') => `navbar__link ${extra} ${active ? 'is-active' : ''}`;

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="TASKFLIX home">
          TASKMANAGER
        </Link>
        <nav className="navbar__links" aria-label="Main navigation">
          <Link to="/" className={linkClass(isHome)} aria-current={isHome ? 'page' : undefined}>
            Home
          </Link>
          <Link
            to="/tasks"
            className={linkClass(isMyTasks)}
            aria-current={isMyTasks ? 'page' : undefined}
          >
            My Tasks
          </Link>
          <Link
            to="/tasks/new"
            className={linkClass(isCreate, 'navbar__cta')}
            aria-current={isCreate ? 'page' : undefined}
          >
            <Plus size={16} /> Create Task
          </Link>
        </nav>
      </div>
    </header>
  );
}