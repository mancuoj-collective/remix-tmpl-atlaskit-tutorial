import { cn } from '@/lib/utils'
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import type { CSSProperties } from 'react'

const strokeSize = 4
const terminalSize = 8

export function DropIndicator({ edge, gap }: { edge: Edge; gap: string }) {
  return (
    <div
      style={
        {
          '--line-thickness': `${strokeSize}px`,
          '--line-offset': `calc(0.5 * (${gap} + ${strokeSize}px))`,
          '--terminal-size': `${terminalSize}px`,
          '--terminal-offset': `${(terminalSize - strokeSize) / 2}px`,
        } as CSSProperties
      }
      className={cn(
        'absolute z-10 bg-neutral-500 pointer-events-none h-(--line-thickness) w-full',
        'before:content-[""] before:absolute before:border before:border-neutral-500  before:size-(--terminal-size) before:-left-(--terminal-size) before:rounded-full',
        {
          '-top-(--line-offset)  before:-top-(--terminal-offset)': edge === 'top',
          '-bottom-(--line-offset)  before:-bottom-(--terminal-offset)': edge === 'bottom',
        },
      )}
    />
  )
}
