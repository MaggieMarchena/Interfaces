/*jshint esversion: 6 */
$(document).ready( function () {

  const WHITE = 'rgba(255, 255, 255, 255)';

  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");
  let color = new Color();
  let filter = new Filter();
  let pressed = false;
  let pickedColor = WHITE;

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
		context.putImageData(imgData,100,100);
  }

  // canvas.mousedown(function(e) {
  //   pressed = true;
  // });
  //
  // canvas.mousemove(function(e) {
  //
  // });
  //
  // canvas.mouseup(function(e) {
  //   pressed = false;
  // });

  $("#open").on('change', function(e) {
    let reader = new FileReader();
    reader.onload = function(event) {
      let img = new Image();
      img.onload = function() {
        let values = fitImage(img);
        img.height = values.imageHeight;
        img.width = values.imageWidth;
        context.drawImage(img, values.x, values.y);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  });

  $("#start").on('click', loadCanvas());

  $("#save").on('click', function functionName() {

  });

  $('.colors').on('click', function () {
    $('.colors').removeClass('active');
    pickedColor = color.get(this.id);
    $(this).addClass('active');
  });

  let filters = document.querySelector('.filters');
  filters.addEventListener('click', function(e) {
    if (e.target !== e.currentTarget) {
      e.preventDefault();
      let name = e.target.getAttribute('href');
      filter(name);
    }
    e.stopPropagation();
  }, false);
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

function draw() {
  //base, faltan los controles del mouse, color y tamaño
  context.lineWidth = 1;
  let pickedColor = document.getElementById('colors');
  context.strokeStyle = color.get(pickedColor);
  context.stroke();
}

function erase() {
  //base, faltan los controles del mouse, color y tamaño
  context.lineWidth = 1;
  context.strokeStyle = 'rgba(255, 255, 255, 255)';
  context.stroke();
}

class Color {
  constructor() {
    this.black = 'rgba(0, 0, 0, 255)';
    this.red = 'rgba(255, 0, 0, 255)';
    this.blue = 'rgba(0, 0, 255, 255)';
    this.yellow = 'rgba(255, 255, 0, 255)';
  }

  get(color){
    let result;
    switch (color) {
      case 'black':
        result =  this.black;
        break;
      case 'red':
        result =  this.red;
        break;
      case 'blue':
        result =  this.blue;
        break;
      case 'yellow':
        result = this.yellow;
        break;
    }
    return result;
  }
}

class Filter {

  bw(){

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
