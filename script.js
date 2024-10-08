const board = document.getElementById('board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const undoBtn = document.getElementById('undoBtn');
const startBtn = document.getElementById('startBtn');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const timer = document.getElementById('timer');
const themeSelect = document.getElementById('themeSelect');
const playerXInput = document.getElementById('playerX');
const playerOInput = document.getElementById('playerO');
const scoreXLabel = document.getElementById('scoreXLabel');
const scoreOLabel = document.getElementById('scoreOLabel');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let moveHistory = [];
let scores = { X: 0, O: 0 };
let startTime, interval;
let playerXName = 'X';
let playerOName = 'O';

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
        e.target.classList.add(currentPlayer.toLowerCase());
        e.target.classList.add('pop');
        moveHistory.push(index);

        if (checkWin()) {
            status.textContent = `Player ${currentPlayer} (${getPlayerName(currentPlayer)}) wins!`;
            gameActive = false;
            updateScore(currentPlayer);
            highlightWinningCells();
            stopTimer();
            playSound('win');
        } else if (checkDraw()) {
            status.textContent = "It's a draw!";
            gameActive = false;
            stopTimer();
            playSound('draw');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `Player ${currentPlayer} (${getPlayerName(currentPlayer)})'s turn`;
            playSound('move');
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
    moveHistory = [];
    status.textContent = `Player ${currentPlayer} (${getPlayerName(currentPlayer)})'s turn`;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'pop', 'winning');
    });
    startTimer();
}

function undoMove() {
    if (moveHistory.length > 0 && gameActive) {
        const lastMove = moveHistory.pop();
        gameBoard[lastMove] = '';
        const cell = document.querySelector(`[data-index="${lastMove}"]`);
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'pop');
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer} (${getPlayerName(currentPlayer)})'s turn`;
    }
}

function updateScore(player) {
    scores[player]++;
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function startTimer() {
    startTime = Date.now();
    interval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timer.textContent = elapsedTime;
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

function getPlayerName(player) {
    return player === 'X' ? playerXName : playerOName;
}

function highlightWinningCells() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    const winningCondition = winConditions.find(condition => {
        return condition.every(index => gameBoard[index] === currentPlayer);
    });
    if (winningCondition) {
        winningCondition.forEach(index => {
            document.querySelector(`[data-index="${index}"]`).classList.add('winning');
        });
    }
}

function handleThemeChange() {
    document.body.setAttribute('data-theme', themeSelect.value);
}

function playSound(type) {
    const audio = new Audio(`sounds/${type}.mp3`);
    audio.play();
}

startBtn.addEventListener('click', () => {
    playerXName = playerXInput.value || 'X';
    playerOName = playerOInput.value || 'O';
    scoreXLabel.textContent = `${playerXName}: ${scores.X}`;
    scoreOLabel.textContent = `${playerOName}: ${scores.O}`;
    restartGame();
});

restartBtn.addEventListener('click', restartGame);
undoBtn.addEventListener('click', undoMove);
themeSelect.addEventListener('change', handleThemeChange);

createBoard();
