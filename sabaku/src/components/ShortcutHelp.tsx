'use client'

import { X } from 'lucide-react'

interface ShortcutHelpProps {
  isOpen: boolean
  onClose: () => void
}

const shortcuts = [
  { key: 'n', action: '新規ストリップ作成' },
  { key: 's', action: 'タイマー START / PAUSE' },
  { key: 'd', action: 'ACTIVE → CLEARED (Done)' },
  { key: 'q', action: 'ACTIVE → QUEUE 戻し' },
  { key: '↑↓', action: 'QUEUE 内選択' },
  { key: 'Enter', action: '選択 → ACTIVE 化' },
  { key: 'Esc', action: 'モーダル閉じ' },
  { key: '1', action: 'Focus ビュー' },
  { key: '2', action: 'Kanban ビュー' },
  { key: 'p', action: 'プロジェクトフィルター切替' },
  { key: '?', action: 'ショートカット一覧' },
]

export default function ShortcutHelp({ isOpen, onClose }: ShortcutHelpProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-bg-secondary border border-border rounded-lg w-full max-w-sm p-5 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 id="shortcuts-title" className="text-[15px] font-medium">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.map(({ key, action }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-[13px] text-text-secondary">{action}</span>
              <kbd className="px-2 py-0.5 text-[12px] font-mono bg-bg-primary border border-border rounded text-text-tertiary">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
