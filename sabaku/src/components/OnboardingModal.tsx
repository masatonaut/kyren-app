'use client'

import { useState } from 'react'
import { X, ChevronRight, Layers, Focus, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

const steps = [
  {
    icon: Layers,
    title: 'Every task is a strip',
    body: 'One task, one strip. Like flight strips in air traffic control — the system only lets you focus on what matters now.',
    hint: 'You have demo strips already. Try dragging one around.',
  },
  {
    icon: Focus,
    title: 'One ACTIVE strip at a time',
    body: 'Press 1 to enter Focus view. Single-task mode removes distractions. Timer tracks your real work automatically.',
    hint: (
      <>
        <kbd className="px-1 py-0.5 bg-bg-primary border border-border rounded text-[10px] font-mono">n</kbd> new ·{' '}
        <kbd className="px-1 py-0.5 bg-bg-primary border border-border rounded text-[10px] font-mono">s</kbd> start/pause ·{' '}
        <kbd className="px-1 py-0.5 bg-bg-primary border border-border rounded text-[10px] font-mono">d</kbd> done
      </>
    ),
  },
  {
    icon: Link2,
    title: 'Power mode: Obsidian Vault sync',
    body: 'With the Pro plan, SABAKU auto-generates strips from your daily note Top 3, handoff docs, and TODO checkboxes. Zero input cost.',
    hint: 'Coming soon. Join the waitlist for early access.',
  },
]

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(0)

  if (!isOpen) return null

  const isLast = step === steps.length - 1
  const s = steps[step]
  const Icon = s.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
      <div className="relative bg-bg-secondary border border-border rounded-lg w-full max-w-md p-6 shadow-2xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary transition-colors"
          aria-label="Skip onboarding"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-accent/10 text-accent rounded-full mb-4">
          <Icon size={24} strokeWidth={1.5} />
        </div>

        {/* Step counter */}
        <div className="flex items-center gap-1.5 mb-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 rounded-full transition-all',
                i === step ? 'w-8 bg-accent' : 'w-4 bg-border',
              )}
            />
          ))}
        </div>

        {/* Content */}
        <h2 id="onboarding-title" className="text-[18px] font-medium mb-2">
          {s.title}
        </h2>
        <p className="text-[14px] text-text-secondary leading-relaxed mb-4">
          {s.body}
        </p>
        <div className="text-[12px] text-text-tertiary bg-bg-primary border border-border rounded px-3 py-2">
          {s.hint}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={onClose}
            className="text-[13px] text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Skip
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-3 py-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors"
              >
                Back
              </button>
            )}
            {isLast ? (
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-[13px] font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors"
              >
                Get started
              </button>
            ) : (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1 px-4 py-1.5 text-[13px] font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors"
              >
                Next
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
