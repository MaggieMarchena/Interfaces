/*jshint esversion: 6 */

class Game {
  constructor() {
    this.element = document.getElementById('game-container');
    this.state = "end";
    this.moveAllowed = false;
    this.scooby = new Scooby();
    this.ghost = new Ghost();
    this.snack = new Snack();
  }

  start(){
    this.state = "on";
    this.moveAllowed = true;
    this.scooby.start();
    this.element.classList.remove("game-end");
    this.element.classList.add("game-on");
    this.play();
  }

  play(){
    let g = this;
    setInterval(function() {
      if (g.state == "on") {
        g.showGhost();
      }
    }, 3000);
    setTimeout(function() {
      setInterval(function() {
        if (g.state == "on") {
          g.showSnack();
        }
      }, 6000);
    }, 2000);
  }

  // playSnack(){
  //   let g = this;
  //   setInterval(function() {
  //     if (g.state == "on") {
  //       g.showSnack();
  //     }
  //   }, 6000);
  // }

  end(){
    this.state = "end";
    this.element.classList.remove("game-on");
    this.element.classList.add("game-end");
  }

  getScoobyLane(){
    return this.scooby.getLane();
  }

  updateVisual(){
    this.moveAllowed = true;
    if (this.scooby.getState() == "walking") {
      this.scoobyWalk();
    }
    else if (this.scooby.getState() == "fainting") {
      this.scoobyFaint();
    }
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
      this.scooby.moveRight();
    }
    else if ((game.getScoobyLane() == 2)) {
      this.scooby.jump2to3();
      this.scooby.moveRight();
    }
  }

  scoobyJumpLeft(){
    if ((game.getScoobyLane() == 2)) {
      this.scooby.jump2to1();
      this.scooby.moveLeft();
    }
    else if ((game.getScoobyLane() == 3)) {
      this.scooby.jump3to2();
      this.scooby.moveLeft();
    }
  }

  scoobyFaint(){
    this.scooby.faint();
    this.end();
  }

  showGhost() {
    let num = getRandomNum();
    this.ghost.setLane(num);
    this.ghost.move();
    let g = this;
    setTimeout(function () {
      g.checkCollision();
    }, 2000);
  }

  showSnack() {
    let num = getRandomNum();
    let ghostLane = this.ghost.getLane();
    while (ghostLane == num) {
      num = getRandomNum();
    }
    this.snack.setLane(num);
    this.snack.move();
    let g = this;
    setTimeout(function () {
      g.checkEat();
    }, 2000);
  }

  checkCollision(){
    if(this.scooby.getLane() == this.ghost.getLane()){
      this.scooby.faint();
      this.ghost.collide();
      this.end();
    }
    else {
      this.changeScoobyState("walking");
      this.ghost.pass();
    }
  }

  checkEat(){
    if(this.scooby.getLane() == this.snack.getLane()){
      this.snack.collide();
      this.changeScoobyState("walking");
    }
    else {
      this.changeScoobyState("walking");
      this.snack.pass();
    }
  }

  arrowRight(){
    if (this.moveAllowed) {
      this.scoobyJumpRight();
      this.moveAllowed = false;
      let g = this;
      setTimeout(function () {
        g.updateVisual();
      }, 800);
    }
  }

  arrowLeft(){
    if (this.moveAllowed) {
      this.scoobyJumpLeft();
      this.moveAllowed = false;
      let g = this;
      setTimeout(function () {
        g.updateVisual();
      }, 800);
    }
  }
}

let game = null;

$(document).ready( function() {

  game = new Game();
  addEventListeners();
  game.start();

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
      game.arrowRight();
    }
    else if (key == ARROW_LEFT) {
      game.arrowLeft();
    }
  }
}

function getRandomNum() {
  return Math.floor(Math.random() * (4 - 1) + 1);
}
