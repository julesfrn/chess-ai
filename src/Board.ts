import Piece, { color, pieceName } from './pieces/Piece'
import defaultSquare from './defaultSquare'
import Pawn from './pieces/Pawn'
import King from './pieces/King'

export interface ISquare {
  piece: Piece | null
  name: string
}

export default class Board {
  public readonly squares: ISquare[][] = defaultSquare

  public turn: color = color.WHITE

  public selectedSquare: ISquare | null = null

  public moveHistory: string[] = []

  public render(): void {
    const HTMLBoard = document.querySelector('#board')
    HTMLBoard.innerHTML = ''
    this.squares.forEach((row: ISquare[], rowIndex) => {
      const HTMLRow = document.createElement('div')
      HTMLRow.setAttribute('id', `row${rowIndex}`)
      HTMLRow.setAttribute('class', `row`)
      HTMLBoard.appendChild(HTMLRow)
      row.forEach((square: ISquare) => {
        HTMLRow.innerHTML += square.piece
          ? `<div class="square" id="${square.name}" style="background-image: url(${square.piece.image});" ${
              square.piece.color === this.turn ? 'clickable' : ''
            }>${square.name}</div>`
          : `<div class="square" id="${square.name}">${square.name}</div>`
      })
    })
    this.listenToClicks()
  }

  public renderSquare(square: ISquare): void {
    let squareCoordinates = this.getSquareCoordinates(square.name)
    this.squares[squareCoordinates.row][squareCoordinates.column] = square
  }

  public renderSquaresAndUI(...squares: ISquare[]) {
    squares.forEach((square: ISquare) => {
      this.renderSquare(square)
      if (square.piece) document.getElementById(square.name).style.backgroundImage = `url(${square.piece.image})`
      else document.getElementById(square.name).removeAttribute('style')
    })
  }

  getSquareCoordinates(square: ISquare['name'] | ISquare): { row: number; column: number } {
    let rowIndex, columnIndex
    if (typeof square === 'string') {
      rowIndex = this.squares.indexOf(this.squares.find((row) => row[0].name[1] === square[1]))
      columnIndex = this.squares[rowIndex].indexOf(this.squares[rowIndex].find((_square) => _square.name === square))
    } else {
      rowIndex = this.squares.indexOf(this.squares.find((row) => row[0].name[1] === square.name[1]))
      columnIndex = this.squares[rowIndex].indexOf(this.squares[rowIndex].find((_square) => _square === square))
    }
    return { row: rowIndex, column: columnIndex }
  }

  getSquareFromCoordinates({ row, column }: { row: number; column: number }): ISquare {
    return this.squares[row][column]
  }

  getSquareFromName(squareName: ISquare['name']): ISquare {
    const squareCoordinates = this.getSquareCoordinates(squareName)
    return this.getSquareFromCoordinates(squareCoordinates)
  }

  public setSquareWithPawnsClickable(): void {
    this.squares.forEach((row: ISquare[]) => {
      row.forEach((square: ISquare) => {
        if (square.piece && square.piece.color === this.turn)
          document.getElementById(square.name).setAttribute('clickable', '')
      })
    })
  }

  public listenToClicks(): void {
    document.querySelectorAll('[clickable]').forEach((clickableElement) => {
      clickableElement.addEventListener('click', this.handleSquareClicked.bind(this))
    })
  }

  private handleSquareClicked(event: MouseEvent): void {
    console.log(this)
    document.querySelectorAll('[clickable]').forEach((element) => {
      element.removeAttribute('clickable')
      const elementWithountListeners = element.cloneNode(true)
      element.parentNode.replaceChild(elementWithountListeners, element)
    })
    document.querySelectorAll('.canGoToThisSquare').forEach((element) => element.classList.remove('canGoToThisSquare'))
    const squareName: ISquare['name'] = (event.target as any).id
    const square: ISquare = this.getSquareFromName(squareName)
    if ((square.piece && this.selectedSquare === null) || (square.piece && square.piece?.color === this.turn)) {
      square.piece.showAvailableMoves(this, square)
      this.selectedSquare = square
    } else {
      this.selectedSquare.piece.move(this, this.selectedSquare, square)
      this.selectedSquare = null
    }
  }

  public getSquaresBetween(square: ISquare, secondSquare: ISquare): ISquare[] {
    const squareCoordinates = this.getSquareCoordinates(square)
    const secondSquareCoordinates = this.getSquareCoordinates(secondSquare)
    const coordinatesArray: ISquare[] = []
    if (squareCoordinates.column === secondSquareCoordinates.column) {
      let index = squareCoordinates.row
      if (squareCoordinates.row < secondSquareCoordinates.row) {
        while (index < secondSquareCoordinates.row) {
          index++
          coordinatesArray.push(this.getSquareFromCoordinates({ row: index, column: squareCoordinates.column }))
        }
      } else {
        while (index > secondSquareCoordinates.row) {
          index--
          coordinatesArray.push(this.getSquareFromCoordinates({ row: index, column: squareCoordinates.column }))
        }
      }
    } else if (squareCoordinates.row === secondSquareCoordinates.row) {
      let index = squareCoordinates.column
      if (squareCoordinates.column < secondSquareCoordinates.column) {
        while (index < secondSquareCoordinates.column) {
          index++
          coordinatesArray.push(this.getSquareFromCoordinates({ column: index, row: squareCoordinates.row }))
        }
      } else {
        while (index > secondSquareCoordinates.column) {
          index--
          coordinatesArray.push(this.getSquareFromCoordinates({ column: index, row: squareCoordinates.row }))
        }
      }
    } else {
      let rowIndex = squareCoordinates.row
      let columnIndex = squareCoordinates.column
      if (squareCoordinates.column < secondSquareCoordinates.column) {
        while (columnIndex < secondSquareCoordinates.column) {
          columnIndex++
          rowIndex = squareCoordinates.row < secondSquareCoordinates.row ? rowIndex + 1 : rowIndex - 1
          coordinatesArray.push(this.getSquareFromCoordinates({ column: columnIndex, row: rowIndex }))
        }
      } else {
        while (columnIndex > secondSquareCoordinates.column) {
          columnIndex--
          rowIndex = squareCoordinates.row < secondSquareCoordinates.row ? rowIndex + 1 : rowIndex - 1
          coordinatesArray.push(this.getSquareFromCoordinates({ column: columnIndex, row: rowIndex }))
        }
      }
    }
    return coordinatesArray
  }

  deleteEnPassantVulnerabilities() {
    this.squares
      .flat()
      .filter((square) => square.piece)
      .forEach((square) => {
        if (square.piece instanceof Pawn) square.piece.isVulnerableToEnPassant = false
      })
  }

  getEnemyKingSquare(allyColor: color): ISquare {
    if (allyColor === color.WHITE) {
      return this.squares.flat().find((square) => square.piece?.color === color.BLACK && square.piece instanceof King)
    } else {
      return this.squares.flat().find((square) => square.piece?.color === color.WHITE && square.piece instanceof King)
    }
  }

  getAllyKingSquare(allyColor: color): ISquare {
    return this.squares.flat().find((square) => square.piece?.color === allyColor && square.piece instanceof King)
  }

  displayCheckMateIfCheckMate(): void {
    const availableMoves = this.squares.flat().filter(square => square.piece?.color === this.turn).map(square => {
      return square.piece.getAllAvailableMoves(this, square).filter(
        (newSquare) => {
          if (square.piece.name !== pieceName.KING) {
            return !(this.getAllyKingSquare(square.piece.color).piece as King).isGoingToBeInCheckAfterMove(square, newSquare, this)
          } else {
            return true
          }
        }
      )
    }).flat()
    console.log(availableMoves)
    if (availableMoves.length < 1) {
      document.querySelector('#board').classList.add('winningScreen')
      document.querySelector('#board').innerHTML = `<h1>${this.turn === color.WHITE ? color.BLACK : color.WHITE} won the game</h1>`
    }
  }
}
