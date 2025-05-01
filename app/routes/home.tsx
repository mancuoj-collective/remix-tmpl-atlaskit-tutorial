import { cn } from '@/lib/utils'
import type { ReactElement } from 'react'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'React Router' }, { name: 'description', content: 'Welcome to React Router!' }]
}

type PieceProps = {
  image: string
  alt: string
}

function Piece({ image, alt }: PieceProps) {
  return (
    <img
      src={image}
      alt={alt}
      className="size-10 shadow p-2 rounded bg-base-100 hover:bg-base-200"
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

export const pieceLookup: { [Key in PieceType]: () => ReactElement } = {
  king: () => <King />,
  pawn: () => <Pawn />,
}

function isEqualCoord(c1: Coord, c2: Coord) {
  return c1[0] === c2[0] && c1[1] === c2[1]
}

function renderSquares(pieces: PieceRecord[]) {
  const squares = []
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const squaredCoord: Coord = [i, j]
      const piece = pieces.find((p) => isEqualCoord(p.location, squaredCoord))
      const isDark = (i + j) % 2 === 1

      squares.push(
        <div
          key={`${i}-${j}`}
          className={cn(
            'size-full bg-base-100 flex items-center justify-center',
            isDark && 'bg-base-300',
          )}
        >
          {piece && pieceLookup[piece.type]()}
        </div>,
      )
    }
  }
  return squares
}

function ChessBoard() {
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

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <ChessBoard />
    </div>
  )
}
