/*jshint esversion: 6 */

const WHITE = 'rgba(255, 255, 255, 255)';

class Mouse {
  constructor() {
    this.click = false;
    this.lastX = null;
    this.lastY = null;
    this.currentX = null;
    this.currentY = null;
  }

  clicked(){
    return this.click;
  }

  setClick(state){
    this.click = state;
  }

  set(x, y){
    this.currentX = x;
    this.currentY = y;
  }

  getLastX(){
    return this.lastX;
  }

  getLastY(){
    return this.lastY;
  }

  getCurrentX(){
    return this.currentX;
  }

  getCurrentY(){
    return this.currentY;
  }

  update(){
    this.lastX = this.currentX;
    this.lastY = this.currentY;
  }

  reset(){
    this.lastX = null;
    this.lastY = null;
  }
}

class Pencil {
  constructor() {
    this.state = 'notActive';
  }

  setState(state){
    this.state = state;
  }

  getState(){
    return this.state;
  }

  draw(e) {
    context.lineWidth = 10;
    context.strokeStyle = color.get();
    context.lineCap = "round";
    mouse.set(e.layerX, e.layerY);
    context.beginPath();
    if (mouse.getLastX() != null || mouse.getLastY() != null) {
      context.moveTo(mouse.getLastX(), mouse.getLastY());
    }
    else {
      context.moveTo(mouse.getCurrentX(), mouse.getCurrentY());
    }
    context.lineTo(mouse.getCurrentX(), mouse.getCurrentY());
    context.closePath();
    context.stroke();
    mouse.update();
  }
}

class Eraser {
  constructor() {
    this.state = 'notActive';
  }

  setState(state){
    this.state = state;
  }

  getState(){
    return this.state;
  }

  erase(e) {
    context.lineWidth = 50;
    context.strokeStyle = WHITE;
    mouse.set(e.layerX, e.layerY);
    context.beginPath();
    if (mouse.getLastX() != null || mouse.getLastY() != null) {
      context.moveTo(mouse.getLastX(), mouse.getLastY());
    }
    else {
      context.moveTo(mouse.getCurrentX(), mouse.getCurrentY());
    }
    context.lineTo(mouse.getCurrentX(), mouse.getCurrentY());
    context.stroke();
    context.closePath();
    mouse.update();
  }
}

class Color {
  constructor() {
    this.picked = WHITE;
    this.black = 'rgba(0, 0, 0, 255)';
    this.red = 'rgba(255, 0, 0, 255)';
    this.blue = 'rgba(0, 0, 255, 255)';
    this.yellow = 'rgba(255, 255, 0, 255)';
  }

  get(){
    return this.picked;
  }

  change(color){
    switch (color) {
      case 'black':
        this.picked =  this.black;
        break;
      case 'red':
        this.picked =  this.red;
        break;
      case 'blue':
        this.picked =  this.blue;
        break;
      case 'yellow':
        this.picked = this.yellow;
        break;
    }
    return this.picked;
  }

}

class Filter {
  constructor(){
    this.imageData = context.getImageData(0,0,canvas.width, canvas.height);
    this.x = 0;
    this.y = 0;
  }

  setImageData(x, y, image){
    this.imageData = context.getImageData(x, y, image.width, image.height);
    this.x = x;
    this.y = y;
  }

  bw(){
    for(i=0; i < imageData.data.length; i+=4){
        let color = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
        imageData.data[i] = color;
        imageData.data[i+1] = color;
        imageData.data[i+2] = color;
    }
    context.putImageData(imagedata, this.x, this.y);
  }

  sepia(){

  }

  negative(){

  }

  sat(){

  }

  contrast(){

  }

  blur(){

  }
}

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let base = null;

let color = new Color();
let filter = new Filter();
let pencil = new Pencil();
let eraser = new Eraser();
let mouse = new Mouse();

$(document).ready( function() {

  function loadCanvas() {
    let imgData=context.createImageData(canvas.height, canvas.width);
		for (let x=0; x<imgData.width; x++){
			for (let y = 0; y < imgData.height; y++) {
				let i = (x + y * imgData.width)*4;
				imgData.data[i+0]=255;
	  		imgData.data[i+1]=255;
	  		imgData.data[i+2]=255;
	  		imgData.data[i+3]=255;
			}
  	}
		context.putImageData(imgData,0,0);
  }

  canvas.addEventListener('mousedown', function(e) {
    mouse.setClick(true);
  });

  canvas.addEventListener('mousemove', function(e) {
    if (mouse.clicked()) {
      if (pencil.getState() == 'active') {
        pencil.draw(e);
      }
      else if (eraser.getState() == 'active') {
        eraser.erase(e);
      }
    }
  });

  canvas.addEventListener('mouseup', function(e) {
    mouse.setClick(false);
    mouse.reset();
  });

  $("#open").on('change', function(e) {
    let reader = new FileReader();
    reader.onload = function(event) {
      let img = new Image();
      img.onload = function() {
        let values = fitImage(img);
        context.drawImage(img, values.x, values.y, values.imageWidth, values.imageHeight);
        filter.setImageData(values.x, values.y, values.imageWidth, values.imageHeight);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  });

  $("#start").on('click', loadCanvas());

  $("#save").on('click', function() {

  });

  $("#pencil").on('click', function() {
    $('.tools').removeClass('active');
    eraser.setState('notActive');
    pencil.setState('active');
    $(this).addClass('active');
  });

  $("#eraser").on('click', function() {
    $('.tools').removeClass('active');
    pencil.setState('notActive');
    eraser.setState('active');
    $(this).addClass('active');
  });

  $('.colors').on('click', function() {
    $('.colors').removeClass('active');
    color.change(this.id);
    $(this).addClass('active');
  });

  $('.filters').on('click', function(e) {
    e.preventDefault();
    filter.set();
    filter.transform(this.name);
  });
});

function fitImage(image) {
  let imageAspectRatio = image.width / image.height;
  let canvasAspectRatio = canvas.width / canvas.height;
  let values = {
    imageWidth:0,
    imageHeight:0,
    x:0,
    y:0,
  };

  if (imageAspectRatio < canvasAspectRatio) {
    values.imageHeight = canvas.height;
    values.imageWidth = image.width * (values.imageHeight / image.height);
    values.x = (canvas.width - values.imageWidth) / 2;
    values.y = 0;
  }
  else if (imageAspectRatio > canvasAspectRatio) {
    values.imageWidth = canvas.width;
    values.imageHeight = image.height * (values.imageWidth / image.width);
    values.y = (canvas.height - values.imageHeight) / 2;
    values.x = 0;
  }
  else {
    values.imageHeight = canvas.height;
    values.imageWidth = canvas.width;
    values.x = 0;
    values.y = 0;
  }

  return values;
}
