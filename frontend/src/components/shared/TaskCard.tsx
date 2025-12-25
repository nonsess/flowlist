'use client'

import { useState } from "react"
import { useTasks } from "@/contexts/TaskContext"
import { Task } from "@/lib/types"
import TaskEditor from "@/components/ui/TaskEditor"

export default function TaskCard({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false)
  const { toggleTask, updateTask, deleteTask } = useTasks()

  const handleSave = async (title: string, description: string | null) => {
    await updateTask(task.id, { title, description })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div
      className={`p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 group ${
        task.completed ? "opacity-75" : ""
      }`}
    >
      <button
        onClick={() => toggleTask(task.id)}
        className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-colors border-2 ${
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

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <TaskEditor
            title={task.title}
            description={task.description}
            onSave={handleSave}
            onCancel={handleCancel}
            autoFocus
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="cursor-pointer"
          >
            <div className={`font-medium ${
              task.completed ? "line-through text-slate-500" : "text-slate-800"
            }`}>
              {task.title}
            </div>
            {task.description && (
              <div className={`text-sm mt-1 ${
                task.completed ? "line-through text-slate-400" : "text-slate-600"
              }`}>
                {task.description}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => deleteTask(task.id)}
        className="mt-0.5 ml-auto cursor-pointer text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
        aria-label="Удалить задачу"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}