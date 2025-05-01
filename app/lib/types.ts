export type PieceType = 'king' | 'pawn'
export type Coord = [number, number]
export type PieceRecord = {
  type: PieceType
  location: Coord
}
