import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Inbox, Loader2, Plus, Search, SearchX, X } from 'lucide-react';
import TaskCard from '../components/TaskCard.jsx';
import { EmptyState, ErrorState, Loader } from '../components/StateViews.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import useDebouncedValue from '../hooks/useDebouncedValue.js';
import useTaskSearch from '../hooks/useTaskSearch.js';
import { PRIORITY_OPTIONS, PRIORITY_RANK, STATUS_OPTIONS } from '../utils/task.js';

const SEARCH_DELAY_MS = 350;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first', compare: (a, b) => b.createdAt.localeCompare(a.createdAt) },
  { value: 'oldest', label: 'Oldest first', compare: (a, b) => a.createdAt.localeCompare(b.createdAt) },
  {
    value: 'due',
    label: 'Due date (soonest)',
    compare: (a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'),
  },
  { value: 'priority', label: 'Priority (high first)', compare: (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] },
  { value: 'title', label: 'Title (A-Z)', compare: (a, b) => a.title.localeCompare(b.title) },
];

export default function TasksPage() {
  const { tasks, loading, error, fetchTasks } = useTasks();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState('');

  const statusParam = searchParams.get('status');
  const priorityParam = searchParams.get('priority');
  const sortParam = searchParams.get('sort');
  const status = STATUS_OPTIONS.some((o) => o.value === statusParam) ? statusParam : 'all';
  const priority = PRIORITY_OPTIONS.some((o) => o.value === priorityParam) ? priorityParam : 'all';
  const sort = SORT_OPTIONS.some((o) => o.value === sortParam) ? sortParam : 'newest';

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === fallback) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const trimmedQuery = searchText.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, SEARCH_DELAY_MS);
  const activeTerm = trimmedQuery === '' ? '' : debouncedQuery;
  const isSearching = activeTerm !== '';
  const search = useTaskSearch(loading ? '' : activeTerm, tasks);

  const baseTasks = isSearching ? search.results : tasks;
  const searchPending =
    trimmedQuery !== activeTerm || (isSearching && (!search.isCurrent || search.loading));

  const visibleTasks = useMemo(() => {
    const { compare } = SORT_OPTIONS.find((option) => option.value === sort);
    return baseTasks
      .filter((task) => status === 'all' || task.status === status)
      .filter((task) => priority === 'all' || task.priority === priority)
      .sort(compare);
  }, [baseTasks, status, priority, sort]);

  const hasFilters = trimmedQuery !== '' || status !== 'all' || priority !== 'all';
  const clearSearch = () => setSearchText('');
  const clearAll = () => {
    setSearchText('');
    setSearchParams({}, { replace: true });
  };

  let results;
  if (isSearching && search.error && !searchPending) {
    results = <ErrorState message={search.error} onRetry={search.retry} />;
  } else if (visibleTasks.length === 0 && searchPending) {
    results = <Loader label="Searching…" />;
  } else if (visibleTasks.length === 0) {
    results = (
      <EmptyState
        icon={SearchX}
        title={trimmedQuery ? `No tasks match “${trimmedQuery}”` : 'No matching tasks'}
        message={
          trimmedQuery
            ? 'Search looks at task titles and descriptions. Try different keywords or check the spelling.'
            : 'Try a different filter.'
        }
        action={
          <button type="button" className="btn btn-secondary" onClick={clearAll}>
            Clear filters
          </button>
        }
      />
    );
  } else {
    results = (
      <div className="task-grid">
        {visibleTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    );
  }

  let content;
  if (loading) {
    content = <Loader label="Loading tasks…" />;
  } else if (error) {
    content = <ErrorState message={error} onRetry={() => fetchTasks()} />;
  } else if (tasks.length === 0) {
    content = (
      <EmptyState
        icon={Inbox}
        title="No tasks yet"
        message="Create your first task to get started."
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
        <div className="toolbar">
          <div className="search">
            <label htmlFor="task-search" className="sr-only">
              Search tasks
            </label>
            <Search size={18} />
            <input
              id="task-search"
              type="search"
              className="input"
              placeholder="Search by title or description"
              autoComplete="off"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            {searchText && (
              <button type="button" className="search__clear" aria-label="Clear search" onClick={clearSearch}>
                <X size={16} />
              </button>
            )}
          </div>

          <select className="input" aria-label="Filter by status" value={status} onChange={(e) => setParam('status', e.target.value, 'all')}>
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select className="input" aria-label="Filter by priority" value={priority} onChange={(e) => setParam('priority', e.target.value, 'all')}>
            <option value="all">All priorities</option>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select className="input" aria-label="Sort tasks" value={sort} onChange={(e) => setParam('sort', e.target.value, 'newest')}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <p className="results-count" aria-live="polite">
          {searchPending ? (
            <>
              <Loader2 size={14} className="spin" /> Searching…
            </>
          ) : trimmedQuery ? (
            `Showing ${visibleTasks.length} of ${baseTasks.length} ${baseTasks.length === 1 ? 'result' : 'results'} for “${trimmedQuery}”`
          ) : (
            `Showing ${visibleTasks.length} of ${tasks.length} tasks`
          )}
          {hasFilters && (
            <button type="button" className="link-button" onClick={clearAll}>
              Clear filters
            </button>
          )}
        </p>

        {results}
      </>
    );
  }

  return (
    <div className="container page">
      <div className="page-header">
        <div>
          <h1>My Tasks</h1>
          <p className="page-subtitle">Search, filter and manage every task in one place.</p>
        </div>
        <Link to="/tasks/new" className="btn btn-primary">
          <Plus size={16} /> Create Task
        </Link>
      </div>
      {content}
    </div>
  );
}