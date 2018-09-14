/*jshint esversion: 6 */

const MAXCOL = 7;
const MAXROW = 6;
const RADIUS = 30;
const CHIPS = 21;
const YELLOW = 'yellow';
const RED = 'red';

class Tile {
  constructor(x, y) {
    this.filled = false;
    this.player = null;
    this.x = x;
    this.y = y;
  }

  isFilled(){
    return this.filled;
  }

  putChip(player){
    this.filled = true;
    this.player = player;
    let img = new Image();
    if (player.getColor() == 'yellow'){
      img.src = "./images/chipYellow.png";
    }
    else {
      img.src = "./images/chipRed.png";
    }
    img.onload = function () {
      let image = context.createPattern(this, 'repeat');
      context.fillStyle = image;
      context.beginPath();
      context.arc(x + (tileWidth / 2), y - (tileHeight / 2), RADIUS, 0, (Math.PI * 2));
      context.fill();
      context.closePath();
    };
  }

  getX(){
    return this.x;
  }

  getY(){
    return this.y;
  }
}

class Board {
  constructor() {
    this.colums = [];
    let auxX = boardX;
    for (let i = 0; i < MAXCOL; i++) {
      let auxY = boardY;
      this.colums[i] = new Array(MAXROW);
      for (let j = 0; j < MAXROW; j++) {
        this.colums[i][j] = new Tile(auxX, auxY);
        auxY += tileHeight;
      }
      auxX += tileWidth;
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
    this.chips = CHIPS;
  }

  useChip(){
    if (this.chips >0) {
      this.chips--;
    }
    else {
      //some sign saying no more chips
    }
  }

  getColor(){
    return this.color;
  }
}

class Game {
  constructor(player1, player2) {
    this.currentPlayer = player1;
    this.waitingPlayer = player2;
  }

  playTurn(){
    //get the column
    //search first free row from the bottom up
    //tile.putChip(this.currentPlayer);
    //this.currentPlayer.useChip();
    //check column, row and diagonals for 4 of currentPlayer color
    //lockChips(currentPlayer) - unlockChips(waitingPlayer)
    //auxPlayer = currentPlayer
    //this.currentPlayer = this.waitingPlayer
    //this.waitingPlayer = aux
  }
}

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let boardX = 0;
let boardY = 0;

let tileWidth = 0;
let tileHeight = 0;

$(document).ready( function() {

  function hola() {
    console.log('hola');
  }

  $("#new").on('click', function (e) {
    e.preventDefault();
    let board = new Image();
    board.src = "./images/board.png";
    board.onload = function() {
      boardX = (canvas.width / 2) - (board.width / 2);
      boardY = (canvas.height / 2) - (board.height / 2) + 20;
      tileWidth = Math.round(board.width / 7);
      tileHeight = board.height / 6;
      context.drawImage(board, boardX, boardY, board.width, board.height);
    };
  });

});
