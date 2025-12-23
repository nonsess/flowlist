'use client'

import { useState, useRef } from "react"
import { useTasks } from "@/contexts/TaskContext"
import { Task } from "@/lib/types"

export default function TaskCard({ task }: { task: Task }) {
  const editAreaRef = useRef<HTMLDivElement>(null)
  const { toggleTask, updateTask, deleteTask } = useTasks()

  const [isEditing, setIsEditing] = useState(false)
  const [editingText, setEditingText] = useState(task.title)

  const cancelEditing = () => {
    setIsEditing(false)
    setEditingText(task.title)
  }

  const startEditing = () => {
    setIsEditing(true)
  }

  const saveEditing = async () => {
    if (editingText.trim()) {
      await updateTask(task.id, { title: editingText.trim() })
    }
    setIsEditing(false)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveEditing()
    else if (e.key === "Escape") cancelEditing()
  }

  const handleEditAreaBlur = () => {
    setTimeout(() => {
      if (editAreaRef.current && !editAreaRef.current.contains(document.activeElement)) {
        cancelEditing()
      }
    }, 100)
  }

  return (
    <div
      className={`p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-4 group ${
        task.completed ? "opacity-75" : ""
      }`}
    >
      <button
        onClick={() => toggleTask(task.id)}
        className={`w-5 h-5 rounded flex items-center justify-center transition-colors border-2 ${
          task.completed
            ? "border-green-500 bg-green-500"
            : "border-slate-300 hover:border-blue-500"
        }`}
        aria-label={task.completed ? "Отметить как не выполненное" : "Отметить как выполненное"}
      >
        {task.completed && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {isEditing ? (
        <div
          ref={editAreaRef}
          onBlur={handleEditAreaBlur}
          tabIndex={-1}
          className="flex-1 flex flex-col gap-2"
        >
          <input
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onKeyDown={handleEditKeyDown}
            className="w-full px-2 py-1 border-b-2 border-blue-300 focus:outline-none text-slate-800"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={saveEditing}
              disabled={!editingText.trim()}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-slate-300"
            >
              Сохранить
            </button>
            <button
              onClick={cancelEditing}
              className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <span
          onClick={startEditing}
          className={`flex-1 cursor-pointer ${
            task.completed ? "line-through text-slate-500" : "text-slate-800"
          }`}
        >
          {task.title}
        </span>
      )}

      <button
        onClick={() => deleteTask(task.id)}
        className="ml-auto cursor-pointer text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Удалить задачу"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}