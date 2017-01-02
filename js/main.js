'use strict'


/** Global Vars */
var gBoard; /** The model */
var gGamerPos = { playerI: 2, playerJ: 2 }; /** i and j for the gamer */
var gCountMoves = 0;
/** Functions */

/**
 * This is called when page loads
 */
function initGame() {
    gBoard = buildBoard();
    renderBoard();
}

/**
 * Returns the board
 */
function buildBoard() {
    var level = 'wwwwwwn' + /** Will get random or selected level , right now only this level*/
        'wffsfwn' +
        'wfpffwn' +
        'wffffwn' +
        'wffbfwn' +
        'wwwwww';
    var board = [];
    var arr = [];
    for (var i = 0; i < level.length; i++) {
        switch (level[i]) {
            case 'n':
                board.push(arr); /** Pushing line */
                arr = []; /** Creating new line */
                break;
            default:
                arr.push(level[i])
                break;
        }
    }
    board.push(arr);
    return board;
}

/**
 * Print the board as a table
 */
function renderBoard() {
    var strHTML = '';
    gBoard.forEach(function (cells, i) {
        strHTML += '<tr>';
        cells.forEach(function (cell, j) {
            var classCell = getClassForCell(cell); /** gets fit class for cell */
            // if(i === 2 && j === 2) strHTML += '<td class="'+classCell+'" id="' + i + ',' + j + '" onkeydown="cellClicked(event,'+i+','+j+')"></td>';
            // else                   strHTML += '<td class="'+classCell+'" id="' + i + ',' + j + '"></td>';
            strHTML += '<td class="' + classCell + '" id="' + i + ',' + j + '"></td>';
        });
    });

    var elSokobanBoard = document.querySelector('#sokobanBoard');
    elSokobanBoard.innerHTML = strHTML;
}


/**
 * Returns matching class for cell
 */
function getClassForCell(cell) {
    switch (cell) {
        case 'w':
            return 'wall';
        case 'f':
            return 'floor';
        case 'b':
            return 'box floor';
        case 's':
            return 'storage floor';
        case 'p':
            return 'player floor';
    }
}

/**
 * Called when a cell (td) is clicked
 */
function cellClicked(e, i, j) { /** Event for key presses on window */
    var kc = e.keyCode; /** Gets key code */
    e.preventDefault();
    switch (kc) {
        case 37: //left
            checkMove(gGamerPos.playerI, gGamerPos.playerJ - 1, 'left') ? console.log('Succsees!!!') : console.log('You are a failure!!!');
            break;
        case 38: //up
            // console.log('up!');
            checkMove(gGamerPos.playerI - 1, gGamerPos.playerJ, 'up') ? console.log('Succsees!!!') : console.log('You are a failure!!!');
            break;
        case 39: //right
            // console.log('right!');
            checkMove(gGamerPos.playerI, gGamerPos.playerJ + 1, 'right') ? console.log('Succsees!!!') : console.log('You are a failure!!!');
            break;
        case 40: //down
            // console.log('down!');
            checkMove(gGamerPos.playerI + 1, gGamerPos.playerJ, 'down') ? console.log('Succsees!!!') : console.log('You are a failure!!!');
            break;
    }
}

/**
 * Checks move is in boundries and not on walls / can move box
 */
function checkMove(i, j, direction) {
    /** Checks board limits */
    if (i < 0 && i > gBoard.length - 1) return false;
    if (j < 0 && j > gBoard[i].length - 1) return false;
    /** Checks that not trying to move to wall */
    if (gBoard[i][j] === 'w') return false;
    if (gBoard[i][j] === 'b') { /** Check if you can move box */
        moveBox(i, j, direction) ? makeMove(i , j) : console.log('Not valid move');
    }
    else {
        makeMove(i, j); /** Makes the move */
        return true;
    }
}

function makeMove(i, j) { /** need fixing */
    var elPlayerSquare = document.getElementById('' + gGamerPos.playerI + ',' + gGamerPos.playerJ + '');
    elPlayerSquare.classList.remove('player');
    gBoard[gGamerPos.playerI][gGamerPos.playerJ] = 
    gGamerPos.playerI = i;
    gGamerPos.playerJ = j;
    elPlayerSquare = document.getElementById('' + gGamerPos.playerI + ',' + gGamerPos.playerJ + '');
    elPlayerSquare.classList.add('player');

    gCountMoves++; /** Counts movements of player */
}

function moveBox(i, j, direction) {
    var canMove = false;
    var newBoxPos;
    switch (direction) {
        case 'left':
            canMove = gBoard[i][j - 1] !== 'w';
            newBoxPos = { newI: i, newJ: j - 1 };
            break;
        case 'up':
            canMove = gBoard[i - 1][j] !== 'w';
            newBoxPos = { newI: i - 1, newJ: j };
            break;
        case 'right':
            canMove = gBoard[i][j + 1] !== 'w';
            newBoxPos = { newI: i, newJ: j + 1 };
            break;
        case 'down':
            canMove = gBoard[i + 1][j] !== 'w';
            newBoxPos = { newI: i + 1, newJ: j };
            break;
    }
    if(canMove){
        debugger;
        var elBoxSquare = document.getElementById('' + i + ',' + j + '');
        elBoxSquare.classList.remove('box');
        elBoxSquare = document.getElementById('' + newBoxPos.newI + ',' + newBoxPos.newJ + '');
        elBoxSquare.classList.add('box');
    }
    return canMove;
}

/**
 * Game is over when all boxes are
 * on targets
 */
function checkGameOver() {

}