import type { TCard, TCardData } from './types'
import { cardDataKey } from './types'

export function getCardData(card: TCard): TCardData {
  return {
    [cardDataKey]: true,
    cardId: card.id,
  }
}

export function isCardData(data: Record<string | symbol, unknown>): data is TCardData {
  return data[cardDataKey] === true
}

export function getCards(): TCard[] {
  return [
    { id: 'task-0', content: 'AAA', status: 'todo' },
    { id: 'task-1', content: 'BBB', status: 'inProgress' },
    { id: 'task-2', content: 'CCC', status: 'done' },
    { id: 'task-3', content: 'DDD', status: 'todo' },
    { id: 'task-4', content: 'EEE', status: 'done' },
    { id: 'task-5', content: 'FFF', status: 'done' },
    { id: 'task-6', content: 'GGG', status: 'todo' },
    { id: 'task-7', content: 'HHH', status: 'inProgress' },
  ]
}
