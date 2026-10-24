import * as taskService from '../services/taskService.js';

export const getAllTasks = (req, res, next) => {
  try {
    const tasks = taskService.getAllTasks();
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = (req, res, next) => {
  try {
    const task = taskService.getTaskById(req.params.id);
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const createTask = (req, res, next) => {
  try {
    const task = taskService.createTask(req.body);
    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = (req, res, next) => {
  try {
    const task = taskService.updateTask(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = (req, res, next) => {
  try {
    const task = taskService.deleteTask(req.params.id);
    res.status(200).json({ success: true, message: 'Task deleted successfully', data: task });
  } catch (error) {
    next(error);
  }
};