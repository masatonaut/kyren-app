'use client'

import { useState, useRef, useEffect } from 'react'
import type { StripPriority, StripCategory } from '@/types'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewStripModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, priority: StripPriority, category: StripCategory, project: string | null) => void
  projects: string[]
}

const priorities: { value: StripPriority; label: string }[] = [
  { value: 'urg', label: 'URG' },
  { value: 'nrm', label: 'NRM' },
  { value: 'low', label: 'LOW' },
]

export default function NewStripModal({ isOpen, onClose, onSubmit, projects }: NewStripModalProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<StripPriority>('nrm')
  const [project, setProject] = useState('')
  const [category] = useState<StripCategory>('manual')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTitle('')
      setPriority('nrm')
      setProject('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    const proj = project.trim() ? project.trim().toUpperCase() : null
    onSubmit(trimmed, priority, category, proj)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-bg-secondary border border-border rounded-lg w-full max-w-md p-6 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-medium">New Strip</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="text-[12px] text-text-secondary block mb-1.5">Title</label>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-bg-primary border border-border rounded px-3 py-2 text-[15px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          {/* Priority */}
          <div className="mb-4">
            <label className="text-[12px] text-text-secondary block mb-1.5">Priority</label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={cn(
                    'px-4 py-1.5 text-[13px] font-mono border rounded transition-colors',
                    priority === p.value && p.value === 'urg' && 'bg-priority-urg/20 text-red-400 border-red-500/30',
                    priority === p.value && p.value === 'nrm' && 'bg-priority-nrm/20 text-green-400 border-green-500/30',
                    priority === p.value && p.value === 'low' && 'bg-priority-low/20 text-neutral-400 border-neutral-500/30',
                    priority !== p.value && 'bg-bg-primary text-text-tertiary border-border hover:border-border-active',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project */}
          <div className="mb-6">
            <label className="text-[12px] text-text-secondary block mb-1.5">Project (optional)</label>
            <input
              type="text"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g. KASHITE"
              list="project-suggestions"
              className="w-full bg-bg-primary border border-border rounded px-3 py-2 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 transition-colors"
            />
            <datalist id="project-suggestions">
              {projects.map(p => <option key={p} value={p} />)}
            </datalist>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 text-[13px] font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
