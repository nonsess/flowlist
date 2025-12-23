'use client'

import { ReactNode } from 'react'
import { AuthProvider } from './AuthContext'
import { TaskProvider } from './TaskContext'

export function MainProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>
        {children}
      </TaskProvider>
    </AuthProvider>
  )
}