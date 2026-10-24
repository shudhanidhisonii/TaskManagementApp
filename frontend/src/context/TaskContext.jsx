import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { taskApi } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) {
        setLoading(true);
        setError('');
      }
      try {
        setTasks(await taskApi.getTasks());
        setError('');
      } catch (err) {
        if (silent) toast.error(`Could not refresh tasks: ${err.message}`);
        else setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(
    async (payload) => {
      const task = await taskApi.createTask(payload);
      await fetchTasks({ silent: true });
      return task;
    },
    [fetchTasks],
  );

  const updateTask = useCallback(
    async (id, payload) => {
      const task = await taskApi.updateTask(id, payload);
      await fetchTasks({ silent: true });
      return task;
    },
    [fetchTasks],
  );

  const requestDelete = useCallback((task, onDeleted) => {
    setPendingDelete({ task, onDeleted });
  }, []);

  const cancelDelete = useCallback(() => setPendingDelete(null), []);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { task, onDeleted } = pendingDelete;
    setDeleting(true);
    try {
      await taskApi.deleteTask(task.id);
      toast.success(`Task "${task.title}" deleted.`);
      setPendingDelete(null);
      await fetchTasks({ silent: true });
      onDeleted?.();
    } catch (err) {
      toast.error(err.message);
      setPendingDelete(null);
      if (err.status === 404) await fetchTasks({ silent: true });
    } finally {
      setDeleting(false);
    }
  };

  const value = useMemo(
    () => ({ tasks, loading, error, fetchTasks, createTask, updateTask, requestDelete }),
    [tasks, loading, error, fetchTasks, createTask, updateTask, requestDelete],
  );

  return (
    <TaskContext.Provider value={value}>
      {children}
      <ConfirmDialog
        task={pendingDelete?.task ?? null}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used inside <TaskProvider>');
  return context;
}