//making this while watching YT and simultanously coding, may consume a lot of time , so pls dont judge on that 

const board = document.getElementById('board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
}

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        if (checkWin()) {
            status.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
        } else if (checkDraw()) {
            status.textContent = "It's a draw!";
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}

function checkWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    return winConditions.some(condition => {
        return condition.every(index => gameBoard[index] === currentPlayer);
    });
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
    });
}

createBoard();
status.textContent = `Player ${currentPlayer}'s turn`;
restartBtn.addEventListener('click', restartGame);