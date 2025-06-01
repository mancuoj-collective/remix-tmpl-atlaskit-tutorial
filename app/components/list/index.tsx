import {
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge'
import {monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { getCards, isCardData } from './data'
import { Card } from './card'

export function List() {
  const [cards, setCards] = useState(() => getCards())

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => isCardData(source.data),
      onDrop: ({ location, source }) => {
        const target = location.current.dropTargets[0]
        if (!target) return

        const sourceData = source.data
        const targetData = target.data
        if (!isCardData(sourceData) || !isCardData(targetData)) return

        const indexOfSource = cards.findIndex((card) => card.id === sourceData.cardId)
        const indexOfTarget = cards.findIndex((card) => card.id === targetData.cardId)
        if (indexOfSource < 0 || indexOfTarget < 0) return

        const closestEdgeOfTarget = extractClosestEdge(targetData)

        flushSync(() => {
          setCards(
            reorderWithEdge({
              list: cards,
              startIndex: indexOfSource,
              indexOfTarget,
              closestEdgeOfTarget,
              axis: 'vertical',
            }),
          )
        })

        const element = document.querySelector(`[data-card-id="${sourceData.cardId}"]`)
        if (element instanceof HTMLElement) {
          element.animate([{ backgroundColor: 'oklch(92.2% 0 0)' }, {}], {
            easing: 'ease-in-out',
            duration: 1000,
            iterations: 1,
          })
        }
      },
    })
  })

  return (
    <div className="flex flex-col gap-2.5 border border-neutral-300 rounded p-3 w-[500px]">
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  )
}
