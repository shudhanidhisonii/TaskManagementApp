import { useCallback, useEffect, useRef, useState } from 'react';
import { taskApi } from '../services/api.js';

export default function useTask(id) {
  const [state, setState] = useState({ task: null, loading: true, error: '', notFound: false });
  const latestRequest = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setState({ task: null, loading: true, error: '', notFound: false });
    try {
      const task = await taskApi.getTask(id);
      if (requestId === latestRequest.current) {
        setState({ task, loading: false, error: '', notFound: false });
      }
    } catch (err) {
      if (requestId === latestRequest.current) {
        setState({ task: null, loading: false, error: err.message, notFound: err.status === 404 });
      }
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}