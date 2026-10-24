import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm.jsx';
import { useToast } from '../components/Toast.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import { formValuesToPayload } from '../utils/task.js';

export default function CreateTaskPage() {
  const { createTask } = useTasks();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const task = await createTask(formValuesToPayload(values));
    toast.success(`Task "${task.title}" created.`);
    navigate('/tasks');
  };

  return (
    <div className="container container--narrow page">
      <div className="page-header">
        <div>
          <h1>Create Task</h1>
          <p className="page-subtitle">Add a new task to your list.</p>
        </div>
      </div>
      <TaskForm submitLabel="Create Task" onSubmit={handleSubmit} cancelTo="/tasks" />
    </div>
  );
}