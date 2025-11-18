const puzzleContainer = document.getElementById("puzzle-container");
let tiles = [];
for (let i = 1; i <= 15; i++) tiles.push(i.toString());
tiles.push(""); // the empty tile

const movesDisplay = document.getElementById("moves");
let moves = 0;

const timeDisplay = document.getElementById("time");
let time = 0;
let timerStarted = false;
let timerInterval = null;

document.getElementById("shuffle-btn").addEventListener("click", shuffle);
shuffle();

function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    let output = "";

    if (minutes) output += `${minutes} m `;
    output += `${seconds} s`;

    return output;
}

function renderPuzzle() {
    puzzleContainer.innerHTML = "";
    movesDisplay.innerText = moves.toString();
    timeDisplay.innerText = formatTime(time);

    for (let i = 0; i < 16; i++) {
        const div = document.createElement("div");

        div.classList.add("tile");
        if (tiles[i] === "") div.classList.add("empty");
        if (tiles[i] === (i + 1).toString()) div.classList.add("correctPosition");
        div.textContent = tiles[i];
        div.addEventListener("click", () => moveTile(i));

        puzzleContainer.appendChild(div);
    }
}

// function to confirm whether a specified tile can move to the current empty tile position
function canMove(index, emptyIndex) {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    return (
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
}

// function to move a specified tile to the current empty tile position
function moveTile(index) {
    const emptyIndex = tiles.indexOf("");

    if (canMove(index, emptyIndex)) {
        if (!timerStarted) {
            timerStarted = true;
            timerInterval = setInterval(() => {
                time++;
                timeDisplay.innerText = formatTime(time);
            }, 1000);
        }

        // switch indices
        let aux = tiles[index];
        tiles[index] = tiles[emptyIndex];
        tiles[emptyIndex] = aux;

        // "reload"
        moves++;
        renderPuzzle();
        checkWin();
    }
}

// function to check the win condition
function checkWin() {
    let won = true;
    for (let i = 0; i < 15; i++) {
        if (tiles[i] != (i + 1).toString()) {
            won = false;
            break;
        }
    }
    if (won) alert("Congratulations! You solved the puzzle!");
}

// function to shuffle puzzle
function shuffle() {
    timerStarted = false;
    clearInterval(timerInterval);
    time = 0;
    moves = 0;

    for (let i = 0; i < 200; i++) {
        const emptyIndex = tiles.indexOf("");
        const possibleMoves = [];

        tiles.forEach((_, index) => {
            if (canMove(index, emptyIndex)) possibleMoves.push(index);
        });

        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

        // update position - switch indices
        let aux = tiles[emptyIndex];
        tiles[emptyIndex] = tiles[randomMove];
        tiles[randomMove] = aux;
    }
    renderPuzzle();
}