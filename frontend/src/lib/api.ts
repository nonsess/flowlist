import { Task, TokenResponse, User } from "./types"

const API_BASE = 'http://localhost:8000/api/v1'
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

const ERROR_MESSAGES: Record<string, string> = {
  'Username already taken': 'Пользователь с таким именем уже существует',
  'Invalid credentials': 'Неверное имя пользователя или пароль',
  
  'Task not found': 'Задача не найдена',
  
  'string_too_short': 'Слишком короткое значение',
  'string_too_long': 'Слишком длинное значение',
  'value_error': 'Недопустимое значение',
  'missing': 'Это поле обязательно',
  
  '401': 'Требуется авторизация',
  '403': 'Доступ запрещён',
  '404': 'Ресурс не найден',
  '500': 'Произошла ошибка, мы уже работаем над ее решением. Пожалуйста, подождите',
}

const extractErrorMessage = (errorText: string, status?: number): string => {
  try {
    const json = JSON.parse(errorText)
    
    if (typeof json.detail === 'string') {
      return ERROR_MESSAGES[json.detail] || json.detail
    }
    
    if (Array.isArray(json.detail) && json.detail.length > 0) {
      const firstError = json.detail[0]
      
      if (firstError.type && ERROR_MESSAGES[firstError.type]) {
        return ERROR_MESSAGES[firstError.type]
      }
      
      if (firstError.msg) {
        return firstError.msg
          .replace('Field required', 'Это поле обязательно')
          .replace('String should have at least', 'Слишком короткое значение')
          .replace('String should have at most', 'Слишком длинное значение')
      }
    }
  } catch {
    if (errorText.trim() in ERROR_MESSAGES) {
      return ERROR_MESSAGES[errorText.trim()]
    }
  
    if (status && ERROR_MESSAGES[status.toString()]) {
      return ERROR_MESSAGES[status.toString()]
    }
  }


  return errorText
    .replace(/["']/g, '')
    .replace(/\.$/, '')
    .trim() || 'Произошла ошибка. Попробуйте позже'
}

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
    const userMessage = extractErrorMessage(errorText, response.status)
    throw new Error(userMessage)
  }

  if (response.status === 204) {
    return undefined as T
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

  create: (title: string, description: string | null) =>
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