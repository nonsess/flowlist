'use client'

import { useState, useRef, useEffect } from 'react'

type TaskEditorProps = {
  title: string
  description: string | null
  onSave: (title: string, description: string | null) => Promise<void>
  onCancel: () => void
  autoFocus?: boolean
}

export default function TaskEditor({
  title,
  description,
  onSave,
  onCancel,
  autoFocus = true,
}: TaskEditorProps) {
  const [titleValue, setTitleValue] = useState(title)
  const [descValue, setDescValue] = useState(description || '')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && titleRef.current) {
      titleRef.current.focus()
      titleRef.current.select()
    }
  }, [autoFocus])

  const handleSave = async () => {
    if (!titleValue.trim()) return
    await onSave(titleValue.trim(), descValue.trim() || null)
  }

  const handleKeyDown = (e: React.KeyboardEvent, isTitle = false) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isTitle) {
        const descInput = e.currentTarget
          .closest('.task-editor')
          ?.querySelector('textarea') as HTMLTextAreaElement
        if (descInput) descInput.focus()
      } else {
        handleSave()
      }
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-3 task-editor">
      <div className="relative">
        <input
          ref={titleRef}
          type="text"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, true)}
          minLength={1}
          maxLength={60}
          placeholder="Название задачи*"
          className="w-full px-0 py-0 bg-transparent border-b-2 border-blue-500 focus:outline-none text-slate-800 placeholder:text-slate-400"
        />
      </div>

      <div className="relative">
        <input
          value={descValue}
          onChange={(e) => setDescValue(e.target.value)}
          onKeyDown={handleKeyDown}
          minLength={1}
          maxLength={150}
          placeholder="Описание (необязательно)"
          className="w-full px-0 py-0 bg-transparent border-b border-slate-300 focus:border-blue-500 focus:outline-none text-slate-800 placeholder:text-slate-400"
        />
      </div>

      <div className="flex gap-2 -mb-1">
        <button
          onClick={handleSave}
          disabled={!titleValue.trim()}
          className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          Готово
        </button>
        <button
          onClick={onCancel}
          className="text-xs px-2 py-0.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
        >
          Отмена
        </button>
      </div>
    </div>
  )
}