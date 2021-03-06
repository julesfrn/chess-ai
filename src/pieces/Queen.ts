import Board, { ISquare } from '../Board'
import Piece, { color, pieceName } from './Piece'

export default class Queen extends Piece {
  constructor(color: color) {
    super(color)
    this.name = pieceName.QUEEN
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
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [-1, 0],
      [-2, 0],
      [-3, 0],
      [-4, 0],
      [-5, 0],
      [-6, 0],
      [-7, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
      [0, 7],
      [0, -1],
      [0, -2],
      [0, -3],
      [0, -4],
      [0, -5],
      [0, -6],
      [0, -7],
    ]
  }

  get image(): string {
    return this.color === color.WHITE
      ? 'https://images.chesscomfiles.com/chess-themes/pieces/tournament/150/wq.png'
      : 'https://images.chesscomfiles.com/chess-themes/pieces/tournament/150/bq.png'
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
