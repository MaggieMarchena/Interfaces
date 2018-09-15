/*jshint esversion: 6 */

const MAXCOL = 7;
const MAXROW = 6;
const LINE = 4;
const RADIUS = 30;
const CHIPS = 21;
const PLAYERS = 2;
const YELLOW = 'yellow';
const RED = 'red';
const BLACK = 'rgba(0, 0, 0, 255)';
const CHIP_SIDE_WIDTH = 100;
const CHIP_SIDE_HEIGHT = 12;

class Mouse {
  constructor() {
    this.click = true;
    this.lastX = null;
    this.lastY = null;
  }

  clicked(){
    return this.click;
  }

  setClick(state){
    this.click = state;
  }

  set(x, y){
    this.lastX = x;
    this.lastY = y;
  }

  getLastX(){
    return this.lastX;
  }

  getLastY(){
    return this.lastY;
  }

  reset(){
    this.lastX = null;
    this.lastY = null;
  }
}

class Tile {
  constructor(x, y) {
    this.filled = false;
    this.player = null;
    this.tileX = x;
    this.tileY = y;
  }

  isFilled(){
    return this.filled;
  }

  putChip(player){
    this.filled = true;
    this.player = player;
    let img = new Image();
    if (player.getColor() == YELLOW){
      img.src = "./images/backYellow.png";
    }
    else {
      img.src = "./images/backRed.png";
    }
    let x = this.tileX + (tileWidth / 2);
    let y = this.tileY + (tileHeight / 2);
    img.onload = function () {
      let image = context.createPattern(this, 'repeat');
      context.fillStyle = image;
      context.beginPath();
      context.arc(x, y, RADIUS, 0, (Math.PI * 2));
      context.fill();
      context.closePath();
      context.beginPath();
      context.arc(x, y, RADIUS, 0, (Math.PI * 2));
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.strokeStyle = BLACK;
      context.stroke();
      context.closePath();
    };
  }

  getPlayer(){
    return this.player;
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

  getTile(column, row){
    return this.colums[column][row];
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
      //take one chip visual
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
  constructor() {
    this.currentPlayer = new Player(YELLOW);
    this.waitingPlayer = new Player(RED);
    this.winner = null;
    this.board = new Board();
    this.mouse = new Mouse();
    this.counter = 0;
  }

  playTurn(column){
    let row = this.getEmptyRow(column);
    let tile = this.board.getTile(column, row);
    tile.putChip(this.currentPlayer);
    this.currentPlayer.useChip();
    this.counter++;
    if (this.counter > 6) {
      if (this.checkColumn(column) || this.checkRow(row) || this.checkDiagonals(column, row)) {
        this.winner = this.currentPlayer;
        alert('Winner: ' + this.winner.getColor());
        //lockAll
      }
    }
    //lockChips(currentPlayer) - unlockChips(waitingPlayer)
    let auxPlayer = this.currentPlayer;
    this.currentPlayer = this.waitingPlayer;
    this.waitingPlayer = auxPlayer;
  }

  pickChip(){
    this.mouse.setClick(true);
    //drag and drop visual
  }

  dropChip(e){
    this.mouse.setClick(false);
    if ((e.layerX > boardX) && (e.layerX < boardX + boardWidth) && (e.layerY < boardY) && (e.layerY > 0)) {
      this.mouse.set(e.layerX, e.layerY);
      let column = this.getColumn();
      if (this.columnNotFull(column)){
        this.playTurn(column);
      }
    }
  }

  getColumn(){
    let column = 0;
    for (let i = 0; i < MAXCOL; i++) {
      if ((this.mouse.getLastX() > boardX + (i * tileWidth)) && (this.mouse.getLastX() < boardX + ((i+1) * tileWidth))) {
        column = i;
      }
    }
    return column;
  }

  columnNotFull(column){
    for (let i = 0; i < MAXROW; i++) {
      if (!this.board.getTile(column, i).isFilled()) {
        return true;
      }
    }
    return false;
  }

  getEmptyRow(column){
    let row = MAXROW - 1;
    while (row >= 0) {
      if (!this.board.getTile(column, row).isFilled()) {
        return row;
      }
      row--;
    }
  }

  checkColumn(column){
    let counter = 0;
    let row = 0;
    while (counter < LINE && row < MAXROW) {
      let tile = this.board.getTile(column, row);
      if (tile.getPlayer() == this.currentPlayer) {
        counter++;
        if (counter == LINE) {
          return true;
        }
      }
      else {
        counter = 0;
      }
      row++;
    }
    return false;
  }

  checkRow(row){
    let counter = 0;
    let column = 0;
    while (counter < LINE && column < MAXCOL) {
      let tile = this.board.getTile(column, row);
      if (tile.getPlayer() == this.currentPlayer) {
        counter++;
        if (counter == LINE) {
          return true;
        }
      }
      else {
        counter = 0;
      }
      column++;
    }
    return false;
  }

  checkDiagonals(column, row){
    if (this.checkDiagonal1(column, row) || this.checkDiagonal2(column, row)) {
      return true;
    }
    return false;
  }

  checkDiagonal1(column, row){
    let counter = 0;

    let baseCol = column;
    let baseRow = row;
    while ((baseCol > 0) && (baseRow > 0)) {
      baseCol--;
      baseRow--;
    }
    while ((counter < LINE) && (baseCol < MAXCOL-1) && (baseRow < MAXROW-1)) {
      let tile = this.board.getTile(baseCol, baseRow);
      if (tile.isFilled()) {
        if (tile.getPlayer() == this.currentPlayer) {
          counter++;
          if (counter == LINE) {
            return true;
          }
        }
        else {
          counter = 0;
        }
      }
      else {
        return false;
      }
      baseCol++;
      baseRow++;
    }
    return false;
  }

  checkDiagonal2(column, row){
    let counter = 0;

    let baseCol = column;
    let baseRow = row;
    while ((baseCol > 0) && (baseRow < MAXROW-1)) {
      baseCol--;
      baseRow++;
    }
    while ((counter < LINE) && (baseCol < MAXCOL-1) && (baseRow > 0)) {
      let tile = this.board.getTile(baseCol, baseRow);
      if (tile.isFilled()) {
        if (tile.getPlayer() == this.currentPlayer) {
          counter++;
          console.log(counter);
          if (counter == LINE) {
            return true;
          }
        }
        else {
          counter = 0;
        }
      }
      else {
        return false;
      }
      baseCol++;
      baseRow--;
    }
    return false;
  }
}

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let boardX = 0;
let boardY = 0;

let boardWidth = 0;
let boardHeight = 0;

let tileWidth = 0;
let tileHeight = 0;

let game = null;

$(document).ready( function() {

  function hola() {
    console.log('hola');
  }

  $("#new").on('click', function (e) {
    e.preventDefault();
    context.clearRect(0, 0, canvas.width, canvas.height);
    let board = new Image();
    board.src = "./images/board.png";
    board.onload = function() {
      boardWidth = board.width;
      boardHeight = board.height;
      boardX = (canvas.width / 2) - (boardWidth / 2);
      boardY = (canvas.height / 2) - (boardHeight / 2) + 20;
      tileWidth = Math.round(boardWidth / 7);
      tileHeight = boardHeight / 6;
      context.drawImage(board, boardX, boardY, boardWidth, boardHeight);
      loadChips();
      game = new Game();
    };
  });

  function loadChips() {
    let yellowX = (boardX / 2) - (CHIP_SIDE_WIDTH / 2);
    let yellowY = canvas.height - (CHIP_SIDE_HEIGHT * 2);
    let chipSideYellow = new Image();
    chipSideYellow.src = "./images/chipSideYellow.png";
    chipSideYellow.onload = function () {
      context.drawImage(chipSideYellow, yellowX, yellowY, chipSideYellow.width, chipSideYellow.height);
      for (let i = 0; i < CHIPS; i++) {
        context.drawImage(chipSideYellow, yellowX, yellowY, chipSideYellow.width, chipSideYellow.height);
        yellowY -= CHIP_SIDE_HEIGHT;
      }
    };
    let redX = boardX + boardWidth + yellowX;
    let redY = canvas.height - (CHIP_SIDE_HEIGHT * 2);
    let chipSideRed = new Image();
    chipSideRed.src = "./images/chipSideRed.png";
    chipSideRed.onload = function () {
      for (let i = 0; i < CHIPS; i++) {
        context.drawImage(chipSideRed, redX, redY, chipSideRed.width, chipSideRed.height);
        redY -= CHIP_SIDE_HEIGHT;
      }
    };
  }

  canvas.addEventListener('mousedown', function(){
    if (game != null) {
      game.pickChip();
    }
  });

  canvas.addEventListener('mouseup', function(e) {
    if (game != null) {
      game.dropChip(e);
    }
  });

});
