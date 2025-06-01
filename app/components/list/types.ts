import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'

export type TCardStatus = 'todo' | 'inProgress' | 'done'

export type TCard = {
  id: string
  content: string
  status: TCardStatus
}

export const cardDataKey = Symbol('card')

export type TCardData = {
  [cardDataKey]: true
  cardId: TCard['id']
}

export type TCardState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'isDragging' }
  | { type: 'isDraggingOver'; closestEdge: Edge | null }
