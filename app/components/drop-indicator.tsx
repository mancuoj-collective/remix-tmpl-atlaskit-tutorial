import { cn } from '@/lib/utils'
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import type { CSSProperties } from 'react'

const strokeSize = 2
const terminalSize = 8

export function DropIndicator({ edge, gap }: { edge: Edge, gap: string }) {
  return (
    <div
      style = {{
        '--line-thickness': `${strokeSize}px`,
        '--line-offset': `calc(0.5 * (${gap} + ${strokeSize}px))`,
        '--terminal-size': `${terminalSize}px`,
        '--terminal-offset': `${(terminalSize - strokeSize) / 2}px`,
      } as CSSProperties}
      className={cn(
        'absolute z-10 bg-primary pointer-events-none h-(--line-thickness) w-full',
        'before:content-[""] before:absolute before:border before:border-primary before:size-(--terminal-size) before:rounded-full',
        {
          '-top-(--line-offset) before:-left-(--terminal-size) before:-top-(--terminal-offset)': edge === 'top',
          '-bottom-(--line-offset) before:-left-(--terminal-size) before:-bottom-(--terminal-offset)': edge === 'bottom',
        },
      )}
    />
  )
}
