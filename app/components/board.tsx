import { cn } from '@/lib/utils'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { type ReactElement, type ReactNode, useEffect, useRef, useState } from 'react'
import invariant from 'tiny-invariant'

type PieceProps = {
  image: string
  alt: string
}

function Piece({ image, alt }: PieceProps) {
  const ref = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    invariant(el, 'element is not found')

    return draggable({
      element: el,
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })
  }, [])

  return (
    <img
      ref={ref}
      src={image}
      alt={alt}
      className={cn(
        'size-10 shadow p-2 rounded bg-base-100 hover:bg-base-200',
        isDragging && 'opacity-50',
      )}
      draggable={false}
    />
  )
}

function King() {
  return <Piece image="/king.png" alt="king" />
}

function Pawn() {
  return <Piece image="/pawn.png" alt="pawn" />
}

type PieceType = 'king' | 'pawn'
type Coord = [number, number]

type PieceRecord = {
  type: PieceType
  location: Coord
}

const pieceLookup: { [Key in PieceType]: () => ReactElement } = {
  king: () => <King />,
  pawn: () => <Pawn />,
}

function isEqualCoord(c1: Coord, c2: Coord) {
  return c1[0] === c2[0] && c1[1] === c2[1]
}

type SquareProps = {
  location: Coord
  children: ReactNode
}

function Square({ location, children }: SquareProps) {
  const ref = useRef(null)
  const [isDraggedOver, setIsDraggedOver] = useState(false)
  const isDark = (location[0] + location[1]) % 2 === 1

  useEffect(() => {
    const el = ref.current
    invariant(el, 'element is not found')

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    })
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'size-full bg-base-100 flex items-center justify-center',
        isDark && 'bg-base-300',
        isDraggedOver && 'bg-primary-content',
      )}
    >
      {children}
    </div>
  )
}

function renderSquares(pieces: PieceRecord[]) {
  const squares = []
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const squaredCoord: Coord = [i, j]
      const piece = pieces.find((p) => isEqualCoord(p.location, squaredCoord))
      const isDark = (i + j) % 2 === 1

      squares.push(
        <Square location={squaredCoord} key={`${i}-${j}`}>
          {piece && pieceLookup[piece.type]()}
        </Square>,
      )
    }
  }
  return squares
}

export function ChessBoard() {
  const pieces: PieceRecord[] = [
    { type: 'king', location: [3, 2] },
    { type: 'pawn', location: [1, 6] },
  ]

  return (
    <div className="grid grid-cols-8 grid-rows-8 size-[500px] border border-base-300">
      {renderSquares(pieces)}
    </div>
  )
}
