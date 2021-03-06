import Board, { ISquare } from '../Board'
import Piece, { color, pieceName } from './Piece'

export default class Bishop extends Piece {
  constructor(color: color) {
    super(color)
    this.name = pieceName.BISHOP
    this.moves = [
      [1, 1],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [2, 2],
      [-2, -2],
      [-2, 2],
      [2, -2],
      [3, 3],
      [-3, -3],
      [-3, 3],
      [3, -3],
      [4, 4],
      [-4, -4],
      [-4, 4],
      [4, -4],
      [5, 5],
      [-5, -5],
      [-5, 5],
      [5, -5],
      [6, 6],
      [-6, -6],
      [-6, 6],
      [6, -6],
      [7, 7],
      [-7, -7],
      [-7, 7],
      [7, -7],
    ]
  }

  get image(): string {
    return this.color === color.WHITE
      ? 'https://images.chesscomfiles.com/chess-themes/pieces/tournament/150/wb.png'
      : 'https://images.chesscomfiles.com/chess-themes/pieces/tournament/150/bb.png'
  }

  public isAllowedToMoveTo(currentSquare: ISquare, newSquare: ISquare, board: Board): boolean {
    let isAllowedToMoveTo = true
    const squaresBetween = board.getSquaresBetween(currentSquare, newSquare)
    for (let i = 0; i < squaresBetween.length; i++) {
      if (
        squaresBetween[i].piece?.color === this.color ||
        (squaresBetween[i - 1]?.piece && squaresBetween[i - 1].piece.color !== this.color)
      ) {
        isAllowedToMoveTo = false
        break
      }
    }
    return isAllowedToMoveTo
  }

  public moveSpecific() {}
}
