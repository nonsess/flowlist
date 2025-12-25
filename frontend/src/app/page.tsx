"use client"

import { useState } from "react"
import Container from "@/components/layout/Container"
import TaskCard from "@/components/shared/TaskCard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import Header from "@/components/layout/Header"
import { useTasks } from "@/contexts/TaskContext"

export default function Home() {
  const { tasks, isLoading, createTask } = useTasks()
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      await createTask(
        newTaskTitle.trim(),
        newTaskDescription.trim() || null
      )
      setNewTaskTitle("")
      setNewTaskDescription("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddTask()
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Header />
        <section className="py-6 bg-slate-50">
          <Container>
            <div className="max-w-2xl mx-auto w-full text-center py-8">
              Загрузка задач...
            </div>
          </Container>
        </section>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Header />
      <section className="py-6 bg-slate-50">
        <Container>
          <div className="max-w-2xl mx-auto w-full">
            <div className="mb-6 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Название задачи*"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  minLength={1}
                  maxLength={60}
                  autoFocus
                />
                <button
                  onClick={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                  className="w-12 shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-xl transition-colors"
                  aria-label="Добавить задачу"
                >
                  +
                </button>
              </div>

              {/* <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Описание (необязательно)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
                rows={2}
              /> */}
            </div>

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-center text-slate-500 py-8">
                  Список пуст. Добавьте первую задачу!
                </p>
              ) : (
                tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        </Container>
      </section>
    </ProtectedRoute>
  )
}