import { Task, TokenResponse, User } from "./types"

const API_BASE = 'http://localhost:8000/api/v1'
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

async function api<T>(
  url: string,
  config: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(config.headers as Record<string, string> || {}),
  }

  const token = getToken()
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...config,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json()
}
  
export const authApi = {
  login: (username: string, password: string) =>
    api<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
  }),

  register: (username: string, password: string) =>
    api<TokenResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
  }),

  getProfile: (): Promise<User> => api<User>('/auth/me')
}
  
export const tasksApi = {
  getAll: () => api<Task[]>('/tasks'),

  getById: (id: string) => api<Task>(`/tasks/${id}`),

  create: (title: string, description?: string) =>
    api<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    }),

  update: (id: string, data: Partial<Task>) =>
    api<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    api<void>(`/tasks/${id}`, { method: 'DELETE' }),
}