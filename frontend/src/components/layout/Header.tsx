'use client'

import { useState, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (menuRef.current && !menuRef.current.contains(document.activeElement)) {
        setIsMenuOpen(false)
      }
    }, 100)
  }

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  if (!user) {
    return (
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-600">FLOWLIST</h1>
            <p className="text-xs text-slate-500 -mt-0.5">Ваш помощник</p>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-600">FLOWLIST</h1>
          <p className="text-xs text-slate-500 -mt-0.5">Ваш помощник</p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={toggleMenu}
            onBlur={handleBlur}
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            className="w-10 h-10 cursor-pointer rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm hover:bg-blue-700 transition-colors focus:outline-none"
          >
            {user.username[0].toUpperCase()}
          </button>

          {isMenuOpen && (
            <div
              ref={menuRef}
              tabIndex={-1}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-20"
            >
              <div className="px-4 py-2 text-sm text-slate-700 border-b border-slate-100">
                @{user.username}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full cursor-pointer text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:rounded-b-xl transition-colors"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}