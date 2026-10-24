import { useCallback, useEffect, useState } from 'react';
import { taskApi } from '../services/api.js';

const IDLE = { term: '', results: [], loading: false, error: '' };

export default function useTaskSearch(term, refreshKey) {
  const [state, setState] = useState(IDLE);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!term) {
      setState(IDLE);
      return undefined;
    }

    const controller = new AbortController();
    setState((current) => ({ ...current, loading: true, error: '' }));

    taskApi
      .searchTasks(term, controller.signal)
      .then((results) => setState({ term, results, loading: false, error: '' }))
      .catch((err) => {
        if (!err.canceled) setState({ term, results: [], loading: false, error: err.message });
      });

    return () => controller.abort();
  }, [term, refreshKey, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  return { ...state, isCurrent: state.term === term, retry };
}