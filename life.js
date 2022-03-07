/*
1) any dead cell with 3 living neighbors comes to life
2) any living cell with <2 or >3 neighbors dies
*/

var allCells = []
var keepSimulating = false;
const simulationDelay = 50;

class Cell {
    constructor (x, y, isAlive) {
        this.isAlive = isAlive;
        this.x = x;
        this.y = y;
        this.id = `${x}, ${y}`;
        this.shouldToggle = false;
    }

    getLivingNeighbors() {
        var neighbors = [];
        var currentCell = this;

        neighbors.push(allCells.find(function(cell) { return cell.id === `${currentCell.x}, ${currentCell.y + 1}`; }));
        neighbors.push(allCells.find(function(cell) { return cell.id === `${currentCell.x}, ${currentCell.y - 1}`; }));
        neighbors.push(allCells.find(function(cell) { return cell.id === `${currentCell.x + 1}, ${currentCell.y + 1}`; }));
        neighbors.push(allCells.find(function(cell) { return cell.id === `${currentCell.x + 1}, ${currentCell.y}`; }));
        neighbors.push(allCells.find(function(cell) { return cell.id === `${currentCell.x + 1}, ${currentCell.y - 1}`; }));
        neighbors.push(allCells.find(function(cell) { return cell.id === `${currentCell.x - 1}, ${currentCell.y + 1}`; }));
        neighbors.push(allCells.find(function(cell) { return cell.id === `${currentCell.x - 1}, ${currentCell.y}`; }));
        neighbors.push(allCells.find(function(cell) { return cell.id === `${currentCell.x - 1}, ${currentCell.y - 1}`; }));

        return neighbors;
    }
    
    updateStatus() {
        var neighbors = this.getLivingNeighbors();
        var living = 0;
        var livingNeighbors = []

        neighbors.forEach(function(neighbor) {
            if (neighbor != undefined) {
                if (neighbor.isAlive) livingNeighbors.push(neighbor);
            }
        });

        if (this.isAlive) {
            if (livingNeighbors.length < 2 || livingNeighbors.length > 3) {
                this.shouldToggle = true;
            }
        } else if (!this.isAlive) {
            if (livingNeighbors.length == 3) {
                this.shouldToggle = true;
            }
        }
    }
}

class Board {
    constructor(height, width) {
        this.height = height;
        this.width = width;


        this.resize(height, width);
        }

    fillCell(x, y) {
        var cell = document.getElementById(`${x}, ${y}`);
        if (cell.style.backgroundColor == "white") {
            cell.style.backgroundColor = "blacK";
            cell.style.borderColor = "white";

            var currentCell = allCells.find(function(cell) { return cell.id == `${x}, ${y}`; });
            currentCell.isAlive = true;
        } else {
            cell.style.backgroundColor = "white";
            cell.style.borderColor = "black";

            var currentCell = allCells.find(function(cell) { return cell.id == `${x}, ${y}`; });
            currentCell.isAlive = false;
        }
    }

    resize(width, height) {
        console.log("resizing...");
        this.height = height;
        this.width = width;
        allCells = [];

        let html = "";
        for (let y = 0; y < height; y++) {
            let row = `<tr id="row ${y}">\n`;
            let cells = "";
            for (let x = 0; x < width; x++) {
                allCells.push(new Cell(x, y, false));
                cells += `<td id="${x}, ${y}" class="cell" onClick="fillCell(${x}, ${y})" />\n`;
            }
            row += cells + "</tr>\n";
            html += row;
        }

        document.getElementById("board").innerHTML = html;

        let cells = document.getElementsByClassName("cell");

        for (let cell of cells) {
            cell.style.backgroundColor = "white";
        }
    }

    simulateTurn() {
        for (let cell of allCells) {
            cell.updateStatus();
        }

        for (let cell of allCells) {
            if (cell.shouldToggle) {
                cell.shouldToggle = false;
                fillCell(cell.x, cell.y);
            }
        }
    }
}

let board = new Board(100, 50);

function fillCell(x, y) {
    board.fillCell(x, y);
}

function getWidthFromInput() {
    let width = 0;
    width  = document.getElementById("width").value;
    return width;
}

function getHeightFromInput() {
    let height = 0;
    height = document.getElementById("height").value;
    return height;
}

function submitButtonClicked(board) {
    width = getWidthFromInput();
    height = getHeightFromInput();
    board.resize(width, height);
}

document.getElementById("submit").onclick = function() {
    submitButtonClicked(board);
}

document.getElementById("nextTurn").onclick = function() {
    board.simulateTurn();
}

function startSimulation() {
    if (keepSimulating) {
        board.simulateTurn();
        setTimeout(startSimulation, simulationDelay);
    }
}

function stopSimulation() {
    keepSimulating = false;
}

document.getElementById("start").onclick = function() {
    console.log("starting");
    keepSimulating = true;
    startSimulation();
}

document.getElementById("stop").onclick = function() {
    console.log("stopping");
    stopSimulation();
}