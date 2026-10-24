export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const STATUS_LABELS = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.label]));
export const PRIORITY_LABELS = Object.fromEntries(PRIORITY_OPTIONS.map((o) => [o.value, o.label]));
export const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

export const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
};

export const formatDueDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : '';

export const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';

export const toInputDate = (iso) => (iso ? iso.slice(0, 10) : '');

export const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'completed') return false;
  const today = new Date().toLocaleDateString('en-CA');
  return task.dueDate.slice(0, 10) < today;
};

export const taskToFormValues = (task) => ({
  title: task.title,
  description: task.description ?? '',
  status: task.status,
  priority: task.priority,
  dueDate: toInputDate(task.dueDate),
});

export const formValuesToPayload = (values) => ({
  title: values.title.trim(),
  description: values.description.trim(),
  status: values.status,
  priority: values.priority,
  dueDate: values.dueDate || null,
});