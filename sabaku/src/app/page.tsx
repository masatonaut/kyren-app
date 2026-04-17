'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import type { ViewMode, Strip } from '@/types'
import { useStrips } from '@/hooks/useStrips'
import { useTimer } from '@/hooks/useTimer'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import Header from '@/components/Header'
import KanbanView from '@/components/KanbanView'
import FocusView from '@/components/FocusView'
import NewStripModal from '@/components/NewStripModal'
import ShortcutHelp from '@/components/ShortcutHelp'
import StatusBar from '@/components/StatusBar'
import StripDetailModal from '@/components/StripDetailModal'
import OnboardingModal from '@/components/OnboardingModal'
import StatsPanel from '@/components/StatsPanel'

const ONBOARDING_KEY = 'sabaku-onboarded'

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [newStripOpen, setNewStripOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const [detailStrip, setDetailStrip] = useState<Strip | null>(null)
  const [selectedQueueIndex, setSelectedQueueIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const {
    strips,
    activeStrip,
    queueStrips,
    clearedStrips,
    projects,
    addStrip,
    moveStrip,
    editStrip,
    deleteStrip,
    updateTimer,
    reorderQueue,
  } = useStrips()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem(ONBOARDING_KEY)) setOnboardingOpen(true)
  }, [])

  const handleFinishOnboarding = useCallback(() => {
    if (typeof window !== 'undefined') localStorage.setItem(ONBOARDING_KEY, 'true')
    setOnboardingOpen(false)
  }, [])

  const currentDetailStrip = useMemo(() => {
    if (!detailStrip) return null
    return strips.find(s => s.id === detailStrip.id) ?? null
  }, [detailStrip, strips])

  const filteredQueue = useMemo(() =>
    selectedProject ? queueStrips.filter(s => s.project === selectedProject) : queueStrips,
    [queueStrips, selectedProject]
  )
  const filteredCleared = useMemo(() =>
    selectedProject ? clearedStrips.filter(s => s.project === selectedProject) : clearedStrips,
    [clearedStrips, selectedProject]
  )

  const { seconds: timerSeconds, isRunning: isTimerRunning, toggle: toggleTimer, reset: resetTimer } = useTimer({
    initialSeconds: activeStrip?.timer_seconds ?? 0,
    onTick: (s) => { if (activeStrip) updateTimer(activeStrip.id, s) },
  })

  const handleDone = useCallback(() => {
    if (!activeStrip) return
    resetTimer()
    moveStrip(activeStrip.id, 'cleared')
  }, [activeStrip, moveStrip, resetTimer])

  const handleQueueBack = useCallback(() => {
    if (!activeStrip) return
    resetTimer()
    moveStrip(activeStrip.id, 'queue')
  }, [activeStrip, moveStrip, resetTimer])

  const handleActivate = useCallback((stripId?: string) => {
    const id = stripId ?? filteredQueue[selectedQueueIndex]?.id
    if (!id) return
    resetTimer()
    moveStrip(id, 'active')
  }, [filteredQueue, selectedQueueIndex, moveStrip, resetTimer])

  const handleNavigateUp = useCallback(() => {
    setSelectedQueueIndex(prev => Math.max(0, prev - 1))
  }, [])

  const handleNavigateDown = useCallback(() => {
    setSelectedQueueIndex(prev => Math.min(filteredQueue.length - 1, prev + 1))
  }, [filteredQueue.length])

  const handleClose = useCallback(() => {
    if (detailStrip) setDetailStrip(null)
    else if (helpOpen) setHelpOpen(false)
    else if (newStripOpen) setNewStripOpen(false)
    else if (statsOpen) setStatsOpen(false)
  }, [detailStrip, helpOpen, newStripOpen, statsOpen])

  const handleCycleProject = useCallback(() => {
    setSelectedQueueIndex(0)
    setSelectedProject(prev => {
      if (prev === null) return projects[0] ?? null
      const idx = projects.indexOf(prev)
      return idx < projects.length - 1 ? projects[idx + 1] : null
    })
  }, [projects])

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(strips, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sabaku-strips-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [strips])

  const shortcutHandlers = useMemo(() => ({
    onNew: () => setNewStripOpen(true),
    onToggleTimer: () => { if (activeStrip) toggleTimer() },
    onDone: handleDone,
    onQueueBack: handleQueueBack,
    onNavigateUp: handleNavigateUp,
    onNavigateDown: handleNavigateDown,
    onActivate: () => handleActivate(),
    onClose: handleClose,
    onViewFocus: () => setViewMode('focus'),
    onViewKanban: () => setViewMode('kanban'),
    onHelp: () => setHelpOpen(prev => !prev),
    onCycleProject: handleCycleProject,
  }), [activeStrip, toggleTimer, handleDone, handleQueueBack, handleNavigateUp, handleNavigateDown, handleActivate, handleClose, handleCycleProject])

  useKeyboardShortcuts(shortcutHandlers)

  return (
    <div className="flex flex-col h-screen">
      <Header
        viewMode={viewMode}
        onViewChange={setViewMode}
        onNewStrip={() => setNewStripOpen(true)}
        onShowHelp={() => setHelpOpen(true)}
        onExport={handleExport}
        onShowStats={() => setStatsOpen(true)}
        projects={projects}
        selectedProject={selectedProject}
        onProjectChange={(p) => { setSelectedProject(p); setSelectedQueueIndex(0) }}
      />

      <main className="flex-1 p-4 overflow-hidden">
        {viewMode === 'kanban' ? (
          <KanbanView
            activeStrip={activeStrip}
            queueStrips={filteredQueue}
            clearedStrips={filteredCleared}
            onMoveStrip={moveStrip}
            onReorderQueue={reorderQueue}
            onStripClick={setDetailStrip}
            selectedQueueIndex={selectedQueueIndex}
          />
        ) : (
          <FocusView
            activeStrip={activeStrip}
            queueStrips={filteredQueue}
            timerSeconds={timerSeconds}
            isTimerRunning={isTimerRunning}
            onToggleTimer={toggleTimer}
            onDone={handleDone}
            onQueueBack={handleQueueBack}
            onActivate={(id) => handleActivate(id)}
            onStripClick={setDetailStrip}
          />
        )}
      </main>

      <StatusBar
        activeCount={activeStrip ? 1 : 0}
        queueCount={filteredQueue.length}
        clearedCount={filteredCleared.length}
        selectedProject={selectedProject}
      />

      <NewStripModal
        isOpen={newStripOpen}
        onClose={() => setNewStripOpen(false)}
        onSubmit={addStrip}
        projects={projects}
      />

      <ShortcutHelp isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      <StripDetailModal
        strip={currentDetailStrip}
        projects={projects}
        onClose={() => setDetailStrip(null)}
        onEdit={editStrip}
        onDelete={deleteStrip}
        onFocus={(id) => { resetTimer(); moveStrip(id, 'active') }}
        onDone={(id) => { resetTimer(); moveStrip(id, 'cleared') }}
        onQueueBack={(id) => { resetTimer(); moveStrip(id, 'queue') }}
      />

      <OnboardingModal isOpen={onboardingOpen} onClose={handleFinishOnboarding} />

      <StatsPanel isOpen={statsOpen} onClose={() => setStatsOpen(false)} strips={strips} />
    </div>
  )
}
