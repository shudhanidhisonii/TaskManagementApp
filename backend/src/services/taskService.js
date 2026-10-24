import crypto from 'node:crypto';
import { AppError } from '../middleware/errorHandler.js';

export const TASK_STATUSES = ['pending', 'in_progress', 'completed'];
export const TASK_PRIORITIES = ['low', 'medium', 'high'];

const tasks = [];
const assertBodyIsObject = (body) => {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError(400, 'Request body must be a JSON object');
  }
};
const validateAndClean = (body, isUpdate) => {
  const errors = [];
  const values = {};

  if (!isUpdate || body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      errors.push('title is required and must be a non-empty string');
    } else {
      values.title = body.title.trim();
    }
  }

  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      errors.push('description must be a string');
    } else {
      values.description = body.description.trim();
    }
  }

  if (body.status !== undefined) {
    if (!TASK_STATUSES.includes(body.status)) {
      errors.push(`status must be one of: ${TASK_STATUSES.join(', ')}`);
    } else {
      values.status = body.status;
    }
  }

  if (body.priority !== undefined) {
    if (!TASK_PRIORITIES.includes(body.priority)) {
      errors.push(`priority must be one of: ${TASK_PRIORITIES.join(', ')}`);
    } else {
      values.priority = body.priority;
    }
  }

  if (body.dueDate !== undefined) {
    if (body.dueDate === null || body.dueDate === '') {
      values.dueDate = null;
    } else if (typeof body.dueDate !== 'string' || Number.isNaN(new Date(body.dueDate).getTime())) {
      errors.push('dueDate must be a valid date string, e.g. "2026-12-31" or "2026-12-31T10:00:00Z"');
    } else {
      values.dueDate = new Date(body.dueDate).toISOString();
    }
  }

  return { errors, values };
};

const findIndexById = (id) => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new AppError(404, `Task with id "${id}" not found`);
  }
  return index;
};

export const getAllTasks = (search) => {
  if (search !== undefined && typeof search !== 'string') {
    throw new AppError(400, 'Query parameter "search" must be a single text value');
  }

  const term = (search ?? '').trim().toLowerCase();
  const matches =
    term === ''
      ? tasks
      : tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(term) ||
            task.description.toLowerCase().includes(term),
        );

  return matches.map((task) => ({ ...task }));
};

export const getTaskById = (id) => {
  return { ...tasks[findIndexById(id)] };
};

export const createTask = (body) => {
  assertBodyIsObject(body);
  const { errors, values } = validateAndClean(body, false);
  if (errors.length > 0) {
    throw new AppError(400, 'Validation failed', errors);
  }

  const now = new Date().toISOString();
  const task = {
    id: crypto.randomUUID(),
    title: values.title,
    description: values.description ?? '',
    status: values.status ?? 'pending',
    priority: values.priority ?? 'medium',
    dueDate: values.dueDate ?? null,
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(task);
  return { ...task };
};

export const updateTask = (id, body) => {
  const index = findIndexById(id);
  assertBodyIsObject(body);

  const { errors, values } = validateAndClean(body, true);
  if (errors.length > 0) {
    throw new AppError(400, 'Validation failed', errors);
  }
  if (Object.keys(values).length === 0) {
    throw new AppError(400, 'No updatable fields provided', [
      'Send at least one of: title, description, status, priority, dueDate',
    ]);
  }

  const updated = {
    ...tasks[index],
    ...values,
    updatedAt: new Date().toISOString(),
  };

  tasks[index] = updated;
  return { ...updated };
};

export const deleteTask = (id) => {
  const index = findIndexById(id);
  const [removed] = tasks.splice(index, 1);
  return removed;
};