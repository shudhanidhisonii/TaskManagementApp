import { useEffect, useRef } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

export default function ConfirmDialog({ task, busy, onConfirm, onCancel }) {
  const cancelButton = useRef(null);

  useEffect(() => {
    if (!task) return undefined;
    cancelButton.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [task, busy, onCancel]);

  if (!task) return null;

  return (
    <div className="modal-backdrop" onClick={() => !busy && onCancel()}>
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-title">Delete this task?</h2>
        <p id="confirm-description">
          &ldquo;{task.title}&rdquo; will be permanently removed. This cannot be undone.
        </p>
        <div className="modal__actions">
          <button
            ref={cancelButton}
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={busy}>
            {busy ? <Loader2 size={16} className="spin" /> : <Trash2 size={16} />}
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}