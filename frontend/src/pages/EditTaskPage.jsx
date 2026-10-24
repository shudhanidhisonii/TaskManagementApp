import { Link, useNavigate, useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm.jsx';
import { EmptyState, ErrorState, Loader } from '../components/StateViews.jsx';
import { useToast } from '../components/Toast.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import useTask from '../hooks/useTask.js';
import { formValuesToPayload, taskToFormValues } from '../utils/task.js';

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { updateTask } = useTasks();
  const { task, loading, error, notFound, reload } = useTask(id);

  const handleSubmit = async (values) => {
    const updated = await updateTask(id, formValuesToPayload(values));
    toast.success(`Task "${updated.title}" updated.`);
    navigate(`/tasks/${id}`);
  };

  let content;
  if (loading) {
    content = <Loader label="Loading task…" />;
  } else if (notFound) {
    content = (
      <EmptyState
        title="Task not found"
        message="This task may have been deleted."
        action={<Link to="/tasks" className="btn btn-primary">Back to My Tasks</Link>}
      />
    );
  } else if (error) {
    content = <ErrorState message={error} onRetry={reload} />;
  } else {
    content = (
      <TaskForm
        key={task.id}
        initialValues={taskToFormValues(task)}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        cancelTo={`/tasks/${id}`}
      />
    );
  }

  return (
    <div className="container container--narrow page">
      <div className="page-header">
        <div>
          <h1>Edit Task</h1>
          <p className="page-subtitle">Update the details of your task.</p>
        </div>
      </div>
      {content}
    </div>
  );
}