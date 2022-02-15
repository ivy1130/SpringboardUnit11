const width = 7
const height = 6

let currPlayer = 1
const board = []
const boardDOM = document.querySelector('#board')

const makeBoard = () => {
	for (let y = 0; y < height; y++) {
		board.push(Array.from({length: width})) //when using Array.from(), if the object has a length property, it will create an array of that length
	}
	return board
}

const makeHtmlBoard = () => {
	// make column tops to see where the new piece will be dropped into the board
	const topRow = document.createElement('tr')
	topRow.id = 'top-row'

	for (let x = 0; x < width; x++) {
		const topRowCell = document.createElement('td')
		topRowCell.id = x
		const topRowPiece = document.createElement('div')
		topRowPiece.classList.add('piece')
		topRowCell.append(topRowPiece)
		topRow.append(topRowCell)
	}

	boardDOM.append(topRow)

	// make main part of board
	for (let y = 0; y < height; y++) {
		const row = document.createElement('tr')

		for (let x = 0; x < width; x++) {
			const cell = document.createElement('td')
			cell.id = `${x},${y}`
			row.append(cell)
		}

		boardDOM.append(row)
	}
}

// show location and color of the new piece that will be dropped in based on what column the mouse is in
const changeTopRowPiece = (e) => {
	const x = e.target.id[0]
	const topRowCell = document.querySelector(`td[id="${x}"]`)
	if (currPlayer === 1) {
		return (topRowCell.firstChild.style.backgroundColor = 'rgba(255, 0, 0, 0.5)')
	} else {
		return (topRowCell.firstChild.style.backgroundColor = 'rgba(0, 0, 255, 0.5)')
	}
}

//change the top row piece back to its initial color when the mouse is no longer on that column
const revertTopRowPiece = (e) => {
	const x = e.target.id[0]
	const topRowCell = document.querySelector(`td[id="${x}"]`)
	return (topRowCell.firstChild.style.backgroundColor = 'initial')
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol (x) {
	for (let y = height - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y
		}
	}
	return null
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable (x, y) {
	const spot = document.querySelector(`[id="${x},${y}"]`)
	const piece = document.createElement('div')
	piece.classList.add('piece', `p${currPlayer}`)
	spot.append(piece)
}

/** endGame: announce game end */

function endGame (msg) {
	alert(msg)
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin () {
	function _win (cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([y, x]) => y >= 0 && y < height && x >= 0 && x < width && board[y][x] === currPlayer)
	}

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			// get "check list" of 4 cells (starting here) for each of the different
			// ways to win
			//board[0][0] === board[[0,0]]
			const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]
			const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]
			const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]
			const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]

			// find winner (only checking each win-possibility as needed)
			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true
			}
		}
	}
}

/** handleClick: handle click of any column to play piece */
const handleClick = (e) => {
	// get x from ID of clicked cell
	const x = e.target.id[0]

	// get next spot in column (if none, ignore click)
	const y = findSpotForCol(x)
	if (y === null) {
		return
	}

	// place piece in board and add to HTML table
	board[y][x] = currPlayer
	placeInTable(x, y)

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`)
	}

	// check for tie
	if (board.every((row) => row.every((cell) => cell))) {
		return endGame('Tie!')
	}

	// switch players
	currPlayer = currPlayer === 1 ? 2 : 1

	changeTopRowPiece(e)
}

boardDOM.addEventListener('mouseover', changeTopRowPiece)
boardDOM.addEventListener('mouseout', revertTopRowPiece)
boardDOM.addEventListener('click', handleClick)

makeBoard()
makeHtmlBoard()
