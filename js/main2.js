'use strict'

/** Global Vars */
var gBoard; /** The model */
var gGamerPos = { playerI: 0, playerJ: 0 }; /** indexes for the gamer , will get real value when randoms a level */
var gStoragesPos; /** Stores all storages positions */
var gCountMoves = 0; /** Counts player moves */
var gLevelData = getRandomLevel(); /** Stores level structure , player indexes and level number */


/** Functions */

/*
* When clicked will restart and render the level from the begining  
*/
function restartLevel(){
    gCountMoves = 0;
    updatCountMoves();
    var elMessages = document.querySelector('.messages');
    elMessages.innerText = '';
    initGame(); 
}

/** Switches random level */
function switchLevel(){
    var currentLevel =gLevelData.levelNum;
    gLevelData = getRandomLevel();
    while(currentLevel === gLevelData.levelNum){ /** Avoiding getting the same level again */
        gLevelData = getRandomLevel();
    }
    restartLevel();
}

/**
 * This is called when page loads
 */
function initGame() {
    gBoard = buildBoard();
    gStoragesPos = getStoragesIndexes();
    renderBoard();
}

/**
 * Returns the board
 */
function buildBoard() {
    var level = gLevelData.level; /** Gets level structure */
    gGamerPos.playerI = gLevelData.playerI; /** Gets player indexes */
    gGamerPos.playerJ = gLevelData.playerJ; /** Gets player indexes */

    var board = [];
    var arr = [];
    for (var i = 0; i < level.length; i++) {
        switch (level[i]) {
            case 'n':
                board.push(arr); /** Pushing line */
                arr = []; /** Creating new line */
                break;
            default:
                arr.push(boardObject(level[i])); /** Pushes object to the array */
                break;
        }
    }
    board.push(arr);
    return board;
}

/**
 * This function gets char that represant cell data
 * ' '- space for void , w - wall , f - floor , p - player , s- storage , b - box.
 * each object as type ,floor as property 'obj' for object on hime(player,box,storage).
 * for player and box we keep src to thier imgs so when we render the board we will insert the images in thier cells
 */
function boardObject(char) {
    switch(char){
        case ' ': return { type: 'v' };
        case 'w': return { type: char };
        case 'f': return { type: char, obj: '' };
        case 'p': return { type: 'f', obj: 'p', img: 'imgs/goku.png' };
        case 's': return { type: 'f', obj: 's', isBoxHere: false };
        case 'b': return { type: 'f', obj: 'b', img: 'imgs/box.png' };
    }
}

/**
 * Print the board as a table
 * For player and box it will enter thier classes and thier images, for the other only classes
 */
function renderBoard() {
    var strHTML = '';
    gBoard.forEach(function (cells, i) {
        strHTML += '<tr>';
        cells.forEach(function (cell, j) {
            var classCell = getClassForCell(cell); /** Gets the righ class for cell */
            if (cell.obj === 'p' || cell.obj === 'b') {
                strHTML += '<td class="' + classCell + '" id="' + i + ',' + j + '"><img src="' + cell.img + '"></td>';
            } else {
                strHTML += '<td class="' + classCell + '" id="' + i + ',' + j + '"></td>';
            }
        });
    });

    var elSokobanBoard = document.querySelector('#sokobanBoard');
    elSokobanBoard.innerHTML = strHTML;
}

/**
 * Returns array with objects that each represent storage indexes
 */
function getStoragesIndexes() {
    var arr = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].obj === 's') arr.push({ indexI: i, indexJ: j });
        }
    }
    return arr;
}

/**
 * Returns matching class for cell
 */
function getClassForCell(cell) {
    switch (cell.type) {
        case 'v': return 'void';
        case 'w': return 'wall';
        case 'f':
            if (cell.obj === 's') return 'floor storage';
            return 'floor';
    }
}

/**
 * Called when a cell (td) is clicked.
 * Gets Event for key pressed on window and indexes of the cell
 * Does the right move according to key preesed and if move was valid it updates countMoves
 */
function cellClicked(e, i, j) {
    var kc = e.keyCode; /** Gets key code */
    e.preventDefault();
    var madeMove = false;
    switch (kc) {
        case 37: //left
            madeMove = checkMove(gGamerPos.playerI, gGamerPos.playerJ - 1, 'left');
            break;
        case 38: //up
            // console.log('up!');
            madeMove = checkMove(gGamerPos.playerI - 1, gGamerPos.playerJ, 'up');
            break;
        case 39: //right
            // console.log('right!');
            madeMove = checkMove(gGamerPos.playerI, gGamerPos.playerJ + 1, 'right');
            break;
        case 40: //down
            // console.log('down!');
            madeMove = checkMove(gGamerPos.playerI + 1, gGamerPos.playerJ, 'down');
            break;
    }
    if (madeMove) updatCountMoves();
}

/**
 * Checks move is in boundries and not on walls / can move box
 * If it is it will make the movement.
 */
function checkMove(i, j, direction) {
    /** Checks board limits */
    if (i < 0 || i > gBoard.length - 1) return false;
    if (j < 0 || j > gBoard[i].length - 1) return false;
    /** Checks that not trying to move to wall */
    if (gBoard[i][j].type === 'w') return false;
    if (gBoard[i][j].obj === 'b') { /** Check if you can move box */
        if (moveBox(i, j, direction)) { /** Moves box, if it moved and it's a valid move it will return true */
            movePlayer(i, j); /** Moves player */
            if (checkGameOver()) {
                var elMessages = document.querySelector('.messages');
                elMessages.innerText = 'YOU WON!!!';
                scoreGame1000StepsCount(elMessages);
            }
        }
    }
    else {
        movePlayer(i, j); /** Makes player move */
    }
    return true;
}

/**
 * Moves player to wanted location
 */
function movePlayer(i, j) { 
    var elPlayerSquare = document.getElementById('' + gGamerPos.playerI + ',' + gGamerPos.playerJ + '');
    elPlayerSquare.removeChild(elPlayerSquare.childNodes[0]); /**Removes img from cell */
    gBoard[gGamerPos.playerI][gGamerPos.playerJ].obj = '';

    var img = gBoard[gGamerPos.playerI][gGamerPos.playerJ].img;
    gBoard[gGamerPos.playerI][gGamerPos.playerJ].img = '';
    var node = document.createElement("img");
    node.src = img;

    /** New player position */
    gGamerPos.playerI = i;
    gGamerPos.playerJ = j;
    elPlayerSquare = document.getElementById('' + gGamerPos.playerI + ',' + gGamerPos.playerJ + '');
    elPlayerSquare.insertBefore(node, elPlayerSquare.firstChild);
    gBoard[gGamerPos.playerI][gGamerPos.playerJ].obj = 'p';
    gBoard[gGamerPos.playerI][gGamerPos.playerJ].img = img;
    gCountMoves++; /** Counts movements of player */
}

/** 
 * If the movement of the box to the wanted direction is valid
 * It will make the move and will send true
 * Otherwise false;
 */
function moveBox(i, j, direction) {
    var canMove = false;
    var newBoxPos;
    switch (direction) {
        case 'left':
            canMove = gBoard[i][j - 1].type !== 'w' && gBoard[i][j - 1].obj !== 'b';
            newBoxPos = { newI: i, newJ: j - 1 };
            break;
        case 'up':
            canMove = gBoard[i - 1][j].type !== 'w' && gBoard[i - 1][j].obj !== 'b';
            newBoxPos = { newI: i - 1, newJ: j };
            break;
        case 'right':
            canMove = gBoard[i][j + 1].type !== 'w' && gBoard[i][j + 1].obj !== 'b';
            newBoxPos = { newI: i, newJ: j + 1 };
            break;
        case 'down':
            canMove = gBoard[i + 1][j].type !== 'w' && gBoard[i + 1][j].obj !== 'b';
            newBoxPos = { newI: i + 1, newJ: j };
            break;
    }
    if (canMove) { /** If the cell we want to move the box to is not a box or a wall go into if block */
        var elBoxSquare = document.getElementById('' + i + ',' + j + ''); /** Gets current box cell */
        // if (elBoxSquare.childNodes.length > 0) { /**  */
            gBoard[i][j].isBoxHere = false;
        // }
        elBoxSquare.removeChild(elBoxSquare.childNodes[0]); /** Removes img from cell */
        gBoard[i][j].obj = '';
        var img = gBoard[i][j].img;

        gBoard[i][j].img = '';
        var node = document.createElement("img");
        node.src = img;

        /** New box position */
        elBoxSquare = document.getElementById('' + newBoxPos.newI + ',' + newBoxPos.newJ + '');
        elBoxSquare.insertBefore(node, elBoxSquare.firstChild);
        gBoard[newBoxPos.newI][newBoxPos.newJ].isBoxHere = true;
        gBoard[newBoxPos.newI][newBoxPos.newJ].obj = 'b';
        gBoard[newBoxPos.newI][newBoxPos.newJ].img = img;
    }
    return canMove;
}


/**
 * Updates the player movement count on HTML
 */
function updatCountMoves() {
    var elCountMoves = document.querySelector('.countMoves');
    elCountMoves.innerText = gCountMoves;
}

/**
 * Game is over when all boxes are
 * on targets
 */
function checkGameOver() {
    for (var i = 0; i < gStoragesPos.length; i++) {
        if (!gBoard[gStoragesPos[i].indexI][gStoragesPos[i].indexJ].isBoxHere)
            return false;
    }
    return true;
}

/**
 * Count the user's steps, the score may be calculated as 400-stepsCount
 *  400-stepsCount because there are levels that take around 300 moves 
 */
function scoreGame400StepsCount(elMessages){
    var score = 400 - gCountMoves;
    elMessages.innerText += ' Score: ' + score;
}
