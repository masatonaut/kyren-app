'use client'

import { useState } from 'react'
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
  selectedQueueIndex: number
}

export default function KanbanView({
  activeStrip,
  queueStrips,
  clearedStrips,
  onMoveStrip,
  onReorderQueue,
  selectedQueueIndex,
}: KanbanViewProps) {
  const [clearedExpanded, setClearedExpanded] = useState(false)
  const displayedCleared = clearedExpanded ? clearedStrips : clearedStrips.slice(0, 5)

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    // Reorder within queue
    if (source.droppableId === 'queue' && destination.droppableId === 'queue') {
      onReorderQueue(source.index, destination.index)
      return
    }

    // Move between columns
    const statusMap: Record<string, StripStatus> = {
      active: 'active',
      queue: 'queue',
      cleared: 'cleared',
    }
    const newStatus = statusMap[destination.droppableId]
    if (newStatus) {
      onMoveStrip(draggableId, newStatus)
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* ACTIVE Column */}
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
                        style={{
                          ...provided.draggableProps.style,
                          transform: snapshot.isDragging
                            ? `${provided.draggableProps.style?.transform} rotate(1deg)`
                            : provided.draggableProps.style?.transform,
                        }}
                      >
                        <StripCard
                          strip={activeStrip}
                          displayIndex={activeStrip.position}
                          showTimer
                        />
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <div className="flex items-center justify-center h-full text-text-tertiary text-[13px]">
                    管制塔スタンバイ
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Column>

        {/* QUEUE Column */}
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
                        style={{
                          ...provided.draggableProps.style,
                          transform: snapshot.isDragging
                            ? `${provided.draggableProps.style?.transform} rotate(1deg)`
                            : provided.draggableProps.style?.transform,
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
                    QUEUE にストリップがありません
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Column>

        {/* CLEARED Column */}
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
                      >
                        <StripCard strip={strip} displayIndex={strip.position} compact />
                      </div>
                    )}
                  </Draggable>
                ))}
                {clearedStrips.length > 5 && (
                  <button
                    onClick={() => setClearedExpanded(!clearedExpanded)}
                    className="flex items-center gap-1 text-[12px] text-text-tertiary hover:text-text-secondary px-2 py-1 w-full"
                  >
                    {clearedExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    {clearedExpanded ? '折りたたむ' : `他 ${clearedStrips.length - 5} 件`}
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
  title,
  count,
  accent,
  children,
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
