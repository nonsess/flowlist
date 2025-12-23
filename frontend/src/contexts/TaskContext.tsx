'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { tasksApi } from '@/lib/api';
import { useAuth } from './AuthContext';
import { Task } from '@/lib/types';

type TaskState = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
};

type TaskContextType = TaskState & {
  refetch: () => Promise<void>;
  createTask: (title: string) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
};

const sortTasksForUI = (tasks: Task[]): Task[] => {
  const incomplete = tasks.filter(t => !t.completed);
  const complete = tasks.filter(t => t.completed);
  return [...incomplete, ...complete];
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { token, isLoading: authLoading } = useAuth();
  const [state, setState] = useState<TaskState>({
    tasks: [],
    isLoading: true,
    error: null,
  });

  const loadTasks = useCallback(async () => {
    if (!token) {
      setState({ tasks: [], isLoading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const tasks = await tasksApi.getAll();
      setState({ tasks, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось загрузить задачи';
      setState({ tasks: [], isLoading: false, error: message });
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading) {
      loadTasks();
    }
  }, [authLoading, token, loadTasks]);

  const createTask = async (title: string) => {
    try {
      const newTask = await tasksApi.create(title);
      setState(prev => ({
        ...prev,
        tasks: [newTask, ...prev.tasks],
      }));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Не удалось создать задачу');
    }
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      const updatedTask = await tasksApi.update(id, data);
      setState(prev => {
        const updatedTasks = prev.tasks.map(task =>
          task.id === id ? updatedTask : task
        );

        if ('completed' in data) {
          return { ...prev, tasks: sortTasksForUI(updatedTasks) };
        }

        return { ...prev, tasks: updatedTasks };
      });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Не удалось обновить задачу');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await tasksApi.delete(id);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== id),
      }));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Не удалось удалить задачу');
    }
  };

  const toggleTask = async (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    await updateTask(id, { completed: !task.completed });
  };

  return (
    <TaskContext.Provider
      value={{
        ...state,
        refetch: loadTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}