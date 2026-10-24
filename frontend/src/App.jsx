import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast.jsx';
import { TaskProvider } from './context/TaskContext.jsx';
import Layout from './components/Layout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import CreateTaskPage from './pages/CreateTaskPage.jsx';
import EditTaskPage from './pages/EditTaskPage.jsx';
import TaskDetailsPage from './pages/TaskDetailsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <ToastProvider>
      <TaskProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="tasks/new" element={<CreateTaskPage />} />
            <Route path="tasks/:id" element={<TaskDetailsPage />} />
            <Route path="tasks/:id/edit" element={<EditTaskPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </TaskProvider>
    </ToastProvider>
  );
}