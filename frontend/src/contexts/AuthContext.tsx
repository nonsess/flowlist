'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/lib/types'
import { authApi } from '@/lib/api'

type AuthState = {
  user: User | null
  token: string | null
  isLoading: boolean
}

type AuthContextType = AuthState & {
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  })

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          const user = await authApi.getProfile()
          setAuthState({ user, token, isLoading: false })
        } catch (err) {
          localStorage.removeItem('auth_token')
          setAuthState({ user: null, token: null, isLoading: false })
        }
      } else {
        setAuthState({ user: null, token: null, isLoading: false })
      }
    }

    initializeAuth()
  }, [])

  const login = async (username: string, password: string) => {
    const data = await authApi.login(username, password)
    localStorage.setItem('auth_token', data.access_token)
    const user = await authApi.getProfile()
    setAuthState({ user, token: data.access_token, isLoading: false })
  }

  const register = async (username: string, password: string) => {
    const data = await authApi.register(username, password)
    localStorage.setItem('auth_token', data.access_token)
    const user = await authApi.getProfile()
    setAuthState({ user, token: data.access_token, isLoading: false })
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setAuthState({ user: null, token: null, isLoading: false })
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}