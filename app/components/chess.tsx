import { cn } from '@/lib/utils'
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { type ReactElement, type ReactNode, useEffect, useRef, useState } from 'react'
import invariant from 'tiny-invariant'

type PieceType = 'king' | 'pawn'
type Coord = [number, number]

type PieceRecord = {
  type: PieceType
  location: Coord
}

type PieceProps = {
  location: Coord
  pieceType: PieceType
  image: string
  alt: string
}

function Piece({ location, pieceType, image, alt }: PieceProps) {
  const ref = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    invariant(el, 'element is not found')

    return draggable({
      element: el,
      getInitialData: () => ({ location, pieceType }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })
  }, [location, pieceType])

  return (
    <img
      ref={ref}
      src={image}
      alt={alt}
      className={cn(
        'size-10 shadow p-2 rounded bg-neutral-100 hover:bg-neutral-200',
        isDragging && 'opacity-50',
      )}
    />
  )
}

function King({ location }: { location: Coord }) {
  return <Piece location={location} pieceType="king" image="/king.png" alt="king" />
}

function Pawn({ location }: { location: Coord }) {
  return <Piece location={location} pieceType="pawn" image="/pawn.png" alt="pawn" />
}

const pieceLookup: { [Key in PieceType]: (location: Coord) => ReactElement } = {
  king: (location) => <King location={location} />,
  pawn: (location) => <Pawn location={location} />,
}

function isEqualCoord(c1: Coord, c2: Coord) {
  return c1[0] === c2[0] && c1[1] === c2[1]
}

function canMove(start: Coord, destination: Coord, pieceType: PieceType, pieces: PieceRecord[]) {
  const rowDist = Math.abs(start[0] - destination[0])
  const colDist = Math.abs(start[1] - destination[1])

  if (pieces.find((p) => isEqualCoord(p.location, destination))) {
    return false
  }

  switch (pieceType) {
    case 'king':
      return rowDist <= 1 && colDist <= 1
    case 'pawn':
      return colDist === 0 && start[0] - destination[0] === -1
    default:
      return false
  }
}

function isCoord(value: unknown): value is Coord {
  return Array.isArray(value) && value.length === 2 && value.every((v) => typeof v === 'number')
}

function isPieceType(value: unknown): value is PieceType {
  return typeof value === 'string' && ['king', 'pawn'].includes(value)
}

type SquareProps = {
  pieces: PieceRecord[]
  location: Coord
  children: ReactNode
}

type HoveredStatus = 'idle' | 'validMove' | 'invalidMove'

function Square({ pieces, location, children }: SquareProps) {
  const ref = useRef(null)
  const [status, setStatus] = useState<HoveredStatus>('idle')
  const isDark = (location[0] + location[1]) % 2 === 1

  useEffect(() => {
    const el = ref.current
    invariant(el, 'element is not found')

    return dropTargetForElements({
      element: el,
      getData: () => ({ location }),
      canDrop: ({ source }) => {
        if (!isCoord(source.data.location)) {
          return false
        }
        return !isEqualCoord(source.data.location, location)
      },
      onDragEnter: ({ source }) => {
        if (!isCoord(source.data.location) || !isPieceType(source.data.pieceType)) {
          return
        }

        if (canMove(source.data.location, location, source.data.pieceType, pieces)) {
          setStatus('validMove')
        } else {
          setStatus('invalidMove')
        }
      },
      onDragLeave: () => setStatus('idle'),
      onDrop: () => setStatus('idle'),
    })
  }, [location, pieces])

  return (
    <div
      ref={ref}
      className={cn(
        'size-full bg-neutral-50 flex items-center justify-center',
        isDark && 'bg-neutral-200',
        status === 'validMove' && 'bg-green-200',
        status === 'invalidMove' && 'bg-red-200',
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
      const piece = pieces.find((p) => isEqualCoord(p.location, [i, j]))

      squares.push(
        <Square location={[i, j]} key={`${i}-${j}`} pieces={pieces}>
          {piece && pieceLookup[piece.type](piece.location)}
        </Square>,
      )
    }
  }
  return squares
}

export function Chess() {
  const [pieces, setPieces] = useState<PieceRecord[]>([
    { type: 'king', location: [3, 2] },
    { type: 'pawn', location: [1, 6] },
  ])

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const destination = location.current.dropTargets[0]
        if (!destination) {
          return
        }

        const destinationLocation = destination.data.location
        const sourceLocation = source.data.location
        const pieceType = source.data.pieceType

        if (!isCoord(destinationLocation) || !isCoord(sourceLocation) || !isPieceType(pieceType)) {
          return
        }

        const piece = pieces.find((p) => isEqualCoord(p.location, sourceLocation))
        const restOfPieces = pieces.filter((p) => p !== piece)

        if (
          canMove(sourceLocation, destinationLocation, pieceType, pieces) &&
          piece !== undefined
        ) {
          setPieces([{ type: pieceType, location: destinationLocation }, ...restOfPieces])
        }
      },
    })
  }, [pieces])

  return (
    <div className="grid grid-cols-8 grid-rows-8 size-[500px] border border-neutral-300">
      {renderSquares(pieces)}
    </div>
  )
}
