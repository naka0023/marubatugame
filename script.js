const board = document.getElementById('board');
const status = document.getElementById('status');
const cells = Array.from(board.getElementsByTagName('td'));
let currentPlayer = 'X';
let gameActive = true;
const gameState = ['', '', '', '', '', '', '', '', ''];
const moveHistory = [];
const disabledCells = []; // Set から配列に変更

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', () => handleCellClick(cell));
});

function handleCellClick(cell) {
    const index = parseInt(cell.getAttribute('data-index'));
    if (gameState[index] !== '' || !gameActive || cell.classList.contains('disabled')) return;
    gameState[index] = currentPlayer;
    moveHistory.push({ player: currentPlayer, index: index });
    cell.textContent = currentPlayer;
    if (moveHistory.length >= 6) {
        disableOldestMove();
    }
    if (checkWinner()) {
        status.textContent = `プレイヤー${currentPlayer}の勝利！`;
        highlightWinner();
        gameActive = false;
    } else if (gameState.every(cell => cell !== '')) {
        status.textContent = '引き分けです';
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `プレイヤー${currentPlayer}のターンです`;
    }
}

function checkWinner() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });
}

function highlightWinner() {
    winningCombinations.forEach(combination => {
        const [a, b, c] = combination;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            cells[a].classList.add('winner');
            cells[b].classList.add('winner');
            cells[c].classList.add('winner');
        }
    });
}

function disableOldestMove() {
    const oldestMove = moveHistory[0];
    const oldestCell = cells[oldestMove.index];
    oldestCell.classList.add('disabled');
    gameState[oldestMove.index] = '';
    moveHistory.shift();
    disabledCells.push(oldestMove.index);

    console.log(disabledCells);

    if(disabledCells.length >= 2){
        const oldestDisable = disabledCells[0];
        const oldestDisableCell = cells[oldestDisable];
        oldestDisableCell.classList.remove('disabled');
        oldestDisableCell.textContent = '';
        disabledCells.shift();
    }
}

function switchTurn() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `プレイヤー${currentPlayer}のターンです`;

    if (disabledCells.length > 0) {
        const index = disabledCells.shift();
        const cell = cells[index];
        cell.classList.remove('disabled');
        gameState[index] = '';
        cell.textContent = '';
    }
}

function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState.fill('');
    moveHistory.length = 0;
    disabledCells.length = 0; // 配列を空にする
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner', 'disabled');
    });
    status.textContent = `プレイヤー${currentPlayer}のターンです`;
}
