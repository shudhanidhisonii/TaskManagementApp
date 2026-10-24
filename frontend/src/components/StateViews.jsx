import { AlertTriangle, Inbox, Loader2, RefreshCw } from 'lucide-react';

export function Loader({ label = 'Loading…' }) {
  return (
    <div className="state state--loading" role="status">
      <Loader2 size={40} className="spin" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <AlertTriangle size={40} />
      <h2>Something went wrong</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          <RefreshCw size={16} /> Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, message, action }) {
  return (
    <div className="state">
      <Icon size={40} />
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}