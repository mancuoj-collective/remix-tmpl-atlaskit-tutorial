import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { useEffect, useRef, useState } from 'react'
import invariant from 'tiny-invariant'
import type { TCardState, TCard } from './types'
import { getCardData, isCardData } from './data'
import { cn } from '@/lib/utils'
import { GripVerticalIcon } from 'lucide-react'
import { Status } from './status'
import { DropIndicator } from './drop-indicator'
import { createPortal } from 'react-dom'

export function Card({ card }: { card: TCard }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState<TCardState>({ type: 'idle' })

  useEffect(() => {
    const element = ref.current
    invariant(element, 'el is required')

    return combine(
      draggable({
        element,
        getInitialData: () => getCardData(card),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({ x: '16px', y: '8px' }),
            render: ({ container }) => {
              setState({ type: 'preview', container })
            },
          })
        },
        onDragStart: () => setState({ type: 'isDragging' }),
        onDrop: () => setState({ type: 'idle' }),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          if (source.element === element) return false
          return isCardData(source.data)
        },
        getData: ({ input }) => {
          const data = getCardData(card)
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          })
        },
        getIsSticky: () => true,
        onDragEnter: ({ self }) => {
          const closestEdge = extractClosestEdge(self.data)
          setState({ type: 'isDraggingOver', closestEdge })
        },
        onDrag: ({ self }) => {
          const closestEdge = extractClosestEdge(self.data)
          setState((current) => {
            if (current.type === 'isDraggingOver' && current.closestEdge === closestEdge)
              return current
            return { type: 'isDraggingOver', closestEdge }
          })
        },
        onDragLeave: () => setState({ type: 'idle' }),
        onDrop: () => setState({ type: 'idle' }),
      }),
    )
  })
  
  return (
    <>
      <div className="relative">
        <div
          ref={ref}
          data-card-id={card.id}
          className={cn(
            'flex items-center text-sm  border border-neutral-300 rounded p-2 pl-0 hover:cursor-grab',
            {
              'opacity-50': state.type === 'isDragging',
            },
          )}
        >
          <div className="flex justify-center w-6 shrink-0">
            <GripVerticalIcon size={12} />
          </div>
          <span className="truncate grow shrink">{card.content}</span>
          <Status status={card.status} />
        </div>
        {state.type === 'isDraggingOver' && state.closestEdge ? (
          <DropIndicator edge={state.closestEdge} gap="10px" />
        ) : null}
      </div>
      {state.type === 'preview' ? createPortal(<DragPreview card={card} />, state.container) : null}
    </>
  )
}

function DragPreview({ card }: { card: TCard }) {
  return <div className="border-solid rounded p-2 bg-neutral-100 text-sm">{card.content}</div>
}
