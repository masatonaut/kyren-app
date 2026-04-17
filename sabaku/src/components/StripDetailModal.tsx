'use client'

import { useState, useEffect } from 'react'
import type { Strip, StripPriority } from '@/types'
import { formatTimer, generateStripId, cn } from '@/lib/utils'
import { X, Trash2, Check, Play, ArrowLeft } from 'lucide-react'

interface StripDetailModalProps {
  strip: Strip | null
  projects: string[]
  onClose: () => void
  onEdit: (stripId: string, updates: Partial<Pick<Strip, 'title' | 'priority' | 'project'>>) => void
  onDelete: (stripId: string) => void
  onFocus: (stripId: string) => void
  onDone: (stripId: string) => void
  onQueueBack: (stripId: string) => void
}

const priorities: { value: StripPriority; label: string }[] = [
  { value: 'urg', label: 'URG' },
  { value: 'nrm', label: 'NRM' },
  { value: 'low', label: 'LOW' },
]

export default function StripDetailModal({
  strip,
  projects,
  onClose,
  onEdit,
  onDelete,
  onFocus,
  onDone,
  onQueueBack,
}: StripDetailModalProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<StripPriority>('nrm')
  const [project, setProject] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (strip) {
      setTitle(strip.title)
      setPriority(strip.priority)
      setProject(strip.project ?? '')
      setConfirmDelete(false)
    }
  }, [strip])

  if (!strip) return null

  const hasChanges = title.trim() !== strip.title
    || priority !== strip.priority
    || (project.trim().toUpperCase() || null) !== strip.project

  function handleSave() {
    if (!strip || !hasChanges) return
    const proj = project.trim() ? project.trim().toUpperCase() : null
    onEdit(strip.id, { title: title.trim() || strip.title, priority, project: proj })
    onClose()
  }

  function handleDelete() {
    if (!strip) return
    if (!confirmDelete) { setConfirmDelete(true); return }
    onDelete(strip.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-bg-secondary border border-border rounded-lg w-full max-w-lg p-6 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-text-tertiary">
              {generateStripId(strip.position)}
            </span>
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 font-mono',
              strip.priority === 'urg' && 'bg-priority-urg/20 text-red-400 border border-red-500/30',
              strip.priority === 'nrm' && 'bg-priority-nrm/20 text-green-400 border border-green-500/30',
              strip.priority === 'low' && 'bg-priority-low/20 text-neutral-400 border border-neutral-500/30',
            )}>
              {strip.priority.toUpperCase()}
            </span>
            <span className="text-[11px] text-text-tertiary">·</span>
            <span className="text-[11px] text-text-tertiary uppercase tracking-wider">
              {strip.status}
            </span>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <h2 id="detail-title" className="sr-only">Strip details</h2>

        {/* Title */}
        <div className="mb-4">
          <label className="text-[12px] text-text-secondary block mb-1.5">Title</label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={2}
            className="w-full bg-bg-primary border border-border rounded px-3 py-2 text-[15px] text-text-primary focus:outline-none focus:border-accent/50 transition-colors resize-none"
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
        <div className="mb-5">
          <label className="text-[12px] text-text-secondary block mb-1.5">Project</label>
          <input
            type="text"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="None"
            list="project-detail-suggestions"
            className="w-full bg-bg-primary border border-border rounded px-3 py-2 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 transition-colors"
          />
          <datalist id="project-detail-suggestions">
            {projects.map(p => <option key={p} value={p} />)}
          </datalist>
        </div>

        {/* Metadata */}
        <div className="mb-5 space-y-1 text-[12px] text-text-tertiary border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <span className="w-20">Category:</span>
            <span className="text-text-secondary">{strip.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-20">Source:</span>
            <span className="text-text-secondary">{strip.source === 'vault' ? '🔗 Obsidian Vault' : '✏️ Manual'}</span>
          </div>
          {strip.vault_ref && (
            <div className="flex items-start gap-2">
              <span className="w-20 shrink-0">Vault ref:</span>
              <span className="text-text-secondary font-mono text-[11px] break-all">{strip.vault_ref}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="w-20">Time:</span>
            <span className="text-text-secondary font-mono">{formatTimer(strip.timer_seconds)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-20">Created:</span>
            <span className="text-text-secondary">{new Date(strip.created_at).toLocaleString()}</span>
          </div>
          {strip.cleared_at && (
            <div className="flex items-center gap-2">
              <span className="w-20">Cleared:</span>
              <span className="text-text-secondary">{new Date(strip.cleared_at).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleDelete}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded transition-colors',
              confirmDelete
                ? 'bg-priority-urg/20 text-red-400 border border-red-500/30'
                : 'text-text-tertiary hover:text-red-400'
            )}
          >
            <Trash2 size={14} />
            {confirmDelete ? 'Confirm delete' : 'Delete'}
          </button>

          <div className="flex items-center gap-2">
            {/* Status-based quick actions */}
            {strip.status === 'queue' && (
              <button
                onClick={() => { onFocus(strip.id); onClose() }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] bg-accent/20 text-accent hover:bg-accent/30 rounded transition-colors"
              >
                <Play size={14} />
                Focus
              </button>
            )}
            {strip.status === 'active' && (
              <>
                <button
                  onClick={() => { onQueueBack(strip.id); onClose() }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] bg-bg-primary border border-border text-text-secondary hover:text-text-primary rounded transition-colors"
                >
                  <ArrowLeft size={14} />
                  Queue
                </button>
                <button
                  onClick={() => { onDone(strip.id); onClose() }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] bg-priority-nrm/20 text-green-400 hover:bg-priority-nrm/30 rounded transition-colors"
                >
                  <Check size={14} />
                  Done
                </button>
              </>
            )}
            {/* Save changes if edited */}
            {hasChanges && (
              <button
                onClick={handleSave}
                className="px-4 py-1.5 text-[13px] font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
