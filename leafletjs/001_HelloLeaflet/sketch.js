var bubbles = [];

function setup() {
  createCanvas(600, 400);
  // for (var i = 0; i < 2; i++) {
  //   bubbles[i] = new Bubble(random(0, width), random(0, height));
  // }
}

function mouseReleased() {
  bubbles.push(new Bubble(mouseX, mouseY));
}

function mouseDragged() {
  bubbles.push(new Bubble(mouseX, mouseY));
}

function draw() {
  background(0);
  for (var i = 0; i < bubbles.length; i++) {
    bubbles[i].move();
    bubbles[i].display();
  }
}

function Bubble(x, y) {
  this.x = x;
  this.y = y;
  this.display = function() {
    stroke(255);
    noFill();
    ellipse(this.x, this.y, 24, 24);
  };
  this.move = function() {
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  };
}
