/*jshint esversion: 6 */

class Game {
  constructor() {
    this.element = document.getElementById('game-container');
    this.scooby = new Scooby();
    this.ghost = new Ghost();
  }

  start(){
    this.scooby.start();
    this.element.classList.remove("game-end");
    this.element.classList.add("game-on");
  }

  end(){
    this.element.classList.remove("game-on");
    this.element.classList.add("game-end");
  }

  getScoobyLane(){
    return this.scooby.getLane();
  }

  update(){
    if (this.scooby.getState() == "walking") {
      this.scoobyWalk();
    }
    // else if (this.scooby.getState() == "") {
    //
    // }
  }

  changeScoobyState(state){
    this.scooby.setState(state);
  }

  scoobyWalk(){
    this.scooby.walk();
  }

  scoobyJumpRight(){
    if ((game.getScoobyLane() == 1)) {
      this.scooby.jump1to2();
    }
    else if ((game.getScoobyLane() == 2)) {
      this.scooby.jump2to3();
    }
    let scooby = this.scooby;
    setTimeout(function () {
      scooby.moveRight();
    }, 800);
  }

  scoobyJumpLeft(){
    if ((game.getScoobyLane() == 2)) {
      this.scooby.jump2to1();
    }
    else if ((game.getScoobyLane() == 3)) {
      this.scooby.jump3to2();
    }
    let scooby = this.scooby;
    setTimeout(function () {
      scooby.moveLeft();
    }, 800);
  }

  scoobyFaint(){
    this.scooby.faint();
    this.end();
  }
}

let game = null;

//let gameContainer = document.getElementById('game-container');
// let ghostContainer = document.getElementById('ghost');
//
// let gamePosLeft = gameContainer.offsetLeft;
// let gamePosTop = gameContainer.offsetTop;

$(document).ready( function() {

  // ghosts = createGhosts();
  game = new Game();
  game.start();
  addEventListeners();

});

function addEventListeners() {
  document.addEventListener('keydown', function(e){
    keyDown(e);
  });
}

function keyDown(e) {
  let key = e.keyCode;

  if (game != null){
    if (key == ARROW_RIGHT) {
      game.scoobyJumpRight();
      game.changeScoobyState("walking");
      setTimeout(function () {
        game.update();
      }, 800);
    }
    else if (key == ARROW_LEFT) {
      game.scoobyJumpLeft();
      game.changeScoobyState("walking");
      setTimeout(function () {
        game.update();
      }, 800);
    }
  }
}

// function createGhosts() {
//   let ghosts = [];
//
//   let ghost1 = new Ghost();
//   ghost1.setLane(1);
//
//   let ghost2 = new Ghost();
//   ghost2.setLane(2);
//
//   let ghost3 = new Ghost();
//   ghost3.setLane(3);
//
//   ghosts[1] = ghost1;
//   ghosts[2] = ghost2;
//   ghosts[3] = ghost3;
//
//   return ghosts;
// }

// function showGhost(ghosts) {
//   let num = getRandom();
//   let ghost = ghosts[num];
//   if (ghost.isAvailable()) {
//     ghost.use();
//   }
// }

function getRandom() {
  return Math.floor(Math.random() * (4 - 1) + 1);
}
