'use client'

import { useState, useRef } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import type { Strip, StripStatus } from '@/types'
import StripCard from './StripCard'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface KanbanViewProps {
  activeStrip: Strip | null
  queueStrips: Strip[]
  clearedStrips: Strip[]
  onMoveStrip: (stripId: string, newStatus: StripStatus) => void
  onReorderQueue: (startIndex: number, endIndex: number) => void
  onStripClick: (strip: Strip) => void
  selectedQueueIndex: number
}

export default function KanbanView({
  activeStrip,
  queueStrips,
  clearedStrips,
  onMoveStrip,
  onReorderQueue,
  onStripClick,
  selectedQueueIndex,
}: KanbanViewProps) {
  const [clearedExpanded, setClearedExpanded] = useState(false)
  const displayedCleared = clearedExpanded ? clearedStrips : clearedStrips.slice(0, 5)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    const { source, destination, draggableId } = result
    if (source.droppableId === 'queue' && destination.droppableId === 'queue') {
      onReorderQueue(source.index, destination.index)
      return
    }
    const statusMap: Record<string, StripStatus> = {
      active: 'active',
      queue: 'queue',
      cleared: 'cleared',
    }
    const newStatus = statusMap[destination.droppableId]
    if (newStatus) onMoveStrip(draggableId, newStatus)
  }

  function handleMouseDown(e: React.MouseEvent) {
    dragStartRef.current = { x: e.clientX, y: e.clientY }
  }

  function handleClick(e: React.MouseEvent, strip: Strip) {
    if (!dragStartRef.current) return onStripClick(strip)
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    if (Math.sqrt(dx * dx + dy * dy) < 5) onStripClick(strip)
    dragStartRef.current = null
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full overflow-x-auto">
        {/* ACTIVE */}
        <Column title="ACTIVE" count={activeStrip ? 1 : 0} accent>
          <Droppable droppableId="active">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 min-h-[100px] p-2 rounded transition-colors ${snapshot.isDraggingOver ? 'bg-accent/5' : ''}`}
              >
                {activeStrip ? (
                  <Draggable draggableId={activeStrip.id} index={0}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onMouseDown={handleMouseDown}
                        onClick={(e) => handleClick(e, activeStrip)}
                        style={{
                          ...provided.draggableProps.style,
                          transform: snapshot.isDragging
                            ? `${provided.draggableProps.style?.transform} rotate(1deg)`
                            : provided.draggableProps.style?.transform,
                          cursor: 'pointer',
                        }}
                      >
                        <StripCard strip={activeStrip} displayIndex={activeStrip.position} showTimer />
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <div className="flex items-center justify-center h-full text-text-tertiary text-[13px]">
                    Ready for takeoff
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Column>

        {/* QUEUE */}
        <Column title="QUEUE" count={queueStrips.length}>
          <Droppable droppableId="queue">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 p-2 space-y-1 overflow-y-auto rounded transition-colors ${snapshot.isDraggingOver ? 'bg-accent/5' : ''}`}
              >
                {queueStrips.map((strip, index) => (
                  <Draggable key={strip.id} draggableId={strip.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onMouseDown={handleMouseDown}
                        onClick={(e) => handleClick(e, strip)}
                        style={{
                          ...provided.draggableProps.style,
                          transform: snapshot.isDragging
                            ? `${provided.draggableProps.style?.transform} rotate(1deg)`
                            : provided.draggableProps.style?.transform,
                          cursor: 'pointer',
                        }}
                      >
                        <StripCard
                          strip={strip}
                          displayIndex={strip.position}
                          isSelected={index === selectedQueueIndex}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {queueStrips.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-text-tertiary text-[13px]">
                    Queue is empty — press <kbd className="mx-1 px-1 py-0.5 bg-bg-secondary border border-border rounded text-[10px] font-mono">n</kbd> to create
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Column>

        {/* CLEARED */}
        <Column title="CLEARED" count={clearedStrips.length}>
          <Droppable droppableId="cleared">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 p-2 space-y-1 overflow-y-auto"
              >
                {displayedCleared.map((strip, index) => (
                  <Draggable key={strip.id} draggableId={strip.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onMouseDown={handleMouseDown}
                        onClick={(e) => handleClick(e, strip)}
                        style={{ ...provided.draggableProps.style, cursor: 'pointer' }}
                      >
                        <StripCard strip={strip} displayIndex={strip.position} compact />
                      </div>
                    )}
                  </Draggable>
                ))}
                {clearedStrips.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-text-tertiary text-[13px]">
                    Completed strips appear here
                  </div>
                )}
                {clearedStrips.length > 5 && (
                  <button
                    onClick={() => setClearedExpanded(!clearedExpanded)}
                    className="flex items-center gap-1 text-[12px] text-text-tertiary hover:text-text-secondary px-2 py-1 w-full"
                  >
                    {clearedExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    {clearedExpanded ? 'Collapse' : `+${clearedStrips.length - 5} more`}
                  </button>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Column>
      </div>
    </DragDropContext>
  )
}

function Column({
  title, count, accent, children,
}: {
  title: string
  count: number
  accent?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col border border-border rounded bg-bg-primary min-h-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className={`text-[13px] font-medium tracking-wide ${accent ? 'text-accent' : 'text-text-secondary'}`}>
          {title}
        </span>
        <span className="text-[11px] text-text-tertiary font-mono">{count}</span>
      </div>
      {children}
    </div>
  )
}
